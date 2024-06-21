import { DateTime } from "luxon";
import isShiftDurationModelActive from "~/utils/isShiftDurationModelActive";

export default function (
  assignments: ShiftsAssignment[],
  atDate?: DateTime,
): ShiftsAssignment | null {
  for (const assignment of assignments) {
    if (isShiftDurationModelActive(assignment, atDate)) return assignment;
  }

  return null;
}
