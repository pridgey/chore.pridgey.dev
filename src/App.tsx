import { Switch, Match, createEffect, onMount } from "solid-js";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { collection, getFirestore, addDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "solid-firebase";
import { FamilySwitch, Loading } from "./components";

import logo from "./logo.svg";
import styles from "./App.module.css";

const App = () => {
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
            <FamilySwitch User={authState.data} />
            <div>Hello {authState.data.displayName}</div>
            <button onClick={() => auth.signOut()}>Logout</button>
          </>
        </Match>
      </Switch>
    </>
  );
};

export default App;
