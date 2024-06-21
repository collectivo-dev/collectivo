import { DateTime } from "luxon";

export default function (shift: ShiftsShift, date: Date): ShiftOccurrence {
  const start = DateTime.fromJSDate(date);

  return {
    shift: shift,
    start: start,
    end: start.plus({ minute: shift.shifts_duration }),
  };
}
