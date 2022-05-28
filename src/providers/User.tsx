import {
  createSignal,
  createContext,
  useContext,
  Accessor,
  createEffect,
} from "solid-js";
import { useAuth, useFirestore } from "solid-firebase";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

type User = {
  Name: string;
  UID: string;
  FamilyName: string;
  Avatar?: string;
};

type UserContextProps = {
  userState: Accessor<User>;
  updateUser(Name: string, UID: string): void;
  updateFamily(FamilyName: string): void;
  logout(): void;
};

const UserContext = createContext<UserContextProps>({
  userState: () => ({ Name: "", UID: "", FamilyName: "" }),
  updateUser: () => undefined,
  updateFamily: () => undefined,
  logout: () => undefined,
});

export const UserProvider = (props: any) => {
  // State keeps track of all of the user properties
  const [userState, setUserState] = createSignal<User>({
    Name: "",
    UID: "",
    FamilyName: "",
  });

  // Grab user information from firebase
  const auth = getAuth();
  const authState = useAuth(auth);

  // Grab Family info from the DB
  const db = getFirestore();
  const users = useFirestore(collection(db, "/users"));
  const families = useFirestore(collection(db, "/family"));

  // Grab users state from firebase and shoves it in our global state
  createEffect(() => {
    if (!authState.loading && authState.data) {
      setUserState((u) => ({
        ...u,
        Name: authState.data.displayName,
        UID: authState.data.uid,
        Avatar: authState.data.photoURL,
      }));
    }
  });

  /*
  TODO
  This never seems to re-run and react to the firestore updating. 
  Need to look for another way for this to update so users are correctly put to the right view
  */

  // Grabs any family state from firebase and shoves it in our global state
  createEffect(() => {
    console.log("Family", { family: families.data, users: users.data });
    if (!users.loading && !families.loading && users.data && families.data) {
      // Check for the user's family if available
      let userDoc = users.data.find((u) => u.id === authState?.data?.uid);
      let familyDoc = families.data.find((f) =>
        f.FamilyMembers.includes(authState?.data?.uid)
      );

      // Do we have matching documents
      if (userDoc?.FamilyName === familyDoc?.FamilyName) {
        // Update state
        setUserState((u) => ({
          ...u,
          FamilyName: familyDoc?.FamilyName,
        }));
      }
    }
  });

  // Store with some actions to modify state
  const store = {
    userState,
    updateUser(Name: string, UID: string) {
      setUserState((u) => ({
        ...u,
        Name,
        UID,
      }));
    },
    updateFamily(FamilyName: string) {
      setUserState((u) => ({
        ...u,
        FamilyName,
      }));
    },
    logout() {
      setUserState({
        FamilyName: "",
        Name: "",
        UID: "",
        Avatar: "",
      });
    },
  };

  return (
    <UserContext.Provider value={store}>{props.children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
