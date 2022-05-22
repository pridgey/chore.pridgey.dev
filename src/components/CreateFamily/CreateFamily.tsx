import { createSignal, Show } from "solid-js";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { User } from "firebase/auth";
import { useUser } from "./../../providers";

type FamilyProps = {
  User: User | any;
};

export const CreateFamily = (props: FamilyProps) => {
  const [familyName, setFamilyName] = createSignal("");
  const [familyNameTaken, setFamilyNameTaken] = createSignal(false);

  const { updateFamily } = useUser();

  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));

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
        onInput={(e) => {
          setFamilyName(e.currentTarget.value);
          setFamilyNameTaken(
            family.data?.some((d) => d.id === e.currentTarget.value) || false
          );
        }}
      />
      <Show when={familyNameTaken()}>
        <p>
          {familyName()} has already been registered. If you believe this is
          someone you know, you should request an invite
        </p>
      </Show>
      <button
        disabled={familyNameTaken()}
        onClick={() => {
          if (!familyNameTaken()) {
            // Create a user doc
            setDoc(doc(db, "/users", props.User.uid), {
              uid: props.User.uid,
              FamilyName: familyName(),
            });

            // Update state
            updateFamily(familyName());

            // Create a family doc
            setDoc(doc(db, "/family", familyName()), {
              fid: props.User.uid,
              Parent: props.User.uid,
              FamilyName: familyName(),
              FamilyMembers: [props.User.uid],
            });
          }
        }}
      >
        Create {familyName()} Family
      </button>
    </>
  );
};
