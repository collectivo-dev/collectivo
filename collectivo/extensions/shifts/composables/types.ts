import { DateTime } from "luxon";

export interface ShiftOccurrence {
  shift: CollectivoShift;
  start: DateTime;
  end: DateTime;
}

export interface CollectivoShift {
  id?: string;
  shifts_name: string;
  shifts_from: string;
  shifts_to?: string;
  shifts_duration: number;
  shifts_repeats_every: number;
}
