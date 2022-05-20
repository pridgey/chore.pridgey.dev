import { AddAgenda } from "..";
import { createSignal, Show } from "solid-js";

type AgendaProps = {
  Family: string;
};

export const Agenda = (props: AgendaProps) => {
  const [showAddDialog, setShowAddDialog] = createSignal(false);

  return (
    <>
      <h1>Agenda</h1>
      <div>Agend Items here</div>
      <button onClick={() => setShowAddDialog(true)}>Add Chore</button>
      <Show when={showAddDialog()}>
        <AddAgenda
          OnComplete={() => setShowAddDialog(false)}
          Family={props.Family}
        />
      </Show>
    </>
  );
};
