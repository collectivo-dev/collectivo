import { DateTime } from "luxon";

declare global {
  interface CollectivoShift {
    id?: string;
    shifts_name: string;
    shifts_from: string;
    shifts_to?: string;
    shifts_duration: number;
    shifts_repeats_every: number;
  }

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

  interface ShiftOccurrence {
    shift: CollectivoShift;
    start: DateTime;
    end: DateTime;
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
