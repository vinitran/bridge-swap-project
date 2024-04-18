export interface CommunityLink {
  discord?: string | undefined;
  twitter?: string | undefined;
  telegram?: string | undefined;
}

export interface CoinInformation {
  website?: Partial<{ name: string; site: string }> | undefined;
  community?: CommunityLink | undefined;
  searchOn?: string | undefined;
  apiId?: string | undefined;
  chains?: Partial<{ name: string; site: string }[]> | undefined;
  categories?: string[] | undefined;
}

export class CoinDetail {
  public id: string;
  public symbol: string | undefined;
  public name: string | undefined;
  public rank: number | undefined;
  public price: number | undefined;
  public image: string | undefined;
  public priceChangePercentage24h: number | undefined;
  public high24h: number | undefined;
  public low24h: number | undefined;

  public marketCap: number | undefined;
  public fullyDilutedValuation: number | undefined;
  public volumnTrading24h: number | undefined;
  public totalValueLocked: number | undefined;
  public circulatingSupply: number | undefined;
  public totalSupply: number | undefined;
  public maxSupply: number | undefined;

  public coinInformation: CoinInformation | undefined;

  constructor(
    id: string,
    symbol?: string,
    name?: string,
    rank?: number,
    price?: number,
    image?: string,
    priceChangePercentage24h?: number,
    high24h?: number,
    low24h?: number,
    marketCap?: number,
    fullyDilutedValuation?: number,
    volumnTrading24h?: number,
    totalValueLocked?: number,
    circulatingSupply?: number,
    totalSupply?: number,
    maxSupply?: number,
    coinInformation?: CoinInformation,
  ) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.rank = rank;
    this.price = price;
    this.image = image;
    this.priceChangePercentage24h = priceChangePercentage24h;
    this.high24h = high24h;
    this.low24h = low24h;
    this.marketCap = marketCap;
    this.fullyDilutedValuation = fullyDilutedValuation;
    this.volumnTrading24h = volumnTrading24h;
    this.totalValueLocked = totalValueLocked;
    this.circulatingSupply = circulatingSupply;
    this.totalSupply = totalSupply;
    this.maxSupply = maxSupply;
    this.coinInformation = coinInformation;
  }
}
