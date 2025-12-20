import { Gauge } from 'lucide-react';

export default function FearGreedIndex() {
  const value = 70;
  const label = value > 75 ? 'Extreme Greed' : value > 55 ? 'Greed' : value > 45 ? 'Neutral' : value > 25 ? 'Fear' : 'Extreme Fear';
  
  const getColor = () => {
    if (value > 75) return '#10b981';
    if (value > 55) return '#3b82f6';
    if (value > 45) return '#f59e0b';
    if (value > 25) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Fear & Greed Index</h3>
        <Gauge size={20} className="text-gray-400" />
      </div>

      <div className="relative w-full aspect-square max-w-[200px] mx-auto">
        <svg viewBox="0 0 200 200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#374151"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 502} 502`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: getColor() }}>
            {value}
          </span>
          <span className="text-sm text-gray-400 mt-1">{label}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-2 text-center text-xs">
        <div>
          <div className="w-full h-2 bg-red-600 rounded mb-1" />
          <span className="text-gray-500">0-20</span>
        </div>
        <div>
          <div className="w-full h-2 bg-orange-600 rounded mb-1" />
          <span className="text-gray-500">20-40</span>
        </div>
        <div>
          <div className="w-full h-2 bg-yellow-600 rounded mb-1" />
          <span className="text-gray-500">40-60</span>
        </div>
        <div>
          <div className="w-full h-2 bg-blue-600 rounded mb-1" />
          <span className="text-gray-500">60-80</span>
        </div>
        <div>
          <div className="w-full h-2 bg-green-600 rounded mb-1" />
          <span className="text-gray-500">80-100</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Last 24 hours • Updated 10 min ago
      </p>
    </div>
  );
}

