import './App.css';
import { Header } from './components/Header';
import { TonConnectBtn } from './components/TonConnect';
import { StartDeal } from './components/StartDeal';

function App() {

  return (
    <div>
      <Header />
      <TonConnectBtn />
      <StartDeal
        findDeal={e => ()}
        newDeal={}
      />
    </div>
  );
}

export default App

