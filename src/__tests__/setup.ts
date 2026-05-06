import { prisma } from "../db";

export async function cleanDatabase() {
  // Respect FK constraints by deleting dependent records first.
  await prisma.battle.deleteMany();
  await prisma.qualification.deleteMany();
  await prisma.car.deleteMany();
  await prisma.event.deleteMany();
  await prisma.pilot.deleteMany();
}

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
