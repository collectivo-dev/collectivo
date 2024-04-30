import type { DateTimeFormatOptions } from "luxon";
import { DateTime } from "luxon";

export default function formatDate(
  date: unknown,
  format: DateTimeFormatOptions = DateTime.DATE_MED_WITH_WEEKDAY,
) {
  if (date instanceof Date) {
    date = DateTime.fromJSDate(date);
  } else if (typeof date === "string") {
    date = DateTime.fromISO(date);
  }

  if (!(date instanceof DateTime)) {
    throw new Error("Can't format date date object : " + date);
  }

  return date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY, format);
}
