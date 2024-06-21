import { DateTime } from "luxon";

export default function (
  from1: DateTime,
  from2: DateTime,
  to1?: DateTime,
  to2?: DateTime,
  dateOnly = false,
): boolean {
  if (from2 >= from1) {
    return isFromToActive(from1, to1, from2, dateOnly);
  }

  if (!to2) {
    return true;
  }

  return isFromToActive(from1, to1, to2, dateOnly);
}
