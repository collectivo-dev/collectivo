import type { DateTime } from "luxon";
import { readItems, aggregate } from "@directus/sdk";
import { ShiftLogType } from "~/server/utils/ShiftLogType";

export const getUserScore = async (
  user: CollectivoUser,
  at?: DateTime,
): Promise<number> => {
  const directus = useDirectus();

  const userScore = (await directus.request(
    aggregate("shifts_logs", {
      aggregate: { sum: "shifts_score" },
      query: {
        filter: {
          shifts_user: { id: { _eq: user.id } },
        },
      },
    }),
  )) as { sum: { shifts_score: number } }[];

  return userScore[0].sum?.shifts_score;
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
    sort: ["-shifts_date"],
  };

  if (at) {
    query.filter["shifts_date"] = {
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
