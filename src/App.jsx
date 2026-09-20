import React from 'react'
import './App.css'
import InstallGate from "./components/InstallGate";
import Menu from "./components/Menu";
import Setup from "./components/Setup";
import LudoGame from "./components/LudoGame";
import TapLudo from "./components/TapLudo";
import { useState } from 'react';

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;


export default function App() {

 const [screen, setScreen] = useState(isStandalone() ? "menu" : "install");
  const [players, setPlayers] = useState([]);
  const menu = () => setScreen("menu");


switch (screen) {
    case "install":
      return <InstallGate onDone={menu} />;
    case "setup":
      return (
        <Setup
          onBack={menu}
          onStart={(p) => {
            setPlayers(p);
            setScreen("game");
          }}
        />
      );
    case "game":
      return <LudoGame players={players} onExit={menu} onRematch={() => setScreen("setup")} />;
    case "tap":
      return <TapLudo onBack={menu} />;
    default:
      return <Menu onPick={setScreen} />;
  }
}
