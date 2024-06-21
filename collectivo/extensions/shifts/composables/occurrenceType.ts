import type { DateTime } from "luxon";
import getActiveAssignment from "~/utils/assignments/getActiveAssignment";

export enum OccurrenceType {
  NOT_ASSIGNED,
  ASSIGNED_TO_CURRENT_USER_FROM_ALREADY_EXISTING_ASSIGNMENT,
  ASSIGNED_TO_CURRENT_USER_FROM_NEW_ASSIGNMENT,
  ASSIGNED_TO_ANOTHER_USER,
  ASSIGNED_TO_ANOTHER_USER_INSIDE_NEW_ASSIGNMENT,
}

export function getOccurrenceType(
  occurrence: ShiftOccurrence,
  assignments: ShiftsAssignment[],
  userId: string,
  from?: DateTime,
  to?: DateTime,
): OccurrenceType {
  const activeAssignment = getActiveAssignment(assignments, occurrence.start);

  const occurrenceIsWithinNewAssignment =
    from && isFromToActive(from, to, occurrence.start, true);

  if (activeAssignment) {
    let assignmentUserId;

    if (typeof activeAssignment.shifts_user == "string") {
      assignmentUserId = activeAssignment.shifts_user;
    } else {
      assignmentUserId = activeAssignment.shifts_user.id;
    }

    if (assignmentUserId == userId) {
      return OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_ALREADY_EXISTING_ASSIGNMENT;
    }

    if (occurrenceIsWithinNewAssignment) {
      return OccurrenceType.ASSIGNED_TO_ANOTHER_USER_INSIDE_NEW_ASSIGNMENT;
    }

    return OccurrenceType.ASSIGNED_TO_ANOTHER_USER;
  }

  if (occurrenceIsWithinNewAssignment) {
    return OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_NEW_ASSIGNMENT;
  }

  return OccurrenceType.NOT_ASSIGNED;
}
