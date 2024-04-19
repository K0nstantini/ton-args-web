import './App.css';
import { Header } from './components/Header';
import { StartDeal } from './components/StartDeal';
import { OpenedContract } from '@ton/core';
import { useEffect, useState } from 'react';
import { NewDeal } from './components/NewDeal';
import { ExistedDeal } from './components/ExistedDeal';
import Deal, { DealInfo } from './contracts/deal';
import { AppAppBar } from "./components/AppBar";
import '@twa-dev/sdk';
import { Help } from './components/Help';

enum AppState {
  Default,
  NewDeal,
  ExistedDeal,
  Help
};

function App() {
  const [appState, setAppState] = useState(AppState.Default);
  const [currentDeal, setCurrentDeal] = useState<[OpenedContract<Deal>, DealInfo] | null>(null);

  useEffect(() => {
    if (appState != AppState.ExistedDeal) {
      setCurrentDeal(null);
    }
  }, [appState]);

  const setExistedDeal = (contract: OpenedContract<Deal>, info: DealInfo) => {
    setCurrentDeal([contract, info]);
    setAppState(AppState.ExistedDeal);
  };

  return (
    <div className="app">
      <AppAppBar onHelpClick={() => setAppState(AppState.Help)} />
      <Header />
      <div className="body">
        {appState != AppState.Help && <StartDeal
          showNewDeal={appState != AppState.NewDeal}
          findDeal={setExistedDeal}
          newDeal={() => setAppState(AppState.NewDeal)}
        />
        }
        {appState == AppState.NewDeal && <NewDeal
          close={() => setAppState(AppState.Default)}
        />}
        {appState == AppState.ExistedDeal && currentDeal && <ExistedDeal
          deal={currentDeal[0]}
          dealInfo={currentDeal[1]}
          close={() => setAppState(AppState.Default)}
        />}
        {appState == AppState.Help && <Help
          close={() => setAppState(AppState.Default)} />
        }
      </div>
    </div>
  );
}

export default App

