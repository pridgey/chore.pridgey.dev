import { DateTime } from "luxon";

type CadenceProps = {
  DisplayName: string;
  IsDone: (LastCompleted: DateTime, Today: DateTime) => boolean;
};

export const Cadence: { [key: string]: CadenceProps } = {
  daily: {
    DisplayName: "Every Day",
    IsDone: (LC: DateTime, Today: DateTime) =>
      LC.toFormat("yyyy-MM-dd") === Today.toFormat("yyyy-MM-dd"),
  },
  bidaily: {
    DisplayName: "Every Other Day",
    IsDone: (LC: DateTime, Today: DateTime) => {
      console.log({ LC, Today });
      console.log("Diff", Today.diff(LC, "days"));
      return Today.diff(LC, "days").days === 1;
    },
  },
  weekly: {
    DisplayName: "Every Week",
    IsDone: (LC: DateTime, Today: DateTime) =>
      LC.weekNumber >= Today.weekNumber,
  },
  biweekly: {
    DisplayName: "Every Other Week",
    IsDone: (LC: DateTime, Today: DateTime) =>
      Today.weekNumber - LC.weekNumber < 2,
  },
  monthly: {
    DisplayName: "Every Month",
    IsDone: (LC: DateTime, Today: DateTime) =>
      LC.year >= Today.year && LC.month >= Today.month,
  },
  bimonthly: {
    DisplayName: "Every Other Month",
    IsDone: (LC: DateTime, Today: DateTime) =>
      LC.year >= Today.year && Today.month - LC.month < 2,
  },
  quarterly: {
    DisplayName: "Every 4 Months",
    IsDone: (LC: DateTime, Today: DateTime) =>
      LC.year >= Today.year && Today.month - LC.month < 4,
  },
  yearly: {
    DisplayName: "Every Year",
    IsDone: (LC: DateTime, Today: DateTime) => LC.year >= Today.year,
  },
  once: {
    DisplayName: "Only Once",
    IsDone: (LC: DateTime) => LC.isValid,
  },
};
