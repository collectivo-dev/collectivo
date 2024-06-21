import { describe, expect, test } from "vitest";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import capAssignmentToFirstAndLastIncludedOccurrence from "~/utils/assignments/capAssignmentToFirstAndLastIncludedOccurrence";

describe("capAssignmentToFirstAndLastIncludedOccurrence", () => {
  test("when both shift and assignment have an end, cap the assignment's end", () => {
    const shift: ShiftsShift = {
      shifts_duration: 3,
      shifts_from: "2020-01-01T00:00:00.000",
      shifts_to: "2020-05-31T00:00:00.000",
      shifts_name: "",
      shifts_repeats_every: 4,
      shifts_status: ItemStatus.PUBLISHED,
    };

    const slot: ShiftsSlot = {
      id: 0,
      shifts_assignments: [],
      shifts_name: "",
      shifts_skills: [],
      shifts_status: ItemStatus.PUBLISHED,
      shifts_shift: shift,
    };

    const assignment: ShiftsAssignment = {
      shifts_slot: slot,
      shifts_from: "2020-02-01T00:00:00.000",
      shifts_to: "2020-10-01T00:00:00.000",
      shifts_user: "",
      shifts_status: ItemStatus.PUBLISHED,
    };

    capAssignmentToFirstAndLastIncludedOccurrence(assignment);

    expect(assignment.shifts_from).toBe("2020-02-02T01:00:00.000+01:00");

    expect(assignment.shifts_to).toBe("2020-05-28T23:59:59.999+02:00");
  });

  test("when the assignment has an end but the shift doesn't, cap the assignment's end", () => {
    const shift: ShiftsShift = {
      shifts_duration: 3,
      shifts_from: "2020-01-01T00:00:00.000",
      shifts_name: "",
      shifts_repeats_every: 4,
      shifts_status: ItemStatus.PUBLISHED,
    };

    const slot: ShiftsSlot = {
      id: 0,
      shifts_assignments: [],
      shifts_name: "",
      shifts_skills: [],
      shifts_status: ItemStatus.PUBLISHED,
      shifts_shift: shift,
    };

    const assignment: ShiftsAssignment = {
      shifts_slot: slot,
      shifts_from: "2020-02-01T00:00:00.000",
      shifts_to: "2020-10-01T00:00:00.000",
      shifts_user: "",
      shifts_status: ItemStatus.PUBLISHED,
    };

    capAssignmentToFirstAndLastIncludedOccurrence(assignment);

    expect(assignment.shifts_from).toBe("2020-02-02T01:00:00.000+01:00");

    expect(assignment.shifts_to).toBe("2020-09-29T23:59:59.999+02:00");
  });

  test("when the shift has an end but the assignment doesn't, leave the assignment uncapped", () => {
    const shift: ShiftsShift = {
      shifts_duration: 3,
      shifts_from: "2020-01-01T00:00:00.000",
      shifts_to: "2020-05-31T00:00:00.000",
      shifts_name: "",
      shifts_repeats_every: 4,
      shifts_status: ItemStatus.PUBLISHED,
    };

    const slot: ShiftsSlot = {
      id: 0,
      shifts_assignments: [],
      shifts_name: "",
      shifts_skills: [],
      shifts_status: ItemStatus.PUBLISHED,
      shifts_shift: shift,
    };

    const assignment: ShiftsAssignment = {
      shifts_slot: slot,
      shifts_from: "2020-02-01T00:00:00.000",
      shifts_user: "",
      shifts_status: ItemStatus.PUBLISHED,
    };

    capAssignmentToFirstAndLastIncludedOccurrence(assignment);

    expect(assignment.shifts_from).toBe("2020-02-02T01:00:00.000+01:00");

    expect(assignment.shifts_to).not.toBeDefined();
  });

  test("when both assignment and shift have no end, leave the assignment uncapped", () => {
    const shift: ShiftsShift = {
      shifts_duration: 3,
      shifts_from: "2020-01-01T00:00:00.000",
      shifts_name: "",
      shifts_repeats_every: 4,
      shifts_status: ItemStatus.PUBLISHED,
    };

    const slot: ShiftsSlot = {
      id: 0,
      shifts_assignments: [],
      shifts_name: "",
      shifts_skills: [],
      shifts_status: ItemStatus.PUBLISHED,
      shifts_shift: shift,
    };

    const assignment: ShiftsAssignment = {
      shifts_slot: slot,
      shifts_from: "2020-02-01T00:00:00.000",
      shifts_user: "",
      shifts_status: ItemStatus.PUBLISHED,
    };

    capAssignmentToFirstAndLastIncludedOccurrence(assignment);

    expect(assignment.shifts_from).toBe("2020-02-02T01:00:00.000+01:00");

    expect(assignment.shifts_to).not.toBeDefined();
  });
});
