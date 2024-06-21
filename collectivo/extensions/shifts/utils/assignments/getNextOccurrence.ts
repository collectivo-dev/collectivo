import { DateTime } from "luxon";
import { luxonDateTimeToRruleDatetime } from "~/server/utils/luxonDateTimeToRruleDatetime";
import { shiftToRRule } from "~/composables/shifts";
import rruleDateToShiftOccurrence from "~/utils/assignments/rruleDateToShiftOccurrence";

export default function (shift: ShiftsShift, after?: DateTime) {
  const date = shiftToRRule(shift).after(
    luxonDateTimeToRruleDatetime(after ?? DateTime.now()),
  );

  return date ? rruleDateToShiftOccurrence(shift, date) : null;
}
