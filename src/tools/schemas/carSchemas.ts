import { z } from "zod";

export const addCarToPilotSchema = z.object({
  pilotId: z.number(),
  make: z.string(),
  model: z.string(),
  horsepower: z.number().optional(),
  engine: z.string().optional(),
});

export const updateCarSchema = z.object({
  id: z.number(),
  make: z.string().optional(),
  model: z.string().optional(),
  horsepower: z.number().optional(),
  engine: z.string().optional(),
});

export const deleteCarSchema = z.object({
  id: z.number(),
});
