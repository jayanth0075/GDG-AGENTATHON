import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, icon: Icon, color = 'blue' }) {
  const isPositive = change?.startsWith('+');
  
  const colorClasses = {
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
    green: 'from-green-600/20 to-green-900/20 border-green-500/30',
    orange: 'from-orange-600/20 to-orange-900/20 border-orange-500/30',
  };

  return (
    <div className={`card card-hover p-6 bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-600 to-${color}-700 flex items-center justify-center`}>
          {Icon && <Icon size={24} className="text-white" />}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {change}
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}

