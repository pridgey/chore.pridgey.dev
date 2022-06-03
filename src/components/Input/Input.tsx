import styles from "./Input.module.css";
import { createSignal } from "solid-js";

type InputProps = {
  DefaultValue?: string;
  Label: string;
  Name?: string;
  Placeholder?: string;
  OnChange: (newValue: string) => void;
};

export const Input = (props: InputProps) => {
  const { label, control } = styles;

  const [inputValue, setInput] = createSignal(props.DefaultValue || "");

  return (
    <label class={label}>
      {props.Label}
      <input
        type="input"
        class={control}
        placeholder={props.Placeholder}
        name={props.Name}
        value={inputValue()}
        onInput={(e) => {
          setInput(e.currentTarget.value);
          props.OnChange(e.currentTarget.value);
        }}
      />
    </label>
  );
};
