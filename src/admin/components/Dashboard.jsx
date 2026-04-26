import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  FolderOpen, 
  CheckSquare, 
  IndianRupee, 
  FileText, 
  CalendarCheck, 
  Mail, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Bell, 
  ChevronDown, 
  Video 
} from 'lucide-react';

// ── Color Tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: '#F3F4F6',
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryLight: '#EFF6FF',
  indigo: '#4F46E5',
  indigoLight: '#EEF2FF',
  emerald: '#10B981',
  emeraldLight: '#ECFDF5',
  amber: '#F59E0B',
  amberLight: '#FFFBEB',
  rose: '#E11D48',
  roseLight: '#FFF1F2',
  slate: '#475569',
  slateLight: '#94A3B8',
  text: '#1E293B',
  textSub: '#334155',
  textMuted: '#64748B',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#E11D48',
  dangerLight: '#FFF1F2',
};

// ── Typography ────────────────────────────────────────────────────────────────
const T = {
  h1: { fontSize: '28px', fontWeight: 700, color: '#1E293B', margin: 0, letterSpacing: '-0.02em' },
  h2: { fontSize: '18px', fontWeight: 700, color: '#334155', margin: 0 },
  h3: { fontSize: '16px', fontWeight: 500, color: C.text, margin: 0 },
  body: { fontSize: '14px', fontWeight: 400, color: C.textSub },
  small: { fontSize: '12px', fontWeight: 400, color: C.textMuted },
  label: { fontSize: '12px', fontWeight: 500, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
};

// ── Base Card ─────────────────────────────────────────────────────────────────
const card = {
  background: C.card,
  borderRadius: '12px',
  border: `1px solid ${C.border}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  padding: '20px',
};

// ── SVG: Line Chart ───────────────────────────────────────────────────────────
const LineChart = ({ data, labels, color = C.primary, height = 120 }) => {
  const W = 400, H = height, pad = 8;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });
  const polyline = pts.map(p => p.join(',')).join(' ');
  const area = `M${pts[0][0]},${H} ` + pts.map(p => `L${p[0]},${p[1]}`).join(' ') + ` L${pts[pts.length - 1][0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px` }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lg)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={C.card} stroke={color} strokeWidth="1.5" />)}
      {labels && labels.map((l, i) => (
        <text key={i} x={pts[i][0]} y={H - 1} textAnchor="middle" fontSize="9" fill={C.grayLight}>{l}</text>
      ))}
    </svg>
  );
};

// ── SVG: Bar Chart ────────────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = C.primary, height = 120 }) => {
  const W = 400, H = height, gap = 6, pad = 16;
  const max = Math.max(...data) || 1;
  const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px` }} preserveAspectRatio="none">
      {data.map((v, i) => {
        const bh = ((v / max) * (H - 24));
        const x = pad + i * (bw + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - bh - 14} width={bw} height={bh} rx="4" fill={color} fillOpacity="0.15" />
            <rect x={x} y={H - bh - 14} width={bw} height={4} rx="2" fill={color} />
            {labels && <text x={x + bw / 2} y={H - 2} textAnchor="middle" fontSize="9" fill={C.grayLight}>{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ── SVG: Doughnut Chart ───────────────────────────────────────────────────────
const DoughnutChart = ({ data, colors, size = 120 }) => {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.24;
  let angle = -Math.PI / 2;
  const slices = data.map((v, i) => {
    const sweep = (v / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const xi1 = cx + ir * Math.cos(angle - sweep), yi1 = cy + ir * Math.sin(angle - sweep);
    const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);
    return { d: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${ir},${ir} 0 ${large},0 ${xi1},${yi1} Z`, color: colors[i] };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: `${size}px`, height: `${size}px` }}>
      {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} />)}
      <circle cx={cx} cy={cy} r={ir - 2} fill={C.card} />
    </svg>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ label, type = 'default' }) => {
  const map = {
    success: { bg: C.successLight, color: C.success },
    warning: { bg: C.warningLight, color: C.warning },
    danger: { bg: C.dangerLight, color: C.danger },
    primary: { bg: C.primaryLight, color: C.primary },
    default: { bg: '#F9FAFB', color: '#6B7280' },
  };
  const { bg, color } = map[type] || map.default;
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: bg, color, border: `1px solid ${color}22` }}>
      {label}
    </span>
  );
};

// ── Button ────────────────────────────────────────────────────────────────────
const Btn = ({ children, variant = 'primary', onClick }) => {
  const styles = {
    primary: { background: C.primary, color: '#fff', border: `1px solid ${C.primary}` },
    secondary: { background: C.card, color: C.gray, border: `1px solid ${C.border}` },
    ghost: { background: 'transparent', color: C.primary, border: `1px solid ${C.primary}` },
  };
  return (
    <button onClick={onClick} style={{ ...styles[variant], padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' }}>
      {children}
    </button>
  );
};

// ── Section Divider ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
    <h2 style={T.h2}>{title}</h2>
    {action && <Btn variant="ghost">{action}</Btn>}
  </div>
);

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(r => r.json())
      .then(json => setData(json))
      .catch(err => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: `3px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ ...T.body, color: C.grayLight }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const projects = data?.projects || [];
  const tasks = data?.tasks || [];
  const finance = data?.finance || [];
  const activities = data?.activities || [];
  const meetings = data?.meetings || [];

  const revenueData = data?.monthlyRevenue?.data || [0, 0, 0, 0, 0, 0];
  const revLabels = data?.monthlyRevenue?.labels || ['', '', '', '', '', ''];
  const attendData = [92, 95, 88, 94, 91, 75, 40]; // Still mocked as attendance logic is not implemented
  const attendLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const totalExp = 0; // TBD
  const totalRev = stats.monthlyRevenue || 0;

  const statCards = [
    { icon: <Users />, label: 'Total Employees', value: stats.totalEmployees || 0, sub: 'Active staff', badge: 'Active', badgeType: 'success', color: C.primary, bg: C.primaryLight },
    { icon: <GraduationCap />, label: 'Total Interns', value: stats.totalInterns || 0, sub: 'Active interns', badge: 'Active', badgeType: 'primary', color: C.indigo, bg: C.indigoLight },
    { icon: <FolderOpen />, label: 'Active Projects', value: stats.activeProjects || 0, sub: 'Ongoing work', badge: 'In Progress', badgeType: 'warning', color: C.amber, bg: C.amberLight },
    { icon: <CheckSquare />, label: 'Pending Tasks', value: stats.pendingTasks || 0, sub: 'Awaiting action', badge: 'Pending', badgeType: 'danger', color: C.rose, bg: C.roseLight },
    { icon: <IndianRupee />, label: 'Monthly Revenue', value: "₹" + (stats.monthlyRevenue || 0).toLocaleString('en-IN'), sub: 'vs last month', badge: '+18%', badgeType: 'success', color: C.emerald, bg: C.emeraldLight },
    { icon: <FileText />, label: 'Pending Invoices', value: "₹" + (stats.pendingPayments || 0).toLocaleString('en-IN'), sub: 'Awaiting payment', badge: 'Unpaid', badgeType: 'warning', color: C.amber, bg: C.amberLight },
    { icon: <CalendarCheck />, label: 'Attendance Rate', value: (stats.attendanceRate || 0) + "%", sub: "Today's presence", badge: 'Good', badgeType: 'success', color: C.primary, bg: C.primaryLight },
    { icon: <Mail />, label: 'New Leads', value: stats.totalLeads || 0, sub: 'Client leads', badge: 'Total', badgeType: 'primary', color: C.indigo, bg: C.indigoLight },
  ];

  const tMetrics = stats.ticketMetrics || { total: 0, open: 0, closed: 0, urgent: 0, pending: 0 };
  const ticketCards = [
    { icon: <Mail />, label: 'Total Tickets', value: tMetrics.total, sub: 'All tickets', color: C.primary, bg: C.primaryLight },
    { icon: <History />, label: 'In Progress', value: tMetrics.pending, sub: 'Pending resolution', color: C.amber, bg: C.amberLight },
    { icon: <CheckCircle />, label: 'Closed Tickets', value: tMetrics.closed, sub: 'Resolved', color: C.emerald, bg: C.emeraldLight },
    { icon: <AlertCircle />, label: 'Urgent Tickets', value: tMetrics.urgent, sub: 'Action needed', color: C.rose, bg: C.roseLight },
  ];

  const layout = {
    page: { minHeight: '100vh', background: C.bg, padding: '24px 28px', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: C.text, boxSizing: 'border-box' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
    grid6: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' },
    grid2_1: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    col: { display: 'flex', flexDirection: 'column', gap: '20px' },
    row: { display: 'flex', alignItems: 'center', gap: '10px' },
  };

  return (
    <div style={layout.page}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
      <style>{`
        * { box-sizing: border-box; }
        button:hover { opacity: 0.85; }
        tr:hover td { background: #F9FAFB; }
      `}</style>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={T.h1}>Dashboard</h1>
          <p style={{ ...T.body, color: C.textMuted, marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 12px' }}>
            <Search style={{ fontSize: '18px', color: C.textLight, width: '18px', height: '18px' }} />
            <input placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: '13px', color: C.textSub, background: 'transparent', width: '160px' }} />
          </div>
          <button style={{ position: 'relative', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '15px' }}>
            <Bell style={{ fontSize: '20px', color: C.primary, width: '20px', height: '20px' }} />
            <span style={{ position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', background: C.danger, borderRadius: '50%', border: `1.5px solid ${C.card}` }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 12px 6px 8px' }}>
            <img src="https://ui-avatars.com/api/?name=Munees+Waran&background=2563EB&color=fff&size=32&font-size=0.4" style={{ width: '32px', height: '32px', borderRadius: '6px' }} alt="avatar" />
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: C.text }}>Munees Waran</p>
              <p style={{ margin: 0, fontSize: '11px', color: C.textMuted }}>Super Admin</p>
            </div>
            <ChevronDown style={{ fontSize: '16px', color: C.grayLight, width: '16px', height: '16px' }} />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div style={layout.grid4}>
        {statCards.map((s, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: s.color, boxShadow: `0 2px 8px ${s.color}15` }}>
                {React.cloneElement(s.icon, { size: 22, color: 'currentColor' })}
              </div>
              <Badge label={s.badge} type={s.badgeType} />
            </div>
            <p style={{ ...T.label, marginBottom: '6px', color: C.textMuted }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: s.color, margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</p>
            <p style={{ ...T.small, marginTop: '4px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ height: '28px' }} />

      {/* ── Support Tickets ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <SectionHeader title="Ticket Support Center" action="View All Tickets" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {ticketCards.map((s, i) => (
            <div key={i} style={card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: s.color, boxShadow: `0 2px 8px ${s.color}15` }}>
                  {React.cloneElement(s.icon, { size: 24, color: 'currentColor' })}
                </div>
                <div>
                  <p style={{ ...T.label, marginBottom: '2px', color: C.textMuted, fontSize: '11px' }}>{s.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: s.color, margin: '0' }}>{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '24px' }} />

      {/* ── Charts Row ────────────────────────────────────────────────────── */}
      <div style={layout.grid2}>
        {/* Revenue Line Chart */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={T.h2}>Revenue Overview</h2>
              <p style={{ ...T.small, marginTop: '3px' }}>Monthly revenue trend — 2026</p>
            </div>
            <Badge label="Year 2026" type="primary" />
          </div>
          <LineChart data={revenueData} labels={revLabels} color={C.primary} height={130} />
        </div>
        {/* Attendance Bar Chart */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={T.h2}>Attendance Rate</h2>
              <p style={{ ...T.small, marginTop: '3px' }}>This week — % present</p>
            </div>
            <Badge label="This Week" type="default" />
          </div>
          <BarChart data={attendData} labels={attendLabels} color={C.primary} height={130} />
        </div>
      </div>

      <div style={{ height: '24px' }} />

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div style={layout.grid2_1}>

        {/* Left: Projects Table + Kanban */}
        <div style={layout.col}>

          {/* Projects Table */}
          <div style={card}>
            <SectionHeader title="Projects" action="View All" />
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: C.grayBg, borderBottom: `1px solid ${C.border}` }}>
                  {['Project Name', 'Client', 'Deadline', 'Progress', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: C.textMuted, fontFamily: 'inherit', borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => {
                  const bType = p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'primary' : 'warning';
                  return (
                    <tr key={i}>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${C.borderLight}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>{p.name?.[0]}</div>
                          <span style={{ fontWeight: 500, color: C.text }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: C.gray, borderBottom: `1px solid ${C.borderLight}` }}>{p.client}</td>
                      <td style={{ padding: '12px', color: C.gray, borderBottom: `1px solid ${C.borderLight}`, fontSize: '13px' }}>
                        {new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${C.borderLight}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', background: C.grayBg, borderRadius: '999px', border: `1px solid ${C.border}`, overflow: 'hidden', minWidth: '80px' }}>
                            <div style={{ height: '100%', width: `${p.progress}%`, background: p.status === 'Completed' ? C.success : C.primary, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ fontSize: '12px', color: C.textMuted, minWidth: '32px' }}>{p.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${C.borderLight}` }}>
                        <Badge label={p.status} type={bType} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tasks */}
          <div style={card}>
            <SectionHeader title="Pending Tasks" action="Add Task" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map((t, i) => {
                const pType = t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'default';
                const sType = t.status === 'In Progress' ? 'primary' : 'default';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: `1px solid ${C.border}`, borderRadius: '8px', background: C.grayBg }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `2px solid ${C.border}`, flexShrink: 0 }} />
                      <span style={{ ...T.body, color: C.text, fontWeight: 500 }}>{t.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Badge label={t.priority} type={pType} />
                      <Badge label={t.status} type={sType} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={layout.col}>

          {/* Finance Summary with Doughnut */}
          <div style={card}>
            <SectionHeader title="Expenses Breakdown" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <DoughnutChart
                data={[totalRev || 195000, totalExp || 47000]}
                colors={[C.primary, C.danger]}
                size={100}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {[
                  { label: 'Revenue', value: `₹${(totalRev || 195000).toLocaleString('en-IN')}`, color: C.primary },
                  { label: 'Expenses', value: `₹${(totalExp || 47000).toLocaleString('en-IN')}`, color: C.danger },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color }} />
                      <span style={T.small}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '16px', borderTop: `1px solid ${C.border}`, paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {finance.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.type === 'Revenue' ? '▲' : '▼'}</span>
                    <span style={{ ...T.small, color: C.textSub }}>{f.category}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: f.type === 'Revenue' ? C.success : C.danger }}>
                    {f.type === 'Revenue' ? '+' : '-'}₹{f.amount?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Meetings */}
          <div style={card}>
            <SectionHeader title="Upcoming Meetings" action="Schedule" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {meetings.length === 0 && <p style={{ ...T.small, textAlign: 'center', padding: '16px 0' }}>No upcoming meetings</p>}
              {meetings.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: `1px solid ${C.border}`, borderRadius: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}><Video size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: C.text }}>{m.title}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.textMuted }}>{m.time} · {m.participants?.length || 0} participants</p>
                  </div>
                  <Badge label="Today" type="primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={card}>
            <SectionHeader title="Recent Activity" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {activities.map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < activities.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                    {act.user?.[0] || '?'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', color: C.text, lineHeight: 1.5 }}>
                      <strong style={{ fontWeight: 600 }}>{act.user}</strong> {act.action} <span style={{ color: C.primary, fontWeight: 500 }}>{act.target}</span>
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '11px', color: C.textMuted }}>
                      {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
