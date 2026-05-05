import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const createPilotSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  country: z.string(),
  teamName: z.string().optional(),
  nickname: z.string().optional(),
  car: z
    .object({
      make: z.string(),
      model: z.string(),
      horsepower: z.number().optional(),
      engine: z.string().optional(),
    })
    .optional(),
});

export const createPilotTool: ToolDef = {
  name: "create_pilot",
  description:
    "Registers a new pilot in the system, optionally attaching a car to them immediately.",
  inputSchema: {
    type: "object",
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      country: { type: "string" },
      teamName: { type: "string" },
      nickname: { type: "string" },
      car: {
        type: "object",
        properties: {
          make: { type: "string" },
          model: { type: "string" },
          horsepower: { type: "number" },
          engine: { type: "string" },
        },
      },
    },
    required: ["firstName", "lastName", "country"],
  },
  handler: async (args) => {
    const parsedArgs = createPilotSchema.parse(args);
    const data: Prisma.PilotCreateInput = {
      firstName: parsedArgs.firstName,
      lastName: parsedArgs.lastName,
      country: parsedArgs.country,
      ...(parsedArgs.teamName !== undefined ? { teamName: parsedArgs.teamName } : {}),
      ...(parsedArgs.nickname !== undefined ? { nickname: parsedArgs.nickname } : {}),
      ...(parsedArgs.car
        ? {
            cars: {
              create: [
                {
                  make: parsedArgs.car.make,
                  model: parsedArgs.car.model,
                  ...(parsedArgs.car.horsepower !== undefined
                    ? { horsepower: parsedArgs.car.horsepower }
                    : {}),
                  ...(parsedArgs.car.engine !== undefined
                    ? { engine: parsedArgs.car.engine }
                    : {}),
                },
              ],
            },
          }
        : {}),
    };

    const createdPilot = await prisma.pilot.create({
      data,
      include: {
        cars: true,
      },
    });

    return createdPilot;
  },
};
