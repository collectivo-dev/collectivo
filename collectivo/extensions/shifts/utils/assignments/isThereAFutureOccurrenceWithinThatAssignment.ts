import { DateTime } from "luxon";
import getNextOccurrence from "~/utils/assignments/getNextOccurrence";
import isShiftDurationModelActive from "~/utils/isShiftDurationModelActive";

export default function (assignment: ShiftsAssignment): boolean {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const nextOccurrence = getNextOccurrence(
    assignment.shifts_slot.shifts_shift,
    DateTime.fromISO(assignment.shifts_from),
  );

  return (
    !!nextOccurrence &&
    isShiftDurationModelActive(assignment, nextOccurrence.start)
  );
}
