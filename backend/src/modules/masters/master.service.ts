import { prisma } from '../../core/database/prisma.client.js';
import { BadRequestError, NotFoundError } from '../../core/errors/AppError.js';

export class MasterService {
  static async listUnits() {
    return prisma.laboratoryUnit.findMany({ orderBy: { name: 'asc' } });
  }

  static async createUnit(rawName: unknown) {
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) throw new BadRequestError('Unit name is required');
    return prisma.laboratoryUnit.upsert({ where: { name }, create: { name }, update: {} });
  }

  // --- Investigations & Tests ---
  static async listTests(query: { search?: string; department?: string }) {
    const where: any = { isDeleted: false };
    if (query.department && query.department !== 'ALL') {
      where.department = query.department;
    }
    if (query.search) {
      where.OR = [
        { code: { contains: query.search } },
        { name: { contains: query.search } }
      ];
    }

    return prisma.investigation.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        parameters: {
          include: { ranges: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
  }

  static async getTestById(id: string) {
    let test = await prisma.investigation.findUnique({
      where: { id },
      include: {
        parameters: {
          include: { ranges: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!test) {
      test = await prisma.investigation.findFirst({
        where: {
          OR: [
            { code: { equals: id, mode: 'insensitive' } },
            { name: { equals: id, mode: 'insensitive' } },
            { name: { contains: id, mode: 'insensitive' } }
          ]
        },
        include: {
          parameters: {
            include: { ranges: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    }

    if (!test) throw new NotFoundError('Test investigation not found');

    const allPanels = await prisma.testPanel.findMany();
    const panelsIncluded = allPanels
      .filter((p) => {
        try {
          const ids = JSON.parse(p.testIds || '[]');
          return ids.includes(test!.id) || ids.includes(test!.code);
        } catch {
          return false;
        }
      })
      .map((p) => ({ name: p.name, id: p.id }));

    const allPackages = await prisma.healthPackage.findMany();
    const ratelistsIncluded = allPackages
      .filter((p) => {
        try {
          const ids = JSON.parse(p.testsIncluded || '[]');
          return ids.includes(test!.id) || ids.includes(test!.code);
        } catch {
          return false;
        }
      })
      .map((p, idx) => ({ sNo: idx + 1, id: p.id, name: p.name, code: p.code }));

    const interp = await prisma.clinicalInterpretation.findFirst({
      where: {
        OR: [
          { testCode: test.code },
          { title: test.name }
        ]
      }
    });

    const enrichedParameters = test.parameters.map((param) => ({
      ...param,
      ranges: param.ranges.map((r) => {
        let displayRange = `${r.lowerBound} - ${r.upperBound}`;
        let minAgeUnit = 'Years';
        let maxAgeUnit = 'Years';
        let selectType = 'numeric_range';
        if (r.textualNormal) {
          try {
            const parsed = JSON.parse(r.textualNormal);
            if (parsed && typeof parsed === 'object') {
              if (parsed.displayRange) displayRange = parsed.displayRange;
              if (parsed.minAgeUnit) minAgeUnit = parsed.minAgeUnit;
              if (parsed.maxAgeUnit) maxAgeUnit = parsed.maxAgeUnit;
              if (parsed.selectType) selectType = parsed.selectType;
            }
          } catch {
            displayRange = r.textualNormal;
            selectType = 'text';
          }
        }
        return {
          ...r,
          displayRange,
          minAgeUnit,
          maxAgeUnit,
          selectType
        };
      })
    }));

    return {
      ...test,
      parameters: enrichedParameters,
      panelsIncluded,
      ratelistsIncluded,
      interpretation: interp ? interp.content : ''
    };
  }

  static async updateNormalValues(testId: string, data: any) {
    const test = await prisma.investigation.findUnique({
      where: { id: testId },
      include: { parameters: { include: { ranges: true } } }
    });
    if (!test) throw new NotFoundError('Test investigation not found');

    let targetParam = data.parameterId
      ? test.parameters.find((p) => p.id === data.parameterId)
      : test.parameters[0];

    if (!targetParam) {
      targetParam = await prisma.testParameter.create({
        data: {
          investigationId: testId,
          code: test.code,
          name: test.name,
          unit: data.unit || 'g/dl',
          sortOrder: 1
        },
        include: { ranges: true }
      });
    }

    await prisma.parameterRange.deleteMany({
      where: { parameterId: targetParam.id }
    });

    if (data.unit) {
      await prisma.testParameter.update({
        where: { id: targetParam.id },
        data: { unit: data.unit }
      });
    }

    if (data.selectType === 'text') {
      await prisma.parameterRange.create({
        data: {
          parameterId: targetParam.id,
          gender: 'All',
          minAge: 0,
          maxAge: 120,
          lowerBound: 0,
          upperBound: 0,
          textualNormal: data.textualNormal || 'Negative'
        }
      });
    } else if (Array.isArray(data.ranges) && data.ranges.length > 0) {
      for (const r of data.ranges) {
        const metadata = {
          displayRange: r.displayRange && r.displayRange.trim() ? r.displayRange.trim() : `${r.lowerBound} - ${r.upperBound}`,
          minAgeUnit: r.minAgeUnit || 'Years',
          maxAgeUnit: r.maxAgeUnit || 'Years',
          selectType: 'numeric_range'
        };

        await prisma.parameterRange.create({
          data: {
            parameterId: targetParam.id,
            gender: r.gender || 'Any',
            minAge: Number(r.minAge || 0),
            maxAge: Number(r.maxAge !== undefined ? r.maxAge : 120),
            lowerBound: Number(r.lowerBound || 0),
            upperBound: Number(r.upperBound || 0),
            textualNormal: JSON.stringify(metadata)
          }
        });
      }
    }

    return this.getTestById(testId);
  }

  static async createTest(data: any) {
    const parameters = Array.isArray(data.parameters) ? data.parameters : [];
    const testType = data.testType || (parameters.length > 1 ? 'Multi parameter' : 'Single parameter');

    if (!data.name?.trim() || !data.code?.trim() || !data.department?.trim()) {
      throw new Error('Code, name and department are required to create a test');
    }
    if (testType === 'Multi parameter' && parameters.filter((p: any) => !p.isRemoved).length === 0) {
      throw new Error('A multi-parameter test needs at least one active parameter');
    }

    const created = await prisma.investigation.create({
      data: {
        code: data.code.trim(),
        name: data.name.trim(),
        department: data.department.trim(),
        testType,
        displayNameInReport: data.displayNameInReport !== false,
        nestedTemplate: data.nestedTemplate || null,
        specimen: data.specimen || 'Blood',
        container: data.container || 'Standard Container',
        rate: Number(data.rate || 0),
        b2bRate: data.b2bRate ? Number(data.b2bRate) : null,
        ratelistGender: data.ratelistGender || 'Both',
        isActiveInRatelist: data.isActiveInRatelist !== false,
        tatHours: Number(data.tatHours || 4),
        parameters: {
          create: parameters.map((parameter: any, index: number) => ({
            code: data.code.trim(),
            name: parameter.name?.trim() || data.name.trim(),
            unit: parameter.unit || '',
            sortOrder: Number(parameter.order ?? index + 1),
            isOptional: Boolean(parameter.isOptional),
            isRemoved: Boolean(parameter.isRemoved),
            inputType: parameter.inputType || 'Single Line',
            defaultResult: parameter.defaultResult || null,
            groupBy: parameter.groupBy || null,
          })),
        },
      },
    });

    return this.getTestById(created.id);
  }

  static async importLibraryTest(data: any) {
    const name = data.name?.trim();
    const department = data.department?.trim();
    const libraryId = String(data.libraryId || '').trim();
    const rate = Number(data.rate);

    if (!name || !department || !libraryId || !Number.isFinite(rate) || rate <= 0) {
      throw new BadRequestError('Library test name, category, reference and a positive fee are required');
    }

    const code = `LIB_${libraryId.replace(/[^A-Za-z0-9_-]/g, '_')}`;
    const existing = await prisma.investigation.findFirst({
      where: {
        OR: [
          { code },
          { name: { equals: name, mode: 'insensitive' } },
        ],
      },
      select: { id: true, isDeleted: true },
    });

    if (existing && !existing.isDeleted) {
      return { created: false, test: await this.getTestById(existing.id) };
    }

    if (existing?.isDeleted) {
      await prisma.investigation.update({
        where: { id: existing.id },
        data: {
          name,
          department,
          rate,
          specimen: data.specimen?.trim() || 'Serum',
          container: data.container?.trim() || 'Standard Container',
          isDeleted: false,
        },
      });
      return { created: true, test: await this.getTestById(existing.id) };
    }

    const test = await this.createTest({
      code,
      name,
      department,
      rate,
      specimen: data.specimen?.trim() || 'Serum',
      container: data.container?.trim() || 'Standard Container',
      testType: 'Single parameter',
      parameters: [{ name, unit: '', inputType: 'Single Line', order: 1 }],
    });

    return { created: true, test };
  }

  static async updateTest(id: string, data: any) {
    let test = await prisma.investigation.findUnique({ where: { id } });
    if (!test) {
      test = await prisma.investigation.findFirst({ where: { code: id } });
    }
    if (!test) throw new NotFoundError('Test investigation not found');

    const updatePayload: any = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.testType !== undefined) updatePayload.testType = data.testType;
    if (data.displayNameInReport !== undefined) updatePayload.displayNameInReport = Boolean(data.displayNameInReport);
    if (data.nestedTemplate !== undefined) updatePayload.nestedTemplate = data.nestedTemplate || null;
    if (data.department !== undefined) updatePayload.department = data.department;
    if (data.specimen !== undefined) updatePayload.specimen = data.specimen;
    if (data.container !== undefined) updatePayload.container = data.container;
    if (data.rate !== undefined) updatePayload.rate = Number(data.rate);
    if (data.b2bRate !== undefined) updatePayload.b2bRate = data.b2bRate ? Number(data.b2bRate) : null;
    if (data.ratelistGender !== undefined) updatePayload.ratelistGender = data.ratelistGender;
    if (data.isActiveInRatelist !== undefined) updatePayload.isActiveInRatelist = Boolean(data.isActiveInRatelist);
    if (data.tatHours !== undefined) updatePayload.tatHours = Number(data.tatHours);

    if (Object.keys(updatePayload).length > 0) {
      await prisma.investigation.update({
        where: { id: test.id },
        data: updatePayload
      });
    }

    if (data.unit) {
      const firstParam = await prisma.testParameter.findFirst({
        where: { investigationId: test.id }
      });
      if (firstParam) {
        await prisma.testParameter.update({
          where: { id: firstParam.id },
          data: { unit: data.unit }
        });
      }
    }

    if (data.interpretation) {
      const existingInterp = await prisma.clinicalInterpretation.findFirst({
        where: {
          OR: [
            { testCode: test.code },
            { title: test.name }
          ]
        }
      });
      if (existingInterp) {
        await prisma.clinicalInterpretation.update({
          where: { id: existingInterp.id },
          data: { content: data.interpretation, title: data.name || test.name }
        });
      } else {
        await prisma.clinicalInterpretation.create({
          data: {
            title: data.name || test.name,
            testCode: test.code,
            department: data.department || test.department,
            content: data.interpretation
          }
        });
      }
    }

    if (Array.isArray(data.parameters)) {
      const existingParameters = await prisma.testParameter.findMany({
        where: { investigationId: test.id },
        select: { id: true },
      });
      const existingIds = new Set(existingParameters.map((parameter) => parameter.id));
      const incomingIds = new Set<string>(
        data.parameters
          .map((parameter: any) => parameter.id)
          .filter((id: unknown): id is string => typeof id === 'string')
      );

      await prisma.$transaction(async (tx) => {
        await tx.testParameter.deleteMany({
          where: { investigationId: test!.id, id: { notIn: [...incomingIds] } },
        });

        await Promise.all(data.parameters.map((parameter: any, index: number) => {
          const value = {
            code: data.code || test!.code,
            name: parameter.name?.trim() || test!.name,
            unit: parameter.unit || '',
            sortOrder: Number(parameter.order ?? index + 1),
            isOptional: Boolean(parameter.isOptional),
            isRemoved: Boolean(parameter.isRemoved),
            inputType: parameter.inputType || 'Single Line',
            defaultResult: parameter.defaultResult || null,
            groupBy: parameter.groupBy || null,
          };
          return existingIds.has(parameter.id)
            ? tx.testParameter.update({ where: { id: parameter.id }, data: value })
            : tx.testParameter.create({ data: { ...value, investigationId: test!.id } });
        }));
      });
    }

    return this.getTestById(test.id);
  }

  static async linkRatelist(testId: string, ratelistNameOrId: string) {
    let test = await prisma.investigation.findUnique({ where: { id: testId } });
    if (!test) test = await prisma.investigation.findFirst({ where: { code: testId } });
    if (!test) throw new NotFoundError('Test investigation not found');

    let pkg = await prisma.healthPackage.findFirst({
      where: {
        OR: [
          { id: ratelistNameOrId },
          { name: ratelistNameOrId }
        ]
      }
    });

    if (!pkg) {
      pkg = await prisma.healthPackage.create({
        data: {
          code: `PKG-${Date.now()}`,
          name: ratelistNameOrId,
          testsIncluded: JSON.stringify([test.code]),
          retailPrice: 1500,
          packagePrice: 1200,
          discountPct: 20
        }
      });
    } else {
      let currentTests: string[] = [];
      try {
        currentTests = JSON.parse(pkg.testsIncluded || '[]');
      } catch {}
      if (!currentTests.includes(test.code) && !currentTests.includes(test.id)) {
        currentTests.push(test.code);
        await prisma.healthPackage.update({
          where: { id: pkg.id },
          data: { testsIncluded: JSON.stringify(currentTests) }
        });
      }
    }

    return this.getTestById(test.id);
  }

  static async deleteTest(id: string) {
    return prisma.investigation.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  // --- Health Packages ---
  static async listPackages() {
    return prisma.healthPackage.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  static async createPackage(data: any) {
    return prisma.healthPackage.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description || null,
        testsIncluded: typeof data.testsIncluded === 'string' ? data.testsIncluded : JSON.stringify(data.testsIncluded || []),
        panelsIncluded: typeof data.panelsIncluded === 'string' ? data.panelsIncluded : JSON.stringify(data.panelsIncluded || []),
        retailPrice: Number(data.retailPrice),
        packagePrice: Number(data.packagePrice),
        discountPct: Number(data.discountPct || 0.0),
        forGender: data.forGender || 'Both',
        isInRatelist: data.isInRatelist !== false,
        hideInterpretation: data.hideInterpretation !== false,
        hideMethodInstrument: Boolean(data.hideMethodInstrument)
      }
    });
  }

  static async updatePackage(id: string, data: any) {
    const pkg = await prisma.healthPackage.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundError('Health package not found');

    const updateData: any = { ...data };
    if (data.testsIncluded && typeof data.testsIncluded !== 'string') {
      updateData.testsIncluded = JSON.stringify(data.testsIncluded);
    }
    if (data.panelsIncluded && typeof data.panelsIncluded !== 'string') {
      updateData.panelsIncluded = JSON.stringify(data.panelsIncluded);
    }
    if (data.retailPrice !== undefined) updateData.retailPrice = Number(data.retailPrice);
    if (data.packagePrice !== undefined) updateData.packagePrice = Number(data.packagePrice);
    if (data.discountPct !== undefined) updateData.discountPct = Number(data.discountPct);

    return prisma.healthPackage.update({
      where: { id },
      data: updateData
    });
  }

  static async deletePackage(id: string) {
    const pkg = await prisma.healthPackage.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundError('Health package not found');

    return prisma.healthPackage.update({
      where: { id },
      data: { isActive: false }
    });
  }

  // --- Test Panels ---
  static async listPanels() {
    return prisma.testPanel.findMany({ orderBy: { name: 'asc' } });
  }

  static async createPanel(data: any) {
    return prisma.testPanel.create({
      data: {
        name: data.name,
        code: data.code || undefined,
        department: data.department,
        testCount: Number(data.testCount || 0),
        testIds: typeof data.testIds === 'string' ? data.testIds : JSON.stringify(data.testIds || []),
        subheadings: data.subheadings ? (typeof data.subheadings === 'string' ? data.subheadings : JSON.stringify(data.subheadings)) : null,
        panelPrice: data.panelPrice !== undefined ? Number(data.panelPrice) : 0.0
      }
    });
  }

  static async updatePanel(id: string, data: any) {
    const panel = await prisma.testPanel.findUnique({ where: { id } });
    if (!panel) throw new NotFoundError('Test panel not found');

    const updateData: any = { ...data };
    if (data.testIds && typeof data.testIds !== 'string') {
      updateData.testIds = JSON.stringify(data.testIds);
    }
    if (data.subheadings && typeof data.subheadings !== 'string') {
      updateData.subheadings = JSON.stringify(data.subheadings);
    }
    if (data.panelPrice !== undefined) updateData.panelPrice = Number(data.panelPrice);
    if (data.testCount !== undefined) updateData.testCount = Number(data.testCount);

    return prisma.testPanel.update({
      where: { id },
      data: updateData
    });
  }

  static async deletePanel(id: string) {
    const panel = await prisma.testPanel.findUnique({ where: { id } });
    if (!panel) throw new NotFoundError('Test panel not found');

    return prisma.testPanel.delete({ where: { id } });
  }

  // --- Test Categories ---
  static async listCategories() {
    return prisma.testCategory.findMany({ orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] });
  }

  static async createCategory(data: any) {
    return prisma.testCategory.create({
      data: {
        name: data.name,
        code: data.code || undefined,
        department: data.department,
        description: data.description || null,
        testCount: Number(data.testCount || 0),
        displayOrder: Number(data.displayOrder || data.testCount || 0)
      }
    });
  }

  static async updateCategory(id: string, data: any) {
    const category = await prisma.testCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Test category not found');

    const updateData: any = { ...data };
    if (data.displayOrder !== undefined) updateData.displayOrder = Number(data.displayOrder);
    return prisma.testCategory.update({
      where: { id },
      data: updateData
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.testCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Test category not found');

    return prisma.testCategory.delete({ where: { id } });
  }

  // --- Collection Agents ---
  static async listAgents(includeAll = false) {
    return prisma.collectionAgent.findMany({
      where: includeAll ? {} : { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  static async createAgent(data: any) {
    return prisma.collectionAgent.create({
      data: {
        name: data.name,
        phone: data.phone || data.mobile || 'N/A',
        zone: data.zone || data.area || 'Default Zone',
        vehicleNo: data.vehicleNo || null,
        feePerCollection: data.feePerCollection !== undefined ? Number(data.feePerCollection) : 100.0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true
      }
    });
  }

  static async updateAgent(id: string, data: any) {
    const agent = await prisma.collectionAgent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundError('Collection agent not found');

    return prisma.collectionAgent.update({
      where: { id },
      data
    });
  }

  static async deleteAgent(id: string) {
    const agent = await prisma.collectionAgent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundError('Collection agent not found');

    return prisma.collectionAgent.update({
      where: { id },
      data: { isActive: false }
    });
  }

  // --- Clinic Settings ---
  static async getClinicSettings() {
    return prisma.clinicSetting.findUnique({
      where: { id: 'clinic_default' }
    });
  }

  static async updateClinicSettings(data: any) {
    return prisma.clinicSetting.update({
      where: { id: 'clinic_default' },
      data
    });
  }
}
