import styles from "./Avatar.module.css";
import { useUser } from "./../../providers";
import { createEffect, createSignal, Switch, Match, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { getAuth } from "firebase/auth";

export const Avatar = () => {
  const { avatar, avaimg, usermenu, menuoption } = styles;
  const { userState, logout } = useUser();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const auth = getAuth();

  const handleOutsideClick = () => setMenuOpen(false);

  createEffect(() => {
    if (menuOpen()) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
  });

  return (
    <div class={avatar} onClick={() => setMenuOpen((m) => !m)}>
      <Switch>
        <Match when={userState().Avatar}>
          <img
            class={avaimg}
            src={userState().Avatar}
            alt={`${userState().Name}'s avatar image'`}
          />
        </Match>
        <Match when={!userState().Avatar}>
          {userState().Name.substring(0, 1)}
        </Match>
      </Switch>
      <Show when={menuOpen()}>
        <Portal>
          <div class={usermenu}>
            <Show when={userState().FamilyID?.length}>
              <button
                class={menuoption}
                onClick={() => {
                  // Construct an invitation url
                  const inviteUrl = `${window.location.origin}?fid=${
                    userState().FamilyID
                  }`;

                  if (navigator?.clipboard) {
                    // Copy the url with the navigator api
                    navigator.clipboard.writeText(inviteUrl);
                  } else {
                    // Try the fallback
                    const textArea = document.createElement("textarea");
                    textArea.value = inviteUrl;
                    textArea.style.top = "0";
                    textArea.style.left = "0";
                    textArea.style.position = "fixed";

                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                  }
                }}
              >
                Invite to {userState().FamilyName}
              </button>
            </Show>
            <button
              class={menuoption}
              onClick={() => {
                setMenuOpen(false);
                logout();
                auth.signOut();
              }}
            >
              Logout
            </button>
          </div>
        </Portal>
      </Show>
    </div>
  );
};
