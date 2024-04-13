import './App.css';
import { Header } from './components/Header';
import { TonConnectBtn } from './components/TonConnect';
import { StartDeal } from './components/StartDeal';
import { Address } from '@ton/core';
import { useState } from 'react';
import { NewDeal } from './components/NewDeal';
import { useTonConnect } from './hooks/useTonConnect';

function App() {
  const { sender, connected } = useTonConnect();
  const [newDeal, setNewDeal] = useState(false);
  const [findDeal, setFindDeal] = useState<Address | null>();

  return (
    <div>
      <Header />
      <TonConnectBtn />
      <StartDeal
        showNewDeal={!newDeal}
        findDeal={a => setFindDeal(a)}
        newDeal={() => setNewDeal(true)}
      />
      {newDeal && <NewDeal
        close={() => setNewDeal(false)}
      />}
    </div>
  );
}

export default App

