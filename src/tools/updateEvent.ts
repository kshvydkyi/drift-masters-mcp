import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import type { Prisma } from "@prisma/client";
import { updateEventSchema } from "./schemas";

export const updateEventTool: ToolDef = {
  name: "update_event",
  description:
    "Updates an existing event (e.g., marks it as completed or changes the date).",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      location: { type: "string" },
      date: {
        type: "string",
        description: "ISO-8601 date string",
      },
      isCompleted: { type: "boolean" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    const parsedArgs = updateEventSchema.parse(args);
    const { id, date, ...rest } = parsedArgs;
    const rawData = {
      ...rest,
      ...(date ? { date: new Date(date) } : {}),
    };
    const data = Object.fromEntries(
      Object.entries(rawData).filter(([, value]) => value !== undefined),
    ) as Prisma.EventUpdateInput;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data,
    });

    return updatedEvent;
  },
};
