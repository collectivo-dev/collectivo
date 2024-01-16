import { DateTime } from "luxon";

export interface ShiftOccurrence {
  shift: CollectivoShift;
  start: DateTime;
  end: DateTime;
}
