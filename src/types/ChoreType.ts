import { Cadence } from "../constants";

export type ChoreType = {
  ChoreFrequency: keyof typeof Cadence;
  ChoreID: string;
  ChoreName: string;
  LastCompleted: string;
  LastUser: string;
};
