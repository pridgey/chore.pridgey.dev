import { useFirestore } from "solid-firebase";
import { collection, getFirestore, doc, updateDoc } from "firebase/firestore";
import { createSignal, createEffect, For, Show } from "solid-js";
import { useUser } from "./../../providers";
import { Cadence } from "./../../constants";

type AddAgendaProps = {
  OnComplete: () => void;
};

export const AddAgenda = (props: AddAgendaProps) => {
  // Form state
  const [choreName, setChoreName] = createSignal("");
  const [choreFrequency, setChoreFrequency] = createSignal("");
  const [choreStartDate, setChoreStartDate] = createSignal("");
  const [foundFamily, setFoundFamily] = createSignal<any>();

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
    <>
      <label>
        Chore Name
        <input
          type="text"
          placeholder="Chore Name"
          value={choreName()}
          onChange={(e) => setChoreName(e.currentTarget.value)}
        />
      </label>
      <label>
        Chore Frequency
        <select
          value={choreFrequency()}
          onChange={(e) => setChoreFrequency(e.currentTarget.value)}
        >
          <option value="" disabled selected>
            Select Chore Frequency
          </option>
          <For each={Object.entries(Cadence)}>
            {(c) => <option value={c[0]}>{c[1].DisplayName}</option>}
          </For>
        </select>
      </label>
      {/* <label>

      <input
        type="date"
        placeholder="Start Date"
        value={choreStartDate()}
        onChange={(e) => setChoreStartDate(e.currentTarget.value)}
      />
      </label> */}
      <button
        onClick={() => {
          const currentChores = [...(foundFamily()?.Chores || [])];
          currentChores.push({
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
      </button>
    </>
  );
};
