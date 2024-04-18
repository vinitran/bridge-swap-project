import Web3 from 'web3';
import { useAppSelector } from '../hook/store.hook';
import { useEffect, useState } from 'react';
import { Data } from '../const/data';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { api } from '../api/api';
import { Chain } from './bridge.screen';
import { notify } from '../service/noti.service';

export interface Coin {
  name: string;
  address: string;
  icon: string;
}

export const FaunetScreen = () => {
  const [chain, setCurrentChain] = useState(Data.chain[0]);
  const [token, setToken] = useState<Coin>(Data.coin['97'][0]);
  const [isOpenCoin, setOpenCoin] = useState(false);
  const [isOpenChain, setOpenChain] = useState(false);
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    document.title = 'Faucet';
  });

  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const onSelectCoin = (coin: Coin) => {
    setToken(coin);
    setOpenCoin(false);
  };

  const onSelectChain = (chain: Chain) => {
    setCurrentChain(chain);
    setToken(Data.coin[chain.chainId][0]);
  };

  const onFaucet = () => {
    if (!address) {
      return;
    }

    api
      .post('/api/v1/faucet', {
        chain_id: chain.chainId,
        token: token.address,
        user_address: address,
      })
      .then(res => {
        if (res.data.code == 200) {
          notify('Success', 'success');
        } else notify('Error', 'error');
      });
  };

  return (
    <div className="w-full h-full justify-center flex bg-slate-900">
      <div className=" flex flex-row mt-6 items-center">
        <input
          className=" rounded-xl bg-slate-800 px-3 py-3 flex-1 caret-slate-100 outline-none mr-4 w-96 h-12 text-white"
          placeholder="Input your address..."
          onChange={onChangeAddress}
        />
        <div className="relative">
          <div
            className=" flex flex-row items-center rounded-lg bg-slate-800 h-12 mr-3 px-3 cursor-pointer w-44 justify-between "
            onClick={() => setOpenChain(!isOpenChain)}
          >
            <img
              src={chain.img}
              className=" w-6 h-6 rounded-full  mr-1 object-cover"
            />
            <div className=" text-white text-lg mr-2">{chain?.name}</div>
            {isOpenChain ? (
              <BsChevronUp color="white" />
            ) : (
              <BsChevronDown color="white" />
            )}
          </div>
          <div>
            {isOpenChain && (
              <div className="absolute pt-1">
                <div className=" rounded-lg overflow-hidden bg-slate-800">
                  {Data.chain.map(selectChain => {
                    return (
                      <div
                        className=" flex flex-row items-center bg-slate-800 h-12 px-3 cursor-pointer w-44"
                        onClick={() => onSelectChain(selectChain)}
                      >
                        <img
                          src={selectChain.img}
                          className=" w-6 h-6 rounded-full  mr-1 object-cover"
                        />
                        <div className=" text-white text-lg mr-6">
                          {selectChain.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <div
            className=" flex flex-row items-center rounded-lg bg-slate-800 h-12 mr-3 px-3 cursor-pointer w-28"
            onClick={() => setOpenCoin(!isOpenCoin)}
          >
            <img src={token.icon} className=" w-6 h-6 rounded-full  mr-1" />
            <div className=" text-white text-lg mr-2">{token.name}</div>
            {isOpenCoin ? (
              <BsChevronUp color="white" />
            ) : (
              <BsChevronDown color="white" />
            )}
          </div>
          <div>
            {isOpenCoin && (
              <div className="absolute pt-1">
                <div className=" absolute rounded-lg overflow-hidden bg-slate-800">
                  {Data.coin[chain.chainId].map(coin => {
                    return (
                      <div
                        className=" flex flex-row items-center bg-slate-800 h-12 px-3 cursor-pointer w-28"
                        onClick={() => onSelectCoin(coin)}
                      >
                        <img
                          src={coin.icon}
                          className=" w-6 h-6 rounded-full  mr-1"
                        />
                        <div className=" text-white text-lg mr-6">
                          {coin.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className=" bg-orange-600 h-12 justify-center items-center rounded-xl py-2 px-2 text-center text-white font-medium text-lg cursor-pointer"
          onClick={onFaucet}
        >
          Give me token
        </div>
      </div>
    </div>
  );
};
