import style from "./Chore.module.css";
import { DateTime } from "luxon";

type ChoreProps = {
  Cadence: string;
  Completed?: boolean;
  ChoreName: string;
  LastCompleted: string;
  LastUser: string;
  OnClick?: () => void;
};

const generateByLine = (LC: string, LU: string) => {
  // Have neither
  if (!LC && !LU) {
    return "Waiting on the Nisse";
  }
  // Has user but no date... somehow
  if (!LC && LU) {
    return `Last done by ${LU}`;
  }

  // Can assume we have a date by this point
  const formattedDate = DateTime.fromFormat(LC, "yyyy-MM-dd").toFormat(
    "LLL dd yyyy"
  );
  // Has a date but no user... somehow
  if (LC && !LU) {
    return `Last completed ${formattedDate}`;
  }
  // Has both date and user
  return `Done ${formattedDate} by ${LU}`;
};

export const Chore = (props: ChoreProps) => {
  const { cadence, container, complete, indicator, title, subtitle } = style;

  return (
    <button class={container} onClick={() => props.OnClick?.()}>
      <div
        classList={{
          [indicator]: true,
          [complete]: props.Completed,
        }}
      ></div>
      <span class={title}>{props.ChoreName}</span>
      <span class={subtitle}>
        {generateByLine(props.LastCompleted, props.LastUser)}
      </span>
      <span class={cadence}>
        {props.Cadence === "once"
          ? "A one-time task"
          : `A ${props.Cadence.replace("bi", "bi-")} task`}
      </span>
    </button>
  );
};
