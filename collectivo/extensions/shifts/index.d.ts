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

  interface ShiftOccurrence {
    shift: CollectivoShift;
    start: DateTime;
    end: DateTime;
  }

  enum ShiftUserType {
    TypeNotChosen = "TYPE_NOT_CHOSEN",
    Regular = "REGULAR",
    Jumper = "JUMPER",
    NotInShiftSystem = "NOT_IN_SHIFT_SYSTEM",
  }
}

// Types for input of app.config.ts
declare module "nuxt/schema" {
  interface AppConfigInput {}
}

export {};
