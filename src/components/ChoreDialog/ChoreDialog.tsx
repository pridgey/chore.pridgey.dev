import { useFirestore } from "solid-firebase";
import { collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { createSignal, createEffect, Show, Switch, Match } from "solid-js";
import { Portal } from "solid-js/web";
import { useUser } from "../../providers";
import { Cadence } from "../../constants";
import { Button, Dropdown, Input } from "..";
import style from "./ChoreDialog.module.css";
import { v4 } from "uuid";
import { ChoreType } from "../../types";

type ChoreDialogProps = {
  Chore?: ChoreType;
  OnComplete: () => void;
  OnClose: () => void;
};

export const ChoreDialog = (props: ChoreDialogProps) => {
  // Form state
  const [choreName, setChoreName] = createSignal(props.Chore?.ChoreName || "");
  const [choreFrequency, setChoreFrequency] = createSignal(
    props.Chore?.ChoreFrequency.toString() || ""
  );
  const [choreStartDate, setChoreStartDate] = createSignal("");
  const [foundFamily, setFoundFamily] = createSignal<any>();

  const [deleteMode, setDeleteMode] = createSignal<boolean>(false);

  const {
    buttonbar,
    close,
    dangertext,
    dialogtext,
    fullbuttonbar,
    shade,
    popup,
    titlebar,
    title,
  } = style;

  const { userState } = useUser();

  const db = getFirestore();
  const families = useFirestore(collection(db, "/family"));

  // Loads family data and pushes it to state for easy access
  createEffect(() => {
    if (!families.loading && families.data) {
      let familyDoc = families.data.find(
        (f) => f.id === userState().FamilyName
      );

      if (familyDoc) setFoundFamily(familyDoc);
    }
  });

  return (
    <Portal>
      <div class={shade}>
        <dialog class={popup}>
          <div class={titlebar}>
            <h1 class={title}>
              {deleteMode() ? "Delete" : props.Chore ? "Edit" : "Add"} Chore
            </h1>
            <button class={close} onClick={() => props.OnClose()}>
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <desc></desc>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <Switch>
            <Match when={!deleteMode()}>
              {/* Standard Edit / Create Form */}
              <Input
                Label="Chore Name"
                Placeholder="Chore Name"
                OnChange={(newValue) => setChoreName(newValue)}
                DefaultValue={props.Chore?.ChoreName || ""}
              />

              <Dropdown
                Label="Chore Frequency"
                Options={Object.entries(Cadence).map((c) => ({
                  id: c[0],
                  display: c[1].DisplayName,
                }))}
                OnChange={(selected) => setChoreFrequency(selected.id)}
                SelectedID={props.Chore?.ChoreFrequency.toString() || ""}
              />

              <div class={props.Chore ? buttonbar : fullbuttonbar}>
                <Show when={props.Chore}>
                  <Button
                    Danger={true}
                    OnClick={() => {
                      setDeleteMode(true);
                    }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <desc></desc>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="4" y1="7" x2="20" y2="7"></line>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                    </svg>
                  </Button>
                </Show>
                <Button
                  Disabled={
                    !choreName().length ||
                    !choreFrequency().length ||
                    !foundFamily()
                  }
                  OnClick={() => {
                    const currentChores = [...(foundFamily()?.Chores || [])];

                    if (props.Chore) {
                      // Editing the chore, so we need to find it
                      const thisChore = currentChores.find(
                        (c) => c.ChoreID === props.Chore?.ChoreID
                      );

                      currentChores.splice(
                        currentChores.findIndex(
                          (c) => c.ChoreID === props.Chore?.ChoreID
                        ),
                        1
                      );
                      currentChores.push({
                        ...thisChore,
                        ChoreName: choreName(),
                        ChoreFrequency: choreFrequency(),
                      });
                    } else {
                      // We are not editing
                      currentChores.push({
                        ChoreID: v4(),
                        ChoreName: choreName(),
                        ChoreFrequency: choreFrequency(),
                        LastCompleted: "",
                      });
                    }

                    // Update the db doc
                    updateDoc(doc(db, "/family", userState().FamilyName), {
                      Chores: [...currentChores],
                    });
                    props.OnComplete();
                  }}
                >
                  {props.Chore ? "Edit Chore" : "Add Chore To Agenda"}
                </Button>
              </div>
            </Match>
            <Match when={deleteMode()}>
              <p class={dialogtext}>
                Are you sure you want to <span class={dangertext}>delete</span>{" "}
                the Chore titled "{props.Chore?.ChoreName}"?
              </p>
              <p class={dialogtext}>
                There is no reversing this action. So be sure it is what you
                wish to do.
              </p>
              <div class={buttonbar}>
                <Button
                  Danger={true}
                  OnClick={() => {
                    // Delete the chore
                    const currentChores = [...(foundFamily()?.Chores || [])];
                    currentChores.splice(
                      currentChores.findIndex(
                        (c) => c.ChoreID === props.Chore?.ChoreID
                      ),
                      1
                    );
                    // Update the db doc
                    updateDoc(doc(db, "/family", userState().FamilyName), {
                      Chores: [...currentChores],
                    });
                    props.OnComplete();
                  }}
                >
                  Delete
                </Button>
                <Button OnClick={() => setDeleteMode(false)}>Cancel</Button>
              </div>
            </Match>
          </Switch>
        </dialog>
      </div>
    </Portal>
  );
};
