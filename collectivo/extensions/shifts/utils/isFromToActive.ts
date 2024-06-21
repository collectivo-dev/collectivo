import { DateTime } from "luxon";

export default function (
  from: DateTime,
  to?: DateTime,
  atDate?: DateTime,
  dateOnly = true,
): boolean {
  if (!atDate) {
    atDate = DateTime.now();
  }

  if (dateOnly) {
    from = from.startOf("day");
    to = to?.endOf("day");
  }

  if (from > atDate) {
    return false;
  }

  return !(to && to < atDate);
}
