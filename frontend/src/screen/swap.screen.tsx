import { CgArrowsExchangeAltV } from 'react-icons/cg';

import { InputToken } from '../component/swap/input-token.component';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../hook/store.hook';
import { BehaviorSubject } from 'rxjs';
import SwapAbi from '../const/swap.json';
import { useContract } from '../hook/contract.hook';
import { Data } from '../const/data';
import { useToken } from '../hook/token.hook';
import { Coin } from './faucet.screen';
import Web3 from 'web3';
import { PropagateLoader } from 'react-spinners';
import { notify } from '../service/noti.service';

interface Props {
  sidebarSubject: BehaviorSubject<boolean>;
}

export const SwapScreen = ({ sidebarSubject }: Props) => {
  const data = Data.coin['5555'].map(coin => {
    return coin.name == 'XCR'
      ? { ...coin, address: '0x86d0f20e305BA901cc9035Ce2Bf19C2807cc3cf2' }
      : coin;
  });

  const walletAddress = useAppSelector(state => state.address);
  const {
    currentChainId,
    changeNetwork,
    getAmountSwap,
    swapForToken,
    swapForCoin,
  } = useContract(
    walletAddress,
    '0xf988aa295bc1feddbcf4c567e855945d1c6a0619',
    SwapAbi.abi,
  );
  const [tokenIn, setTokenIn] = useState(data[1]);
  const [tokenOut, setTokenOut] = useState<Coin>();
  const [amountIn, setAmountIn] = useState<string>();
  const [amountOut, setAmountOut] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const [isLoading, setLoading] = useState(false);

  const {
    getWalletTokenAmount,
    getAmountCanTranfer,
    approveAmountTransfer,
    tokenBalance,
  } = useToken(walletAddress, tokenIn.address);

  useEffect(() => {
    document.title = 'Swap';
  });

  const changeCurrentNetwork = () => {
    changeNetwork(Data.chain[1]);
  };

  const getSubmitButton = () => {
    if (!walletAddress) {
      return (
        <div
          className=" mt-2 w-full py-3 text-center bg-orange-500/90 rounded-xl text-white font-medium text-xl cursor-pointer"
          onClick={() => {
            sidebarSubject.next(true);
          }}
        >
          Connect wallet
        </div>
      );
    }

    if (currentChainId?.toString() != '5555') {
      return (
        <div
          className=" mt-2 w-full py-3 text-center bg-orange-500/90 rounded-xl text-white font-medium text-xl cursor-pointer"
          onClick={changeCurrentNetwork}
        >
          Change Metamask network
        </div>
      );
    }

    if (!tokenOut || tokenIn.address == tokenOut.address) {
      return (
        <div className=" mt-2 w-full py-3 text-center bg-orange-500/90 rounded-xl text-white font-medium text-xl cursor-pointer">
          Select token
        </div>
      );
    }

    if (!amountIn) {
      return (
        <div className=" mt-2 w-full py-3 text-center bg-orange-500/90 rounded-xl text-white font-medium text-xl cursor-pointer">
          Enter amount
        </div>
      );
    }
    if ((!balance && !tokenBalance) || !amountOut) {
      return;
    }
    return (
      <div
        className=" mt-2 w-full h-14 py-3 text-center bg-orange-500/90 rounded-xl text-white font-medium text-xl cursor-pointer"
        onClick={onSwap}
      >
        {isLoading ? (
          <PropagateLoader color="white" className=" mt-2" />
        ) : (
          <div>Swap</div>
        )}
      </div>
    );
  };

  const onSwap = async () => {
    const contractTranferAdd = '0xf988aa295bc1feddbcf4c567e855945d1c6a0619';
    const allowanceAmount = await getAmountCanTranfer(
      contractTranferAdd as string,
    );
    if (+(allowanceAmount || 0) < +(amountIn || 0) && tokenIn.name == 'VINI') {
      await approveAmountTransfer(
        contractTranferAdd as string,
        amountIn ?? '0',
      );
    }

    setLoading(true);
    if (tokenOut?.name == 'VINI') {
      swapForToken(
        amountIn as string,
        amountOut as string,
        tokenIn.address,
        tokenOut?.address as string,
      )
        .then(res => {
          setLoading(false);
          notify('Transaction Success', 'success');
        })
        .catch(e => {
          setLoading(false);
          notify('Transaction Error', 'error');
        });
    } else {
      swapForCoin(
        amountIn as string,
        amountOut as string,
        tokenIn.address,
        tokenOut?.address as string,
      )
        .then(res => {
          setLoading(false);
          notify('Transaction Success', 'success');
        })
        .catch(e => {
          setLoading(false);
          notify('Transaction Error', 'error');
        });
    }
  };

  const getBalance = async () => {
    const timeout = setTimeout(() => {
      if (tokenIn.name != 'VINI') {
        const web3 = new Web3(window.ethereum);
        web3.eth
          .getBalance(walletAddress)
          .then(balance => setBalance(web3.utils.fromWei(balance, 'ether')));
      } else {
        //getWalletTokenAmount().then(balance => setBalance(balance));
      }
      clearTimeout(timeout);
    }, 3000);
  };

  const getAmount = () => {
    const timeout = setTimeout(() => {
      getAmountSwap(
        amountIn as string,
        tokenIn.address,
        tokenOut?.address as string,
      ).then(amount => {
        setAmountOut(amount);
      });

      clearTimeout(timeout);
    }, 3000);
  };

  useEffect(() => {
    if (!walletAddress || currentChainId?.toString() != '5555') {
      return;
    }

    getBalance();
  }, [walletAddress, currentChainId, tokenIn.address]);

  useEffect(() => {
    if (
      !walletAddress ||
      currentChainId?.toString() != '5555' ||
      !amountIn ||
      !tokenOut?.address
    ) {
      return;
    }

    getAmount();
  }, [
    walletAddress,
    currentChainId,
    tokenIn.address,
    tokenOut?.address,
    amountIn,
  ]);

  return (
    <div className="w-full h-full items-center justify-center flex bg-slate-900">
      <div className="border-solid border-2 border-stone-500 rounded-2xl self-center w-fit m-0 p-4">
        <InputToken
          token={tokenIn}
          setCoin={setTokenIn}
          amount={amountIn}
          setAmount={setAmountIn}
          balance={tokenIn.name != 'VINI' ? balance : tokenBalance}
          data={data}
        />
        <div className="w-full items-center flex justify-center">
          <div className=" p-1 items-center justify-center mt-3 bg-gray-800 w-fit rounded-lg">
            <CgArrowsExchangeAltV color="white" className="w-8 h-8" />
          </div>
        </div>
        <InputToken
          token={tokenOut}
          setCoin={setTokenOut}
          amount={amountOut}
          data={data}
        />
        {getSubmitButton()}
      </div>
    </div>
  );
};
