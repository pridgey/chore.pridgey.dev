import styles from "./Input.module.css";

export const Input = () => {
  const { label, control } = styles;

  return (
    <label class={label}>
      Input Label
      <input
        type="input"
        class={control}
        placeholder="Name"
        name="name"
        id="name"
        required
      />
    </label>
  );
};
