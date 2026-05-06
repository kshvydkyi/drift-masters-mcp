import { createPilotTool } from "./createPilot";
import { createEventTool } from "./createEvent";
import { addCarToPilotTool } from "./addCarToPilot";
import { deleteCarTool } from "./deleteCar";
import { deleteEventTool } from "./deleteEvent";
import { deletePilotTool } from "./deletePilot";
import { getDatabaseSchemaTool } from "./getDatabaseSchema";
import { generateBracketTool } from "./generateBracket";
import { queryDatabaseTool } from "./queryDatabase";
import { recordQualificationRunTool } from "./recordQualification";
import { updateCarTool } from "./updateCar";
import { updateEventTool } from "./updateEvent";
import { updatePilotTool } from "./updatePilot";
import type { ToolDef } from "../types/types";

export const toolsRegistry: Record<string, ToolDef> = {
  [createPilotTool.name]: createPilotTool,
  [createEventTool.name]: createEventTool,
  [addCarToPilotTool.name]: addCarToPilotTool,
  [updatePilotTool.name]: updatePilotTool,
  [updateEventTool.name]: updateEventTool,
  [deletePilotTool.name]: deletePilotTool,
  [deleteEventTool.name]: deleteEventTool,
  [updateCarTool.name]: updateCarTool,
  [deleteCarTool.name]: deleteCarTool,
  [getDatabaseSchemaTool.name]: getDatabaseSchemaTool,
  [queryDatabaseTool.name]: queryDatabaseTool,
  [recordQualificationRunTool.name]: recordQualificationRunTool,
  [generateBracketTool.name]: generateBracketTool,
};
