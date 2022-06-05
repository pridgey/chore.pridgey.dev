import { DateTime } from "luxon";

export const dateAtMidnight = (date: string) => {
  if (date) {
    const d = DateTime.fromFormat(date, "yyyy-MM-dd");
    d.set({ hour: 0, minute: 0, second: 0 });
    return d;
  } else {
    const d = DateTime.fromFormat("3000-01-01", "yyyy-MM-dd");
    d.set({ hour: 0, minute: 0, second: 0 });
    return d;
  }
};
