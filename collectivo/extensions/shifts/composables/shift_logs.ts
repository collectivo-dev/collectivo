import type { DateTime } from "luxon";
import { readItems } from "@directus/sdk";
import { ShiftLogType } from "~/server/utils/ShiftLogType";

export const getUserScore = async (
  user: CollectivoUser,
  at?: DateTime,
): Promise<number> => {
  const logs: ShiftsLog[] = await getUserLogs(user, at);

  let score = 0;

  for (const log of logs) {
    switch (log.shifts_type) {
      case ShiftLogType.ATTENDED:
        score += 1;
        break;
      case ShiftLogType.MISSED:
        score -= 2;
        break;
    }
  }

  return score;
};

export const getUserLogs = async (
  user: CollectivoUser,
  at?: DateTime,
): Promise<ShiftsLog[]> => {
  const directus = useDirectus();

  const query = {
    filter: { shifts_user: { _eq: user.id } },
    fields: "*",
  };

  if (at) {
    query.filter["shifts_datetime"] = {
      _lte: at.toString(),
    };
  }

  const logs: ShiftsLog[] = await directus.request(
    readItems("shifts_logs", query),
  );

  return logs;
};
