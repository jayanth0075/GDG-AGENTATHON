import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  RefreshCcw,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { getAnalytics, getProjects, getWorkflows, healthCheck } from '../services/api';

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const decimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const fallbackRevenue = [
  { month: 'Jan', value: 4200 },
  { month: 'Feb', value: 3800 },
  { month: 'Mar', value: 5100 },
  { month: 'Apr', value: 5600 },
  { month: 'May', value: 6400 },
  { month: 'Jun', value: 7200 },
];

const fallbackWorkflows = [
  { name: 'Data Processing', success_rate: 98.7, executions: 120 },
  { name: 'Risk Alerts', success_rate: 97.5, executions: 84 },
  { name: 'Customer Support', success_rate: 96.2, executions: 68 },
];

const statusPill = (status) => {
  const mapping = {
    healthy: 'bg-emerald-100 text-emerald-700',
    degraded: 'bg-amber-100 text-amber-700',
    offline: 'bg-rose-100 text-rose-700',
  };
  return mapping[status] || 'bg-gray-100 text-gray-600';
};

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [workflows, setWorkflows] = useState(null);
  const [projects, setProjects] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [analyticsResp, workflowsResp, projectsResp, healthResp] = await Promise.all([
        getAnalytics(),
        getWorkflows(),
        getProjects(),
        healthCheck(),
      ]);
      setAnalytics(analyticsResp);
      setWorkflows(workflowsResp);
      setProjects(projectsResp);
      setHealth(healthResp);
    } catch (err) {
      console.error('Failed to load dashboard', err);
      setError('Unable to reach the backend. Make sure the FastAPI server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const revenueTrend = useMemo(() => analytics?.monthly_revenue ?? fallbackRevenue, [analytics]);
  const workflowStats = useMemo(() => workflows?.workflows ?? fallbackWorkflows, [workflows]);

  const averageWorkflowSuccess = useMemo(() => {
    if (!workflowStats.length) return 0;
    const total = workflowStats.reduce((sum, item) => sum + Number(item.success_rate || 0), 0);
    return total / workflowStats.length;
  }, [workflowStats]);

  const liveSummary = useMemo(() => {
    if (!analytics || !workflows) {
      return 'Connecting to telemetry services… live insights will appear once the backend responds.';
    }
    const execs = workflows.total_executions || workflowStats.reduce((sum, item) => sum + (item.executions || 0), 0);
    return `Monitoring ${numberFormatter.format(execs)} automation cycles and ${numberFormatter.format(analytics.active_users)} active accounts over the last 24 hours.`;
  }, [analytics, workflows, workflowStats]);

  const metricCards = useMemo(() => ([
    {
      label: 'Automations Run',
      value: workflows?.total_executions ?? workflowStats.reduce((sum, item) => sum + (item.executions || 0), 0),
      change: '+4.2% vs previous hour',
      icon: Activity,
    },
    {
      label: 'Active Accounts',
      value: analytics?.active_users,
      change: `${analytics?.community_growth ?? 0}% community growth`,
      icon: Users,
    },
    {
      label: 'Revenue Run-Rate',
      value: analytics ? currencyFormatter.format(analytics.total_revenue) : null,
      change: analytics?.revenue_growth,
      icon: DollarSign,
    },
    {
      label: 'Avg Screen Time',
      value: analytics ? `${decimalFormatter.format(analytics.screen_time)} h` : null,
      change: 'Daily engagement',
      icon: Clock,
    },
  ]), [analytics, workflows, workflowStats]);

  const bills = analytics?.bills_topup ?? [];
  const timeline = workflows?.recent_activity ?? [];

  const conicStops = useMemo(() => {
    const segments = workflowStats.map((item, index) => ({
      value: item.executions || 0,
      color: ['#38bdf8', '#6366f1', '#f97316', '#0ea5e9'][index % 4],
      label: item.name,
    }));
    const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
    let acc = 0;
    return segments.map((segment) => {
      const start = (acc / total) * 100;
      acc += segment.value;
      const end = (acc / total) * 100;
      return { ...segment, start, end };
    });
  }, [workflowStats]);

  const lastUpdated = health?.timestamp
    ? new Date(health.timestamp).toLocaleString()
    : 'Awaiting signal';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl text-center">
          <p className="text-sm text-slate-500">Preparing your operational command center…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 right-0 w-96 h-96 bg-gradient-to-br from-sky-100 via-indigo-50 to-transparent blur-3xl opacity-60" />
        <div className="absolute top-1/3 -left-10 w-80 h-80 bg-gradient-to-tr from-white via-rose-50 to-transparent blur-3xl opacity-70" />
      </div>

      {error && (
        <div className="glass-card border border-rose-200 bg-rose-50/80 text-rose-700 p-4 rounded-2xl">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-8"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/25 via-indigo-500/20 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-teal-400/20 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 max-w-2xl">
            <p className="uppercase text-xs tracking-[0.2em] text-slate-300">Executive cockpit</p>
            <h1 className="text-3xl md:text-4xl font-semibold">Synapse Intelligence Console</h1>
            <p className="text-slate-200 text-base leading-relaxed">{liveSummary}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-300" />
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPill(health?.status)}`}>
                  {health?.status ?? 'syncing'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-200" />
                <span>{health?.ollama === 'connected' ? 'Ollama models online' : 'Ollama offline'}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-200" />
                <span>{projects?.compared_to_last_week ?? '+0.0%' } vs last week</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 w-full max-w-sm bg-slate-900/60 border border-white/10 text-slate-100 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Live telemetry</p>
                <p className="text-2xl font-semibold mt-1 text-white">{health?.status === 'healthy' ? 'Nominal' : 'Investigate'}</p>
              </div>
              <button
                type="button"
                onClick={fetchDashboard}
                disabled={refreshing}
                className="btn-secondary bg-slate-800/80 border-white/20 text-white hover:bg-slate-700/80 disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Syncing' : 'Refresh'}</span>
                </div>
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Ollama link</span>
                <span className="font-medium text-white">{health?.ollama ?? 'pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model capacity</span>
                <span className="font-medium text-white">{analytics ? `${numberFormatter.format(analytics.total_mentors)} advisors` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last sync</span>
                <span className="font-medium text-white">{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <span className="icon-container h-10 w-10">
                  <Icon className="h-5 w-5 text-slate-700" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {typeof metric.value === 'number'
                    ? numberFormatter.format(metric.value)
                    : metric.value ?? '—'}
                </p>
                <p className="text-xs mt-2 text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {metric.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Engagement momentum</p>
              <p className="text-xl font-semibold text-slate-900">Monthly revenue trajectory</p>
            </div>
            <span className="text-sm text-slate-500">Rolling 6 months</span>
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip cursor={{ opacity: 0.1 }} contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-100 to-white" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Knowledge coverage</p>
                <p className="text-xl font-semibold text-slate-900">Workflow mix</p>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 font-medium">
                {averageWorkflowSuccess ? `${decimalFormatter.format(averageWorkflowSuccess)}% avg success` : '—'}
              </span>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div
                className="relative mx-auto h-40 w-40 rounded-full"
                style={{
                  background: `conic-gradient(${conicStops
                    .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
                    .join(', ')})`,
                }}
              >
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-slate-500">Executions</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {numberFormatter.format(workflows?.total_executions ?? 0)}
                  </p>
                  <span className="text-xs text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {workflows?.workflows?.length ?? workflowStats.length} active flows
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {conicStops.map((segment) => (
                  <div key={segment.label}>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                        {segment.label}
                      </span>
                      <span className="font-medium">
                        {Math.round(segment.end - segment.start)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 mt-1">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${segment.end - segment.start}%`, backgroundColor: segment.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass-card rounded-3xl p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Workflow reliability</p>
              <p className="text-xl font-semibold text-slate-900">Success rate by automation</p>
            </div>
            <span className="text-sm text-slate-500">Last sync {lastUpdated}</span>
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workflowStats} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" domain={[90, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={{ borderRadius: 16, borderColor: '#e2e8f0' }} />
                <Bar dataKey="success_rate" radius={8} fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {timeline.slice(0, 4).map((event, idx) => (
              <div key={`${event.workflow}-${idx}`} className="rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{event.workflow}</p>
                  <p className="text-sm text-slate-500">{event.timestamp}</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex flex-col gap-6">
          <div>
            <p className="text-sm text-slate-500">Project delivery</p>
            <p className="text-xl font-semibold text-slate-900">{projects?.ongoing_projects ?? '—'}% on track</p>
            <p className="text-xs text-slate-500">{projects?.compared_to_last_week ?? '+0.0%'} vs last week</p>
          </div>
          <div className="space-y-4">
            {projects?.projects?.map((project) => (
              <div key={project.name} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{project.name}</p>
                  <p className="text-xs text-slate-500">Team: {project.team.join(', ')}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    project.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Operational watchlist</p>
              <p className="text-xl font-semibold text-slate-900">Upcoming spend</p>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-700">48h horizon</span>
          </div>
          <div className="mt-4 space-y-4">
            {bills.map((bill) => (
              <div key={bill.name} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">{bill.name}</p>
                  <p className="text-xs text-slate-500">Due {bill.due}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-900">{currencyFormatter.format(bill.amount)}</p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 justify-end">
                    <ArrowUpRight className="h-3 w-3" />auto-paid via treasury
                  </p>
                </div>
              </div>
            ))}
            {!bills.length && (
              <p className="text-sm text-slate-500">No pending invoices.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Activity timeline</p>
              <p className="text-xl font-semibold text-slate-900">Recent automation pulses</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-4 space-y-4">
            {timeline.slice(0, 5).map((event, idx) => (
              <div key={`${event.workflow}-timeline-${idx}`} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {idx !== timeline.length - 1 && <span className="w-px flex-1 bg-slate-200" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{event.workflow}</p>
                  <p className="text-xs text-slate-500">{event.timestamp}</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700">
                  {event.status}
                </span>
              </div>
            ))}
            {!timeline.length && <p className="text-sm text-slate-500">No workflow signals yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
