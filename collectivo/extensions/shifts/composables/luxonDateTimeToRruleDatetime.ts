import { DateTime } from "luxon";
import { datetime } from "rrule";

export const luxonDateTimeToRruleDatetime = (luxonDateTime: DateTime): Date => {
  return datetime(
    luxonDateTime.year,
    luxonDateTime.month,
    luxonDateTime.day,
    luxonDateTime.hour,
    luxonDateTime.minute,
  );
};
