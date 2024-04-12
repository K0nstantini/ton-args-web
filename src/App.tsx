import './App.css';
import { Header } from './components/Header';
import { TonConnectBtn } from './components/TonConnect';
import { StartDeal } from './components/StartDeal';
import { Address } from '@ton/core';

function App() {


  const findDeal = (addr: Address) => {
  };

  const newDeal = () => {
  };

  return (
    <div>
      <Header />
      <TonConnectBtn />
      <StartDeal
        findDeal={findDeal}
        newDeal={newDeal}
      />
    </div>
  );
}

export default App

