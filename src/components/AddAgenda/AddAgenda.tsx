import { useFirestore } from "solid-firebase";
import { collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { createSignal, createEffect, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useUser } from "./../../providers";
import { Cadence } from "./../../constants";
import { Button, Dropdown, Input } from "./../";
import style from "./AddAgenda.module.css";
import { v4 } from "uuid";

type AddAgendaProps = {
  OnComplete: () => void;
  OnClose: () => void;
};

export const AddAgenda = (props: AddAgendaProps) => {
  // Form state
  const [choreName, setChoreName] = createSignal("");
  const [choreFrequency, setChoreFrequency] = createSignal("");
  const [choreStartDate, setChoreStartDate] = createSignal("");
  const [foundFamily, setFoundFamily] = createSignal<any>();

  const { close, shade, popup, titlebar, title } = style;

  const { userState } = useUser();

  const db = getFirestore();
  const families = useFirestore(collection(db, "/family"));

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
            <h1 class={title}>Add Chore</h1>
            <button class={close} onClick={() => props.OnClose()}>
              x
            </button>
          </div>
          <Input
            Label="Chore Name"
            Placeholder="Chore Name"
            OnChange={(newValue) => setChoreName(newValue)}
          />

          <Dropdown
            Label="Chore Frequency"
            Options={Object.entries(Cadence).map((c) => ({
              id: c[0],
              display: c[1].DisplayName,
            }))}
            OnChange={(selected) => setChoreFrequency(selected.id)}
          />

          <Button
            Disabled={
              !choreName().length || !choreFrequency().length || !foundFamily()
            }
            OnClick={() => {
              const currentChores = [...(foundFamily()?.Chores || [])];
              currentChores.push({
                ChoreID: v4(),
                ChoreName: choreName(),
                ChoreFrequency: choreFrequency(),
                LastCompleted: "",
              });
              updateDoc(doc(db, "/family", userState().FamilyName), {
                Chores: [...currentChores],
              });
              props.OnComplete();
            }}
          >
            Add Chore To Agenda
          </Button>
        </dialog>
      </div>
    </Portal>
  );
};
