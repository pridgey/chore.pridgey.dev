import { AddAgenda } from "..";
import { createSignal, Show, For, createEffect } from "solid-js";
import { useUser } from "./../../providers";
import { useFirestore } from "solid-firebase";
import { collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { dateAtMidnight } from "../../utilities";
import { Cadence } from "./../../constants";
import { DateTime } from "luxon";

export const Agenda = () => {
  const [showAddDialog, setShowAddDialog] = createSignal(false);

  const [toDo, setToDo] = createSignal<any[]>([]);
  const [done, setDone] = createSignal<any[]>([]);

  const { userState } = useUser();

  const db = getFirestore();
  const families = useFirestore(collection(db, "/family"));

  createEffect(() => {
    if (!families.loading && families.data) {
      const choreAgenda: any[] =
        families.data.find((f) => f.FamilyName === userState().FamilyName)
          ?.Chores || [];

      if (choreAgenda.length) {
        // We found chores, now to do the thing
        setToDo([]);
        setDone([]);
        choreAgenda.forEach((c) => {
          const lastCompleted = dateAtMidnight(c.LastCompleted);
          const today = dateAtMidnight(DateTime.local().toFormat("yyyy-MM-dd"));

          if (Cadence[c.ChoreFrequency].IsDone(lastCompleted, today)) {
            setDone((d) => {
              const curr = [...new Set(d)];
              curr.push(c);
              return curr;
            });
          } else {
            // Chore is due
            setToDo((t) => {
              const curr = [...new Set(t)];
              curr.push(c);
              return curr;
            });
          }
        });
      }
    }
  });

  return (
    <>
      <h1>Agenda</h1>
      <h2>Done</h2>
      <ul>
        <For each={done()}>
          {(d) => (
            <li>
              {d.ChoreName} - Last Completed: {d.LastCompleted}
            </li>
          )}
        </For>
      </ul>
      <h2>To Do</h2>
      <ul>
        <For each={toDo()}>
          {(t) => (
            <li>
              {t.ChoreName} - Last Completed: {t.LastCompleted}
            </li>
          )}
        </For>
      </ul>
      <button onClick={() => setShowAddDialog(true)}>Add Chore</button>
      <Show when={showAddDialog()}>
        <AddAgenda OnComplete={() => setShowAddDialog(false)} />
      </Show>
    </>
  );
};
