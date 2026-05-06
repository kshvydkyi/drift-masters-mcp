import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // 1. Очищаем старые данные (чтобы при перезапуске скрипта не было дублей)
  const deletedBattles = await prisma.battle.deleteMany();
  const deletedQualifications = await prisma.qualification.deleteMany();
  const deletedCars = await prisma.car.deleteMany();
  const deletedEvents = await prisma.event.deleteMany();
  const deletedPilots = await prisma.pilot.deleteMany();

  console.log(`Deleted battles: ${deletedBattles.count}`);
  console.log(`Deleted qualifications: ${deletedQualifications.count}`);
  console.log(`Deleted cars: ${deletedCars.count}`);
  console.log(`Deleted events: ${deletedEvents.count}`);
  console.log(`Deleted pilots: ${deletedPilots.count}`);

  // 2. Создаем Ивенты (Этапы Drift Masters 2026)
  const round1 = await prisma.event.create({
    data: {
      name: 'Round 1: Italy',
      location: 'Vallelunga Circuit, Rome',
      date: new Date('2026-05-01T10:00:00Z'),
      isCompleted: true,
    },
  });
  console.log(`Created event: ${round1.name}`);

  const round2 = await prisma.event.create({
    data: {
      name: 'Round 2: Spain',
      location: 'Circuito del Jarama, Madrid',
      date: new Date('2026-05-30T10:00:00Z'), // примерная дата
      isCompleted: false,
    },
  });
  console.log(`Created event: ${round2.name}`);

  // 3. Создаем Пилотов и сразу привязываем к ним машины
  const jamesDeane = await prisma.pilot.create({
    data: {
      firstName: 'James',
      lastName: 'Deane',
      nickname: 'The Machine',
      teamName: 'Falken Tyres',
      country: 'Ireland',
      cars: {
        create: [
          {
            make: 'Nissan',
            model: 'Silvia S14',
            horsepower: 900,
            engine: '2JZ-GTE',
          },
        ],
      },
    },
  });
  console.log(`Created pilot: ${jamesDeane.firstName} ${jamesDeane.lastName}`);

  const piotrWiecek = await prisma.pilot.create({
    data: {
      firstName: 'Piotr',
      lastName: 'Wiecek',
      teamName: 'Worthouse Drift Team',
      country: 'Poland',
      cars: {
        create: [
          {
            make: 'Nissan',
            model: 'Silvia S15',
            horsepower: 1000,
            engine: '2JZ-GTE',
          },
        ],
      },
    },
  });
  console.log(`Created pilot: ${piotrWiecek.firstName} ${piotrWiecek.lastName}`);

  // 4. Добавляем фейковые результаты квалификации для Round 1
  const createdQualifications = await prisma.qualification.createMany({
    data: [
      {
        runNumber: 1,
        lineScore: 28.5,
        angleScore: 29.0,
        styleScore: 38.5,
        totalScore: 96.0,
        pilotId: jamesDeane.id,
        eventId: round1.id,
      },
      {
        runNumber: 1,
        lineScore: 29.0,
        angleScore: 29.5,
        styleScore: 39.0,
        totalScore: 97.5,
        pilotId: piotrWiecek.id,
        eventId: round1.id,
      },
    ],
  });
  console.log(`Created qualifications: ${createdQualifications.count}`);

  console.log("Seeding finished successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
