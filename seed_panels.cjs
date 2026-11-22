const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function seedPanels() {
  const allPanels = JSON.parse(fs.readFileSync('parsed_panels.json', 'utf8'));
  const panels = allPanels.slice(0, 24);

  console.log('Seeding', panels.length, 'panels into database...');
  for (let i = 0; i < panels.length; i++) {
    const p = panels[i];
    const code = 'PANEL_' + p.name.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase().slice(0, 15);
    const existing = await prisma.testPanel.findFirst({
      where: {
        OR: [
          { name: p.name },
          { id: p.id },
          { code: code }
        ]
      }
    });

    const data = {
      name: p.name,
      code: existing?.code || code,
      category: p.category,
      department: p.category,
      testCount: p.tests.length,
      testIds: JSON.stringify(p.tests),
      subheadings: JSON.stringify({
        order: i + 1,
        hideInterpretation: p.hideInterpretation,
        hideMethodInstrument: p.hideMethodInstrument,
        noteHtml: p.noteHtml,
        ratelistEntries: p.ratelistEntries
      }),
      panelPrice: p.ratelistEntries?.[0]?.fee || 200.0
    };

    if (existing) {
      await prisma.testPanel.update({
        where: { id: existing.id },
        data
      });
      console.log('Updated panel:', p.name);
    } else {
      await prisma.testPanel.create({
        data: {
          id: p.id,
          ...data
        }
      });
      console.log('Created panel:', p.name);
    }
  }

  const count = await prisma.testPanel.count();
  console.log('Total test panels in DB:', count);
}

seedPanels().catch(console.error).finally(() => prisma.$disconnect());
