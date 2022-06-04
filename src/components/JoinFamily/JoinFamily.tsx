import { useFirestore } from "solid-firebase";
import {
  collection,
  getFirestore,
  setDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import { User } from "firebase/auth";
import { useUser } from "./../../providers";
import { Button, ImageBanner } from "./../";
import style from "./JoinFamily.module.css";

type JoinFamilyProps = {
  Fid: string;
  User: User | any;
};

export const JoinFamily = (props: JoinFamilyProps) => {
  const [foundFamily, setFoundFamily] = createSignal<any>();

  const { textbox, subtitle, bold, buttonchoice } = style;

  const { updateFamily } = useUser();

  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));

  // Look up the family with the given fid (family id)
  createEffect(() => {
    if (!family.loading) {
      if (family.data?.some((f) => f.fid === props.Fid)) {
        setFoundFamily(family.data.find((f) => f.fid === props.Fid));
      } else {
        window.location.search = "";
      }
    }
  });

  return (
    <>
      <Show when={family.loading}>Loading...</Show>
      <Switch>
        <Match when={foundFamily()}>
          <ImageBanner
            ImageSrc="joinbg.jpg"
            Text={`The ${foundFamily().FamilyName} Family`}
          />

          <div class={textbox}>
            <h2 class={subtitle}>You've Received a Family Invitation</h2>
            <div>
              You are being invited to join the{" "}
              <span class={bold}>{`${foundFamily()?.FamilyName} `}</span>
              family. Do you accept this invitation?
            </div>
            <div>
              If you agree, you will join the family and be able to see their
              Chore list and mark items as completed. Accepting this invitation
              will remove you from any existing family.
            </div>
            <div>
              If you do not wish to join, you will not join this family and be
              returned to your homepage
            </div>
            <div class={buttonchoice}>
              <Button
                Danger={true}
                OnClick={() => (window.location.search = "")}
              >
                No
              </Button>
              <Button
                OnClick={() => {
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
              </Button>
            </div>
          </div>
        </Match>
      </Switch>
    </>
  );
};
