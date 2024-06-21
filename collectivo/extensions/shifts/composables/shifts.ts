import { readItems } from "@directus/sdk";
import { DateTime } from "luxon";
import { RRule, RRuleSet } from "rrule";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";

interface GetShiftOccurrencesOptions {
  shiftType?: "regular" | "jumper" | "unfilled" | "all";
}

interface SlotRule {
  slotID: number;
  rrule: RRule;
}

export const getShiftOccurrences = async (
  from: DateTime,
  to: DateTime,
  options: GetShiftOccurrencesOptions = {},
): Promise<ShiftOccurrence[]> => {
  const directus = useDirectus();
  const { shiftType } = options;
  const isJumper = shiftType === "jumper";
  const isRegular = shiftType === "regular";
  const isAll = shiftType === "all";

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

  // Get assignments within timeframe
  const assignments =
    slotIds && slotIds.length > 0
      ? ((await directus.request(
          readItems("shifts_assignments", {
            filter: {
              shifts_to: {
                _or: [{ _gte: from.toISO() }, { _null: true }],
              },
              shifts_from: { _lte: to.toISO() },
              shifts_slot: {
                _in: slotIds,
              },
            },
            fields: ["*", "shift_slots.*", "shift_slots.shifts_assignments.*"],
          }),
        )) as ShiftsAssignment[])
      : ([] as ShiftsAssignment[]);

  const assignmentIds = assignments.map((assignment) => assignment.id);

  const absences = (await directus.request(
    readItems("shifts_absences", {
      filter: {
        shifts_assignment: {
          _in: assignmentIds,
        },
        _or: [
          { shifts_to: { _gte: from.toISO() } },
          { shifts_from: { _lte: to.toISO() } },
        ],
      },
      fields: ["shifts_from", "shifts_to", "shifts_assignment"],
    }),
  )) as ShiftsAbsence[];

  const occurrences = [];

  // Assign assignments to slots
  for (const shift of shifts) {
    const shiftRule = shiftToRRule(shift);
    const slotRules: SlotRule[] = [];

    for (const slot of shift.shifts_slots ?? []) {
      const filteredAssignments = assignments.filter(
        (assignment) => assignment.shifts_slot === slot,
      );

      slotRules.push({
        slotID: slot as number,
        rrule: slotToRrule(shift, shiftRule, filteredAssignments, absences),
      });
    }

    const today = getCurrentDate();
    let minDate = from.toJSDate();
    let maxDate = to.toJSDate();

    // Jumper and regular can only be into the future
    if ((isJumper || isRegular) && minDate < today) {
      minDate = today;
    }

    // Jumpers will only see the next 4 weeks
    if (isJumper) {
      const jumperLimit = getFutureDate(28);

      if (jumperLimit < maxDate) {
        maxDate = jumperLimit;
      }
    }

    const shiftOccurrences = getOccurrencesForShift(
      shift,
      shiftRule,
      slotRules,
      minDate,
      maxDate,
    );

    // Show only shifts with open slots
    if (!isAll) {
      occurrences.push(
        ...shiftOccurrences.filter(
          (occurrence) => occurrence.openSlots.length > 0,
        ),
      );
    } else {
      occurrences.push(...shiftOccurrences);
    }
  }

  occurrences.sort((a, b) => {
    return a.start.toMillis() - b.start.toMillis();
  });

  return occurrences;
};

// Get all occurrences for a shift in a given timeframe
export const getOccurrencesForShift = (
  shift: ShiftsShift,
  shiftRule: RRule,
  slotRules: SlotRule[],
  from: Date,
  to: Date,
): ShiftOccurrence[] => {
  const dates: Date[] = shiftRule.between(from, to, true);

  const shiftOccurrences: ShiftOccurrence[] = [];

  for (const date of dates) {
    shiftOccurrences.push(
      getSingleShiftOccurence(shift, date, shiftRule, slotRules),
    );
  }

  return shiftOccurrences;
};

// Get occurence object for a shift on a given date
// Includes information about shift, slots, and assignments
// Time is always given in UTC - even if meant for other timezones
const getSingleShiftOccurence = (
  shift: ShiftsShift,
  date: Date,
  shiftRule?: RRule,
  slotRules?: SlotRule[],
): ShiftOccurrence => {
  const openSlots: number[] = [];

  for (const slotRule of slotRules ?? []) {
    if (slotRule.rrule.between(date, date, true).length > 0) {
      openSlots.push(slotRule.slotID);
    }
  }

  const dateString = date.toISOString().split("T")[0];

  const start = DateTime.fromISO(
    `${dateString}T${shift.shifts_from_time}Z`,
  ).toUTC();

  const end = DateTime.fromISO(
    `${dateString}T${shift.shifts_to_time}Z`,
  ).toUTC();

  return {
    shift: shift,
    start: start,
    end: end,
    shiftRule: shiftRule,
    slots: slotRules?.length ?? 0,
    openSlots: openSlots,
  };
};

// Create a RRule object for a shift
// Shifts without end date run forever
// Shifts without repetition run once
// Dates are with T=00:00:00 UTC
export const shiftToRRule = (shift: ShiftsShift): RRule => {
  return new RRule({
    freq: RRule.DAILY,
    interval: shift.shifts_repeats_every,
    count: shift.shifts_repeats_every ? null : 1,
    dtstart: new Date(shift.shifts_from),
    until: shift.shifts_to ? new Date(shift.shifts_to) : null,
  });
};

// SlotRrule is a RRuleSet that shows only free occurences
// Occurences with existing assignments are excluded
export const slotToRrule = (
  shift: ShiftsShift,
  shiftRule: RRule,
  assignments: ShiftsAssignment[],
  absences: ShiftsAbsence[],
): RRule => {
  const slotRule = new RRuleSet();
  slotRule.rrule(shiftRule);

  for (const assignment of assignments) {
    const assignmentRule = new RRuleSet();

    assignmentRule.rrule(
      new RRule({
        freq: RRule.DAILY,
        interval: shift.shifts_repeats_every,
        dtstart: shiftRule.after(new Date(assignment.shifts_from), true),
        until: assignment.shifts_to
          ? shiftRule.before(new Date(assignment.shifts_to), true)
          : null,
      }),
    );

    const filteredAbsences = absences.filter(
      (absence) =>
        absence.shifts_assignment == assignment.id ||
        absence.shifts_assignment == null,
    );

    for (const absence of filteredAbsences) {
      const absenceRule = new RRule({
        freq: RRule.DAILY,
        interval: shift.shifts_repeats_every,
        dtstart: shiftRule.after(new Date(absence.shifts_from), true),
        until: shiftRule.before(new Date(absence.shifts_to), true),
      });

      assignmentRule.exrule(absenceRule);
    }

    // Exclude assignment from slotRules
    slotRule.exrule(assignmentRule);
  }

  return slotRule;
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
