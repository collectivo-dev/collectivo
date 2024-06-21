import { DateTime } from "luxon";
import getActiveAssignment from "~/utils/assignments/getActiveAssignment";

export default function (assignments: ShiftsAssignment[], atDate?: DateTime) {
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
}
