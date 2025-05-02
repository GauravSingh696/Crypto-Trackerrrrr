import { CryptoAsset } from "../types/crypto";
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = async (): Promise<CryptoAsset[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d,30d',
        localization: false
      }
    });

    return response.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      percent_change_1h: coin.price_change_percentage_1h_in_currency || 0,
      percent_change_24h: coin.price_change_percentage_24h_in_currency || 0,
      percent_change_7d: coin.price_change_percentage_7d_in_currency || 0,
      percent_change_30d: coin.price_change_percentage_30d_in_currency || 0,
      market_cap: coin.market_cap,
      volume_24h: coin.total_volume,
      circulating_supply: coin.circulating_supply,
      max_supply: coin.max_supply,
      logo: coin.image,
      chart: generateChartUrl(coin.sparkline_in_7d?.price || []),
      price_data: coin.sparkline_in_7d?.price || []
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

// Function to generate a chart URL using a simple SVG
const generateChartUrl = (prices: number[]): string => {
  if (!prices.length) return '';
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  
  const points = prices.map((price, i) => {
    const x = (i / (prices.length - 1)) * 100;
    const y = 100 - ((price - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="40">
      <polyline
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        points="${points}"
      />
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
