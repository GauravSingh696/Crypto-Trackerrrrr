import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import clsx from "clsx";
import { useState } from "react";
import { PriceChart } from "../../components/PriceChart";

type SortField = 'price' | 'percent_change_1h' | 'percent_change_24h' | 'percent_change_7d' | 'market_cap' | 'volume_24h' | 'circulating_supply';
type SortDirection = 'asc' | 'desc';

const formatNumber = (num: number) =>
  num >= 1e9
    ? (num / 1e9).toFixed(2) + "B"
    : num >= 1e6
    ? (num / 1e6).toFixed(2) + "M"
    : num.toLocaleString();

export default function CryptoTable() {
  const { assets, loading, error } = useSelector((state: RootState) => state.crypto);
  const [sortField, setSortField] = useState<SortField>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedAssets = assets
    .filter(asset => 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * multiplier;
    });

  if (loading && assets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <p className="text-red-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">No data available...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-11 gap-4 px-6 py-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('price')}>
            <div className="flex items-center space-x-1">
              <span>Price</span>
              {sortField === 'price' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('percent_change_1h')}>
            <div className="flex items-center space-x-1">
              <span>1h %</span>
              {sortField === 'percent_change_1h' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('percent_change_24h')}>
            <div className="flex items-center space-x-1">
              <span>24h %</span>
              {sortField === 'percent_change_24h' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('percent_change_7d')}>
            <div className="flex items-center space-x-1">
              <span>7d %</span>
              {sortField === 'percent_change_7d' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('market_cap')}>
            <div className="flex items-center space-x-1">
              <span>Market Cap</span>
              {sortField === 'market_cap' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('volume_24h')}>
            <div className="flex items-center space-x-1">
              <span>Volume (24h)</span>
              {sortField === 'volume_24h' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('circulating_supply')}>
            <div className="flex items-center space-x-1">
              <span>Circulating Supply</span>
              {sortField === 'circulating_supply' && (
                <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1">7d Chart</div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-gray-200">
          {filteredAndSortedAssets.map((asset, i) => (
            <div key={asset.id} className="grid grid-cols-11 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="col-span-1 text-sm text-gray-500">{i + 1}</div>
              <div className="col-span-2">
                <div className="flex items-center space-x-3">
                  <img src={asset.logo} alt={asset.symbol} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium text-gray-900 truncate max-w-[180px]">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.symbol}</div>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="text-sm font-medium text-gray-900">
                  ${asset.price.toLocaleString()}
                </div>
              </div>
              <div className="col-span-1">
                <span className={clsx(
                  "px-2 py-1 text-sm font-medium rounded-full",
                  asset.percent_change_1h >= 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {asset.percent_change_1h >= 0 ? '+' : ''}{asset.percent_change_1h.toFixed(2)}%
                </span>
              </div>
              <div className="col-span-1">
                <span className={clsx(
                  "px-2 py-1 text-sm font-medium rounded-full",
                  asset.percent_change_24h >= 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {asset.percent_change_24h >= 0 ? '+' : ''}{asset.percent_change_24h.toFixed(2)}%
                </span>
              </div>
              <div className="col-span-1">
                <span className={clsx(
                  "px-2 py-1 text-sm font-medium rounded-full",
                  asset.percent_change_7d >= 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {asset.percent_change_7d >= 0 ? '+' : ''}{asset.percent_change_7d.toFixed(2)}%
                </span>
              </div>
              <div className="col-span-1 text-sm text-gray-500">
                ${formatNumber(asset.market_cap)}
              </div>
              <div className="col-span-1 text-sm text-gray-500">
                ${formatNumber(asset.volume_24h)}
              </div>
              <div className="col-span-1">
                <div className="text-sm text-gray-500">
                  {formatNumber(asset.circulating_supply)} {asset.symbol}
                </div>
              </div>
              <div className="col-span-1">
                <div className="w-16">
                  <PriceChart 
                    prices={asset.price_data}
                    color={asset.percent_change_24h >= 0 ? '#10B981' : '#EF4444'}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
