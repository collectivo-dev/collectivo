import { DateTime } from "luxon";
import isFromToActive from "./isFromToActive";

export default function (
  durationModel: { shifts_from: string; shifts_to?: string },
  atDate?: DateTime,
): boolean {
  return isFromToActive(
    DateTime.fromISO(durationModel.shifts_from),
    durationModel.shifts_to
      ? DateTime.fromISO(durationModel.shifts_to)
      : undefined,
    atDate,
    true,
  );
}
