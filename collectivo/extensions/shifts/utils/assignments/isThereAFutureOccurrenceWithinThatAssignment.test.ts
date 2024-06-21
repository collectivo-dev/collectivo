import { beforeEach, describe, expect, test, vi } from "vitest";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import isThereAFutureOccurrenceWithinThatAssignment from "~/utils/assignments/isThereAFutureOccurrenceWithinThatAssignment";
import { DateTime } from "luxon";

const hoisted = vi.hoisted(() => {
  return {
    mockGetNextOccurrence: vi.fn(),
    mockIsShiftDurationModelActive: vi.fn(),
  };
});

const shift: ShiftsShift = {
  shifts_duration: 3,
  shifts_from: "2020-01-01T00:00:00.000",
  shifts_to: "2020-06-30T00:00:00.000",
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
  shifts_from: "2020-07-01T00:00:00.000",
  shifts_user: "",
  shifts_status: ItemStatus.PUBLISHED,
};

describe("isThereAFutureOccurrenceWithinThatAssignment", () => {
  beforeEach(() => {
    vi.mock("~/utils/assignments/getNextOccurrence.ts", () => ({
      default: hoisted.mockGetNextOccurrence,
    }));

    vi.mock("~/utils/isShiftDurationModelActive.ts", () => ({
      default: hoisted.mockIsShiftDurationModelActive,
    }));
  });

  test("when there is no future occurrence, returns false", () => {
    hoisted.mockGetNextOccurrence.mockReturnValue(null);

    expect(isThereAFutureOccurrenceWithinThatAssignment(assignment)).toBe(
      false,
    );

    expect(hoisted.mockGetNextOccurrence).toHaveBeenCalledOnce();

    expect(hoisted.mockGetNextOccurrence).toHaveBeenCalledWith(
      shift,
      DateTime.fromISO(assignment.shifts_from),
    );
  });

  test("when the future occurrence is not within the assignment, return false", () => {
    hoisted.mockGetNextOccurrence.mockReturnValue({
      start: "occurrence_start",
    });

    hoisted.mockIsShiftDurationModelActive.mockReturnValue(false);

    expect(isThereAFutureOccurrenceWithinThatAssignment(assignment)).toBe(
      false,
    );

    expect(hoisted.mockGetNextOccurrence).toHaveBeenCalledOnce();

    expect(hoisted.mockGetNextOccurrence).toHaveBeenCalledWith(
      shift,
      DateTime.fromISO(assignment.shifts_from),
    );

    expect(hoisted.mockIsShiftDurationModelActive).toHaveBeenCalledOnce();

    expect(hoisted.mockIsShiftDurationModelActive).toHaveBeenCalledWith(
      assignment,
      "occurrence_start",
    );
  });

  test("when the future occurrence is within the assignment, return true", () => {
    hoisted.mockGetNextOccurrence.mockReturnValue({
      start: "occurrence_start",
    });

    hoisted.mockIsShiftDurationModelActive.mockReturnValue(true);

    expect(isThereAFutureOccurrenceWithinThatAssignment(assignment)).toBe(true);

    expect(hoisted.mockGetNextOccurrence).toHaveBeenCalledOnce();

    expect(hoisted.mockGetNextOccurrence).toHaveBeenCalledWith(
      shift,
      DateTime.fromISO(assignment.shifts_from),
    );

    expect(hoisted.mockIsShiftDurationModelActive).toHaveBeenCalledOnce();

    expect(hoisted.mockIsShiftDurationModelActive).toHaveBeenCalledWith(
      assignment,
      "occurrence_start",
    );
  });
});
