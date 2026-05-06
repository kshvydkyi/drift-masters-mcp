import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import type { ToolDef } from "../types/types";
import { z } from "zod";

const getDatabaseSchemaArgsSchema = z.object({});

export const getDatabaseSchemaTool: ToolDef = {
  name: "get_database_schema",
  description: "Get the Prisma schema to understand available tables and relations.",

  
  inputSchema: { type: "object", properties: {} },
  handler: async (args) => {
    getDatabaseSchemaArgsSchema.parse(args ?? {});
    const schemaPath = resolve(process.cwd(), "prisma/schema.prisma");
    const schemaContent = await fs.readFile(schemaPath, "utf-8");
    return schemaContent;
  },
};
