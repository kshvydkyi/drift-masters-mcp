import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { deleteCarSchema } from "./schemas";

export const deleteCarTool: ToolDef = {
  name: "delete_car",
  description: "Removes a car from the database (e.g., if it was totaled or sold).",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "number" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    const parsedArgs = deleteCarSchema.parse(args);

    await prisma.car.delete({
      where: { id: parsedArgs.id },
    });

    return {
      success: true,
      message: `Car with id ${parsedArgs.id} was deleted successfully.`,
    };
  },
};
