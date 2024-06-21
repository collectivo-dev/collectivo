import { DateTime } from "luxon";
import getActiveAssignment from "~/utils/assignments/getActiveAssignment";

export default function (assignments: ShiftsAssignment[], atDate?: DateTime) {
  if (!atDate) {
    atDate = DateTime.now();
  }

  const assignment = getActiveAssignment(assignments, atDate);
  if (!assignment) return false;

  return assignment.shifts_to == undefined;
}
