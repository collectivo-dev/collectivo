import { describe, expect, test } from "vitest";
import { DateTime } from "luxon";
import doTimeIntervalsOverlap from "~/utils/doTimeIntervalsOverlap";

describe("doTimeIntervalsOverlap", () => {
  test("Second interval is after first interval (first interval has an end)", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = DateTime.local(2024, 1, 31);
    const from2 = DateTime.local(2024, 2, 1);
    const to2 = DateTime.local(2024, 2, 28);
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(false);
  });

  test("Second interval is after first interval (first interval has no end)", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = undefined;
    const from2 = DateTime.local(2024, 2, 1);
    const to2 = DateTime.local(2024, 2, 28);
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(true);
  });

  test("Second interval is inside first interval", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = DateTime.local(2024, 2, 28);
    const from2 = DateTime.local(2024, 1, 10);
    const to2 = DateTime.local(2024, 1, 15);
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(true);
  });

  test("Second interval overlaps first interval at end", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = DateTime.local(2024, 2, 28);
    const from2 = DateTime.local(2024, 2, 1);
    const to2 = DateTime.local(2024, 3, 31);
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(true);
  });

  test("Second interval is before first interval (second interval has an end)", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = DateTime.local(2024, 1, 31);
    const from2 = DateTime.local(2023, 10, 1);
    const to2 = DateTime.local(2023, 12, 31);
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(false);
  });

  test("Second interval is before first interval (second interval has no end)", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = DateTime.local(2024, 1, 31);
    const from2 = DateTime.local(2023, 10, 1);
    const to2 = undefined;
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(true);
  });

  test("Second interval overlaps first interval at start", () => {
    const from1 = DateTime.local(2024, 1, 1);
    const to1 = DateTime.local(2024, 1, 31);
    const from2 = DateTime.local(2023, 12, 15);
    const to2 = DateTime.local(2024, 1, 20);
    expect(doTimeIntervalsOverlap(from1, from2, to1, to2)).toBe(true);
  });
});
