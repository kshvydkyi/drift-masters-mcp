import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { deleteEventSchema } from "./schemas";

export const deleteEventTool: ToolDef = {
  name: "delete_event",
  description: "Deletes an event.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    const parsedArgs = deleteEventSchema.parse(args);

    const deletedEvent = await prisma.event.delete({
      where: { id: parsedArgs.id },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      message: `Event ${deletedEvent.id} (${deletedEvent.name}) was deleted successfully.`,
    };
  },
};
