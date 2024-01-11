import { readItems } from "@directus/sdk";
import type { CollectivoShift } from "~/index";
import { DateTime } from "luxon";
import { datetime, RRule } from "rrule";

export interface ShiftOccurence {
  shift: CollectivoShift;
  start: DateTime;
  end: DateTime;
}

export const getAllShiftOccurences = async (
  from: DateTime,
  to: DateTime,
): Promise<ShiftOccurence[]> => {
  const directus = useDirectus();

  const shifts: CollectivoShift[] = await directus.request(
    readItems("shifts_shifts"),
  );

  const occurrences = [];

  for (const shift of shifts) {
    occurrences.push(...getOccurrencesForShift(shift, from, to));
  }

  occurrences.sort((a, b) => {
    return a.start.toMillis() - b.start.toMillis();
  });

  return occurrences;
};

export const getOccurrencesForShift = (
  shift: CollectivoShift,
  from: DateTime,
  to: DateTime,
): ShiftOccurence[] => {
  const dates: datetime[] = shiftToRRule(shift).between(
    luxonDateTimeToRruleDatetime(from),
    luxonDateTimeToRruleDatetime(to),
    true,
  );

  const shiftOccurrences: ShiftOccurence[] = [];

  for (const date of dates) {
    const start = DateTime.fromJSDate(date);

    shiftOccurrences.push({
      shift: shift,
      start: start,
      end: start.plus({ minute: shift.duration }),
    });
  }

  return shiftOccurrences;
};

export const shiftToRRule = (shift: CollectivoShift): RRule => {
  return new RRule({
    freq: RRule.DAILY,
    interval: shift.shifts_repeats_every,
    dtstart: luxonDateTimeToRruleDatetime(DateTime.fromISO(shift.shifts_from)),
    until: shift.shifts_to
      ? luxonDateTimeToRruleDatetime(DateTime.fromISO(shift.shifts_to))
      : null,
  });
};

export const luxonDateTimeToRruleDatetime = (
  luxonDateTime: DateTime,
): datetime => {
  return datetime(
    luxonDateTime.year,
    luxonDateTime.month,
    luxonDateTime.day,
    luxonDateTime.hour,
    luxonDateTime.minute,
  );
};
