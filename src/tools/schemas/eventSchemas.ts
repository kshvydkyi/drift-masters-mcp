import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string(),
  location: z.string(),
  date: z.string().datetime(),
  isCompleted: z.boolean().optional(),
});

export const updateEventSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  location: z.string().optional(),
  date: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});

export const deleteEventSchema = z.object({
  id: z.number(),
});
