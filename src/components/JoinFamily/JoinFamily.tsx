export const JoinFamily = () => {
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
