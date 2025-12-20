import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Activity } from 'lucide-react';

export default function CryptoWidget() {
  const [crypto, setCrypto] = useState([
    { name: 'Bitcoin', symbol: 'BTC', price: 52228.68, change: 2.5, icon: Bitcoin },
    { name: 'Ethereum', symbol: 'ETH', price: 3458.12, change: -1.2, icon: Activity },
    { name: 'Total Wallet', symbol: 'USD', price: 814.73, change: 8.5, icon: DollarSign }
  ]);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Wallet Balance</h3>
      
      <div className="space-y-4">
        {crypto.map((coin, index) => {
          const Icon = coin.icon;
          const isPositive = coin.change > 0;
          
          return (
            <div
              key={index}
              className="p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 hover:border-gray-600/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{coin.name}</p>
                    <p className="text-xs text-gray-500">{coin.symbol}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-medium">{Math.abs(coin.change)}%</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">
                  ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {coin.symbol === 'USD' && (
                  <span className="text-xs text-gray-500">Last 30 days</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

