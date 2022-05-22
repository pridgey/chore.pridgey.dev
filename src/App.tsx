import { Switch, Match, createEffect, onMount } from "solid-js";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuth, useFirestore } from "solid-firebase";
import { FamilySwitch, Loading } from "./components";
import { useUser } from "./providers";

import logo from "./logo.svg";
import styles from "./App.module.css";

const App = () => {
  // Get auth info from firebase
  const auth = getAuth();
  const authState = useAuth(auth);

  // If we are not loading, there's no data, and no errors, let's try to log in
  createEffect(() => {
    if (!authState.loading && !authState.data && !authState.error) {
      signInWithPopup(auth, new GoogleAuthProvider());
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
        <Match when={authState.data}>
          <>
            <div>Hello {authState.data.displayName}</div>
            <div>{authState.data.uid}</div>
            <button onClick={() => auth.signOut()}>Logout</button>
            <FamilySwitch User={authState.data} />
          </>
        </Match>
      </Switch>
    </>
  );
};

export default App;
