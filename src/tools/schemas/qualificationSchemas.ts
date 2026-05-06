import { z } from "zod";

export const recordQualificationSchema = z.object({
  pilotId: z.number(),
  eventId: z.number(),
  runNumber: z.union([z.literal(1), z.literal(2)]),
  lineScore: z.number(),
  angleScore: z.number(),
  styleScore: z.number(),
});
