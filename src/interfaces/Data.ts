export interface Data {
    stats: Stats;
    coins: Coin[];
}

export interface Coin {
    uuid:           string;
    symbol:         string;
    name:           string;
    color:          string;
    iconUrl:        string;
    marketCap:      string;
    price:          string;
    listedAt:       number;
    tier:           number;
    change:         string;
    rank:           number;
    sparkline:      number[];
    lowVolume:      boolean;
    coinrankingUrl: string;
    "24hVolume":    string;
    btcPrice:       string;
}

export interface Stats {
    total:          number;
    totalCoins:     number;
    totalMarkets:   number;
    totalExchanges: number;
    totalMarketCap: string;
    total24hVolume: string;
}