import { prisma } from "../db";
import type { ToolDef } from "../types/types";
import { generateBracketSchema } from "./schemas";

type PilotBestResult = {
  pilotId: number;
  firstName: string;
  lastName: string;
  bestScore: number;
};

export const generateBracketTool: ToolDef = {
  name: "generate_bracket",
  description:
    "Generates the battle bracket (e.g., Top 32 or Top 16) for a specific event based on qualification results.",
  inputSchema: {
    type: "object",
    properties: {
      eventId: { type: "number" },
    },
    required: ["eventId"],
  },
  handler: async (args) => {
    const parsedArgs = generateBracketSchema.parse(args);

    const qualifications = await prisma.qualification.findMany({
      where: { eventId: parsedArgs.eventId },
      include: {
        pilot: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const bestByPilot = new Map<number, PilotBestResult>();

    for (const qualification of qualifications) {
      const currentBest = bestByPilot.get(qualification.pilotId);

      if (!currentBest || qualification.totalScore > currentBest.bestScore) {
        bestByPilot.set(qualification.pilotId, {
          pilotId: qualification.pilotId,
          firstName: qualification.pilot.firstName,
          lastName: qualification.pilot.lastName,
          bestScore: qualification.totalScore,
        });
      }
    }

    const rankedPilots = Array.from(bestByPilot.values())
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 32)
      .map((pilot, index) => ({
        rank: index + 1,
        ...pilot,
      }));

    return {
      eventId: parsedArgs.eventId,
      bracketSize: rankedPilots.length,
      bracket: rankedPilots,
    };
  },
};
