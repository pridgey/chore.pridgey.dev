import styles from "./Header.module.css";
import { Avatar } from "./../";

export const Header = () => {
  const { header, chorelogo } = styles;

  return (
    <header class={header}>
      <span class={chorelogo}>Chore</span>
      <Avatar />
    </header>
  );
};
