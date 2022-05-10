import { Switch, Match, createEffect } from "solid-js";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuth } from "solid-firebase";

import logo from "./logo.svg";
import styles from "./App.module.css";

const App = () => {
  const auth = getAuth();
  const authState = useAuth(auth);

  createEffect(() => {
    if (!authState.loading && !authState.data && !authState.error) {
      signInWithPopup(auth, new GoogleAuthProvider());
    }
  });

  return (
    <>
      <Switch>
        <Match when={authState.loading}>
          <div>Loading...</div>
        </Match>
        <Match when={authState.error}>
          <div>Error: {authState.error.message}</div>
        </Match>
        <Match when={authState.data}>
          <>
            <div>Hello {authState.data.displayName}</div>
            <button onClick={() => auth.signOut()}>Logout</button>
          </>
        </Match>
      </Switch>
    </>
  );
};

export default App;
