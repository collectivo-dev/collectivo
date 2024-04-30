import type { DateTime } from "luxon";

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
    if (typeof activeAssignment.shifts_user == "string") {
      throw new Error("assignment.shifts_user field must be loaded");
    }

    if (activeAssignment.shifts_user.id == userId) {
      return OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_ALREADY_EXISTING_ASSIGNMENT;
    }

    if (occurrenceIsWithinNewAssignment) {
      return OccurrenceType.ASSIGNED_TO_ANOTHER_USER_INSIDE_NEW_ASSIGNMENT;
    }

    return OccurrenceType.ASSIGNED_TO_ANOTHER_USER;
  } else {
    if (occurrenceIsWithinNewAssignment) {
      return OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_NEW_ASSIGNMENT;
    }

    return OccurrenceType.NOT_ASSIGNED;
  }
}
