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
      case ShiftLogType.CYCLE:
        score -= 1;
        break;
      case ShiftLogType.CANCELLED:
        // Do nothing
        break;
      default:
        throw new Error("Unknown shift log type : " + log.shifts_type);
    }
  }

  return score;
};

export const getUserLogs = async (
  user: CollectivoUser,
  at?: DateTime,
  limit?: number,
): Promise<ShiftsLog[]> => {
  const directus = useDirectus();

  const query = {
    filter: {
      shifts_user: { id: { _eq: user.id } },
      shifts_type: { _neq: ShiftLogType.CANCELLED },
    },
    fields: ["*"],
    sort: ["-shifts_datetime"],
  };

  if (at) {
    query.filter["shifts_datetime"] = {
      _lte: at.toString(),
    };
  }

  if (limit) {
    query["limit"] = limit;
  }

  return (await directus.request(
    readItems("shifts_logs", query),
  )) as ShiftsLog[];
};
