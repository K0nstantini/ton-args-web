import './App.css';
import { Header } from './components/Header';
import { StartDeal } from './components/StartDeal';
import { OpenedContract } from '@ton/core';
import { useEffect, useState } from 'react';
import { NewDeal } from './components/NewDeal';
import { ExistedDeal } from './components/ExistedDeal';
import Deal, { DealInfo } from './contracts/deal';
import { AppAppBar } from './components/AppBar';

function App() {
  const [newDeal, setNewDeal] = useState(false);
  const [findDeal, setFindDeal] = useState<[OpenedContract<Deal>, DealInfo] | null>(null);

  useEffect(() => {
    if (newDeal) {
      setFindDeal(null);
    }
  }, [newDeal]);

  useEffect(() => {
    if (findDeal) {
      setNewDeal(false);
    }
  }, [findDeal]);

  return (
    <div className="app">
      <AppAppBar />
      <Header />
      <div className="body">
        <StartDeal
          showNewDeal={!newDeal}
          findDeal={(c, i) => setFindDeal([c, i])}
          newDeal={() => setNewDeal(true)}
        />
        {newDeal && <NewDeal
          close={() => setNewDeal(false)}
        />}
        {findDeal && <ExistedDeal
          deal={findDeal[0]}
          dealInfo={findDeal[1]}
          close={() => setFindDeal(null)}
        />}
      </div>
    </div>
  );
}

export default App

