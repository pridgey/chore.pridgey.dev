import { createSignal } from "solid-js";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { User } from "firebase/auth";

type FamilyProps = {
  User: User | any;
};

export const CreateFamily = (props: FamilyProps) => {
  const [familyName, setFamilyName] = createSignal("");
  const db = getFirestore();

  return (
    <>
      <p>
        Hello! Welcome to Chore. We can't seem to find you in our system, so we
        think you might be new.
      </p>
      <p>
        If you are looking to join someone else's family, they will need to send
        you an invite link.
      </p>
      <p>
        Otherwise, we can help you create a household. All we need is a family
        name and you can start inviting members and setting up chores!
      </p>
      <input
        type="text"
        placeholder="Family Name"
        value={familyName()}
        onInput={(e) => setFamilyName(e.currentTarget.value)}
      />
      <button
        onClick={() => {
          setDoc(doc(db, "/family", props.User.uid), {
            id: props.User.uid,
            Parent: props.User.uid,
            FamilyName: familyName(),
          });
        }}
      >
        Create {familyName()} Family
      </button>
    </>
  );
};
