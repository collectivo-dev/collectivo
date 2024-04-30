import { RRule } from "rrule";
import { createItems, readItems } from "@directus/sdk";
import { ACTIVE_MEMBERSHIP_STATUSES } from "@collectivo/memberships/server/schemas/memberships_01";
import {
  SHIFT_CYCLE_DURATION_WEEKS,
  SHIFT_CYCLE_START,
} from "@collectivo/shifts/server/utils/constants";

import { luxonDateTimeToRruleDatetime } from "@collectivo/shifts/server/utils/luxonDateTimeToRruleDatetime";
import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  verifyCollectivoApiToken(event);
  const directus = await useDirectusAdmin();

  const memberships = (await directus.request(
    readItems("memberships", {
      fields: [
        "memberships_user",
        "memberships_date_approved",
        "memberships_status",
      ],
      filter: { memberships_status: { _in: ACTIVE_MEMBERSHIP_STATUSES } },
    }),
  )) as MembershipsMembership[];

  // We load logs for all users then filter the logs manually before sending to removePointsForUser
  // in order to avoid doing one DB request per user.
  const cycleLogs = (await directus.request(
    readItems("shifts_logs", {
      fields: ["shifts_datetime"],
      filter: { shifts_type: { _eq: ShiftLogType.CYCLE } },
    }),
  )) as ShiftsLog[];

  const logsToCreate = [];

  for (const membership of memberships) {
    const logsForUser = await removePointsForUser(
      membership,
      cycleLogs.filter((log) => log.shifts_user == membership.user),
    );

    logsToCreate.push(...logsForUser);
  }

  if (!logsToCreate) return;

  await directus.request(createItems("shifts_logs", logsToCreate));
});

function removePointIfNecessary(
  userId: string,
  cycleDate: Date,
  datesWherePointsAreAlreadyRemoved: DateTime[],
) {
  if (
    datesWherePointsAreAlreadyRemoved.some((date) => {
      return DateTime.fromJSDate(cycleDate).hasSame(date, "day");
    })
  )
    return null;

  return {
    shifts_type: ShiftLogType.CYCLE,
    shifts_datetime: cycleDate,
    shifts_user: userId,
  };
}

async function removePointsForUser(
  membership: MembershipsMembership,
  cycleLogs: ShiftsLog[],
) {
  const rrule = buildShiftCycleRrule();

  let nextCycleStartDate = rrule.after(
    new Date(membership.memberships_date_approved),
    true,
  );

  if (!nextCycleStartDate) return [];

  const datesWherePointsAreAlreadyRemoved = cycleLogs.map((log) => {
    return DateTime.fromISO(log.shifts_datetime);
  });

  const requests = [];

  while (nextCycleStartDate < new Date()) {
    const request = removePointIfNecessary(
      membership.memberships_user,
      nextCycleStartDate,
      datesWherePointsAreAlreadyRemoved,
    );

    if (request) requests.push(request);

    nextCycleStartDate = rrule.after(nextCycleStartDate, false);
    if (!nextCycleStartDate) break;
  }

  return requests;
}

function buildShiftCycleRrule() {
  return new RRule({
    freq: RRule.WEEKLY,
    interval: SHIFT_CYCLE_DURATION_WEEKS,
    dtstart: luxonDateTimeToRruleDatetime(SHIFT_CYCLE_START),
    until: null,
  });
}
