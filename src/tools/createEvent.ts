import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { createEventSchema } from "./schemas";

export const createEventTool: ToolDef = {
  name: "create_event",
  description: "Creates a new drifting event/round.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      location: { type: "string" },
      date: {
        type: "string",
        description: "ISO-8601 date string",
      },
      isCompleted: { type: "boolean" },
    },
    required: ["name", "location", "date"],
  },
  handler: async (args) => {
    const parsedArgs = createEventSchema.parse(args);

    const createdEvent = await prisma.event.create({
      data: {
        name: parsedArgs.name,
        location: parsedArgs.location,
        date: new Date(parsedArgs.date),
        isCompleted: parsedArgs.isCompleted ?? false,
      },
    });

    return createdEvent;
  },
};
