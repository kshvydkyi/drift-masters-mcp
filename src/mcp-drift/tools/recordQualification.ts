import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { z } from "zod";

const recordQualificationRunSchema = z.object({
  pilotId: z.number(),
  eventId: z.number(),
  runNumber: z.union([z.literal(1), z.literal(2)]),
  lineScore: z.number(),
  angleScore: z.number(),
  styleScore: z.number(),
});

export const recordQualificationRunTool: ToolDef = {
  name: "record_qualification_run",
  description: "Records a pilot's qualification run scores.",
  inputSchema: {
    type: "object",
    properties: {
      pilotId: { type: "number" },
      eventId: { type: "number" },
      runNumber: { type: "number", enum: [1, 2] },
      lineScore: { type: "number" },
      angleScore: { type: "number" },
      styleScore: { type: "number" },
    },
    required: [
      "pilotId",
      "eventId",
      "runNumber",
      "lineScore",
      "angleScore",
      "styleScore",
    ],
  },
  handler: async (args) => {
    const parsedArgs = recordQualificationRunSchema.parse(args);
    const totalScore =
      parsedArgs.lineScore + parsedArgs.angleScore + parsedArgs.styleScore;

    await prisma.qualification.create({
      data: {
        pilotId: parsedArgs.pilotId,
        eventId: parsedArgs.eventId,
        runNumber: parsedArgs.runNumber,
        lineScore: parsedArgs.lineScore,
        angleScore: parsedArgs.angleScore,
        styleScore: parsedArgs.styleScore,
        totalScore,
      },
    });

    return {
      success: true,
      message: `Qualification run recorded successfully. Total score: ${totalScore}.`,
      totalScore,
    };
  },
};
