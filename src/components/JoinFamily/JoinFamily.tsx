import { useFirestore } from "solid-firebase";
import {
  collection,
  getFirestore,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createEffect, createSignal, Show } from "solid-js";
import { User } from "firebase/auth";
import { useUser } from "./../../providers";

type JoinFamilyProps = {
  Fid: string;
  User: User | any;
};

export const JoinFamily = (props: JoinFamilyProps) => {
  const [foundFamily, setFoundFamily] = createSignal<any>();

  const { updateFamily } = useUser();

  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));

  // Look up the family with the given fid (family id)
  createEffect(() => {
    if (!family.loading) {
      if (family.data?.some((f) => f.fid === props.Fid)) {
        setFoundFamily(family.data.find((f) => f.fid === props.Fid));
      }
    }
  });

  return (
    <>
      <Show when={family.loading}>Loading...</Show>
      <div>
        You are being invited to join the {foundFamily()?.FamilyName} family. Do
        you accept this invitation?
      </div>
      <button onClick={() => (window.location.search = "")}>No</button>
      <button
        onClick={() => {
          // Join the family
          const currentMembers = [...foundFamily().FamilyMembers];
          currentMembers.push(props.User.uid);
          updateDoc(doc(db, "/family", foundFamily().FamilyName), {
            FamilyMembers: [...currentMembers],
          });

          // Update Family in State
          updateFamily(foundFamily().FamilyName);

          // Create a user doc
          setDoc(doc(db, "/users", props.User.uid), {
            uid: props.User.uid,
            FamilyName: foundFamily().FamilyName,
          });
        }}
      >
        Yes
      </button>
    </>
  );
};
