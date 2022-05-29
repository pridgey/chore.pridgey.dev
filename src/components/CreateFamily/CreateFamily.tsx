import { createSignal, Show } from "solid-js";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { User } from "firebase/auth";
import { useUser } from "./../../providers";
import style from "./CreateFamily.module.css";
import { Gardening } from "./../SVG";
import { Input } from "./../";

type FamilyProps = {
  User: User | any;
};

export const CreateFamily = (props: FamilyProps) => {
  const { container, title } = style;

  const [familyName, setFamilyName] = createSignal("");
  const [familyNameTaken, setFamilyNameTaken] = createSignal(false);

  const { updateFamily } = useUser();

  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));

  return (
    <div class={container}>
      <h1 class={title}>Welcome to Chore</h1>
      <Gardening />
      <span>Hello There!</span>
      <span>
        We're looking you up in our system by your email. But we can't seem to
        find you. So we think you might be a new user.
      </span>
      <span>
        If you are looking to join someone else's family, they will need to send
        you an invite link.
      </span>
      <span>
        Otherwise, we can help you create a household. All we need is a family
        name and you can start inviting members and setting up chores!
      </span>
      <Input />
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
    </div>
  );
};
