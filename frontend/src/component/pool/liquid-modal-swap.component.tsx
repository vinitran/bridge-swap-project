import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa6';
import { useAppSelector } from '../../hook/store.hook';
import Web3 from 'web3';
import { Data } from '../../const/data';
import { Coin } from '../../screen/faucet.screen';
import { useContract } from '../../hook/contract.hook';
import { IoMdClose } from 'react-icons/io';
import Swap from '../../const/swap.json';
import { notify } from '../../service/noti.service';
import { PropagateLoader } from 'react-spinners';

interface Props {
  onCloseModal: () => void;
}
export const LiquidModalSwap = ({ onCloseModal }: Props) => {
  const [token, setToken] = useState<Coin | undefined>();
  const [token2, setToken2] = useState<Coin | undefined>();
  const [chainId, setCurrentChainId] = useState<string | undefined>();
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  const [amount, setAmount] = useState<string | undefined>();
  const [amount2, setAmount2] = useState<string | undefined>();
  const [amountMin, setAmountMin] = useState<string | undefined>();
  const [amountMin2, setAmountMin2] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(false);

  const modalRef = useRef<any>();
  const walletAddress = useAppSelector(state => state.address);
  const [contractAddress, setContractAddress] = useState<undefined | string>();

  const { addLiquiditySwap } = useContract(
    walletAddress,
    contractAddress,
    Swap.abi,
  );

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const onChangeAmount2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount2(e.target.value);
  };

  const onChangeAmountMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountMin(e.target.value);
  };

  const onChangeAmountMin2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountMin2(e.target.value);
  };

  const handleCloseModal = () => {
    onCloseModal();
  };

  const getChainId = async () => {
    if (!walletAddress) {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3 = new Web3(window.ethereum);

        const chainId = await web3.eth.getChainId();
        setCurrentChainId(chainId.toString());
        setToken(Data.coin[chainId.toString()][0]);
        setToken2(Data.coin[chainId.toString()][1]);
        setContractAddress(
          Data.chain.find(chain => chain.chainId == chainId.toString())
            ?.bridgeContractAddress,
        );
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('Metamask not found.');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        getChainId();
      });
      window.ethereum.on('accountsChanged', () => {
        getChainId();
      });
    }
    getChainId();
  }, []);

  const onSelectCoin = (coin: Coin) => {
    setToken(coin);
    setOpen(false);
  };

  const onSelectCoin2 = (coin: Coin) => {
    setToken2(coin);
    setOpen2(false);
  };

  const onSubmit = () => {
    if (
      !walletAddress ||
      !contractAddress ||
      !token ||
      !amount ||
      !token2 ||
      !amount2 ||
      !amountMin ||
      !amountMin2 ||
      isLoading
    ) {
      return;
    }
    setLoading(true);
    addLiquiditySwap(
      token.address,
      token2?.address,
      amount,
      amount2,
      amountMin,
      amountMin2,
    )
      .then(() => {
        onCloseModal();
        notify('Transaction Success', 'success');
        setLoading(false);
      })
      .catch(e => {
        notify('Transaction Error', 'error');
        setLoading(false);
      });
  };

  return createPortal(
    <div
      ref={modalRef}
      className={` w-full h-full bg-black/10 z-40 fixed top-0 left-0 ease-in-out duration-300 transition-all`}
    >
      <div className="w-full h-full bg-slate-900/75 absolute z-10 items-center justify-center flex">
        <div className="rounded-2xl p-4 border-solid border-stone-300/0.5 bg-slate-900 border-2">
          <div className=" flex flex-row justify-between items-center relative mt-2 pt-2 mb-2">
            <div
              className=" absolute -right-3 -top-4 cursor-pointer"
              onClick={handleCloseModal}
            >
              <IoMdClose color="white" size={'1.5rem'} />
            </div>
          </div>
          <div className=" flex flex-row items-center">
            <div className=" relative">
              <div
                className=" mr-4 rounded-xl w-36 bg-slate-800 px-3 py-3 flex flex-row justify-between items-center cursor-pointer"
                onClick={() => setOpen(!isOpen)}
              >
                {token ? (
                  <>
                    <img
                      src={token.icon}
                      className=" h-6 w-6 rounded-full mr-1"
                    />
                    <div className=" text-white ml-3 mr-2">{token.name}</div>
                  </>
                ) : (
                  <div className=" text-white ml-3 mr-2">
                    Wrong Metamask network
                  </div>
                )}
                {isOpen && !!chainId ? (
                  <BsChevronUp color="white" size={'1rem'} />
                ) : (
                  <BsChevronDown color="white" size={'1rem'} />
                )}
              </div>
              {isOpen && !!chainId && (
                <div className=" absolute rounded-xl mt-2 overflow-hidden bg-slate-800">
                  {Data.coin[chainId].map(coin => {
                    return (
                      <div
                        className=" flex flex-row items-center bg-slate-800 h-12 px-3 cursor-pointer w-36"
                        onClick={() => onSelectCoin(coin)}
                      >
                        <img
                          src={coin.icon}
                          className=" h-6 w-6 rounded-full mr-7"
                        />
                        <div className=" text-white mr-6">{coin.name}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <input
              className=" rounded-xl bg-slate-800 px-3 py-3 flex-1 w-64 caret-slate-100 outline-none mr-2 text-white "
              placeholder="Amount Desired"
              onChange={onChangeAmount}
            />
            <input
              className=" rounded-xl bg-slate-800 px-3 py-3 flex-1 w-64 caret-slate-100 outline-none text-white "
              placeholder="Amount Min"
              onChange={onChangeAmountMin}
            />
          </div>
          <div className=" flex flex-row items-center mt-3">
            <div className=" relative">
              <div
                className=" mr-4 rounded-xl w-36 bg-slate-800 px-3 py-3 flex flex-row justify-between items-center cursor-pointer"
                onClick={() => setOpen2(!isOpen2)}
              >
                {token2 ? (
                  <>
                    <img
                      src={token2.icon}
                      className=" h-6 w-6 rounded-full mr-1"
                    />
                    <div className=" text-white ml-3 mr-2">{token2.name}</div>
                  </>
                ) : (
                  <div className=" text-white ml-3 mr-2">
                    Wrong Metamask network
                  </div>
                )}
                {isOpen2 && !!chainId ? (
                  <BsChevronUp color="white" size={'1rem'} />
                ) : (
                  <BsChevronDown color="white" size={'1rem'} />
                )}
              </div>
              {isOpen2 && !!chainId && (
                <div className=" absolute rounded-xl mt-2 overflow-hidden bg-slate-800">
                  {Data.coin[chainId].map(coin => {
                    return (
                      <div
                        className=" flex flex-row items-center bg-slate-800 h-12 px-3 cursor-pointer w-36"
                        onClick={() => onSelectCoin2(coin)}
                      >
                        <img
                          src={coin.icon}
                          className=" h-6 w-6 rounded-full mr-7"
                        />
                        <div className=" text-white mr-6">{coin.name}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <input
              className=" rounded-xl bg-slate-800 px-3 py-3 flex-1 w-64 caret-slate-100 outline-none mr-2 text-white "
              placeholder="Amount Desired"
              onChange={onChangeAmount2}
            />
            <input
              className=" rounded-xl bg-slate-800 px-3 py-3 flex-1 w-64 caret-slate-100 outline-none text-white"
              placeholder="Amount Min"
              onChange={onChangeAmountMin2}
            />
          </div>
          <div className=" flex flex-row justify-between">
            <div className=" flex flex-row items-center w-full mt-2">
              <div className=" font-normal text-white">3 months - </div>
              <div className=" font-normal text-green-600"> 1.5%</div>
            </div>
            <div className=" flex flex-row items-center justify-end w-full mt-2">
              <div className=" font-normal text-white">6 months - </div>
              <div className=" font-normal text-green-600"> 3.0%</div>
            </div>
            <div className=" flex flex-row items-center justify-end w-full mt-2">
              <div className=" font-normal text-white">9 months - </div>
              <div className=" font-normal text-green-600"> 4.5%</div>
            </div>
          </div>
          <div
            className=" w-full h-14 bg-orange-600 justify-center items-center rounded-xl py-3 mt-3 text-center text-white font-medium text-lg cursor-pointer"
            onClick={onSubmit}
          >
            {isLoading ? (
              <PropagateLoader color="white" className=" mt-2" />
            ) : (
              <div>Add liquidity</div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
