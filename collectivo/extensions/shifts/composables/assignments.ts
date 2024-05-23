import { DateTime } from "luxon";
import { RRule } from "rrule";
import { isShiftDurationModelActive, shiftToRRule } from "~/composables/shifts";

// Get assignment rrule
// Creates a slice of the shift rrule within the assignment timeframe
export const getAssignmentRRule = (assignment: ShiftsAssignment) => {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const shift = assignment.shifts_slot.shifts_shift;
  const shiftRule = shiftToRRule(shift);

  return new RRule({
    freq: RRule.DAILY,
    interval: shift.shifts_repeats_every,
    count: shift.shifts_repeats_every ? null : 1,
    dtstart: shiftRule.after(
      DateTime.fromISO(assignment.shifts_from).toJSDate(),
      true,
    ),
    until: assignment.shifts_to
      ? shiftRule.before(
          DateTime.fromISO(assignment.shifts_to).toJSDate(),
          true,
        )
      : null,
  });
};

export const getNextAssignmentOccurence = (
  assignment: ShiftsAssignment,
): Date | null => {
  return getAssignmentRRule(assignment).after(DateTime.now().toJSDate());
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