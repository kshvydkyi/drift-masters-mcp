import { prisma } from "../db";
import { toolsRegistry } from "../tools";
import { cleanDatabase } from "./setup";
import type { ToolDef } from "../types/types";

function getTool(name: string): ToolDef {
  const tool = toolsRegistry[name];
  if (!tool) {
    throw new Error(`Tool "${name}" is not registered`);
  }
  return tool;
}

describe("MCP tools integration tests", () => {
  beforeAll(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("create_pilot creates pilot without car", async () => {
    const createPilotTool = getTool("create_pilot");
    const result = (await createPilotTool.handler({
      firstName: "Conor",
      lastName: "Shanahan",
      country: "Ireland",
    })) as { id: number };

    const createdPilot = await prisma.pilot.findUnique({
      where: { id: result.id },
      include: { cars: true },
    });

    expect(createdPilot).not.toBeNull();
    expect(createdPilot?.firstName).toBe("Conor");
    expect(createdPilot?.cars).toHaveLength(0);
  });

  test("create_pilot creates pilot with nested car", async () => {
    const createPilotTool = getTool("create_pilot");
    const result = (await createPilotTool.handler({
      firstName: "James",
      lastName: "Dean",
      country: "USA",
      teamName: "Worthouse",
      nickname: "The Machine",
      car: {
        make: "Nissan",
        model: "S15",
        horsepower: 950,
        engine: "2JZ",
      },
    })) as { id: number };

    const createdPilot = await prisma.pilot.findUnique({
      where: { id: result.id },
      include: { cars: true },
    });

    expect(createdPilot).not.toBeNull();
    expect(createdPilot?.cars).toHaveLength(1);
    expect(createdPilot?.cars[0]?.model).toBe("S15");
  });

  test("update_pilot updates teamName", async () => {
    const createPilotTool = getTool("create_pilot");
    const updatePilotTool = getTool("update_pilot");
    const createdPilot = (await createPilotTool.handler({
      firstName: "Aasbo",
      lastName: "Fredric",
      country: "Norway",
    })) as { id: number };

    await updatePilotTool.handler({
      id: createdPilot.id,
      teamName: "Papadakis Racing",
    });

    const updated = await prisma.pilot.findUnique({ where: { id: createdPilot.id } });
    expect(updated?.teamName).toBe("Papadakis Racing");
  });

  test("delete_pilot removes pilot from DB", async () => {
    const createPilotTool = getTool("create_pilot");
    const deletePilotTool = getTool("delete_pilot");
    const createdPilot = (await createPilotTool.handler({
      firstName: "Ryan",
      lastName: "Tuerck",
      country: "USA",
    })) as { id: number };

    await deletePilotTool.handler({ id: createdPilot.id });

    const deleted = await prisma.pilot.findUnique({ where: { id: createdPilot.id } });
    expect(deleted).toBeNull();
  });

  test("create_pilot throws with missing required fields", async () => {
    const createPilotTool = getTool("create_pilot");
    await expect(
      createPilotTool.handler({
        firstName: "Incomplete",
      }),
    ).rejects.toThrow();
  });

  test("add_car_to_pilot creates and links car", async () => {
    const createPilotTool = getTool("create_pilot");
    const addCarToPilotTool = getTool("add_car_to_pilot");
    const createdPilot = (await createPilotTool.handler({
      firstName: "Adam",
      lastName: "LZ",
      country: "USA",
    })) as { id: number };

    const createdCar = (await addCarToPilotTool.handler({
      pilotId: createdPilot.id,
      make: "BMW",
      model: "E36",
      horsepower: 800,
      engine: "2JZ",
    })) as { id: number };

    const carInDb = await prisma.car.findUnique({ where: { id: createdCar.id } });
    expect(carInDb).not.toBeNull();
    expect(carInDb?.pilotId).toBe(createdPilot.id);
  });

  test("update_car updates horsepower", async () => {
    const createPilotTool = getTool("create_pilot");
    const updateCarTool = getTool("update_car");
    const createdPilot = (await createPilotTool.handler({
      firstName: "Toshiki",
      lastName: "Yoshioka",
      country: "Japan",
      car: {
        make: "Toyota",
        model: "Mark II",
        horsepower: 650,
      },
    })) as { id: number };

    const car = await prisma.car.findFirst({ where: { pilotId: createdPilot.id } });
    expect(car).not.toBeNull();

    await updateCarTool.handler({
      id: car!.id,
      horsepower: 720,
    });

    const updated = await prisma.car.findUnique({ where: { id: car!.id } });
    expect(updated?.horsepower).toBe(720);
  });

  test("delete_car removes car and keeps pilot", async () => {
    const createPilotTool = getTool("create_pilot");
    const deleteCarTool = getTool("delete_car");
    const createdPilot = (await createPilotTool.handler({
      firstName: "Aurimas",
      lastName: "Bakchis",
      country: "USA",
      car: {
        make: "Nissan",
        model: "S14",
      },
    })) as { id: number };

    const car = await prisma.car.findFirst({ where: { pilotId: createdPilot.id } });
    expect(car).not.toBeNull();
    await deleteCarTool.handler({ id: car!.id });

    const carAfterDelete = await prisma.car.findUnique({ where: { id: car!.id } });
    const pilotAfterDelete = await prisma.pilot.findUnique({ where: { id: createdPilot.id } });
    expect(carAfterDelete).toBeNull();
    expect(pilotAfterDelete).not.toBeNull();
  });

  test("create_event creates event with expected fields", async () => {
    const createEventTool = getTool("create_event");
    const eventDate = "2026-01-15T10:00:00.000Z";

    const result = (await createEventTool.handler({
      name: "Round 1: Riga",
      location: "Riga",
      date: eventDate,
      isCompleted: false,
    })) as { id: number; name: string };

    const createdEvent = await prisma.event.findUnique({
      where: { id: result.id },
    });

    expect(createdEvent).not.toBeNull();
    expect(createdEvent?.name).toBe("Round 1: Riga");
    expect(createdEvent?.location).toBe("Riga");
    expect(createdEvent?.date.toISOString()).toBe(eventDate);
    expect(createdEvent?.isCompleted).toBe(false);
  });

  test("update_event marks event as completed", async () => {
    const createEventTool = getTool("create_event");
    const updateEventTool = getTool("update_event");
    const createdEvent = (await createEventTool.handler({
      name: "Round 2: Warsaw",
      location: "Warsaw",
      date: "2026-02-15T10:00:00.000Z",
    })) as { id: number };

    await updateEventTool.handler({
      id: createdEvent.id,
      isCompleted: true,
    });

    const updated = await prisma.event.findUnique({ where: { id: createdEvent.id } });
    expect(updated?.isCompleted).toBe(true);
  });

  test("delete_event removes event", async () => {
    const createEventTool = getTool("create_event");
    const deleteEventTool = getTool("delete_event");
    const createdEvent = (await createEventTool.handler({
      name: "Round 3: Madrid",
      location: "Madrid",
      date: "2026-03-15T10:00:00.000Z",
    })) as { id: number };

    await deleteEventTool.handler({ id: createdEvent.id });
    const deleted = await prisma.event.findUnique({ where: { id: createdEvent.id } });
    expect(deleted).toBeNull();
  });

  test("record_qualification_run saves run and computes totalScore", async () => {
    const createPilotTool = getTool("create_pilot");
    const createEventTool = getTool("create_event");
    const recordQualificationTool = getTool("record_qualification_run");

    const pilot = (await createPilotTool.handler({
      firstName: "Driver",
      lastName: "One",
      country: "Latvia",
    })) as { id: number };
    const event = (await createEventTool.handler({
      name: "Qual Round A",
      location: "Riga",
      date: "2026-04-01T10:00:00.000Z",
    })) as { id: number };

    await recordQualificationTool.handler({
      pilotId: pilot.id,
      eventId: event.id,
      runNumber: 1,
      lineScore: 28,
      angleScore: 29,
      styleScore: 35,
    });

    const run = await prisma.qualification.findFirst({
      where: { pilotId: pilot.id, eventId: event.id, runNumber: 1 },
    });
    expect(run).not.toBeNull();
    expect(run?.totalScore).toBe(92);
  });

  test("record_qualification_run supports two runs for same pilot/event", async () => {
    const createPilotTool = getTool("create_pilot");
    const createEventTool = getTool("create_event");
    const recordQualificationTool = getTool("record_qualification_run");

    const pilot = (await createPilotTool.handler({
      firstName: "Driver",
      lastName: "Two",
      country: "Estonia",
    })) as { id: number };
    const event = (await createEventTool.handler({
      name: "Qual Round B",
      location: "Tallinn",
      date: "2026-04-02T10:00:00.000Z",
    })) as { id: number };

    await recordQualificationTool.handler({
      pilotId: pilot.id,
      eventId: event.id,
      runNumber: 1,
      lineScore: 24,
      angleScore: 25,
      styleScore: 30,
    });
    await recordQualificationTool.handler({
      pilotId: pilot.id,
      eventId: event.id,
      runNumber: 2,
      lineScore: 27,
      angleScore: 28,
      styleScore: 33,
    });

    const runs = await prisma.qualification.findMany({
      where: { pilotId: pilot.id, eventId: event.id },
      orderBy: { runNumber: "asc" },
    });
    expect(runs).toHaveLength(2);
    expect(runs[0]?.runNumber).toBe(1);
    expect(runs[1]?.runNumber).toBe(2);
  });

  test("generate_bracket ranks pilots by best score descending", async () => {
    const createPilotTool = getTool("create_pilot");
    const createEventTool = getTool("create_event");
    const recordQualificationTool = getTool("record_qualification_run");
    const generateBracketTool = getTool("generate_bracket");

    const event = (await createEventTool.handler({
      name: "Bracket Event",
      location: "Kaunas",
      date: "2026-04-10T10:00:00.000Z",
    })) as { id: number };

    const pilots = await Promise.all(
      [
        { firstName: "P1", lastName: "A", country: "LT", score: 89 },
        { firstName: "P2", lastName: "B", country: "LV", score: 95 },
        { firstName: "P3", lastName: "C", country: "EE", score: 92 },
        { firstName: "P4", lastName: "D", country: "PL", score: 87 },
      ].map((pilot) => createPilotTool.handler(pilot)),
    );

    const createdPilots = pilots as Array<{ id: number; firstName: string; lastName: string }>;

    for (let i = 0; i < createdPilots.length; i++) {
      const score = [89, 95, 92, 87][i]!;
      await recordQualificationTool.handler({
        pilotId: createdPilots[i]!.id,
        eventId: event.id,
        runNumber: 1,
        lineScore: score - 60,
        angleScore: 30,
        styleScore: 30,
      });
    }

    const result = (await generateBracketTool.handler({
      eventId: event.id,
    })) as {
      bracket: Array<{ pilotId: number; bestScore: number; firstName: string }>;
      bracketSize: number;
    };

    expect(result.bracketSize).toBe(4);
    expect(result.bracket[0]?.bestScore).toBe(95);
    expect(result.bracket[0]?.firstName).toBe("P2");
    expect(result.bracket.map((row) => row.bestScore)).toEqual([95, 92, 89, 87]);
  });

  test("query_database returns all created pilots", async () => {
    const createPilotTool = getTool("create_pilot");
    const queryDatabaseTool = getTool("query_database");

    await createPilotTool.handler({
      firstName: "Piotr",
      lastName: "Wiecek",
      country: "Poland",
    });
    await createPilotTool.handler({
      firstName: "Conor",
      lastName: "Shanahan",
      country: "Ireland",
    });
    await createPilotTool.handler({
      firstName: "Jack",
      lastName: "Shanahan",
      country: "Ireland",
    });

    const result = (await queryDatabaseTool.handler({
      model: "pilot",
    })) as Array<{ id: number; firstName: string; lastName: string }>;

    expect(result).toHaveLength(3);
  });

  test("query_database filters by country", async () => {
    const createPilotTool = getTool("create_pilot");
    const queryDatabaseTool = getTool("query_database");

    await createPilotTool.handler({
      firstName: "Conor",
      lastName: "Shanahan",
      country: "Ireland",
    });
    await createPilotTool.handler({
      firstName: "Driver",
      lastName: "Else",
      country: "Japan",
    });

    const result = (await queryDatabaseTool.handler({
      model: "pilot",
      queryArgs: {
        where: { country: "Ireland" },
      },
    })) as Array<{ country: string }>;

    expect(result).toHaveLength(1);
    expect(result[0]?.country).toBe("Ireland");
  });

  test("query_database throws on invalid model", async () => {
    const queryDatabaseTool = getTool("query_database");
    await expect(
      queryDatabaseTool.handler({
        model: "unicorn",
      }),
    ).rejects.toThrow();
  });

  test("get_database_schema returns Prisma schema string", async () => {
    const getDatabaseSchemaTool = getTool("get_database_schema");
    const schema = (await getDatabaseSchemaTool.handler({})) as string;
    expect(schema).toContain("model Pilot");
  });
});
