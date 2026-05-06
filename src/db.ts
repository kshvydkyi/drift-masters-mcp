import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = new PrismaClient({ adapter });
