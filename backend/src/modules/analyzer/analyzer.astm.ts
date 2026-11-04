/**
 * ASTM E1381 / E1394 Standard Parser and Generator for LIS Analyzers
 * Used by Mindray, Sysmex, Horiba, Beckman Coulter, etc.
 */

export const ASTM_CHARS = {
  ENQ: '\x05',
  ACK: '\x06',
  NAK: '\x15',
  STX: '\x02',
  ETX: '\x03',
  ETB: '\x17',
  EOT: '\x04',
  CR: '\r',
  LF: '\n',
};

export interface ASTMParsedResult {
  sampleBarcode: string;
  patientId?: string;
  patientName?: string;
  testCode: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  flag?: string; // N (Normal), H (High), L (Low), A (Abnormal), C (Critical)
  status?: string; // F (Final), P (Preliminary)
  instrumentId?: string;
  timestamp?: string;
}

export interface ASTMParsedMessage {
  header?: {
    senderId?: string;
    instrumentModel?: string;
    protocolVersion?: string;
    timestamp?: string;
  };
  patient?: {
    patientId?: string;
    fullName?: string;
    gender?: string;
    dob?: string;
  };
  order?: {
    specimenBarcode?: string;
    testCodes?: string[];
    priority?: string;
  };
  results: ASTMParsedResult[];
  comments: string[];
  rawText: string;
}

export class ASTMParser {
  /**
   * Calculates 2-digit Hex Checksum for an ASTM Frame (modulo 256)
   */
  static calculateChecksum(frameText: string): string {
    let sum = 0;
    for (let i = 0; i < frameText.length; i++) {
      sum = (sum + frameText.charCodeAt(i)) % 256;
    }
    const hex = sum.toString(16).toUpperCase();
    return hex.padStart(2, '0');
  }

  /**
   * Cleans ASTM framing characters (\x02, frame number, \x03, checksum, \r, \n)
   */
  static cleanFrameText(raw: string): string {
    return raw
      .replace(/[\x02\x03\x04\x05\x06\x15\x17]/g, '')
      .replace(/^[0-9]/gm, '') // frame sequence numbers
      .trim();
  }

  /**
   * Parses complete ASTM E1394 message payload
   */
  static parse(rawMessage: string): ASTMParsedMessage {
    const lines = rawMessage
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const message: ASTMParsedMessage = {
      results: [],
      comments: [],
      rawText: rawMessage,
    };

    let currentBarcode = 'UNKNOWN_SAMPLE';
    let currentInstrument = 'Mindray Hematology';

    for (const line of lines) {
      // Strip framing controls and frame numbers
      const cleanLine = this.cleanFrameText(line);
      if (!cleanLine) continue;

      const recordType = cleanLine.charAt(0);
      const fields = cleanLine.split('|');

      switch (recordType) {
        case 'H': {
          // Header: H|\^&|||AnalyzerName^Model|||||||P|1394-97|20261102143000
          const senderInfo = fields[4] || 'Analyzer';
          currentInstrument = senderInfo.split('^')[0] || 'Hematology Analyzer';
          message.header = {
            senderId: senderInfo,
            instrumentModel: currentInstrument,
            timestamp: fields[13] || new Date().toISOString(),
          };
          break;
        }

        case 'P': {
          // Patient: P|1||PatientID||LastName^FirstName|||Gender
          const patientName = fields[5] ? fields[5].replace(/\^/g, ' ').trim() : undefined;
          message.patient = {
            patientId: fields[3] || undefined,
            fullName: patientName,
            gender: fields[8] || undefined,
          };
          break;
        }

        case 'O': {
          // Order: O|1|SampleBarcode||^^^CBC|R||||||A
          currentBarcode = fields[2] || fields[3] || 'UNKNOWN_SAMPLE';
          // Clean barcode from tube suffixes if needed
          message.order = {
            specimenBarcode: currentBarcode,
            testCodes: fields[4] ? fields[4].split('^').filter(Boolean) : ['CBC'],
            priority: fields[5] || 'R',
          };
          break;
        }

        case 'R': {
          // Result: R|1|^^^WBC|7.8|10^3/uL|4.0-11.0|N||F||||20261102143000
          // Universal test code can be ^^^WBC or WBC
          const testCodeField = fields[2] || '';
          const testCodeParts = testCodeField.split('^');
          const testCode = testCodeParts[testCodeParts.length - 1] || testCodeField;
          const value = fields[3] || '';
          const unit = fields[4] ? fields[4].replace(/\^/g, '/') : '';
          const referenceRange = fields[5] || '';
          const flag = fields[6] || 'N';
          const status = fields[8] || 'F';
          const timestamp = fields[12] || new Date().toISOString();

          if (testCode && value) {
            message.results.push({
              sampleBarcode: currentBarcode,
              patientId: message.patient?.patientId,
              patientName: message.patient?.fullName,
              testCode: testCode.toUpperCase(),
              value,
              unit,
              referenceRange,
              flag,
              status,
              instrumentId: currentInstrument,
              timestamp,
            });
          }
          break;
        }

        case 'C': {
          // Comment: C|1|I|Scattergram flags / Normal cell distribution|G
          if (fields[3]) {
            message.comments.push(fields[3]);
          }
          break;
        }

        case 'L': {
          // Terminator: L|1|N
          break;
        }
      }
    }

    return message;
  }

  /**
   * Generates a fully compliant ASTM transmission frame sequence
   */
  static generateSimulatedPayload(
    sampleBarcode: string,
    results: Array<{ code: string; value: number | string; unit: string; refRange: string; flag?: string }>,
    analyzerName = 'Mindray BC-5000'
  ): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);

    let frameNumber = 1;
    const records: string[] = [
      `H|\\^&|||${analyzerName}|||||||P|1394-97|${timestamp}`,
      `P|1||UHID-89201||Verma^Arjun|||M`,
      `O|1|${sampleBarcode}||^^^CBC|R||||||A`,
    ];

    results.forEach((r, idx) => {
      records.push(
        `R|${idx + 1}|^^^${r.code}|${r.value}|${r.unit}|${r.refRange}|${r.flag || 'N'}||F||||${timestamp}`
      );
    });

    records.push('C|1|I|Automated Differential Smear Validated|G');
    records.push('L|1|N');

    // Build framed messages with ASTM STX, Frame#, Text, ETX, Checksum, CR, LF
    const framedLines = records.map((rec) => {
      const textToSum = `${frameNumber}${rec}\x0D\x03`;
      const checksum = this.calculateChecksum(textToSum);
      const frame = `\x02${frameNumber}${rec}\x0D\x03${checksum}\x0D\x0A`;
      frameNumber = (frameNumber % 7) + 1;
      return frame;
    });

    return `\x05` + framedLines.join('') + `\x04`;
  }
}

