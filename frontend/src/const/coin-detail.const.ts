enum MarketChartFilterDays {
  _24h = 1,
  _7d = 7,
  _30d = 30,
  _1y = 365,
}

namespace MarketChartFilterDays {
  export function getList(): Partial<
    { key: string; value: number; label: string }[]
  > {
    return [
      {
        key: MarketChartFilterDays[MarketChartFilterDays._24h],
        value: MarketChartFilterDays._24h,
        label: '24h',
      },
      {
        key: MarketChartFilterDays[MarketChartFilterDays._7d],
        value: MarketChartFilterDays._7d,
        label: '7d',
      },
      {
        key: MarketChartFilterDays[MarketChartFilterDays._30d],
        value: MarketChartFilterDays._30d,
        label: '1m',
      },
      {
        key: MarketChartFilterDays[MarketChartFilterDays._1y],
        value: MarketChartFilterDays._1y,
        label: '1y',
      },
    ];
  }
}

export { MarketChartFilterDays };
