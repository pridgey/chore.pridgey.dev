import style from "./Chore.module.css";
import { DateTime } from "luxon";
import { Show } from "solid-js";

type ChoreProps = {
  Cadence: string;
  Completed?: boolean;
  ChoreName: string;
  LastCompleted: string;
  LastUser: string;
  OnClick?: () => void;
  OnEdit?: () => void;
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
  const {
    cadence,
    chorewrapper,
    container,
    complete,
    editbutton,
    indicator,
    title,
    subtitle,
  } = style;

  return (
    <div class={container}>
      <button class={chorewrapper} onClick={() => props.OnClick?.()}>
        <div
          classList={{
            [indicator]: true,
            [complete]: props.Completed,
          }}
        >
          <Show when={props.Completed}>
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <desc></desc>
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 12l5 5l10 -10"></path>
            </svg>
          </Show>
        </div>
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
      <button class={editbutton} onClick={() => props.OnEdit?.()}>
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <desc></desc>
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
          <path d="M16 5l3 3"></path>
        </svg>
      </button>
    </div>
  );
};
