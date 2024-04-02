import { useEffect, useState } from "react"
import { TokenTableItem } from "../component/tokens/tokens-table.component"

export interface CoinData {
    id: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    sparkline_in_7d: {
        price: number[]
    }
}

export const Token = () => {
    const [timeValue, setTime] = useState('24h');
    const [data, setData] = useState<CoinData[]>([])
    const timeOption = [
        { value: '24h', label: '1D' },
        { value: '7d', label: '1W' },
        { value: '30d', label: '1M' },
        { value: '1y', label: '1Y' },
    ]

    const getData = async () => {
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=${timeValue}&locale=vi&precision=2`)
            .then(res => res.json())
            .then(data => setData(data))

        console.log("data:", data)
    }

    useEffect(() => {
        document.title = "Tokens"
    })

    useEffect(() => {
        getData();
    }, [timeValue])

    return (
        <div className="w-full items-center flex bg-slate-900 py-10 px-36 flex-col pt-40 overflow-y-scroll min-h-screen">
            <div className=" text-white text-4xl w-full mb-2">Top tokens</div>
            {/* <div className=' flex flex-row justify-start w-full mt-3'>
                <div className=' mr-4'>
                    <Dropdown value={timeValue} options={timeOption} onSelectValue={value => setTime(value)} />
                </div>
            </div> */}
            <div className="rounded-xl border-2 border-slate-800 w-full mt-4">
                <table className=" w-full p-4">
                    <thead className=" text-slate-400 py-2 border-b-2 border-slate-800 px-2">
                        <tr >
                            <th className=" text-lg py-2 text-right px-2">#</th>
                            <th className=" text-lg py-2 text-left px-2">Token name</th>
                            <th className=" text-lg py-2 text-right px-2">Price</th>
                            <th className=" text-lg py-2 text-right px-2">Change</th>
                            <th className=" text-lg py-2 text-right px-2">Volume</th>
                            <th className=" text-lg py-2 text-right px-2"></th>
                        </tr>
                    </thead>
                    <tbody className=" overflow-y-scroll">
                        {data.map((item, index) => {
                            return (
                                <TokenTableItem item={item} index={index} />
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}