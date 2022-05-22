import { DateTime } from "luxon";

export const dateAtMidnight = (date: string) => {
  const d = DateTime.fromFormat(date, "yyyy-MM-dd");
  d.set({ hour: 0, minute: 0, second: 0 });
  return d;
};
