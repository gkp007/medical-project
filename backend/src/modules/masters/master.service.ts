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
