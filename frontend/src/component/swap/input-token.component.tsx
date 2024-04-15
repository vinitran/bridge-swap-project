import { useState } from 'react';
import { Coin } from '../../screen/faunet.screen';
import { Data } from '../../const/data';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

interface Props {
  token?: Coin;
  setCoin: (coin: Coin) => void;
  amount?: string;
  setAmount?: (amount: string) => void;
  balance?: string;
  data: Coin[];
}

export const InputToken = ({
  token,
  setAmount,
  setCoin,
  amount,
  balance,
  data,
}: Props) => {
  const [modalVisble, setModalVisble] = useState(false);

  const setModalVisbleState = (visble: boolean) => {
    setModalVisble(visble);
  };

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount?.(e.target.value);
  };

  const onSelectCoin = (coin: Coin) => {
    setCoin(coin);
    setModalVisble(false);
  };

  return (
    <>
      <div className="w-96 bg-slate-800 rounded-xl border-solid border-2 border-slate-700 mt-3">
        <div className="p-4 flex flex-row items-center">
          {!setAmount ? (
            <div className="bg-transparent text-xl outline-none caret-slate-100 text-slate-100 flex-1">
              {!amount ? 0 : Number(amount).toFixed(8)}
            </div>
          ) : (
            <input
              type="text"
              placeholder="0"
              className="bg-transparent text-xl outline-none caret-slate-100 text-slate-100 flex-1 flex-shrink"
              value={amount}
              onChange={onChangeAmount}
              disabled={!setAmount}
            />
          )}
          <div className=" relative">
            <div
              className="rounded-full flex flex-row items-center bg-orange-600 p-2 cursor-pointer text-white font-medium"
              onClick={() => setModalVisbleState(!modalVisble)}
            >
              {token?.name ? (
                <>
                  <img
                    src={token.icon}
                    className=" w-6 h-6 rounded-full mr-2"
                  />
                  <div>{token.name}</div>
                </>
              ) : (
                <div>Select token</div>
              )}
              {modalVisble ? (
                <BsChevronUp color="white" />
              ) : (
                <BsChevronDown color="white" />
              )}
            </div>
            {modalVisble && (
              <div className=" absolute left-1/2 -translate-x-1/2 w-28 rounded-lg border border-slate-400 bg-slate-700 max-h-48 overflow-y-scroll cursor-pointer z-50">
                {data.map(chain => {
                  return (
                    <div
                      className=" flex flex-row items-center px-3 py-4 cursor-pointer"
                      onClick={() => onSelectCoin(chain)}
                    >
                      <img
                        src={chain.icon}
                        className=" w-6 h-6 rounded-full mr-2"
                      />
                      <p className=" ml-2 font-medium text-lg text-white">
                        {chain.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {balance && (
          <div className=" text-slate-400 mr-10 pr-4 mb-2 w-full text-right">
            Balance: {Number(balance).toFixed(8)}
          </div>
        )}
      </div>
    </>
  );
};
