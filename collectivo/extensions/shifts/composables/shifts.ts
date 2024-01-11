import { readItems } from "@directus/sdk";
import type { CollectivoShift } from "~/index";
import { DateTime } from "luxon";

export const getShiftOccurences = async (
  from: DateTime,
  to: DateTime,
): Promise<CollectivoShift[]> => {
  const directus = useDirectus();
  return await directus.request(
    readItems("shifts_shifts", {
      filter: { shifts_from: { _gte: from.toString() } },
    }),
  );
};
