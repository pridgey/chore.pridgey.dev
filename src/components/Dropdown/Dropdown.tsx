import styles from "./Dropdown.module.css";
import { For } from "solid-js";

type DropdownOption = {
  id: string;
  display: string;
};

type DropdownProps = {
  Label: string;
  Name?: string;
  Options: DropdownOption[];
  Placeholder?: string;
  OnChange: (newValue: DropdownOption) => void;
  SelectedID?: string;
};

export const Dropdown = (props: DropdownProps) => {
  const { label, control } = styles;

  return (
    <label class={label}>
      {props.Label}
      <select
        class={control}
        name={props.Name}
        onChange={(e) => {
          const selected = props.Options.find(
            (o) => o.id === e.currentTarget.value
          );
          if (selected) {
            props.OnChange(selected);
          }
        }}
      >
        <option value="" disabled selected>
          Select Chore Frequency
        </option>
        <For each={props.Options}>
          {(c) => (
            <option selected={c.id === props.SelectedID} value={c.id}>
              {c.display}
            </option>
          )}
        </For>
      </select>
    </label>
  );
};
