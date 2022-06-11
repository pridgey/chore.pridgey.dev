import { AddAgenda } from "..";
import { createSignal, Show, For, createEffect } from "solid-js";
import { useUser } from "./../../providers";
import { useFirestore } from "solid-firebase";
import { collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { dateAtMidnight } from "../../utilities";
import { Cadence } from "./../../constants";
import { DateTime } from "luxon";
import { Button, Chore, ImageBanner, Sticky } from "./../";
import style from "./Agenda.module.css";

export const Agenda = () => {
  const [showAddDialog, setShowAddDialog] = createSignal(false);

  const [toDo, setToDo] = createSignal<any[]>([]);
  const [done, setDone] = createSignal<any[]>([]);

  const [chores, setChores] = createSignal<any[]>([]);

  const { userState } = useUser();
  const { container, chorelist } = style;

  const db = getFirestore();
  const families = useFirestore(collection(db, "/family"));

  createEffect(() => {
    if (!families.loading && families.data) {
      const choreAgenda: any[] =
        families.data.find((f) => f.FamilyName === userState().FamilyName)
          ?.Chores || [];

      if (choreAgenda.length) {
        // We found chores, now to do the thing
        setChores([...choreAgenda]);
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
    <div class={container}>
      <ImageBanner ImageSrc="agendabg.jpg" Text="Agenda" />
      <div class={chorelist}>
        {/* To-Do */}
        <For each={toDo()}>
          {(t) => (
            <Chore
              Cadence={t.ChoreFrequency}
              LastUser={t.LastUser}
              ChoreName={t.ChoreName}
              LastCompleted={t.LastCompleted}
              OnClick={() => {
                const currentChores = JSON.parse(JSON.stringify([...chores()]));
                const thisChore = currentChores.find(
                  (c: any) => c.ChoreID === t.ChoreID
                );

                if (thisChore) {
                  // set it to today
                  thisChore.LastCompleted =
                    DateTime.local().toFormat("yyyy-MM-dd");
                  // By this user
                  thisChore.LastUser = userState().Name;

                  updateDoc(doc(db, "/family", userState().FamilyName), {
                    Chores: [...currentChores],
                  });
                } else {
                  // Throw an error!
                  // Toasts would be good
                }
              }}
            />
          )}
        </For>
        {/* Done Chores */}
        <For each={done()}>
          {(d) => (
            <Chore
              Cadence={d.ChoreFrequency}
              Completed={true}
              ChoreName={d.ChoreName}
              LastCompleted={d.LastCompleted || "Never"}
              LastUser={d.LastUser}
            />
          )}
        </For>
      </div>
      <Sticky Bottom="0px">
        <Button OnClick={() => setShowAddDialog(true)}>Add New Chore</Button>
      </Sticky>
      <Show when={showAddDialog()}>
        <AddAgenda
          OnClose={() => setShowAddDialog(false)}
          OnComplete={() => setShowAddDialog(false)}
        />
      </Show>
    </div>
  );
};
