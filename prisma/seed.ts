import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed data for regions
  const singapore = await prisma.region.upsert({
    where: { code: "SG" },
    update: {}, // If the region exists, do nothing
    create: {
      name: "Singapore",
      code: "SG",
      timeZone: "Asia/Singapore",
    },
  });

  const usa = await prisma.region.upsert({
    where: { code: "US" },
    update: {}, // If the region exists, do nothing
    create: {
      name: "United States",
      code: "US",
      timeZone: "America/New_York",
    },
  });

  // Seed data for questions
  await prisma.question.createMany({
    data: [
      {
        content: "What is your favorite color?",
        orderIndex: 1,
        regionId: singapore.id,
      },
      {
        content: "What is your favorite food?",
        orderIndex: 2,
        regionId: singapore.id,
      },
      {
        content: "What is your favorite season?",
        orderIndex: 1,
        regionId: usa.id,
      },
      {
        content: "Where would you like to travel?",
        orderIndex: 2,
        regionId: usa.id,
      },
    ],
    skipDuplicates: true, // Avoid creating duplicates
  });

  // Seed data for configurations
  await prisma.configuration.upsert({
    where: { regionId: singapore.id },
    update: {}, // Do nothing if configuration exists
    create: {
      regionId: singapore.id,
      cycleDuration: 7, // 7 days
      cycleStartDay: 1, // Monday
      cycleStartHour: 19, // 7 PM SGT
      cycleStartMinute: 0,
    },
  });

  await prisma.configuration.upsert({
    where: { regionId: usa.id },
    update: {},
    create: {
      regionId: usa.id,
      cycleDuration: 7, // 7 days
      cycleStartDay: 1, // Monday
      cycleStartHour: 19, // 7 PM ET
      cycleStartMinute: 0,
    },
  });

  console.log("Database has been seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
