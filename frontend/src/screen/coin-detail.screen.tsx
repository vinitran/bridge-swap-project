import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CoinMarketChartModel } from '../model/market-chart.model';
import { CoinInformation } from '../component/coin-detail/coin-information.component';
import { CoinDetail } from '../model/coin-detail.model';
import { CoinDetailMarketChart } from '../component/coin-detail/coin-detail-martket-chart';
import { Interval } from '../const/interval.const';

export interface MarketChartFilter {
  fixedPrice: number;
  currency: string;
  days: number;
  interval: Interval;
}

export const CoinDetailScreen = () => {
  const { paramId } = useParams();
  const [filter, setFilter] = useState<MarketChartFilter>({
    fixedPrice: 3,
    currency: 'usd',
    days: 0.1,
    interval: Interval._1m,
  });
  const [coinDetail, setCoinDetail] = useState<CoinDetail | undefined>();
  const [intervalMarketChart, setIntervalMarketChart] = useState<Interval>(
    Interval._1m,
  );

  useEffect(() => {
    getData();
  }, [filter]);

  const getData = async () => {
    const searchId = paramId ?? 'bella-protocol';
    // get detail
    await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${searchId}`,
      )
      .then(res => {
        setCoinDetail(
          new CoinDetail(
            res.data.id,
            res.data.symbol,
            res.data.name,
            res.data.market_cap_rank,
            Number(res.data.market_data.current_price?.[filter.currency]),
            res.data.image.large,
            res.data.market_data.price_change_percentage_24h,
            res.data.market_data.high_24h?.[filter.currency],
            res.data.market_data.low_24h?.[filter.currency],
            res.data.market_data.market_cap?.[filter.currency],
            res.data.market_data.fully_diluted_valuation?.[filter.currency],
            res.data.market_data.total_volume?.[filter.currency],
            res.data.market_data.total_value_locked?.[filter.currency],
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
  };

  const handleChangeFilter = (value: MarketChartFilter) => {
    setFilter(value);
  };

  return (
    <div className="page-height mt-[100px] mb-[4px] mx-[24px] text-[#DFE5EC] overflow-y-hidden">
      {coinDetail ? (
        <div className="page-container-height flex flex-row justify-between overflow-y-hidden">
          <div className="w-[400px] pr-[8px] mr-[8px] overflow-y-auto">
            <CoinInformation key={coinDetail.id} data={coinDetail} />
          </div>
          <div className="flex-1 flex flex-col items-center justify-between space-y-[8px]">
            <div className="flex flex-row justify-center space-x-[8px] rounded-[8px]">
              <div
                className={
                  'rounded-[8px] w-[45px] h-[28px] cursor-pointer text-center bg-[#704CE3]'
                }
                onClick={() => {
                  setIntervalMarketChart(Interval._1m);
                }}
              >
                1m
              </div>
              <div
                className={
                  'rounded-[8px] w-[45px] h-[28px] cursor-pointer text-center bg-[#704CE3]'
                }
                onClick={() => {
                  setIntervalMarketChart(Interval._1d);
                }}
              >
                1d
              </div>{' '}
              <div
                className={
                  'rounded-[8px] w-[45px] h-[28px] cursor-pointer text-center bg-[#704CE3]'
                }
                onClick={() => {
                  setIntervalMarketChart(Interval._1M);
                }}
              >
                1M
              </div>{' '}
              <div
                className={
                  'rounded-[8px] w-[45px] h-[28px] cursor-pointer text-center bg-[#704CE3]'
                }
                onClick={() => {
                  setIntervalMarketChart(Interval._1y);
                }}
              >
                1y
              </div>
            </div>
            <div className="flex-1 w-full h-[80%] p-[1px] bg-[#1B232D]">
              <CoinDetailMarketChart
                symbol={coinDetail.symbol}
                interval={intervalMarketChart}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>Coin not found</div>
      )}
    </div>
  );
};
