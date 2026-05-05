import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { z } from "zod";

const allowedModels = ["pilot", "car", "event", "qualification", "battle"] as const;

const queryDatabaseSchema = z.object({
  model: z.enum(allowedModels),
  queryArgs: z.unknown().optional(),
});

export const queryDatabaseTool: ToolDef = {
  name: "query_database",
  description:
    "Universal read-only database tool. Accepts model and Prisma findMany queryArgs.",
  inputSchema: {
    type: "object",
    properties: {
      model: {
        type: "string",
        description:
          "The name of the database table/model in lowercase (e.g., 'pilot', 'car').",
      },
      queryArgs: {
        type: "object",
        description: "Prisma findMany arguments (where/include/select/etc.).",
      },
    },
    required: ["model"],
  },
  handler: async (args) => {
    const parsedArgs = queryDatabaseSchema.parse(args);

    // @ts-ignore Dynamic Prisma model access
    const result = await prisma[parsedArgs.model].findMany(parsedArgs.queryArgs ?? {});
    return result;
  },
};
