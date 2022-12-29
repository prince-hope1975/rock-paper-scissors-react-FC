import React, { useState } from "react";

const Wrapper = (props) => {
  const { content } = props;
  return (
    <div className="App">
      <header className="App-header" id="root">
        <h1>Rock, Paper, Scissors</h1>
        {content}
      </header>
    </div>
  );
};

const ConnectAccount = () => {
  return (
    <div>
      Please wait while we connect to your account. If this takes more than a
      few seconds, there may be something wrong.
    </div>
  );
};

const FundAccount = (props) => {
  const { bal, standardUnit, defaultFundAmt, parent } = props;
  const [state, setState] = useState({ amt: "0" });
  const amt = state.amt || defaultFundAmt;
  return (
    <div>
      <h2>Fund account</h2>
      <br />
      Balance: {bal} {standardUnit}
      <hr />
      Would you like to fund your account with additional {standardUnit}?
      <br />
      (This only works on certain devnets)
      <br />
      <input
        type="number"
        placeholder={defaultFundAmt}
        onChange={(e) => setState({ amt: e.currentTarget.value })}
      />
      <button onClick={() => parent.fundAccount(amt)}>Fund Account</button>
      <button onClick={() => parent.skipFundAccount()}>Skip</button>
    </div>
  );
};

const DeployerOrAttacher = (props) => {
  const { parent } = props;
  return (
    <div>
      Please select a role:
      <br />
      <p>
        <button onClick={() => parent.selectDeployer()}>Deployer</button>
        <br /> Set the wager, deploy the contract.
      </p>
      <p>
        <button onClick={() => parent.selectAttacher()}>Attacher</button>
        <br /> Attach to the Deployer's contract.
      </p>
    </div>
  );
};

export default { Wrapper, ConnectAccount, DeployerOrAttacher, FundAccount };
