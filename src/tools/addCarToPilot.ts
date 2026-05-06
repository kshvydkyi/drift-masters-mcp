import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { addCarToPilotSchema } from "./schemas";

export const addCarToPilotTool: ToolDef = {
  name: "add_car_to_pilot",
  description: "Adds a new car and links it to an existing pilot.",
  inputSchema: {
    type: "object",
    properties: {
      pilotId: { type: "number" },
      make: { type: "string" },
      model: { type: "string" },
      horsepower: { type: "number" },
      engine: { type: "string" },
    },
    required: ["pilotId", "make", "model"],
  },
  handler: async (args) => {
    const parsedArgs = addCarToPilotSchema.parse(args);

    const createdCar = await prisma.car.create({
      data: {
        pilotId: parsedArgs.pilotId,
        make: parsedArgs.make,
        model: parsedArgs.model,
        ...(parsedArgs.horsepower !== undefined
          ? { horsepower: parsedArgs.horsepower }
          : {}),
        ...(parsedArgs.engine !== undefined ? { engine: parsedArgs.engine } : {}),
      },
    });

    return createdCar;
  },
};
