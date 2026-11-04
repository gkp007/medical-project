import net from 'net';
import { prisma } from '../../core/database/prisma.client.js';
import { logger } from '../../core/logger/logger.js';
import { ASTMParser, ASTMParsedResult } from './analyzer.astm.js';
import { HL7Parser, HL7ParsedResult } from './analyzer.hl7.js';

export class AnalyzerService {
  private static activeServers: Map<number, net.Server> = new Map();

  /**
   * Initializes default analyzers and default parameter mappings if empty
   */
  static async seedDefaultsIfNeeded() {
    try {
      const count = await prisma.labAnalyzer.count();
      if (count > 0) return;

      logger.info('Seeding default laboratory diagnostic analyzers...');

      // 1. Mindray BC-5000 (ASTM E1381 Hematology)
      const mindray = await prisma.labAnalyzer.create({
        data: {
          name: 'Mindray BC-5000 (5-Part Diff)',
          model: 'BC-5000',
          department: 'Hematology',
          protocol: 'ASTM_E1381',
          connectionType: 'TCP_SERVER',
          hostIp: '127.0.0.1',
          port: 5100,
          isBidirectional: true,
          status: 'ONLINE',
          totalPacketsProcessed: 42,
        },
      });

      // 2. Roche Cobas c311 (HL7 v2.5 Biochemistry)
      const cobas = await prisma.labAnalyzer.create({
        data: {
          name: 'Roche Cobas c311 Clinical Chemistry',
          model: 'Cobas c311',
          department: 'Biochemistry',
          protocol: 'HL7_V2',
          connectionType: 'TCP_SERVER',
          hostIp: '127.0.0.1',
          port: 5101,
          isBidirectional: true,
          status: 'ONLINE',
          totalPacketsProcessed: 28,
        },
      });

      // 3. Sysmex XN-500 (ASTM Automated Hematology)
      await prisma.labAnalyzer.create({
        data: {
          name: 'Sysmex XN-500 Automated Hematology',
          model: 'XN-500',
          department: 'Hematology',
          protocol: 'ASTM_E1381',
          connectionType: 'TCP_SERVER',
          hostIp: '127.0.0.1',
          port: 5102,
          isBidirectional: true,
          status: 'ONLINE',
          totalPacketsProcessed: 15,
        },
      });

      // Seed Mindray Mappings
      const mindrayMappings = [
        { code: 'HGB', name: 'Hemoglobin', unit: 'g/dL' },
        { code: 'RBC', name: 'Total RBC Count', unit: '10^6/uL' },
        { code: 'WBC', name: 'Total Leukocyte Count (TLC)', unit: 'cells/cumm' },
        { code: 'PLT', name: 'Platelet Count', unit: '10^3/uL' },
        { code: 'HCT', name: 'Packed Cell Volume (Hematocrit)', unit: '%' },
        { code: 'MCV', name: 'Mean Corpuscular Volume (MCV)', unit: 'fL' },
        { code: 'MCH', name: 'Mean Corpuscular Hemoglobin (MCH)', unit: 'pg' },
        { code: 'MCHC', name: 'MCHC', unit: 'g/dL' },
        { code: 'NEU%', name: 'Neutrophils', unit: '%' },
        { code: 'LYM%', name: 'Lymphocytes', unit: '%' },
        { code: 'EOS%', name: 'Eosinophils', unit: '%' },
        { code: 'MON%', name: 'Monocytes', unit: '%' },
        { code: 'BAS%', name: 'Basophils', unit: '%' },
      ];

      for (const m of mindrayMappings) {
        await prisma.analyzerMapping.create({
          data: {
            analyzerId: mindray.id,
            machineCode: m.code,
            parameterName: m.name,
            unit: m.unit,
            conversionMultiplier: 1.0,
          },
        });
      }

      // Seed Cobas Mappings
      const cobasMappings = [
        { code: 'GLU', name: 'Blood Glucose Fasting', unit: 'mg/dL' },
        { code: 'UREA', name: 'Blood Urea', unit: 'mg/dL' },
        { code: 'CREAT', name: 'Serum Creatinine', unit: 'mg/dL' },
        { code: 'BILI_T', name: 'Total Bilirubin', unit: 'mg/dL' },
        { code: 'SGOT', name: 'SGOT (AST)', unit: 'U/L' },
        { code: 'SGPT', name: 'SGPT (ALT)', unit: 'U/L' },
        { code: 'ALP', name: 'Alkaline Phosphatase', unit: 'U/L' },
        { code: 'CHOL', name: 'Total Cholesterol', unit: 'mg/dL' },
        { code: 'TRIG', name: 'Triglycerides', unit: 'mg/dL' },
        { code: 'HDL', name: 'HDL Cholesterol', unit: 'mg/dL' },
        { code: 'LDL', name: 'LDL Cholesterol', unit: 'mg/dL' },
      ];

      for (const m of cobasMappings) {
        await prisma.analyzerMapping.create({
          data: {
            analyzerId: cobas.id,
            machineCode: m.code,
            parameterName: m.name,
            unit: m.unit,
            conversionMultiplier: 1.0,
          },
        });
      }

      logger.info('Laboratory diagnostic analyzers and parameter mappings seeded successfully.');
    } catch (err: any) {
      logger.warn(`Analyzer seed notice: ${err.message}`);
    }
  }

