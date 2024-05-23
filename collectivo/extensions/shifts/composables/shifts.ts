import { readItems } from "@directus/sdk";
import { DateTime } from "luxon";
import { RRule, RRuleSet } from "rrule";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";

export const getAllShiftOccurrences = async (
  from: DateTime,
  to: DateTime,
): Promise<ShiftOccurrence[]> => {
  const directus = useDirectus();

  const shifts: ShiftsShift[] = (await directus.request(
    readItems("shifts_shifts", {
      filter: {
        shifts_to: {
          _or: [{ _gte: from.toISO() }, { _null: true }],
        },
        shifts_from: { _lte: to.toISO() },
        shifts_status: { _eq: ItemStatus.PUBLISHED },
      },
      fields: ["*", "shift_slots.*", "shift_slots.shifts_assignments.*"],
    }),
  )) as ShiftsShift[];

  // Create array of slot ids from shift.shift_slots in shifts
  const slotIds = shifts
    .map((shift) => shift.shifts_slots)
    .reduce((acc, slotList) => {
      return [...acc, ...slotList];
    }, []);

  // Flatten array of slot ids

  // Get assignments within timeframe
  const assignments = (await directus.request(
    readItems("shifts_assignments", {
      filter: {
        shifts_to: { _gte: from.toISO() },
        shifts_from: { _lte: to.toISO() },
        shifts_slot: {
          _in: slotIds,
        },
      },
      fields: ["*", "shift_slots.*", "shift_slots.shifts_assignments.*"],
    }),
  )) as ShiftsAssignment[];

  const occurrences = [];

  // Assign assignments to slots
  for (const shift of shifts) {
    const shiftRule = shiftToRRule(shift);
    const slotRules: RRule[] = [];

    for (const slot of shift.shifts_slots ?? []) {
      const filteredAssignments = assignments.filter(
        (assignment) => assignment.shifts_slot === slot,
      );

      slotRules.push(slotToRrule(shift, shiftRule, filteredAssignments));
    }

    occurrences.push(
      ...getOccurrencesForShift(shift, shiftRule, slotRules, from, to),
    );
  }

  occurrences.sort((a, b) => {
    return a.start.toMillis() - b.start.toMillis();
  });

  return occurrences;
};

export const slotToRrule = (
  shift: ShiftsShift,
  shiftRule: RRule,
  assignments: ShiftsAssignment[],
): RRule => {
  const slotRules = new RRuleSet();
  slotRules.rrule(shiftRule);

  for (const assignment of assignments) {
    slotRules.exrule(
      new RRule({
        freq: RRule.DAILY,
        interval: shift.shifts_repeats_every,
        dtstart: shiftRule.after(
          luxonDateTimeToRruleDatetime(
            DateTime.fromISO(assignment.shifts_from),
          ),
        ),
        until: assignment.shifts_to
          ? shiftRule.before(
              luxonDateTimeToRruleDatetime(
                DateTime.fromISO(assignment.shifts_to),
              ),
            )
          : null,
      }),
    );
  }

  return slotRules;
};

export const getOccurrencesForShift = (
  shift: ShiftsShift,
  shiftRule: RRule,
  slotRules: RRule[],
  from: DateTime,
  to: DateTime,
): ShiftOccurrence[] => {
  const dates: Date[] = shiftRule.between(
    luxonDateTimeToRruleDatetime(from),
    luxonDateTimeToRruleDatetime(to),
    true,
  );

  const shiftOccurrences: ShiftOccurrence[] = [];

  for (const date of dates) {
    shiftOccurrences.push(rruleDateToShiftOccurrence(shift, date, slotRules));
  }

  console.log(
    "Slot occurences",
    slotRules[0].between(
      luxonDateTimeToRruleDatetime(from),
      luxonDateTimeToRruleDatetime(to),
      true,
    ),
  );

  return shiftOccurrences;
};

// export const xxx = (
//   shift: ShiftsShift,
//   assignments: ShiftsAssignment[],
//   from: DateTime,
//   to: DateTime,
// ): ShiftOccurrence[] => {
//   const dates: Date[] = slotToRRule(shift, assignments).between(
//     luxonDateTimeToRruleDatetime(from),
//     luxonDateTimeToRruleDatetime(to),
//     true,
//   );

//   const shiftOccurrences: ShiftOccurrence[] = [];

//   for (const date of dates) {
//     shiftOccurrences.push(rruleDateToShiftOccurrence(shift, date));
//   }

//   return shiftOccurrences;
// };

const rruleDateToShiftOccurrence = (
  shift: ShiftsShift,
  date: Date,
  slotRules?: RRule[],
): ShiftOccurrence => {
  const start = DateTime.fromJSDate(date);

  let openSlots = 0;

  for (const slotRule of slotRules ?? []) {
    if (slotRule.between(date, date, true).length > 0) {
      openSlots++;
    }
  }

  return {
    shift: shift,
    start: start,
    slots: slotRules?.length ?? 0,
    openSlots: openSlots,
    end: start.plus({ minute: shift.shifts_duration }),
  };
};

// Create a RRule object for a shift
// Shifts without end date run forever
// Shifts without repetition run once
export const shiftToRRule = (shift: ShiftsShift): RRule => {
  return new RRule({
    freq: RRule.DAILY,
    interval: shift.shifts_repeats_every,
    count: shift.shifts_repeats_every ? null : 1,
    dtstart: new Date(shift.shifts_from),
    until: shift.shifts_to ? new Date(shift.shifts_to) : null,
  });
};

export const isShiftDurationModelActive = (
  durationModel: { shifts_from: string; shifts_to?: string },
  atDate?: DateTime,
): boolean => {
  return isFromToActive(
    DateTime.fromISO(durationModel.shifts_from),
    durationModel.shifts_to
      ? DateTime.fromISO(durationModel.shifts_to)
      : undefined,
    atDate,
    true,
  );
};

export const isFromToActive = (
  from: DateTime,
  to?: DateTime,
  atDate?: DateTime,
  dateOnly = true,
): boolean => {
  if (!atDate) {
    atDate = DateTime.now();
  }

  if (dateOnly) {
    from = from.startOf("day");
    to = to?.endOf("day");
  }

  if (from > atDate) {
    return false;
  }

  return !(to && to < atDate);
};

export const fromToOverlaps = (
  from1: DateTime,
  from2: DateTime,
  to1?: DateTime,
  to2?: DateTime,
  dateOnly = false,
): boolean => {
  if (from2 >= from1) {
    return isFromToActive(from1, to1, from2, dateOnly);
  }

  if (!to2) {
    return true;
  }

  return isFromToActive(from1, to1, to2, dateOnly);
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