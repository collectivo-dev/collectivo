import type { ShiftLogType } from "~/server/utils/ShiftLogType";

declare global {
  interface CollectivoSlot {
    id: string;
    shifts_name: string;
    shifts_skills: CollectivoSkill[];
    shifts_shift: CollectivoShift;
  }

  interface CollectivoSkill {
    id: string;
    shifts_name: string;
  }

  interface CollectivoAssignment {
    id: string;
    shifts_from: string;
    shifts_to?: string;
    shifts_slot: CollectivoSlot;
    shifts_user: CollectivoUser;
  }

  interface CollectivoLog {
    id: string;
    shifts_type: ShiftLogType;
    shifts_datetime: string;
    shifts_user: CollectivoUser;
    shifts_assignment: CollectivoAssignment;
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
