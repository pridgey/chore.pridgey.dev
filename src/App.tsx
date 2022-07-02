import { Switch, Match, createEffect, onMount } from "solid-js";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { useAuth, useFirestore } from "solid-firebase";
import { FamilySwitch, Header, Loading } from "./components";
import { useUser } from "./providers";

import logo from "./logo.svg";
import "./App.module.css";

const App = () => {
  // Get auth info from firebase
  const auth = getAuth();
  const authState = useAuth(auth);

  const { userState, updateUser } = useUser();

  // If we are not loading, there's no data, and no errors, let's try to log in
  createEffect(() => {
    if (!authState.loading && !authState.data && !authState.error) {
      signInWithRedirect(auth, new GoogleAuthProvider()).then((r) =>
        updateUser(r.user.displayName || "", r.user.uid)
      );
      // signInWithPopup(auth, new GoogleAuthProvider()).then((r) =>
      //   updateUser(r.user.displayName || "", r.user.uid)
      // );
    }
  });

  return (
    <>
      <Switch>
        <Match when={authState.loading}>
          <Loading />
        </Match>
        <Match when={authState.error}>
          <div>Error: {authState.error.message}</div>
        </Match>
        <Match when={userState().UID}>
          <>
            <Header />
            <FamilySwitch User={authState.data} />
          </>
        </Match>
      </Switch>
    </>
  );
};

export default App;
