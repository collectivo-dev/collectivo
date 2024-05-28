import { readItems } from "@directus/sdk";
import { DateTime } from "luxon";
import { RRule } from "rrule";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import { luxonDateTimeToRruleDatetime } from "@collectivo/shifts/server/utils/luxonDateTimeToRruleDatetime";

export const getAllShiftOccurrences = async (
  from: DateTime,
  to: DateTime,
): Promise<ShiftOccurrence[]> => {
  const directus = useDirectus();

  const shifts: ShiftsShift[] = (await directus.request(
    readItems("shifts_shifts", {
      filter: { shifts_status: { _eq: ItemStatus.PUBLISHED } },
    }),
  )) as ShiftsShift[];

  const occurrences = [];

  for (const shift of shifts) {
    occurrences.push(...getOccurrencesForShift(shift, from, to));
  }

  occurrences.sort((a, b) => {
    return a.start.toMillis() - b.start.toMillis();
  });

  return occurrences;
};

export const getNextOccurrences = (
  shift: ShiftsShift,
  maxOccurrences: number,
  after?: DateTime,
  until?: DateTime,
) => {
  const nextOccurrences: ShiftOccurrence[] = [];
  let nextOccurrence = getNextOccurrence(shift, after ?? DateTime.now());

  while (
    nextOccurrence !== null &&
    nextOccurrences.length < maxOccurrences &&
    (until == null || nextOccurrence.start < until)
  ) {
    nextOccurrences.push(nextOccurrence);
    nextOccurrence = getNextOccurrence(shift, nextOccurrence.end);
  }

  return nextOccurrences;
};

export const getNextOccurrence = (shift: ShiftsShift, after?: DateTime) => {
  const date = shiftToRRule(shift).after(
    luxonDateTimeToRruleDatetime(after ?? DateTime.now()),
  );

  return date ? rruleDateToShiftOccurrence(shift, date) : null;
};

export const getOccurrencesForShift = (
  shift: ShiftsShift,
  from: DateTime,
  to: DateTime,
): ShiftOccurrence[] => {
  const dates: Date[] = shiftToRRule(shift).between(
    luxonDateTimeToRruleDatetime(from),
    luxonDateTimeToRruleDatetime(to),
    true,
  );

  const shiftOccurrences: ShiftOccurrence[] = [];

  for (const date of dates) {
    shiftOccurrences.push(rruleDateToShiftOccurrence(shift, date));
  }

  return shiftOccurrences;
};

const rruleDateToShiftOccurrence = (
  shift: ShiftsShift,
  date: Date,
): ShiftOccurrence => {
  const start = DateTime.fromJSDate(date);

  return {
    shift: shift,
    start: start,
    end: start.plus({ minute: shift.shifts_duration }),
  };
};

export const shiftToRRule = (shift: ShiftsShift): RRule => {
  return new RRule({
    freq: RRule.DAILY,
    interval: shift.shifts_repeats_every,
    dtstart: luxonDateTimeToRruleDatetime(DateTime.fromISO(shift.shifts_from)),
    until: shift.shifts_to
      ? luxonDateTimeToRruleDatetime(DateTime.fromISO(shift.shifts_to))
      : null,
  });
};
