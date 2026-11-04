/**
 * HL7 v2.3.1 / v2.5 / v2.5.1 MLLP Parser and Generator for Diagnostic Analyzers
 * Used by Roche Cobas, Erba Mannheim, Beckman Coulter, Abbott Architect, etc.
 */

export const MLLP_START = '\x0B';
export const MLLP_END = '\x1C\x0D';

export interface HL7ParsedResult {
  sampleBarcode: string;
  patientId?: string;
  patientName?: string;
  testCode: string;
  testName?: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  abnormalFlag?: string; // N, H, L, LL, HH, A
  status?: string; // F (Final), C (Corrected)
  instrumentId?: string;
  timestamp?: string;
}

export interface HL7ParsedMessage {
  messageType: string; // ORU^R01, QRY^Q02, ACK
  controlId: string;
  sendingApp: string;
  sendingFacility: string;
  patient?: {
    patientId?: string;
    fullName?: string;
    gender?: string;
    dob?: string;
  };
  order?: {
    specimenBarcode?: string;
    orderNumber?: string;
    testName?: string;
  };
  results: HL7ParsedResult[];
  rawText: string;
}

export class HL7Parser {
  /**
   * Strips MLLP envelope characters
   */
  static cleanMLLP(raw: string): string {
    return raw
      .replace(new RegExp(MLLP_START, 'g'), '')
      .replace(new RegExp(MLLP_END, 'g'), '')
      .trim();
  }

  /**
   * Parses an HL7 ORU^R01 (Observation Result) message
   */
  static parse(rawMessage: string): HL7ParsedMessage {
    const clean = this.cleanMLLP(rawMessage);
    const segments = clean
      .replace(/\r\n/g, '\r')
      .replace(/\n/g, '\r')
      .split('\r')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const message: HL7ParsedMessage = {
      messageType: 'ORU^R01',
      controlId: `MSG-${Date.now()}`,
      sendingApp: 'Cobas c311',
      sendingFacility: 'Biochemistry Core Lab',
      results: [],
      rawText: rawMessage,
    };

    let currentBarcode = 'UNKNOWN_SAMPLE';
    let currentInstrument = 'Biochemistry Analyzer';

    for (const seg of segments) {
      const fields = seg.split('|');
      const segType = fields[0];

      switch (segType) {
        case 'MSH': {
          // MSH|^~\&|Roche Cobas|Clinical Lab|LabsmartLIS|MainBranch|20261102144500||ORU^R01|MSG-98102|P|2.5
          message.sendingApp = fields[2] || 'Analyzer';
          message.sendingFacility = fields[3] || 'Laboratory';
          message.messageType = fields[8] || 'ORU^R01';
          message.controlId = fields[9] || `MSG-${Date.now()}`;
          currentInstrument = message.sendingApp;
          break;
        }

        case 'PID': {
          // PID|1||UHID-89201||Verma^Arjun||19940512|M
          const patientName = fields[5] ? fields[5].replace(/\^/g, ' ').trim() : undefined;
          message.patient = {
            patientId: fields[3] || undefined,
            fullName: patientName,
            dob: fields[7] || undefined,
            gender: fields[8] || undefined,
          };
          break;
        }

        case 'OBR': {
          // OBR|1|BL-2026-0015-T1|BL-2026-0015|LIPID^Lipid Profile^LN|||20261102143000
          currentBarcode = fields[2] || fields[3] || 'UNKNOWN_SAMPLE';
          const testCodeParts = (fields[4] || '').split('^');
          message.order = {
            specimenBarcode: currentBarcode,
            orderNumber: fields[3] || fields[2],
            testName: testCodeParts[1] || testCodeParts[0] || 'Investigation',
          };
          break;
        }

        case 'OBX': {
          // OBX|1|NM|GLU^Blood Glucose Fasting^LN||104|mg/dL|70-99|H|||F|||20261102144500
          const testField = fields[3] || '';
          const testParts = testField.split('^');
          const testCode = testParts[0] || testField;
          const testName = testParts[1] || testCode;
          const value = fields[5] || '';
          const unit = fields[6] || '';
          const referenceRange = fields[7] || '';
          const abnormalFlag = fields[8] || 'N';
          const status = fields[11] || 'F';
          const timestamp = fields[14] || new Date().toISOString();

          if (testCode && value) {
            message.results.push({
              sampleBarcode: currentBarcode,
              patientId: message.patient?.patientId,
              patientName: message.patient?.fullName,
              testCode: testCode.toUpperCase(),
              testName,
              value,
              unit,
              referenceRange,
              abnormalFlag,
              status,
              instrumentId: currentInstrument,
              timestamp,
            });
          }
          break;
        }
      }
    }

    return message;
  }

  /**
   * Generates HL7 ACK message formatted with MLLP
   */
  static generateAck(controlId: string, isSuccess = true, errorMsg = ''): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);

    const msh = `MSH|^~\\&|LabsmartLIS|MainBranch|Analyzer|CoreLab|${timestamp}||ACK^R01|ACK-${Date.now()}|P|2.5`;
    const msa = `MSA|${isSuccess ? 'AA' : 'AE'}|${controlId}${errorMsg ? `|${errorMsg}` : ''}`;

    const payload = `${msh}\r${msa}\r`;
    return `${MLLP_START}${payload}${MLLP_END}`;
  }

  /**
   * Generates simulated HL7 ORU^R01 payload with MLLP
   */
  static generateSimulatedPayload(
    sampleBarcode: string,
    results: Array<{ code: string; name: string; value: number | string; unit: string; refRange: string; flag?: string }>,
    analyzerName = 'Roche Cobas c311'
  ): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14);

    const msgId = `MSG-${Date.now()}`;
    const msh = `MSH|^~\\&|${analyzerName}|CoreLab|LabsmartLIS|MainBranch|${timestamp}||ORU^R01|${msgId}|P|2.5`;
    const pid = `PID|1||UHID-89201||Verma^Arjun||19940512|M`;
    const obr = `OBR|1|${sampleBarcode}|${sampleBarcode}|BIOCHEM^Biochemistry Routine Panel|||${timestamp}`;

    const obxLines = results.map((r, idx) => {
      return `OBX|${idx + 1}|NM|${r.code}^${r.name}^LN||${r.value}|${r.unit}|${r.refRange}|${r.flag || 'N'}|||F|||${timestamp}`;
    });

    const body = [msh, pid, obr, ...obxLines].join('\r') + '\r';
    return `${MLLP_START}${body}${MLLP_END}`;
  }
}

