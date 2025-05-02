export interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    price: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    market_cap: number;
    volume_24h: number;
    circulating_supply: number;
    max_supply?: number;
    logo: string;
    chart: string;
    price_data: number[];
  }
  