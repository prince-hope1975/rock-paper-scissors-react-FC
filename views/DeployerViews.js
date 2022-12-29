import React, {  useState } from "react";
import PlayerViews from "./PlayerViews";

const exports = { ...PlayerViews };

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const Wrapper = (props) => {
  const { content } = props;
  return (
    <div className="Deployer">
      <h2>Deployer (Alice)</h2>
      {content}
    </div>
  );
};

const SetWager = (props) => {
  const { parent, defaultWager, standardUnit } = props;
  const [state, setState] = useState();
  const wager = (state || {}).wager || defaultWager;
  return (
    <div>
      <input
        type="number"
        placeholder={defaultWager}
        onChange={(e) => setState({ ...state, wager: e.currentTarget.value })}
      />{" "}
      {standardUnit}
      <br />
      <button onClick={() => parent.setWager(wager)}>Set wager</button>
    </div>
  );
};

const Deploy = (props) => {
  const { parent, wager, standardUnit } = props;
  return (
    <div>
      Wager (pay to deploy): <strong>{wager}</strong> {standardUnit}
      <br />
      <button onClick={() => parent.deploy()}>Deploy</button>
    </div>
  );
};

const Deploying = () => {
  return <div>Deploying... please wait.</div>;
};

const WaitingForAttacher = (props) => {
  async function copyToClipborad(button) {
    const { ctcInfoStr } = props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = "Copied!";
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }
  const { ctcInfoStr } = props;
  return (
    <div>
      Waiting for Attacher to join...
      <br /> Please give them this contract info:
      <pre className="ContractInfo">{ctcInfoStr}</pre>
      <button onClick={(e) => copyToClipborad(e.currentTarget)}>
        Copy to clipboard
      </button>
    </div>
  );
};

export default {
  ...exports,
  Wrapper,
  SetWager,
  Deploy,
  Deploying,
  WaitingForAttacher,
};
