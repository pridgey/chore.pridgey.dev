import { useFirestore } from "solid-firebase";
import { collection, getFirestore } from "firebase/firestore";

export const JoinFamily = () => {
  const db = getFirestore();
  const family = useFirestore(collection(db, "/family"));

  return (
    <>
      <div>
        You are being invited to join the ____ family. Do you accept this
        invitation?
      </div>
      <button onClick={() => (window.location.search = "")}>No</button>
      <button onClick={() => undefined}>Yes</button>
    </>
  );
};
