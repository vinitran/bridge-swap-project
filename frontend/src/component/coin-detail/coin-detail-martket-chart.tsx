import axios from 'axios';
import { ISeriesApi, Time, createChart } from 'lightweight-charts';
import { Interval } from '../../const/interval.const';
import { useEffect, useRef, useState } from 'react';
import { chartProperties } from './lightweight-charts.config';

export const CoinDetailMarketChart = ({
  symbol,
  interval = Interval._1m,
  limit = 200,
}: {
  symbol?: string;
  interval?: Interval;
  limit?: number;
}) => {
  let candleSeries: ISeriesApi<'Candlestick', Time> | undefined = undefined;
  const domElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    candleSeries = undefined;
    if (domElement.current?.firstChild)
      domElement.current?.removeChild(domElement.current.firstChild);

    const timerInterval = setInterval(async () => {
      console.log('props:', [symbol, interval, limit]);
      await syncMarketChart(symbol, interval, limit);
    }, 2000);

    return () => clearInterval(timerInterval);
  }, [symbol, interval, limit]);

  const syncMarketChart = async (
    symbol: string | undefined,
    interval: string,
    limit: number,
  ) => {
    console.log(
      `start syncMarketChart: symbol=${symbol?.toUpperCase()}USDT&interval=${interval}&limit=${limit}`,
    );
    await axios(
      `https://api.binance.com/api/v3/klines?symbol=${symbol?.toUpperCase()}USDT&interval=${interval}&limit=${limit}`,
    )
      .then((res: any) => {
        const marketChartData = res.data.map((d: any) => {
          return {
            time: d[0] / 1000,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          };
        });
        if (marketChartData.length > 0 && !candleSeries && domElement.current) {
          const chart = createChart(domElement.current, chartProperties);
          candleSeries = chart.addCandlestickSeries();
          candleSeries.setData(marketChartData);
        } else if (marketChartData.length > 0 && candleSeries) {
          candleSeries.update(marketChartData[marketChartData.length - 1]);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <div className="relative w-full h-full">
        <div
          id="coin-detail-market-chart"
          className={'w-full h-full'}
          ref={domElement}
        ></div>
        <div
          className={`top-0 right-0 bottom-0 left-0  flex items-center justify-center absolute ${
            candleSeries ? 'hidden' : 'absolute'
          }`}
        >
          loading...
        </div>
      </div>
    </>
  );
};
