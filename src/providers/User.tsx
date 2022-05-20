import {
  createSignal,
  createContext,
  useContext,
  Accessor,
  createEffect,
} from "solid-js";
import { useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";

type User = {
  Name: string;
  UID: string;
  FamilyName: string;
};

type UserContextProps = {
  userState: Accessor<User>;
  updateUser(Name: string, UID: string): void;
  updateFamily(FamilyName: string): void;
};

const UserContext = createContext<UserContextProps>({
  userState: () => ({ Name: "", UID: "", FamilyName: "" }),
  updateUser: () => undefined,
  updateFamily: () => undefined,
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
  createEffect(() => {
    if (!authState.loading && authState.data) {
      setUserState((u) => ({
        ...u,
        Name: authState.data.displayName,
        UID: authState.data.uid,
      }));
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
  };

  return (
    <UserContext.Provider value={store}>{props.children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
