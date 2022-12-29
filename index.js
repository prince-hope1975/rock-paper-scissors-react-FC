import React, { useEffect, useState } from "react";
import AppViews from "./views/AppViews";
import DeployerViews from "./views/DeployerViews";
import AttacherViews from "./views/AttacherViews";
import { renderDOM, useRenderView } from "./views/render";
import "./index.css";
import * as backend from "./build/index.main.mjs";
import { loadStdlib } from "@reach-sh/stdlib";
const reach = loadStdlib("ETH");
// import MyAlgoConnect from "@reach-sh/stdlib/ALGO_MyAlgoConnect";
// reach.setWalletFallback(
//   reach.walletFallback({
//     providerEnv: "TestNet",
//     MyAlgoConnect,
//   })
// );

const handToInt = { ROCK: 0, PAPER: 1, SCISSORS: 2 };
const intToOutcome = ["Bob wins!", "Draw!", "Alice wins!"];
const { standardUnit } = reach;
const defaults = {
  defaultFundAmt: "10",
  defaultWager: "3",
  standardUnit,
  acc: {},
  bal: "0",
  ContentView: <></>,
};

const App = () => {
  const [state, setState] = useState({
    view: "ConnectAccount",
    ...defaults,
  });

  async function handleMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    setState((prev) => ({ ...prev, acc, bal }));
    if (await reach.canFundFromFaucet()) {
      setState((prev) => ({ ...prev, view: "FundAccount" }));
    } else {
      setState((prev) => ({ ...prev, view: "DeployerOrAttacher" }));
    }
  }
  useEffect(() => {
    handleMount();
  }, []);

  async function fundAccount(fundAmount) {
    await reach.fundFromFaucet(state.acc, reach.parseCurrency(fundAmount));
    setState({ ...state, view: "DeployerOrAttacher" });
  }
  async function skipFundAccount() {
    setState({ ...state, view: "DeployerOrAttacher" });
  }
  function selectAttacher() {
    setState({ ...state, view: "Wrapper", ContentView: Attacher });
  }
  function selectDeployer() {
    setState({ ...state, view: "Wrapper", ContentView: Deployer });
  }
  const Comp = useRenderView(
    { selectAttacher, selectDeployer, skipFundAccount, fundAccount, state },
    AppViews
  );

  return <>{Comp}</>;
};

const usePlayer = ({ state, setState }) => {
  useEffect(() => {
    setState((prev) => ({
      playable: false,
      hand: "",
      outcome: "",
      resolveHandP: () => {},
      ...prev,
    }));
  }, []);
  function random() {
    return reach.hasRandom.random();
  }
  async function getHand() {
    const hand = await new Promise((resolveHandP) => {
      setState({ ...state, view: "GetHand", playable: true, resolveHandP });
    });
    setState({ ...state, view: "WaitingForResults", hand });
    return handToInt[hand];
  }
  function seeOutcome(i) {
    setState({ ...state, view: "Done", outcome: intToOutcome[i] });
  }
  function informTimeout() {
    setState({ ...state, view: "Timeout" });
  }
  function playHand(hand) {
    state.resolveHandP(hand);
  }

  return {
    random,
    getHand,
    seeOutcome,
    informTimeout,
    playHand,
  };
};
function Deployer(props) {
  const [state, setState] = useState({
    view: "SetWager",
    wager: "0",
    ctc: "",
    ctcInfoStr: "",
  });
  const player = usePlayer({ state, setState });

  function setWager(wager) {
    setState({ ...state, view: "Deploy", wager });
  }
  async function deploy() {
    const ctc = props.acc.contract(backend);
    setState({ ...state, view: "Deploying", ctc });
    let wager = reach.parseCurrency(state.wager); // UInt
    let deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector]; // UInt
    backend.Alice(ctc, { ...player, wager, deadline, setWager });
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    setState({ ...state, view: "WaitingForAttacher", ctcInfoStr });
  }
  const Comp = useRenderView(
    { ...player, state, setState, deploy, setWager },
    DeployerViews
  );
  return <>{Comp}</>;
}

function Attacher(props) {
  const [state, setState] = useState({
    view: "Attach",
    wager: "0",
  });
  const player = usePlayer({ state, setState });

  async function acceptWager(wagerAtomic) {
    const wager = reach.formatCurrency(wagerAtomic, 4);
    return await new Promise((resolveAcceptedP) => {
      setState({ view: "AcceptTerms", wager, resolveAcceptedP });
    });
  }
  function termsAccepted() {
    state.resolveAcceptedP(null);
    setState({ ...state, view: "WaitingForTurn" });
  }
  function attach(ctcInfoStr) {
    const ctc = props.acc.contract(backend, ctcInfoStr);
    setState({ ...state, view: "Attaching" });
    backend.Bob(ctc, {
      ...player,
      termsAccepted,
      acceptWager,
    
    });
  }
  const Comp = useRenderView(
    { termsAccepted, acceptWager, attach, state, setState, ...player },
    AttacherViews
  );

  return <>{Comp}</>;
}

renderDOM(<App />);
