import { User } from "firebase/auth";
import { Switch, Match } from "solid-js";
import { Agenda, CreateFamily, JoinFamily } from "../";
import { useUser } from "./../../providers";

type FamilyProps = {
  User: User | any;
};

export const FamilySwitch = (props: FamilyProps) => {
  // Represents the current url
  const url = new URL(window.location.href);

  // Global state info
  const { userState } = useUser();

  return (
    <>
      <Switch>
        <Match when={url.searchParams.get("fid") && !userState().FamilyName}>
          <JoinFamily Fid={url.searchParams.get("fid")!} User={props.User} />
        </Match>
        <Match when={!userState().FamilyName}>
          <CreateFamily User={props.User} />
        </Match>
        <Match when={userState().FamilyName}>
          <Agenda />
        </Match>
      </Switch>
    </>
  );
};
