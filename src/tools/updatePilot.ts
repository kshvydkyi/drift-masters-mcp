import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import type { Prisma } from "@prisma/client";
import { updatePilotSchema } from "./schemas";

export const updatePilotTool: ToolDef = {
  name: "update_pilot",
  description: "Updates an existing pilot's details.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      country: { type: "string" },
      teamName: { type: "string" },
      nickname: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    const parsedArgs = updatePilotSchema.parse(args);
    const { id, ...rest } = parsedArgs;
    const data = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined),
    ) as Prisma.PilotUpdateInput;

    const updatedPilot = await prisma.pilot.update({
      where: { id },
      data,
    });

    return updatedPilot;
  },
};
