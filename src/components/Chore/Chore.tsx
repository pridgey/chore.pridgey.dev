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
        {`Done: ${
          props.LastCompleted === "Never"
            ? "Never"
            : DateTime.fromFormat(props.LastCompleted, "yyyy-MM-dd").toFormat(
                "LLL dd yyyy"
              )
        } by ${props.LastUser ?? "The Nisse"}`}
      </span>
      <span class={cadence}>
        {props.Cadence === "once"
          ? "A one-time task"
          : `A ${props.Cadence.replace("bi", "bi-")} task`}
      </span>
    </button>
  );
};
