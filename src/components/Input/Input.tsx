import styles from "./Input.module.css";

export const Input = () => {
  const { container, inputControl, inputLabel } = styles;

  return (
    <div class={container}>
      <input
        type="input"
        class={inputControl}
        placeholder="Name"
        name="name"
        id="name"
        required
      />
      <label for="name" class={inputLabel}>
        Name
      </label>
    </div>
  );
};