  /**
   * Retrieves all analyzers with mapping counts
   */
  static async listAnalyzers() {
    await this.seedDefaultsIfNeeded();
    return prisma.labAnalyzer.findMany({
      include: {
        _count: {
          select: { mappings: true, transmissions: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Retrieves single analyzer with its parameter code mappings
   */
  static async getAnalyzer(id: string) {
    return prisma.labAnalyzer.findUnique({
      where: { id },
      include: { mappings: true },
    });
  }

  /**
   * Registers a new analyzer
   */
  static async createAnalyzer(data: {
    name: string;
    model: string;
    department?: string;
    protocol: string;
    connectionType?: string;
    hostIp?: string;
    port: number;
    baudRate?: number;
    isBidirectional?: boolean;
  }) {
    return prisma.labAnalyzer.create({
      data: {
        name: data.name,
        model: data.model,
        department: data.department || 'Hematology',
        protocol: data.protocol || 'ASTM_E1381',
        connectionType: data.connectionType || 'TCP_SERVER',
        hostIp: data.hostIp || '127.0.0.1',
        port: data.port,
        baudRate: data.baudRate || 9600,
        isBidirectional: data.isBidirectional ?? true,
        status: 'ONLINE',
      },
    });
  }

  /**
   * Updates an analyzer's settings or status
   */
  static async updateAnalyzer(id: string, data: any) {
    return prisma.labAnalyzer.update({
      where: { id },
      data,
    });
  }

  /**
   * Saves or updates parameter mappings for an analyzer
   */
  static async saveMappings(
    analyzerId: string,
    mappings: Array<{ machineCode: string; parameterName: string; unit?: string; conversionMultiplier?: number }>
  ) {
    await prisma.analyzerMapping.deleteMany({ where: { analyzerId } });

    const created = await Promise.all(
      mappings.map((m) =>
        prisma.analyzerMapping.create({
          data: {
            analyzerId,
            machineCode: m.machineCode.toUpperCase(),
            parameterName: m.parameterName,
            unit: m.unit,
            conversionMultiplier: m.conversionMultiplier || 1.0,
          },
        })
      )
    );

    return created;
  }

  /**
   * Retrieves recent analyzer transmission logs
   */
  static async getTransmissions(limit = 50) {
    return prisma.analyzerTransmission.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { analyzer: true },
    });
  }

  /**
   * Matches a specimen barcode (e.g. BL-2026-0015-T1, BL-2026-0015, or L1) to an active Case
   */
  static async findMatchingCase(sampleBarcode: string) {
    if (!sampleBarcode || sampleBarcode === 'UNKNOWN_SAMPLE') return null;

    const trimmed = sampleBarcode.trim();

    // 1. Check exact billNumber match (e.g. BL-2026-0015)
    let matched = await prisma.case.findFirst({
      where: { billNumber: trimmed },
      include: { patient: true, items: true },
    });
    if (matched) return matched;

    // 2. Check tube barcode prefix (e.g. BL-2026-0015-T1 -> BL-2026-0015)
    if (trimmed.includes('-T')) {
      const baseBill = trimmed.split('-T')[0];
      matched = await prisma.case.findFirst({
        where: { billNumber: baseBill },
        include: { patient: true, items: true },
      });
      if (matched) return matched;
    }

    // 3. Check dailyCode match (e.g. L1, L4) created today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    matched = await prisma.case.findFirst({
      where: {
        dailyCode: trimmed.toUpperCase(),
        createdAt: { gte: startOfToday },
      },
      include: { patient: true, items: true },
    });
    if (matched) return matched;

    // 4. Check UHID match
    matched = await prisma.case.findFirst({
      where: {
        patient: { uhid: trimmed },
      },
      orderBy: { createdAt: 'desc' },
      include: { patient: true, items: true },
    });

    return matched;
  }

  /**
   * Ingests parsed analyzer results, matches them to an active case, updates ClinicalResult
   */
  static async ingestResults(
    analyzerId: string | null,
    analyzerName: string,
    protocol: string,
    sampleBarcode: string,
    results: Array<{ code: string; value: string; unit?: string; flag?: string; refRange?: string }>,
    rawPayload: string
  ) {
    const matchedCase = await this.findMatchingCase(sampleBarcode);
    const caseId = matchedCase ? matchedCase.id : null;

    // Map machine codes to LIS parameter names if mappings exist
    let mappingsMap = new Map<string, string>();
    if (analyzerId) {
      const mappings = await prisma.analyzerMapping.findMany({ where: { analyzerId } });
      mappings.forEach((m) => mappingsMap.set(m.machineCode.toUpperCase(), m.parameterName));
    }

    const formattedResults = results.map((r) => {
      const mappedName = mappingsMap.get(r.code.toUpperCase()) || r.code;
      return {
        code: r.code,
        parameterName: mappedName,
        value: r.value,
        unit: r.unit || '',
        flag: r.flag || 'N',
        referenceRange: r.refRange || '',
      };
    });

    // If case is matched, populate ClinicalResult and update Case status
    if (matchedCase) {
      const existingResult = await prisma.clinicalResult.findUnique({
        where: { caseId: matchedCase.id },
      });

      const paramValuesPayload = formattedResults.map((r) => ({
        code: r.parameterName,
        value: r.value,
        unit: r.unit,
        flag: r.flag,
      }));

      const note = `Auto-populated from ${analyzerName} via ${protocol} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      if (existingResult) {
        // Merge with existing results if any
        let currentValues: any[] = [];
        try {
          currentValues = JSON.parse(existingResult.parameterValues);
        } catch (_) {}

        const mergedMap = new Map<string, any>();
        currentValues.forEach((item) => mergedMap.set(item.code, item));
        paramValuesPayload.forEach((item) => mergedMap.set(item.code, item));

        await prisma.clinicalResult.update({
          where: { caseId: matchedCase.id },
          data: {
            parameterValues: JSON.stringify(Array.from(mergedMap.values())),
            technologistNote: note,
          },
        });
      } else {
        await prisma.clinicalResult.create({
          data: {
            caseId: matchedCase.id,
            parameterValues: JSON.stringify(paramValuesPayload),
            technologistNote: note,
            interpretation: 'Automated diagnostic measurement complete. Awaiting clinical validation.',
          },
        });
      }

      // Update case progress
      if (matchedCase.reportStatus === 'Registered') {
        await prisma.case.update({
          where: { id: matchedCase.id },
          data: { reportStatus: 'In Process' },
        });
      }
    }

    // Record Transmission Audit
    const transmission = await prisma.analyzerTransmission.create({
      data: {
        analyzerId: analyzerId || undefined,
        analyzerName,
        protocol,
        sampleBarcode,
        matchedCaseId: caseId,
        rawPayload,
        parsedResults: JSON.stringify(formattedResults),
        status: matchedCase ? 'MATCHED' : 'ORPHAN',
      },
    });

    // Increment analyzer total packets
    if (analyzerId) {
      await prisma.labAnalyzer.update({
        where: { id: analyzerId },
        data: {
          totalPacketsProcessed: { increment: 1 },
          lastPacketAt: new Date(),
        },
      });
    }

    return {
      transmissionId: transmission.id,
      matchedCaseId: caseId,
      billNumber: matchedCase?.billNumber,
      patientName: matchedCase?.patient.fullName,
      parametersCount: formattedResults.length,
      status: matchedCase ? 'MATCHED' : 'ORPHAN',
    };
  }

  /**
   * Simulates an automated machine run (Mindray BC-5000 or Roche Cobas)
   */
  static async simulateRun(analyzerId: string, sampleBarcode: string, scenario: 'NORMAL' | 'ABNORMAL' = 'NORMAL') {
    const analyzer = await prisma.labAnalyzer.findUnique({
      where: { id: analyzerId },
      include: { mappings: true },
    });

    if (!analyzer) {
      throw new Error('Analyzer machine not found');
    }

    if (analyzer.protocol === 'ASTM_E1381') {
      // Hematology Simulation (CBC)
      const cbcResults =
        scenario === 'NORMAL'
          ? [
              { code: 'HGB', value: 14.2, unit: 'g/dL', refRange: '13.0-17.0', flag: 'N' },
              { code: 'RBC', value: 4.8, unit: '10^6/uL', refRange: '4.5-5.5', flag: 'N' },
              { code: 'WBC', value: 7200, unit: 'cells/cumm', refRange: '4000-11000', flag: 'N' },
              { code: 'PLT', value: 240, unit: '10^3/uL', refRange: '150-450', flag: 'N' },
              { code: 'HCT', value: 42.5, unit: '%', refRange: '40.0-50.0', flag: 'N' },
              { code: 'MCV', value: 88.5, unit: 'fL', refRange: '83.0-101.0', flag: 'N' },
              { code: 'MCH', value: 29.6, unit: 'pg', refRange: '27.0-32.0', flag: 'N' },
              { code: 'MCHC', value: 33.4, unit: 'g/dL', refRange: '31.5-34.5', flag: 'N' },
              { code: 'NEU%', value: 62.0, unit: '%', refRange: '40.0-70.0', flag: 'N' },
              { code: 'LYM%', value: 30.5, unit: '%', refRange: '20.0-40.0', flag: 'N' },
              { code: 'EOS%', value: 3.2, unit: '%', refRange: '1.0-6.0', flag: 'N' },
              { code: 'MON%', value: 3.8, unit: '%', refRange: '2.0-8.0', flag: 'N' },
              { code: 'BAS%', value: 0.5, unit: '%', refRange: '0.0-1.0', flag: 'N' },
            ]
          : [
              { code: 'HGB', value: 9.8, unit: 'g/dL', refRange: '13.0-17.0', flag: 'L' },
              { code: 'RBC', value: 3.4, unit: '10^6/uL', refRange: '4.5-5.5', flag: 'L' },
              { code: 'WBC', value: 14800, unit: 'cells/cumm', refRange: '4000-11000', flag: 'H' },
              { code: 'PLT', value: 110, unit: '10^3/uL', refRange: '150-450', flag: 'L' },
              { code: 'HCT', value: 31.0, unit: '%', refRange: '40.0-50.0', flag: 'L' },
              { code: 'MCV', value: 74.0, unit: 'fL', refRange: '83.0-101.0', flag: 'L' },
              { code: 'MCH', value: 24.0, unit: 'pg', refRange: '27.0-32.0', flag: 'L' },
              { code: 'MCHC', value: 29.5, unit: 'g/dL', refRange: '31.5-34.5', flag: 'L' },
              { code: 'NEU%', value: 78.5, unit: '%', refRange: '40.0-70.0', flag: 'H' },
              { code: 'LYM%', value: 16.0, unit: '%', refRange: '20.0-40.0', flag: 'L' },
              { code: 'EOS%', value: 1.5, unit: '%', refRange: '1.0-6.0', flag: 'N' },
              { code: 'MON%', value: 3.5, unit: '%', refRange: '2.0-8.0', flag: 'N' },
              { code: 'BAS%', value: 0.5, unit: '%', refRange: '0.0-1.0', flag: 'N' },
            ];

      const rawPayload = ASTMParser.generateSimulatedPayload(sampleBarcode, cbcResults, analyzer.name);
      const parsed = ASTMParser.parse(rawPayload);

      return this.ingestResults(
        analyzer.id,
        analyzer.name,
        analyzer.protocol,
        sampleBarcode,
        parsed.results.map((r) => ({
          code: r.testCode,
          value: r.value,
          unit: r.unit,
          flag: r.flag,
          refRange: r.referenceRange,
        })),
        rawPayload
      );
    } else {
      // Biochemistry Simulation (Cobas c311)
      const biochemResults =
        scenario === 'NORMAL'
          ? [
              { code: 'GLU', name: 'Blood Glucose Fasting', value: 88, unit: 'mg/dL', refRange: '70-99', flag: 'N' },
              { code: 'UREA', name: 'Blood Urea', value: 24, unit: 'mg/dL', refRange: '15-40', flag: 'N' },
              { code: 'CREAT', name: 'Serum Creatinine', value: 0.9, unit: 'mg/dL', refRange: '0.6-1.2', flag: 'N' },
              { code: 'SGOT', name: 'SGOT (AST)', value: 26, unit: 'U/L', refRange: '10-40', flag: 'N' },
              { code: 'SGPT', name: 'SGPT (ALT)', value: 28, unit: 'U/L', refRange: '10-45', flag: 'N' },
              { code: 'CHOL', name: 'Total Cholesterol', value: 175, unit: 'mg/dL', refRange: '125-200', flag: 'N' },
              { code: 'TRIG', name: 'Triglycerides', value: 130, unit: 'mg/dL', refRange: '50-150', flag: 'N' },
            ]
          : [
              { code: 'GLU', name: 'Blood Glucose Fasting', value: 168, unit: 'mg/dL', refRange: '70-99', flag: 'H' },
              { code: 'UREA', name: 'Blood Urea', value: 58, unit: 'mg/dL', refRange: '15-40', flag: 'H' },
              { code: 'CREAT', name: 'Serum Creatinine', value: 2.1, unit: 'mg/dL', refRange: '0.6-1.2', flag: 'H' },
              { code: 'SGOT', name: 'SGOT (AST)', value: 68, unit: 'U/L', refRange: '10-40', flag: 'H' },
              { code: 'SGPT', name: 'SGPT (ALT)', value: 85, unit: 'U/L', refRange: '10-45', flag: 'H' },
              { code: 'CHOL', name: 'Total Cholesterol', value: 245, unit: 'mg/dL', refRange: '125-200', flag: 'H' },
              { code: 'TRIG', name: 'Triglycerides', value: 260, unit: 'mg/dL', refRange: '50-150', flag: 'H' },
            ];

      const rawPayload = HL7Parser.generateSimulatedPayload(
        sampleBarcode,
        biochemResults,
        analyzer.name
      );
      const parsed = HL7Parser.parse(rawPayload);

      return this.ingestResults(
        analyzer.id,
        analyzer.name,
        analyzer.protocol,
        sampleBarcode,
        parsed.results.map((r) => ({
          code: r.testCode,
          value: r.value,
          unit: r.unit,
          flag: r.abnormalFlag,
          refRange: r.referenceRange,
        })),
        rawPayload
      );
    }
  }

  /**
   * Retrieves any available analyzer results for a specific case
   */
  static async getPendingResultsForCase(caseId: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: { clinicalResult: true },
    });

    if (!caseRecord) return null;

    const orConditions: any[] = [
      { matchedCaseId: caseId },
      { sampleBarcode: caseRecord.billNumber },
      { sampleBarcode: { startsWith: `${caseRecord.billNumber}-` } },
    ];
    if (caseRecord.dailyCode) {
      orConditions.push({ sampleBarcode: caseRecord.dailyCode });
    }

    const transmissions = await prisma.analyzerTransmission.findMany({
      where: {
        OR: orConditions,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      hasResults: transmissions.length > 0 || !!caseRecord.clinicalResult,
      transmissions: transmissions.map((t) => ({
        id: t.id,
        analyzerName: t.analyzerName,
        protocol: t.protocol,
        sampleBarcode: t.sampleBarcode,
        createdAt: t.createdAt,
        results: JSON.parse(t.parsedResults || '[]'),
      })),
      currentResult: caseRecord.clinicalResult
        ? {
            parameterValues: JSON.parse(caseRecord.clinicalResult.parameterValues || '[]'),
            technologistNote: caseRecord.clinicalResult.technologistNote,
            interpretation: caseRecord.clinicalResult.interpretation,
            isAuthorized: caseRecord.clinicalResult.isAuthorized,
          }
        : null,
    };
  }

  /**
   * Starts TCP listener sockets for active analyzers on their configured ports
   */
  static startListeners() {
    const defaultPorts = [5100, 5101];

    for (const port of defaultPorts) {
      if (this.activeServers.has(port)) continue;

      const server = net.createServer((socket) => {
        const clientAddr = `${socket.remoteAddress}:${socket.remotePort}`;
        logger.info(`Analyzer connected on port ${port} from ${clientAddr}`);

        let buffer = '';

        socket.on('data', async (chunk) => {
          const text = chunk.toString();
          buffer += text;

          // ASTM ENQ Handshake
          if (text.includes('\x05')) {
            socket.write('\x06'); // Send ACK
          }

          // ASTM EOT or HL7 End of message
          if (text.includes('\x04') || text.includes('\x1C\x0D')) {
            try {
              if (text.includes('\x1C\x0D')) {
                // HL7 message
                const parsed = HL7Parser.parse(buffer);
                await this.ingestResults(
                  null,
                  parsed.sendingApp || 'Biochemistry Analyzer',
                  'HL7_V2',
                  parsed.order?.specimenBarcode || 'UNKNOWN_SAMPLE',
                  parsed.results.map((r) => ({
                    code: r.testCode,
                    value: r.value,
                    unit: r.unit,
                    flag: r.abnormalFlag,
                    refRange: r.referenceRange,
                  })),
                  buffer
                );
                // Send HL7 ACK
                socket.write(HL7Parser.generateAck(parsed.controlId, true));
              } else {
                // ASTM message
                const parsed = ASTMParser.parse(buffer);
                await this.ingestResults(
                  null,
                  parsed.header?.instrumentModel || 'Mindray Hematology',
                  'ASTM_E1381',
                  parsed.order?.specimenBarcode || 'UNKNOWN_SAMPLE',
                  parsed.results.map((r) => ({
                    code: r.testCode,
                    value: r.value,
                    unit: r.unit,
                    flag: r.flag,
                    refRange: r.referenceRange,
                  })),
                  buffer
                );
                socket.write('\x06'); // Send final ACK
              }
            } catch (err: any) {
              logger.error(`Error processing analyzer stream on port ${port}: ${err.message}`);
            }
            buffer = '';
          }
        });

        socket.on('error', (err) => {
          logger.warn(`Analyzer socket error on port ${port}: ${err.message}`);
        });
      });

      server.on('error', (err: any) => {
        // If port is already in use, don't crash, just log warning
        logger.warn(`Analyzer listener on port ${port} could not bind: ${err.message}`);
      });

      try {
        server.listen(port, () => {
          logger.info(`LIS Analyzer TCP listener active on port ${port}`);
        });
        this.activeServers.set(port, server);
      } catch (err: any) {
        logger.warn(`Could not start TCP server on port ${port}: ${err.message}`);
      }
    }
  }
}
