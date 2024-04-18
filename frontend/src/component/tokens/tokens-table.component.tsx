import { useReactTable } from "@tanstack/react-table"
import { useCallback, useEffect, useMemo } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { LineChart, Line } from "recharts";
import { CoinData } from "../../screen/tokens.screen";
import { useNavigate } from "react-router-dom";

interface TableItemProps {
    item: CoinData,
    index: number
}

export const TokenTableItem = ({ item, index }: TableItemProps) => {
    const navigate = useNavigate();

    const formatDollars = useCallback((value: number) => {
        const suffixes = ['', 'K', 'M', 'B', 'T'];
        let newValue = value;
        let suffixIndex = 0;

        while (newValue >= 1000 && suffixIndex < suffixes.length - 1) {
            newValue /= 1000;
            suffixIndex++;
        }

        const formattedValue = newValue.toFixed(2);
        const suffix = suffixes[suffixIndex];

        return `$${formattedValue} ${suffix}`;
    }, [])

    const handleRedirectCoinDetail = () => {
        navigate(`/coin-detail/${item.id}`);
    }

    return (
        <tr className="cursor-pointer" onClick={handleRedirectCoinDetail}>
            <td className=" text-right text-white py-2 px-2">{index + 1}</td>
            <td className=" text-left text-white py-2 px-2 font-medium">{item.name}</td>
            <td className=" text-right text-white py-2 px-2 font-medium">${item.current_price}</td>
            <td className={` text-right py-2 px-2 font-medium ${+item.price_change_percentage_24h < 0 ? 'text-red-600' : 'text-green-600'}`}>{item.price_change_percentage_24h}%</td>
            <td className=" text-right text-white py-2 px-2 font-medium">{formatDollars(item.total_volume)}</td>
            <td className=" text-right text-white py-2 px-2 font-medium flex justify-center items-center">
                <LineChart data={item.sparkline_in_7d.price.map(value => ({ value }))} width={200} height={40} className=" m-0 -mr-16">
                    <Line type={"natural"} dot={false} stroke={+item.price_change_percentage_24h < 0 ? '#DC2626' : '#16A34A'} dataKey={'value'} />
                </LineChart>
            </td>
        </tr>
    )
}