import React from "react";
// Player views must be extended.
// It does not have its own Wrapper view.

const GetHand = (props) => {
  const { parent, playable, hand } = props;
  return (
    <div>
      {hand ? "It was a draw! Pick again." : ""}
      <br />
      {!playable ? "Please wait..." : ""}
      <br />
      <button disabled={!playable} onClick={() => parent.playHand("ROCK")}>
        Rock
      </button>
      <button disabled={!playable} onClick={() => parent.playHand("PAPER")}>
        Paper
      </button>
      <button disabled={!playable} onClick={() => parent.playHand("SCISSORS")}>
        Scissors
      </button>
    </div>
  );
};

const WaitingForResults = () => {
  return <div>Waiting for results...</div>;
};

const Done = (props) => {
  const { outcome } = props;
  return (
    <div>
      Thank you for playing. The outcome of this game was:
      <br />
      {outcome || "Unknown"}
    </div>
  );
};

const Timeout = () => {
  return <div>There's been a timeout. (Someone took too long.)</div>;
};


export default { Timeout, Done, WaitingForResults, GetHand };
