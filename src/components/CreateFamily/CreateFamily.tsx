import { createSignal, Show } from "solid-js";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { User } from "firebase/auth";
import { useUser } from "./../../providers";
import style from "./CreateFamily.module.css";
import { Button, ImageBanner, Input } from "./../";

type FamilyProps = {
  User: User | any;
};

export const CreateFamily = (props: FamilyProps) => {
  const { container, subtitle, textbox } = style;

  const [familyName, setFamilyName] = createSignal("");
  const [familyNameTaken, setFamilyNameTaken] = createSignal(false);

  const { updateFamily } = useUser();

  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));

  return (
    <div class={container}>
      <ImageBanner ImageSrc="splashbg.jpg" Text="Welcome to Chore" />
      <div class={textbox}>
        <h2 class={subtitle}>Hello There!</h2>
        <span>
          We're looking you up in our system by your email. But we can't seem to
          find you. So we think you might be a new user.
        </span>
        <span>
          If you are looking to join someone else's family, they will need to
          send you an invite link.
        </span>
        <span>
          Otherwise, we can help you create a household. All we need is a family
          name and you can start inviting members and setting up chores!
        </span>
        <Input
          Label="Name Your Family"
          Placeholder="Family Name"
          OnChange={(newValue) => {
            setFamilyName(newValue);
            setFamilyNameTaken(
              family.data?.some((d) => d.id === newValue) || false
            );
          }}
        />
        <Show when={familyNameTaken()}>
          <p>
            {familyName()} has already been registered. If you believe this is
            someone you know, you should request an invite
          </p>
        </Show>
      </div>
      <Button
        Disabled={familyNameTaken() || !familyName().length}
        OnClick={() => {
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
      </Button>
    </div>
  );
};
