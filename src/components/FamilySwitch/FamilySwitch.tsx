import { collection, getFirestore, addDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { useFirestore } from "solid-firebase";
import { Switch, Match, createSignal, createEffect } from "solid-js";
import { Agenda, CreateFamily, JoinFamily, Loading } from "../";

type FamilyProps = {
  User: User | any;
};

export const FamilySwitch = (props: FamilyProps) => {
  // Get the db
  const db = getFirestore();
  const users = useFirestore(collection(db, "/users"));

  console.log("User", props.User);

  // Represents the current url
  const url = new URL(window.location.href);

  // Whether or not the user has a doc, so we know where to go
  const [hasDoc, setHasDoc] = createSignal(false);

  // Most likely going to wait for the db to load, so we wrap it in a useEffect to react to updates
  createEffect(() => {
    // Check and see if there is a user document, and it has a family name
    setHasDoc(
      users.data?.some((d) => d.id === props.User.uid && d.FamilyName) || false
    );
  });

  return (
    <>
      <Switch>
        <Match when={users.loading}>
          <Loading />
        </Match>
        <Match when={url.searchParams.get("fid") && !hasDoc()}>
          <JoinFamily Fid={url.searchParams.get("fid")!} User={props.User} />
        </Match>
        <Match when={!hasDoc()}>
          <CreateFamily User={props.User} />
        </Match>
        <Match when={hasDoc()}>
          <Agenda Family={props.User.FamilyName} />
        </Match>
      </Switch>
    </>
  );
};
