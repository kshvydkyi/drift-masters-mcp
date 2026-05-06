import { z } from "zod";

export const createPilotSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  country: z.string(),
  teamName: z.string().optional(),
  nickname: z.string().optional(),
  car: z
    .object({
      make: z.string(),
      model: z.string(),
      horsepower: z.number().optional(),
      engine: z.string().optional(),
    })
    .optional(),
});

export const updatePilotSchema = z.object({
  id: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z.string().optional(),
  teamName: z.string().optional(),
  nickname: z.string().optional(),
});

export const deletePilotSchema = z.object({
  id: z.number(),
});
