import { z } from "zod";

const allowedModels = ["pilot", "car", "event", "qualification", "battle"] as const;

export const queryDatabaseSchema = z.object({
  model: z.enum(allowedModels),
  queryArgs: z.unknown().optional(),
});
