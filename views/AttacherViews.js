import React, { useState } from "react";
import PlayerViews from "./PlayerViews";

const exports = { ...PlayerViews };

const Wrapper = (props) => {
  const { content } = props;
  return (
    <div className="Attacher">
      <h2>Attacher (Bob)</h2>
      {content}
    </div>
  );
};

const Attach = (props) => {
  const [state, setState] = useState();
  const { parent } = props;
  const { ctcInfoStr } = state || {};
  return (
    <div>
      Please paste the contract info to attach to:
      <br />
      <textarea
        spellCheck="false"
        className="ContractInfo"
        onChange={(e) =>
          setState({ ...state, ctcInfoStr: e.currentTarget.value })
        }
        placeholder="{}"
      />
      <br />
      <button disabled={!ctcInfoStr} onClick={() => parent.attach(ctcInfoStr)}>
        Attach
      </button>
    </div>
  );
};

const Attaching = () => {
  return <div>Attaching, please wait...</div>;
};

const AcceptTerms = (props) => {
  const [state, setState] = useState();
  const { wager, standardUnit, parent } = props;
  const { disabled } = state || {};
  return (
    <div>
      The terms of the game are:
      <br /> Wager: {wager} {standardUnit}
      <br />
      <button
        disabled={disabled}
        onClick={() => {
          setState({ ...state, disabled: true });
          parent.termsAccepted();
        }}
      >
        Accept terms and pay wager
      </button>
    </div>
  );
};

const WaitingForTurn = () => {
  return (
    <div>
      Waiting for the other player...
      <br />
      Think about which move you want to play.
    </div>
  );
};

export default {
  ...exports,
  WaitingForTurn,
  AcceptTerms,
  Attach,
  Attaching,
  Wrapper,
};
