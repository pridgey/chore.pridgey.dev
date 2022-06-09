import { JSX } from "solid-js";
import style from "./Sticky.module.css";

type StickyProps = {
  Bottom?: `${number}px`;
  Right?: `${number}px`;
  Left?: `${number}px`;
  Top?: `${number}px`;
  children: JSX.Element;
};

export const Sticky = (props: StickyProps) => {
  const { sticky } = style;

  return (
    <div
      class={sticky}
      style={{
        bottom: props.Bottom,
        top: props.Top,
        left: props.Left,
        right: props.Right,
      }}
    >
      {props.children}
    </div>
  );
};
