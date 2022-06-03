import { JSX } from "solid-js";
import style from "./Button.module.css";

type ButtonProps = {
  Disabled?: boolean;
  OnClick: () => void;
  children: JSX.Element;
};

export const Button = (props: ButtonProps) => {
  const { control } = style;

  return (
    <button
      class={control}
      onClick={() => props.OnClick()}
      disabled={props.Disabled}
    >
      {props.children}
    </button>
  );
};
