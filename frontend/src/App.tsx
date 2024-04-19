import './App.css';
import { SwapScreen } from './screen/swap.screen';
import { PoolScreen } from './screen/pool.screen';
import { Header } from './component/common/header.component';
import { Sidebar } from './component/common/right-side-bar.component';
import { BehaviorSubject } from 'rxjs';
import { Routes, Route } from 'react-router-dom';
import { Token } from './screen/tokens.screen';
import { Bridge } from './screen/bridge.screen';
import { FaunetScreen } from './screen/faucet.screen';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notificationObservable } from './service/noti.service';
import { toast } from 'react-toastify';
import { CoinDetailScreen } from './screen/coin-detail.screen';

function App() {
  const sidebarListener = new BehaviorSubject(false);
  const sidebarListener$ = sidebarListener.asObservable();

  useEffect(() => {
    const subscription = notificationObservable.subscribe((data: any) => {
      toast(data.message, {
        type: data.type,
        theme: 'light',
        autoClose: 5000,
        closeOnClick: true,
        position: 'top-right',
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      className="w-full h-screen box-border m-0 p-0 scroll-smooth bg-slate-900"
      id="home"
    >
      <ToastContainer />
      <Header sidebarSubject={sidebarListener} />
      <Sidebar listener={sidebarListener$} />
      <div className=" overflow-y-hidden max-h-full h-full">
        <Routes>
          <Route
            path="/"
            element={<Bridge sidebarSubject={sidebarListener} />}
          />
          <Route
            path="/swap"
            element={<SwapScreen sidebarSubject={sidebarListener} />}
          />
          <Route
            path="/pool"
            element={<PoolScreen sidebarSubject={sidebarListener} />}
          />
          <Route path="/tokens" element={<Token />} />
          <Route path="/coin-detail/:paramId" element={<CoinDetailScreen />} />
          <Route path="/faucet" element={<FaunetScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
