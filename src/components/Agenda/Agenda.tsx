import { ChoreDialog } from "..";
import { createSignal, Show, For, createEffect, Match, Switch } from "solid-js";
import { useUser } from "./../../providers";
import { useFirestore } from "solid-firebase";
import { collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { dateAtMidnight } from "../../utilities";
import { Cadence } from "./../../constants";
import { DateTime } from "luxon";
import { Button, Chore, ImageBanner, Sticky } from "./../";
import style from "./Agenda.module.css";
import { ChoreType } from "../../types";

export const Agenda = () => {
  // State to show or hide the dialog modal
  const [showAddDialog, setShowAddDialog] = createSignal(false);

  // State that holds chores in the To Do category and in the Done category
  const [toDo, setToDo] = createSignal<ChoreType[]>([]);
  const [done, setDone] = createSignal<ChoreType[]>([]);

  // State of all the chores of the family
  const [chores, setChores] = createSignal<ChoreType[]>([]);

  // State for the chore that is currently being edited
  const [choreToEdit, setChoreToEdit] = createSignal<ChoreType>();

  // The user of the session
  const { userState } = useUser();

  // Grab the style class names
  const { container, chorelist, choretitle, emptystate } = style;

  const db = getFirestore();
  const families = useFirestore(collection(db, "/family"));

  // The main lifecycle of this component, fetchs chores and sorts them into the proper categories
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
        <Show when={!toDo().length && !done().length}>
          <div class={emptystate}>
            <h2 class={choretitle}>Welcome to your Agenda</h2>
            <span>Looks like there are no chores yet. If only.</span>
            <span>
              Tap the button below to add a new chore. Each chore need only be
              added once, it will automatically refresh its status at the end of
              its frequency.
            </span>
            <span>
              If you need to invite family members to this agenda, send them the
              link below:
            </span>
            <span>{`${window.location.origin}?fid=${
              userState().FamilyID
            }`}</span>
          </div>
        </Show>
        {/* To-Do */}
        <Show when={toDo().length}>
          <h2 class={choretitle}>To-Do</h2>
          <For each={toDo()}>
            {(t) => (
              <Chore
                Cadence={t.ChoreFrequency.toString()}
                LastUser={t.LastUser}
                ChoreName={t.ChoreName}
                LastCompleted={t.LastCompleted}
                OnEdit={() => {
                  setChoreToEdit(t);
                  setShowAddDialog(true);
                }}
                OnClick={() => {
                  const currentChores = JSON.parse(
                    JSON.stringify([...chores()])
                  );
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
        </Show>
        {/* Done Chores */}
        <Show when={done().length}>
          <h2 class={choretitle}>Completed</h2>
          <For each={done()}>
            {(d) => (
              <Chore
                Cadence={d.ChoreFrequency.toString()}
                Completed={true}
                ChoreName={d.ChoreName}
                LastCompleted={d.LastCompleted || "Never"}
                LastUser={d.LastUser}
                OnEdit={() => {
                  setChoreToEdit(d);
                  setShowAddDialog(true);
                }}
              />
            )}
          </For>
        </Show>
      </div>
      <Sticky Bottom="0px">
        <Button OnClick={() => setShowAddDialog(true)}>Add New Chore</Button>
      </Sticky>
      <Show when={showAddDialog()}>
        <ChoreDialog
          Chore={choreToEdit()}
          OnClose={() => {
            setChoreToEdit();
            setShowAddDialog(false);
          }}
          OnComplete={() => {
            setChoreToEdit();
            setShowAddDialog(false);
          }}
        />
      </Show>
    </div>
  );
};
