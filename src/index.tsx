/* @refresh reload */
import { render } from "solid-js/web";
import { FirebaseProvider, UserProvider } from "./providers";

import "./index.css";
import App from "./App";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_SENDER_ID || "",
  appId: import.meta.env.APP_ID || "",
};

render(
  () => (
    <FirebaseProvider config={firebaseConfig}>
      <UserProvider>
        <App />
      </UserProvider>
    </FirebaseProvider>
  ),
  document.getElementById("root") as HTMLElement
);
