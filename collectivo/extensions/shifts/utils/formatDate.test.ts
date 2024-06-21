import { describe, expect, test } from "vitest";
import { DateTime } from "luxon";

describe("formatDate", () => {
  test("Format a js date", () => {
    expect(formatDate(new Date(2024, 4, 21, 13, 53))).toBe("Tue, 21 May 2024");
  });

  test("Format an ISO string", () => {
    expect(formatDate("2024-05-21T13:53")).toBe("Tue, 21 May 2024");
  });

  test("Format a Luxon DateTime", () => {
    expect(formatDate(DateTime.local(2024, 5, 21, 13, 53))).toBe(
      "Tue, 21 May 2024",
    );
  });

  test("Invalid argument throws error", () => {
    expect(() => formatDate(123455676)).toThrowError();
  });
});
