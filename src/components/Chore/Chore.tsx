import style from "./Chore.module.css";
import { DateTime } from "luxon";

type ChoreProps = {
  Completed?: boolean;
  ChoreName: string;
  LastCompleted: string;
  OnClick?: () => void;
};

export const Chore = (props: ChoreProps) => {
  const { container, complete, indicator, title, subtitle } = style;

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
        Last Completed:{" "}
        {props.LastCompleted === "Never"
          ? "Never"
          : DateTime.fromFormat(props.LastCompleted, "yyyy-MM-dd").toFormat(
              "LLL dd yyyy"
            )}
      </span>
    </button>
  );
};
