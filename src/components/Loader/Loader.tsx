import { createSignal, onCleanup, onMount } from "solid-js";
import styles from "./Loader.module.css";

export const Loading = () => {
  // Classes
  const { loader } = styles;
  // Long ellipsis that gets shorter
  const [ellipsis, setEllipsis] = createSignal("..........");

  let interval: NodeJS.Timer;

  // Create the interval on mount
  onMount(() => {
    interval = setInterval(() =>
      setEllipsis(ellipsis().substring(0, ellipsis().length - 1))
    );
  });

  // clear it on dismount
  onCleanup(() => clearInterval(interval));

  return <div class={loader}>Decluttering{ellipsis()}</div>;
};
