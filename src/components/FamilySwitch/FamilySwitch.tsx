import { collection, getFirestore, addDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useFirestore } from "solid-firebase";
import { Switch, Match, createSignal, createEffect } from "solid-js";
import { Input, JoinFamily, Loading } from "../";

type FamilyProps = {
  User: User | any;
};

export const FamilySwitch = (props: FamilyProps) => {
  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));
  const url = new URL(window.location.href);
  const [hasDoc, setHasDoc] = createSignal(false);

  createEffect(() => {
    setHasDoc(family.data?.some((d) => d.id === props.User.uid) || false);
  });

  return (
    <>
      <Switch>
        <Match when={family.loading}>
          <Loading />
        </Match>
        <Match when={url.searchParams.get("fid") && !hasDoc()}>
          <JoinFamily />
        </Match>
        <Match when={!hasDoc()}>
          <div>Let's create a family</div>
        </Match>
        <Match when={hasDoc()}>
          <div>Doc</div>
        </Match>
      </Switch>
      {props.User.uid}
    </>
  );
};
