export interface Coin {
    uuid: string,
    symbol: string,
    name: string,
    color: string,
    iconUrl: string,
    marketCap: number,
    price: number,
    listedAt: number,
    tier: number,
    change: string,
    rank: number,
    sparkline: number[],
    lowVolume: boolean,
    coinrankingUrl: string,
    btcPrice: number
}