import { createItems, readItems, readUsers } from "@directus/sdk";

const CYCLE_DAYS = 28;

interface ShiftUser {
  id: string;
  shifts_user_type: string;
}

export default defineEventHandler(async () => {
  // verifyCollectivoApiToken(event);
  const directus = await useDirectusAdmin();

  const users = (await directus.request(
    readUsers({
      fields: ["id", "shifts_user_type"],
    }),
  )) as ShiftUser[];

  // We load logs for all users then filter the logs manually
  // before sending to createShiftScoreLogs
  // in order to avoid doing one DB request per user.
  // TODO: We only need last log of each user actually
  const cycleLogs = (await directus.request(
    readItems("shifts_logs", {
      fields: ["shifts_date", "shifts_user", "shifts_type"],
      sort: ["-shifts_date", "-date_created"],
      filter: {
        shifts_type: {
          _in: [
            ShiftLogType.CYCLE,
            ShiftLogType.CYCLE_ACTIVATED,
            ShiftLogType.CYCLE_DEACTIVATED,
          ],
        },
      },
    }),
  )) as ShiftsLog[];

  const logsToCreate = [];

  for (const user of users) {
    const logsForUser = await createShiftScoreLogs(
      user,
      cycleLogs.filter((log) => log.shifts_user == user.id),
    );

    logsToCreate.push(...logsForUser);
  }

  if (!logsToCreate) return;

  await directus.request(createItems("shifts_logs", logsToCreate));
});

function getCurrentDate() {
  const now = new Date();

  const currentDateUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
    ),
  );

  return currentDateUTC;
}

async function createShiftScoreLogs(user: ShiftUser, cycleLogs: ShiftsLog[]) {
  const today = getCurrentDate();

  // Handle users that should be deactivated
  // Log cycle deactivation if necessary
  if (
    user.shifts_user_type != ShiftUserType.REGULAR &&
    user.shifts_user_type != ShiftUserType.JUMPER
  ) {
    if (
      cycleLogs.length > 0 &&
      cycleLogs[0].shifts_type != ShiftLogType.CYCLE_DEACTIVATED
    ) {
      return [
        {
          shifts_type: ShiftLogType.CYCLE_DEACTIVATED,
          shifts_date: today.toISOString(),
          shifts_user: user.id,
        },
      ];
    } else {
      return [];
    }
  }

  // Handle users that should be activated
  // Log cycle activation if necessary
  if (
    cycleLogs.length == 0 ||
    cycleLogs[0].shifts_type == ShiftLogType.CYCLE_DEACTIVATED
  ) {
    return [
      {
        shifts_type: ShiftLogType.CYCLE_ACTIVATED,
        shifts_date: today.toISOString(),
        shifts_user: user.id,
      },
    ];
  }

  // Handle regular users
  let nextCycleDate = undefined;

  if (cycleLogs.length > 0) {
    let lastCycle = undefined;
    let lastActivated = undefined;
    let deactivatedDays = 0;

    // Find the last cycle log or the first activation
    // Note breaks (deactivated-activated) in between today and last cycle
    while (cycleLogs.length > 0) {
      const mostRecentLog = cycleLogs.shift();

      if (mostRecentLog!.shifts_type == ShiftLogType.CYCLE) {
        lastCycle = mostRecentLog;
        break;
      }

      if (mostRecentLog!.shifts_type == ShiftLogType.CYCLE_ACTIVATED) {
        lastActivated = mostRecentLog;
        continue;
      }

      if (mostRecentLog!.shifts_type == ShiftLogType.CYCLE_DEACTIVATED) {
        if (lastActivated) {
          // Get number of days between last activation and deactivation
          deactivatedDays += Math.floor(
            (new Date(mostRecentLog!.shifts_date).getTime() -
              new Date(lastActivated.shifts_date).getTime()) /
              (1000 * 60 * 60 * 24),
          );
        }

        lastActivated = undefined;
        continue;
      }
    }

    // Create the next cycle date based on the last cycle or activation
    if (lastCycle || lastActivated) {
      nextCycleDate = new Date(
        lastCycle ? lastCycle.shifts_date : lastActivated!.shifts_date,
      );

      nextCycleDate.setDate(
        nextCycleDate.getDate() + CYCLE_DAYS + deactivatedDays,
      );
    } else {
      // If no valid cycle log is found, create cycle log at current date
      nextCycleDate = getCurrentDate();
    }
  } else {
    // If no cycle logs exist, create the first cycle log at current date
    nextCycleDate = getCurrentDate();
  }

  // Create cycle logs until current date is exceeded
  const requests = [];

  while (nextCycleDate <= today) {
    requests.push({
      shifts_type: ShiftLogType.CYCLE,
      shifts_date: nextCycleDate.toISOString(),
      shifts_user: user.id,
      shifts_score: -1,
    });

    nextCycleDate.setDate(nextCycleDate.getDate() + CYCLE_DAYS);
  }

  return requests;
}
