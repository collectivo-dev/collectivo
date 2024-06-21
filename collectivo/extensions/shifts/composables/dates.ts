// Always start of the day, in UTC
export function getCurrentDate() {
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

export function getFutureDate(days: number) {
  const currentDate = getCurrentDate();
  return new Date(currentDate.setDate(currentDate.getDate() + days));
}
