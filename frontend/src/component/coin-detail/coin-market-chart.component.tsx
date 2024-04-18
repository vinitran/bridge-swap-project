import {
  XAxis,
  AreaChart,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { CoinMarketChartModel } from '../../model/market-chart.model';
// import moment from 'moment';
import { formatPrice } from '../../utils';
export const CoinMarketChart = ({
  datas,
}: {
  datas: CoinMarketChartModel[];
}) => {
  return (
   <>
   <ResponsiveContainer width="90%" height="50%">
      <AreaChart
        data={datas}
        margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#704CE3" stopOpacity={1} />
            <stop offset="95%" stopColor="#534CF7" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date"  />
        <YAxis
          orientation="right"
          type="number"
          domain={[
            Math.max(...datas.map(item => Number(item.price))),
            Math.min(...datas.map(item => Number(item.price))),
          ]}
        />
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Tooltip content={CustomTooltip} />
        <Area
          type="natural"
          dataKey="price"
          stroke="#534CF7"
          dot={false}
          fillOpacity={1}
          fill="url(#colorPrice)"
        />
      </AreaChart>
    </ResponsiveContainer>

    
   </>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1B232D] rounded-[8px] p-[16px]">
        <p className="">{payload[0]?.payload?.date}</p>
        <p className="mt-[6px]">
          <span className="text-[#4A6382]">Price: </span>$
          {formatPrice(payload[0].payload?.price)}
        </p>{' '}
        <p className="">
          <span className="text-[#4A6382]">Volumn: </span>$
          {formatPrice(payload[0].payload?.volumn)}
        </p>
      </div>
    );
  }

  return null;
};
