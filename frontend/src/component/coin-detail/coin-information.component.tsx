import { CoinDetail } from '../../model/coin-detail.model';
import Slider from '@mui/material/Slider';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { formatPrice } from '../../utils';

export const CoinInformation = ({ data }: { data: CoinDetail }) => {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#704CE3' : '#534CF7',
    },
  }));

  return (
    <div className="flex flex-col space-y-[16px] text-[14px] w-full">
      {/* Coin Analysis */}
      <div className="flex flex-col space-y-[4px]">
        <div className="flex flex-row items-center space-x-[5px]">
          <div className="w-[40px] h-[40px]">
            <img src={data.image} alt="--" />
          </div>
          <div className="text-[16px] font-bold">{data.name}</div>
          <div className="text-[14px]">- {data.symbol?.toUpperCase()}</div>
          <div className="text-[12px] text-gray-400">#{data.rank}</div>
        </div>

        <div className="flex flex-row items-center space-x-1">
          <div className="text-[36px] font-bold">${data.price}</div>
          <div
            className={
              'text-[18px] font-bold ' +
              ((data.priceChangePercentage24h ?? 0) < 0
                ? 'text-red-500'
                : 'text-green-500')
            }
          >
            {(data.priceChangePercentage24h ?? 0) < 0
              ? `${data.priceChangePercentage24h}`
              : `+${data.priceChangePercentage24h}`}
            %
          </div>
        </div>

        <div className="flex flex-col space-y-[4px]">
          <BorderLinearProgress
            variant="determinate"
            value={
              (((data.price ?? 0) - (data.low24h ?? 0)) * 100) /
              ((data.high24h ?? 0) - (data.low24h ?? 0))
            }
          />
          <div className="flex flex-row justify-between text-[12px] font-[600]">
            <div>${data.low24h}</div>
            <div>Price in 24h</div>
            <div>${data.high24h}</div>
          </div>
        </div>
      </div>

      {/* Coin Trading */}
      <div className="flex flex-col space-y-[8px]">
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">Market Cap</div>
          <div className="font-[600]">${formatPrice(data.marketCap)}</div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">
            Fully Diluted Valuation
          </div>
          <div className="font-[600]">
            ${formatPrice(data.fullyDilutedValuation)}
          </div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">24 Hour Trading Vol </div>
          <div className="font-[600]">
            ${formatPrice(data.volumnTrading24h)}
          </div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">
            Total Value Locked (TVL)
          </div>
          <div className="font-[600]">
            ${formatPrice(data.totalValueLocked)}
          </div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">Circulating Supply</div>
          <div className="font-[600]">
            ${formatPrice(data.circulatingSupply)}
          </div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">Total Supply </div>
          <div className="font-[600]">${formatPrice(data.totalSupply)}</div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
        <div className="flex flex-row justify-between">
          <div className="font-[500] text-[#9EB0C7]">Max Supply</div>
          <div className="font-[600]">${formatPrice(data.maxSupply)}</div>
        </div>
        <div className="h-[1px] bg-gray-700"></div>
      </div>

      {/* Coin Information */}
      <div className="flex flex-col space-y-[8px]">
        <div className="text-[18px] font-[700]">Info</div>
        <div className="flex flex-row items-center justify-between pb-[8px] border-b-[1px] border-b-solid border-b-gray-700">
          <div className="font-[500] text-[#9EB0C7]">Website</div>
          <a
            className="font-[600] text-[12px] text-center leading-[16px] align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] hover:bg-[rgb(56,74,97)] cursor-pointer rounded-[8px]"
            href={data.coinInformation?.website?.site}
          >
            <div>{data.coinInformation?.website?.name}</div>
          </a>
        </div>
        <div className="flex flex-row items-center justify-between pb-[8px] border-b-[1px] border-b-solid border-b-gray-700">
          <div className="font-[500] text-[#9EB0C7]">Community</div>
          <div className="flex flex-row space-x-[4px]">
            <a
              className="font-[600] text-[12px] text-center align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] hover:bg-[rgb(56,74,97)] cursor-pointer rounded-[8px]"
              href={data.coinInformation?.community?.twitter}
            >
              <div className="flex flex-row space-x-[2px] items-center ">
                <span className="h-[12px] w-[12px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      fill="#ffffff"
                      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                    />
                  </svg>
                </span>
                <div className="leading-[16px]">Twitter</div>
              </div>
            </a>
            <a
              className="font-[600] text-[12px] text-center leading-[16px] align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] hover:bg-[rgb(56,74,97)] cursor-pointer rounded-[8px]"
              href={data.coinInformation?.community?.telegram}
            >
              <div className="flex flex-row space-x-[2px] items-center ">
                <span className="mt-[1px] h-[12px] w-[12px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                    <path
                      fill="#ffffff"
                      d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                    />
                  </svg>
                </span>
                <div className="leading-[16px]">Telegram</div>
              </div>
            </a>
            <a
              className="font-[600] text-[12px] text-center leading-[16px] align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] hover:bg-[rgb(56,74,97)] cursor-pointer rounded-[8px]"
              href={data.coinInformation?.community?.discord}
            >
              <div className="flex flex-row space-x-[2px] items-center ">
                <span className="mt-[4px] h-[12px] w-[12px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path
                      fill="#ffffff"
                      d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
                    />
                  </svg>
                </span>
                <div className="leading-[15px]">Discord</div>
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between pb-[8px] border-b-[1px] border-b-solid border-b-gray-700">
          <div className="font-[500] text-[#9EB0C7]">Search on</div>
          <a
            className="font-[600] text-[12px] text-center align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] hover:bg-[rgb(56,74,97)] cursor-pointer rounded-[8px]"
            href={data.coinInformation?.searchOn}
          >
            <div className="flex flex-row space-x-[2px] items-center ">
              <span className="mt-[1px] h-[12px] w-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#ffffff"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  />
                </svg>
              </span>
              <div className="leading-[16px]">Twitter</div>
            </div>
          </a>
        </div>
        <div className="flex flex-row items-center justify-between pb-[8px] border-b-[1px] border-b-solid border-b-gray-700">
          <div className="font-[500] text-[#9EB0C7]">API ID</div>
          <a className="font-[600] text-[12px] text-center align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] rounded-[8px]">
            <div className="flex flex-row space-x-[2px] items-center ">
              <div className="leading-[16px]">
                {data.coinInformation?.apiId}
              </div>
            </div>
          </a>
        </div>
        <div className="flex flex-row items-center justify-between pb-[8px] border-b-[1px] border-b-solid border-b-gray-700">
          <div className="font-[500] text-[#9EB0C7]">Chains</div>
          <div className='flex flex-row space-x-[4px]'>
          {data.coinInformation?.chains?.map((chain, index) => {
            return (
              index < 3 && chain && (
                <a
                  className="font-[600] text-[12px] text-center align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] rounded-[8px]"
                  href={chain?.site}
                >
                  <div className="flex flex-row space-x-[2px] items-center ">
                    <div className="leading-[16px]">{chain?.name}</div>
                  </div>
                </a>
              )
            );
          })}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between pb-[8px] border-b-[1px] border-b-solid border-b-gray-700">
          <div className="font-[500] text-[#9EB0C7]">Categories</div>
          <div className='flex flex-row space-x-[4px]'>
          {data.coinInformation?.categories?.map((category, index) => {
            return (
              index < 1 && category && (
                <a key={index}
                  className="font-[600] text-[12px] text-center align-middle h-[28px] px-[10px] py-[6px] bg-[rgb(33,45,59)] rounded-[8px]"
                >
                  <div className="flex flex-row space-x-[2px] items-center ">
                    <div className="leading-[16px]">{category}</div>
                  </div>
                </a>
              )
            );
          })}
          </div>
       </div>
      </div>
    </div>
  );
};
