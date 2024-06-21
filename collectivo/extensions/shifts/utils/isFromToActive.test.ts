import { describe, expect, test } from "vitest";
import { DateTime } from "luxon";

describe("isFromToActive", () => {
  test("interval starts after target date", () => {
    expect(
      isFromToActive(
        DateTime.local(2023, 6, 14),
        undefined,
        DateTime.local(2023, 6, 13),
      ),
    ).toBe(false);
  });

  test("interval starts before target date and has no end", () => {
    expect(
      isFromToActive(
        DateTime.local(2023, 6, 12),
        undefined,
        DateTime.local(2023, 6, 13),
      ),
    ).toBe(true);
  });

  test("interval starts before target date and has end date that is after the target date", () => {
    expect(
      isFromToActive(
        DateTime.local(2023, 6, 12),
        DateTime.local(2023, 6, 14),
        DateTime.local(2023, 6, 13),
      ),
    ).toBe(true);
  });

  test("interval ends before target date", () => {
    expect(
      isFromToActive(
        DateTime.local(2023, 6, 12),
        DateTime.local(2023, 6, 15),
        DateTime.local(2023, 6, 17),
      ),
    ).toBe(false);
  });

  test("dateOnly=true causes time to be ignored", () => {
    expect(
      isFromToActive(
        DateTime.local(2023, 6, 12),
        DateTime.local(2023, 6, 15, 12, 15),
        DateTime.local(2023, 6, 15, 12, 30),
        true,
      ),
    ).toBe(true);
  });

  test("dateOnly=false causes time to be enforced", () => {
    expect(
      isFromToActive(
        DateTime.local(2023, 6, 12),
        DateTime.local(2023, 6, 15, 12, 15),
        DateTime.local(2023, 6, 15, 12, 30),
        false,
      ),
    ).toBe(false);
  });
});
