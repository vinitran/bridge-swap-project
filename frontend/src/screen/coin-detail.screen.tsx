import { useState } from 'react';
import { useParams } from 'react-router-dom';

import moment from 'moment';
import axios from 'axios';
import { CoinMarketChartModel } from '../model/market-chart.model';
import { CoinMarketChart } from '../component/coin-detail/coin-market-chart.component';
import { CoinInformation } from '../component/coin-detail/coin-information.component';
import { CoinDetail } from '../model/coin-detail.model';
import { MarketChartFilterDays } from '../const/coin-detail.const';

export interface MarketChartFilter {
  fixedPrice: number;
  currency: string;
  days: number;
}

export const CoinDetailScreen = () => {
  const { paramId } = useParams();
  const [filter, setFilter] = useState<MarketChartFilter>({
    fixedPrice: 3,
    currency: 'usd',
    days: 1,
  });
  const [marketChartData, setMarketChartData] = useState<
    CoinMarketChartModel[]
  >([]);
  const [coinDetail, setCoinDetail] = useState<CoinDetail | undefined>();

  //   const timerInterval = setInterval(() => {
  //     // getData();

  //     console.log('now: ', moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
  //     // console.log("timerInterval", timerInterval);
  //     // console.log("data", data);
  //   }, 5000);

  const getData = async () => {
    const searchId = 'bella-protocol';
    // const searchId = paramId ?? 'bella-protocol';
    console.log('paramId', paramId);
    console.log('paramId', searchId);
    // get detail
    await axios
      .get(`https://api.coingecko.com/api/v3/coins/${searchId}`)
      .then(res => {
        setCoinDetail(
          new CoinDetail(
            res.data.id,
            res.data.symbol,
            res.data.name,
            res.data.market_cap_rank,
            Number(res.data.market_data.current_price[filter.currency]),
            res.data.image.large,
            res.data.market_data.price_change_percentage_24h,
            res.data.market_data.high_24h[filter.currency],
            res.data.market_data.low_24h[filter.currency],
            res.data.market_data.market_cap[filter.currency],
            res.data.market_data.fully_diluted_valuation[filter.currency],
            res.data.market_data.total_volume[filter.currency],
            res.data.market_data.total_value_locked[filter.currency],
            res.data.market_data.circulating_supply,
            res.data.market_data.total_supply,
            res.data.market_data.max_supply,
            {
              website: {
                name:
                  String(res.data.links.homepage[0]).split('://').length > 0
                    ? String(res.data.links.homepage)
                        .split('://')[1]
                        .split('/')[0]
                    : '',
                site: String(res.data.links.homepage[0]),
              },
              community: {
                discord: res.data.links.chat_url[0],
                twitter:
                  'https://twitter.com/' + res.data.links.twitter_screen_name,
                telegram:
                  'https://web.telegram.org/k/#@' +
                  res.data.links.telegram_channel_identifier,
              },
              searchOn: 'https://twitter.com/search?q=$' + res.data.symbol,
              apiId: res.data.id,
              chains: res.data.links.blockchain_site.map(
                (item: string | undefined) => {
                  if (item) {
                    return {
                      name: item.split('.com')[0].split('/')[2],
                      site: item,
                    };
                  }
                },
              ),
              categories: res.data.categories,
            },
          ),
        );
      });

    // get martket chart
    await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${searchId}/market_chart?vs_currency=${filter.currency}&days=${filter.days}`,
      )
      .then(async res => {
        await setMarketChartData(
          res.data.prices.map((price: [number, number], index: number) => {
            return {
              date: moment(price[0]).format('HH:mm'),
              price: Number(price[1]).toFixed(3),
              volumn: Number(res.data.total_volumes[index][1]).toFixed(0),
            };
          }),
        );

        console.log('marketChartData:', marketChartData);
        console.log('marketChartData.length:', marketChartData.length);
      });
  };

  const handleChangeFilter = async (value: MarketChartFilter) => {
    await setFilter(value);
    console.log('value:', value);
    console.log('filter:', filter);
    getData();
  };

  return (
    <div className="pt-[100px] px-[24px] text-[#DFE5EC]">
      {coinDetail ? (
        <div className="flex flex-row space-x-[24px] justify-between">
          <div className="overflow-y-auto overflow-x-hidden">
            <CoinInformation data={coinDetail} />
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="w-[60%] flex flex-row justify-center space-x-[8px] rounded-[8px]">
              {MarketChartFilterDays.getList().map(item => (
                <div
                  className={
                    'rounded-[8px] w-[45px] h-[28px] cursor-pointer text-center bg-[#704CE3]'
                  }
                  onClick={() =>
                    handleChangeFilter({
                      ...filter,
                      days: item?.value ?? 1,
                    })
                  }
                >
                  {item?.label}
                </div>
              ))}
            </div>
            <CoinMarketChart datas={marketChartData} />
          </div>
        </div>
      ) : (
        <div>Coin not found</div>
      )}
      <button onClick={getData}>Sync data</button>
    </div>
  );
};
