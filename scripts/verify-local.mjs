import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
  const [interventions, events, achievements, contacts] = await Promise.all([
    prisma.intervention.findMany({ where: { published: true } }),
    prisma.event.findMany({ where: { published: true } }),
    prisma.achievement.findMany({ where: { published: true } }),
    prisma.emergencyContact.findMany({ where: { active: true } }),
  ]);

  console.log(`✅ LOCAL DB VERIFIED:`);
  console.log(`- Interventions: ${interventions.length} items`);
  interventions.forEach((i) => console.log(`   * [${i.category || 'General'}] ${i.title}`));
  console.log(`- Events: ${events.length} items`);
  events.forEach((e) => console.log(`   * ${e.title}`));
  console.log(`- Achievements: ${achievements.length} items`);
  achievements.forEach((a) => console.log(`   * [${a.category}] ${a.title}`));
  console.log(`- Emergency Contacts: ${contacts.length} items`);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
