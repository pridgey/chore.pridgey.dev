import { useFirestore } from "solid-firebase";
import {
  collection,
  getFirestore,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createSignal, createEffect } from "solid-js";

type AddAgendaProps = {
  Family: string;
  OnComplete: () => void;
};

export const AddAgenda = (props: AddAgendaProps) => {
  // Form state
  const [choreName, setChoreName] = createSignal("");
  const [choreFrequency, setChoreFrequency] = createSignal("");
  const [choreStartDate, setChoreStartDate] = createSignal("");
  const [foundFamily, setFoundFamily] = createSignal<any>();

  console.log("Family:", props.Family);

  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));
  const users = useFirestore(collection(db, "/users"));

  return (
    <>
      <input
        type="text"
        placeholder="Chore Name"
        value={choreName()}
        onChange={(e) => setChoreName(e.currentTarget.value)}
      />
      <select
        value={choreFrequency()}
        onChange={(e) => setChoreFrequency(e.currentTarget.value)}
      >
        <option value="" disabled selected>
          Select Chore Frequency
        </option>
        <option value="daily">Every Day</option>
        <option value="weekly">Every Week</option>
        <option value="biweekly">Every Other Week</option>
        <option value="monthly">Every Month</option>
        <option value="bimonthly">Every Other Month</option>
        <option value="quarterly">Every 4 Months</option>
        <option value="yearly">Every Year</option>
      </select>
      <input
        type="date"
        placeholder="Start Date"
        value={choreStartDate()}
        onChange={(e) => setChoreStartDate(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          const currentChores = [...(foundFamily()?.Chores || [])];
          currentChores.push({
            ChoreName: choreName(),
            ChoreFrequency: choreFrequency(),
            choreStartDate: choreStartDate(),
          });
          updateDoc(doc(db, "/family", props.Family), {
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
