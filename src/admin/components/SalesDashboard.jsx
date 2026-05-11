import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Mail,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const C = {
  bg: '#F8FAFC',
  white: '#FFFFFF',
  primary: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  accent: '#2563EB',
  cyan: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6',
  light: '#F1F5F9',
};

const card = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
};

const statusColors = [C.accent, C.cyan, C.purple, C.warning, C.success, C.error];

const money = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;
const date = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No date';

const StatCard = ({ icon: Icon, label, value, note, color }) => (
  <div style={{ ...card, padding: 22, display: 'flex', gap: 16, alignItems: 'center' }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}14`, color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 25, lineHeight: 1, fontWeight: 900, color: C.primary }}>{value}</div>
      <div style={{ marginTop: 7, fontSize: 12, color: C.muted, fontWeight: 600 }}>{note}</div>
    </div>
  </div>
);

const StatusPill = ({ children, color = C.accent }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '5px 10px', background: `${color}14`, color, fontSize: 11, fontWeight: 800 }}>
    {children}
  </span>
);

const SalesDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/sales/overview')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load Sales & CRM data');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  const charts = useMemo(() => {
    if (!data) return null;
    return {
      leads: {
        labels: data.charts.leadStatuses,
        datasets: [{
          data: data.charts.leadCounts,
          backgroundColor: statusColors,
          borderRadius: 8,
        }],
      },
      deals: {
        labels: data.charts.dealStatuses,
        datasets: [{
          data: data.charts.dealCounts,
          backgroundColor: [C.cyan, C.warning, C.accent, C.success, C.error],
          borderWidth: 0,
        }],
      },
      values: {
        labels: data.charts.dealStatuses,
        datasets: [{
          label: 'Pipeline Value',
          data: data.charts.dealValues,
          backgroundColor: [C.cyan, C.warning, C.accent, C.success, C.error],
          borderRadius: 8,
        }],
      },
    };
  }, [data]);

  if (error) {
    return <div style={{ padding: 32, color: C.error, fontWeight: 700 }}>{error}</div>;
  }

  if (!data || !charts) {
    return <div style={{ padding: 32, color: C.muted, fontWeight: 700 }}>Loading Sales & CRM...</div>;
  }

  const { stats, leads = [], deals = [] } = data;

  return (
    <div style={{ padding: 32, background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: C.primary }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '8px 12px', background: '#DBEAFE', color: C.accent, borderRadius: 999, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.7 }}>
            <Target size={15} /> Sales & CRM
          </div>
          <h1 style={{ margin: '16px 0 6px', fontSize: 36, letterSpacing: '-0.04em', fontWeight: 950 }}>Revenue command center</h1>
          <p style={{ margin: 0, color: C.muted, fontSize: 15, fontWeight: 600 }}>Track leads, qualify demand, manage deals, and forecast pipeline value.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/admin/resources/Lead" style={actionLink}><Users size={16} /> Leads</a>
          <a href="/admin/resources/Sales" style={{ ...actionLink, background: C.accent, color: '#fff', borderColor: C.accent }}><Briefcase size={16} /> Deals</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
        <StatCard icon={Users} label="Total Leads" value={stats.totalLeads} note={`${stats.leadConversionRate}% converted`} color={C.accent} />
        <StatCard icon={Briefcase} label="Active Deals" value={stats.activeDeals} note={`${stats.dealWinRate}% win rate`} color={C.cyan} />
        <StatCard icon={CircleDollarSign} label="Pipeline Value" value={money(stats.pipelineValue)} note={`Forecast ${money(stats.forecastValue)}`} color={C.warning} />
        <StatCard icon={CheckCircle2} label="Won Value" value={money(stats.wonValue)} note={`${stats.wonDeals} closed won`} color={C.success} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(300px, 0.85fr)', gap: 24, marginBottom: 24 }}>
        <section style={{ ...card, padding: 24 }}>
          <PanelTitle title="Lead funnel" subtitle="Volume by qualification stage" icon={TrendingUp} />
          <div style={{ height: 320 }}>
            <Bar data={charts.leads} options={barOptions('x')} />
          </div>
        </section>

        <section style={{ ...card, padding: 24 }}>
          <PanelTitle title="Deal mix" subtitle="Open, won, and lost opportunities" icon={Target} />
          <div style={{ height: 320 }}>
            <Doughnut data={charts.deals} options={{ maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 11, padding: 16, font: { weight: 700 } } } } }} />
          </div>
        </section>
      </div>

      <section style={{ ...card, padding: 24, marginBottom: 24 }}>
        <PanelTitle title="Value by deal stage" subtitle="Pipeline value grouped by current sales stage" icon={CircleDollarSign} />
        <div style={{ height: 300 }}>
          <Bar data={charts.values} options={barOptions('y')} />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        <RecentPanel title="Recent leads" empty="No leads captured yet">
          {leads.map((lead) => (
            <div key={lead._id} style={rowStyle}>
              <div>
                <div style={rowTitle}>{lead.leadName}</div>
                <div style={rowMeta}><Mail size={13} /> {lead.companyName || lead.email}</div>
              </div>
              <StatusPill color={C.accent}>{lead.status}</StatusPill>
            </div>
          ))}
        </RecentPanel>

        <RecentPanel title="Recent deals" empty="No deals in pipeline yet">
          {deals.map((deal) => (
            <div key={deal._id} style={rowStyle}>
              <div>
                <div style={rowTitle}>{deal.dealName}</div>
                <div style={rowMeta}>{deal.clientName} | closes {date(deal.expectedClosingDate)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900 }}>{money(deal.dealValue)}</div>
                <div style={{ marginTop: 4 }}><StatusPill color={deal.status === 'Won' ? C.success : C.warning}>{deal.probability}%</StatusPill></div>
              </div>
            </div>
          ))}
        </RecentPanel>
      </div>
    </div>
  );
};

const actionLink = {
  height: 42,
  padding: '0 16px',
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  background: C.white,
  color: C.primary,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 800,
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'center',
  padding: '14px 0',
  borderBottom: `1px solid ${C.border}`,
};

const rowTitle = { fontSize: 14, fontWeight: 850, color: C.primary };
const rowMeta = { marginTop: 5, display: 'flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 12, fontWeight: 600 };

const PanelTitle = ({ title, subtitle, icon: Icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 22 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>{title}</h2>
      <p style={{ margin: '5px 0 0', color: C.muted, fontSize: 13, fontWeight: 600 }}>{subtitle}</p>
    </div>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: C.light, color: C.accent, display: 'grid', placeItems: 'center' }}>
      <Icon size={20} />
    </div>
  </div>
);

const RecentPanel = ({ title, empty, children }) => {
  const items = React.Children.toArray(children);
  return (
    <section style={{ ...card, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>{title}</h2>
        <ArrowUpRight size={18} color={C.muted} />
      </div>
      {items.length ? items : <div style={{ padding: '28px 0', color: C.muted, fontWeight: 700 }}>{empty}</div>}
    </section>
  );
};

const barOptions = (axis) => ({
  maintainAspectRatio: false,
  indexAxis: axis === 'y' ? 'y' : 'x',
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#0F172A', padding: 12 },
  },
  scales: {
    x: { grid: { color: '#EEF2F7' }, ticks: { color: C.muted, font: { weight: 700 } } },
    y: { grid: { color: '#EEF2F7' }, ticks: { color: C.muted, font: { weight: 700 } } },
  },
});

export default SalesDashboard;
