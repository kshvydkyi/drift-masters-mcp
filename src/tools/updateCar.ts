import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import type { Prisma } from "@prisma/client";
import { updateCarSchema } from "./schemas";

export const updateCarTool: ToolDef = {
  name: "update_car",
  description:
    "Updates an existing car's specs (e.g., if a pilot changes the engine or boosts horsepower).",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
      make: { type: "string" },
      model: { type: "string" },
      horsepower: { type: "number" },
      engine: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    const parsedArgs = updateCarSchema.parse(args);
    const { id, ...rest } = parsedArgs;
    const data = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    ) as Prisma.CarUpdateInput;

    const updatedCar = await prisma.car.update({
      where: { id },
      data,
    });

    return updatedCar;
  },
};
