import { shiftToRRule } from "~/composables/shifts";
import { DateTime } from "luxon";
import { luxonDateTimeToRruleDatetime } from "@collectivo/shifts/server/utils/luxonDateTimeToRruleDatetime";

export default function (assignment: ShiftsAssignment) {
  if (typeof assignment.shifts_slot == "number") {
    throw new Error("assignment.shifts_slot field must be loaded");
  }

  if (typeof assignment.shifts_slot.shifts_shift == "number") {
    throw new Error("assignment.shifts_slot.shifts_shift field must be loaded");
  }

  const rrule = shiftToRRule(assignment.shifts_slot.shifts_shift);

  const firstOccurrenceWithinAssignment = rrule.after(
    luxonDateTimeToRruleDatetime(
      DateTime.fromISO(assignment.shifts_from).startOf("day"),
    ),
  );

  if (firstOccurrenceWithinAssignment) {
    assignment.shifts_from = DateTime.fromJSDate(
      firstOccurrenceWithinAssignment,
    ).toISO()!;
  }

  if (!assignment.shifts_to) return;

  const lastOccurrenceWithinAssignment = rrule.before(
    luxonDateTimeToRruleDatetime(
      DateTime.fromISO(assignment.shifts_to).endOf("day"),
    ),
    true,
  );

  if (!lastOccurrenceWithinAssignment) return;

  assignment.shifts_to = DateTime.fromJSDate(lastOccurrenceWithinAssignment)
    .endOf("day")
    .toISO()!;
}
