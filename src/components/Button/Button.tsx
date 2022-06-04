import { JSX } from "solid-js";
import style from "./Button.module.css";

type ButtonProps = {
  Danger?: boolean;
  Disabled?: boolean;
  OnClick: () => void;
  children: JSX.Element;
};

export const Button = (props: ButtonProps) => {
  const { danger, control } = style;

  return (
    <button
      classList={{
        [control]: true,
        [danger]: props.Danger,
      }}
      onClick={() => props.OnClick()}
      disabled={props.Disabled}
    >
      {props.children}
    </button>
  );
};
