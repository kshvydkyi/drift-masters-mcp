import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { z } from "zod";

const deletePilotSchema = z.object({
  id: z.number(),
});

export const deletePilotTool: ToolDef = {
  name: "delete_pilot",
  description:
    "Removes a pilot from the system (retires or disqualifies them). This will cascade or require deleting their cars/results depending on schema.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    const parsedArgs = deletePilotSchema.parse(args);

    const deletedPilot = await prisma.pilot.delete({
      where: { id: parsedArgs.id },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    return {
      success: true,
      message: `Pilot ${deletedPilot.firstName} ${deletedPilot.lastName} was deleted successfully.`,
    };
  },
};
