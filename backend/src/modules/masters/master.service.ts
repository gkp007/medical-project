import { prisma } from '../../core/database/prisma.client.js';
import { NotFoundError } from '../../core/errors/AppError.js';

export class MasterService {
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
    const test = await prisma.investigation.findUnique({
      where: { id },
      include: {
        parameters: {
          include: { ranges: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    if (!test) throw new NotFoundError('Test investigation not found');

    const allPanels = await prisma.testPanel.findMany();
    const panelsIncluded = allPanels
      .filter((p) => {
        try {
          const ids = JSON.parse(p.testIds || '[]');
          return ids.includes(test.id) || ids.includes(test.code);
        } catch {
          return false;
        }
      })
      .map((p) => ({ name: p.name, id: p.id }));

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
      panelsIncluded
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
    return prisma.investigation.create({
      data: {
        code: data.code,
        name: data.name,
        department: data.department,
        specimen: data.specimen,
        container: data.container || 'Standard Container',
        rate: data.rate,
        b2bRate: data.b2bRate || null,
        tatHours: data.tatHours || 4
      }
    });
  }

  static async updateTest(id: string, data: any) {
    const test = await prisma.investigation.findUnique({ where: { id } });
    if (!test) throw new NotFoundError('Test investigation not found');

    return prisma.investigation.update({
      where: { id },
      data
    });
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
        retailPrice: Number(data.retailPrice),
        packagePrice: Number(data.packagePrice),
        discountPct: Number(data.discountPct || 0.0)
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
    return prisma.testCategory.findMany({ orderBy: { name: 'asc' } });
  }

  static async createCategory(data: any) {
    return prisma.testCategory.create({
      data: {
        name: data.name,
        code: data.code || undefined,
        department: data.department,
        description: data.description || null,
        testCount: Number(data.testCount || 0)
      }
    });
  }

  static async updateCategory(id: string, data: any) {
    const category = await prisma.testCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Test category not found');

    return prisma.testCategory.update({
      where: { id },
      data
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.testCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Test category not found');

    return prisma.testCategory.delete({ where: { id } });
  }

  // --- Collection Agents ---
  static async listAgents() {
    return prisma.collectionAgent.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  static async createAgent(data: any) {
    return prisma.collectionAgent.create({
      data: {
        name: data.name,
        phone: data.phone,
        zone: data.zone || 'Default Zone',
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
