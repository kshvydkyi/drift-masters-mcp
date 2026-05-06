import { z } from "zod";

export const generateBracketSchema = z.object({
  eventId: z.number(),
});
