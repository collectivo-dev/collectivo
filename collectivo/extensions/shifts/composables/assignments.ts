import { DateTime } from "luxon";
import { RRule, RRuleSet } from "rrule";
import { isShiftDurationModelActive, shiftToRRule } from "~/composables/shifts";
import { readItems } from "@directus/sdk";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";

export const getActiveAssignments = async (user: CollectivoUser) => {
  const directus = useDirectus();
  const now = getCurrentDate();
  const nowStr = now.toISOString();

  const assignments = (await directus.request(
    readItems("shifts_assignments", {
      filter: {
        shifts_user: { id: { _eq: user.id } },
        shifts_to: {
          _or: [{ _gte: nowStr }, { _null: true }],
        },
        shifts_slot: {
          shifts_shift: { shifts_status: { _eq: ItemStatus.PUBLISHED } },
        },
      },
      fields: [
        "*",
        { shifts_slot: ["*", { shifts_shift: ["*"] }] },
        { shifts_user: ["first_name", "last_name"] },
      ],
    }),
  )) as ShiftsAssignment[];

  const absences = (await directus.request(
    readItems("shifts_absences", {
      filter: {
        shifts_assignment: {
          shifts_user: { id: { _eq: user.id } },
        },
        shifts_to: { _gte: nowStr },
      },
      fields: [
        "*",
        { shifts_slot: ["*", { shifts_shift: ["*"] }] },
        { shifts_user: ["first_name", "last_name"] },
      ],
    }),
  )) as ShiftsAbsence[];

  const assignmentRules: ShiftsAssignmentRules[] = assignments.map(
    (assignment) => {
      const filteredAbsences = absences.filter(
        (absence) =>
          absence.shifts_assignment == assignment.id ||
          absence.shifts_assignment == null,
      );

      const rules = getAssignmentRRule(assignment, filteredAbsences);
      const assignmentRule = rules[0];
      const absencesRule = rules[1];
      const nextOccurence = assignmentRule.after(now, true);
      let secondNextOccurence = null;

      if (nextOccurence) {
        secondNextOccurence = assignmentRule.after(nextOccurence);
      }

      return {
        assignment: assignment,
        absences: filteredAbsences,
        assignmentRule: assignmentRule,
        absencesRule: absencesRule,
        nextOccurrence: nextOccurence,
        isRegular: secondNextOccurence != null,
      };
    },
  );

  assignmentRules.sort((a, b) => {
    const nextA = a.assignmentRule.after(now, true);
    const nextB = b.assignmentRule.after(now, true);
    if (!nextA && !nextB) return 0;
    if (!nextA) return 1;
    if (!nextB) return -1;
    if (nextA == nextB) return 0;
    return nextA > nextB ? 1 : -1;
  });

  return assignmentRules;
};

// Get assignment rrule
// Creates a slice of the shift rrule within the assignment timeframe
export const getAssignmentRRule = (
  assignment: ShiftsAssignment,
  absences?: ShiftsAbsence[],
) => {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const shift = assignment.shifts_slot.shifts_shift;
  const shiftRule = shiftToRRule(shift);

  const assignmentRule = new RRuleSet();
  const absencesRule = new RRuleSet();

  // Main shift rule
  assignmentRule.rrule(
    new RRule({
      freq: RRule.DAILY,
      interval: shift.shifts_repeats_every,
      count: shift.shifts_repeats_every ? null : 1,
      dtstart: shiftRule.after(new Date(assignment.shifts_from), true),
      until: assignment.shifts_to
        ? shiftRule.before(new Date(assignment.shifts_to), true)
        : null,
    }),
  );

  // Absence rules
  absences?.forEach((absence) => {
    const absenceRule = new RRule({
      freq: RRule.DAILY,
      interval: shift.shifts_repeats_every,
      dtstart: shiftRule.after(new Date(absence.shifts_from), true),
      until: shiftRule.before(new Date(absence.shifts_to), true),
    });

    absencesRule.rrule(absenceRule);
    assignmentRule.exrule(absenceRule);
  });

  return [assignmentRule, absencesRule];
};

export const getNextAssignmentOccurence = (
  assignment: ShiftsAssignment,
): Date | null => {
  return getAssignmentRRule(assignment)[0].after(new Date());
};

export const getActiveAssignment = (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
): ShiftsAssignment | null => {
  for (const assignment of assignments) {
    if (isShiftDurationModelActive(assignment, atDate)) return assignment;
  }

  return null;
};

export const getAssigneeName = (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
) => {
  if (!atDate) {
    atDate = DateTime.now();
  }

  const assignment = getActiveAssignment(assignments, atDate);

  if (!assignment)
    return "No assignee on " + atDate.toLocaleString(DateTime.DATE_SHORT);

  if (typeof assignment.shifts_user == "string") {
    throw new Error("Assignment shifts_user field must be loaded");
  }

  return (
    assignment.shifts_user.first_name +
    " " +
    assignment.shifts_user.last_name[0] +
    "."
  );
};

export const hasActivePermanentAssignment = (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
) => {
  if (!atDate) {
    atDate = DateTime.now();
  }

  const assignment = getActiveAssignment(assignments, atDate);
  if (!assignment) return false;

  return assignment.shifts_to == undefined;
};

export const capAssignmentToFirstAndLastIncludedOccurrence = (
  assignment: ShiftsAssignment,
) => {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const rrule = shiftToRRule(assignment.shifts_slot.shifts_shift);

  const firstOccurrenceWithinAssignment = rrule.after(
    DateTime.fromISO(assignment.shifts_from).startOf("day").toJSDate(),
  );

  if (firstOccurrenceWithinAssignment) {
    assignment.shifts_from = DateTime.fromJSDate(
      firstOccurrenceWithinAssignment,
    ).toISO()!;
  }

  if (!assignment.shifts_to) return;

  const lastOccurrenceWithinAssignment = rrule.before(
    DateTime.fromISO(assignment.shifts_to).endOf("day").toJSDate(),
    true,
  );

  if (!lastOccurrenceWithinAssignment) return;

  assignment.shifts_to = DateTime.fromJSDate(lastOccurrenceWithinAssignment)
    .endOf("day")
    .toISO()!;
};
