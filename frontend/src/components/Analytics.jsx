import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, FileText, Activity } from 'lucide-react';

export default function Analytics() {
  const usageData = [
    { month: 'Jan', queries: 450, documents: 120, users: 45 },
    { month: 'Feb', queries: 520, documents: 145, users: 52 },
    { month: 'Mar', queries: 480, documents: 135, users: 48 },
    { month: 'Apr', queries: 650, documents: 180, users: 65 },
    { month: 'May', queries: 720, documents: 195, users: 72 },
    { month: 'Jun', queries: 680, documents: 190, users: 68 },
  ];

  const performanceData = [
    { time: '00:00', responseTime: 120 },
    { time: '04:00', responseTime: 100 },
    { time: '08:00', responseTime: 250 },
    { time: '12:00', responseTime: 320 },
    { time: '16:00', responseTime: 280 },
    { time: '20:00', responseTime: 150 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
        <p className="text-gray-600 mt-2">Track system performance and usage metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1.2s</h3>
          <p className="text-sm text-green-600 mt-1">↓ 15% faster</p>
        </div>

        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
          <p className="text-sm text-green-600 mt-1">↑ 8.2% growth</p>
        </div>

        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="text-green-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Documents Processed</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">3,456</h3>
          <p className="text-sm text-green-600 mt-1">↑ 12% increase</p>
        </div>

        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">98.5%</h3>
          <p className="text-sm text-green-600 mt-1">↑ 2.1% better</p>
        </div>
      </div>

      {/* Usage Trends */}
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={usageData}>
            <defs>
              <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="queries" stroke="#3b82f6" fillOpacity={1} fill="url(#colorQueries)" />
            <Area type="monotone" dataKey="documents" stroke="#10b981" fillOpacity={1} fill="url(#colorDocs)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Queries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Documents</span>
          </div>
        </div>
      </div>

      {/* Response Time Performance */}
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Response Time (24h)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="responseTime" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

