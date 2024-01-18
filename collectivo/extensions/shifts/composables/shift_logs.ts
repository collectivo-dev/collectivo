import type { DateTime } from "luxon";
import { readItems } from "@directus/sdk";
import { ShiftLogType } from "~/server/utils/ShiftLogType";

export const getUserScore = async (
  user: CollectivoUser,
  at?: DateTime,
): Promise<number> => {
  const directus = useDirectus();

  const query = {
    filter: { shifts_user: { _eq: user.id } },
    fields: "shifts_type",
  };

  if (at) {
    query.filter["shifts_datetime"] = {
      _lte: at.toString(),
    };
  }

  const logs: CollectivoLog[] = await directus.request(
    readItems("shifts_logs", query),
  );

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
