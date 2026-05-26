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
  Video,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Briefcase,
  Layers,
  Wrench,
  Clock,
  Loader2
} from 'lucide-react';

// ── Clean Corporate Light Theme Color Tokens ──────────────────────────────────────────
const C = {
  bg: '#F8FAFC', // Slate 50 - extremely clean off-white background
  card: '#FFFFFF', // Pure white cards
  border: '#E2E8F0', // Slate 200 - clean border
  borderHover: '#CBD5E1', // Slate 300 - hover border
  text: '#0F172A', // Slate 900 - readable deep slate
  textSub: '#475569', // Slate 600 - secondary text
  textMuted: '#94A3B8', // Slate 400 - muted text
  
  // Standard branding colors (Clean & Non-generic)
  primary: '#2563EB', // Royal Blue
  primaryLight: '#EFF6FF',
  
  indigo: '#4F46E5', // Indigo
  indigoLight: '#EEF2FF',
  
  emerald: '#10B981', // Emerald Green
  emeraldLight: '#ECFDF5',
  
  amber: '#F59E0B', // Warm Amber
  amberLight: '#FFFBEB',
  
  rose: '#EF4444', // Soft Red
  roseLight: '#FEF2F2',
};

// ── Typography ────────────────────────────────────────────────────────────────
const T = {
  h1: { fontSize: '24px', fontWeight: 700, color: C.text, margin: 0, letterSpacing: '-0.02em' },
  h2: { fontSize: '15px', fontWeight: 700, color: C.textSub, margin: 0, letterSpacing: '-0.01em' },
  h3: { fontSize: '13.5px', fontWeight: 600, color: C.text, margin: 0 },
  body: { fontSize: '13px', fontWeight: 400, color: C.textSub, lineHeight: 1.5 },
  small: { fontSize: '11px', fontWeight: 400, color: C.textMuted },
  label: { fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
};

// ── Clean Simple Card Wrap ───────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      background: C.card, 
      borderRadius: '12px', 
      border: `1px solid ${C.border}`, 
      padding: '20px',
      transition: 'all 0.2s ease-in-out',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      ...style 
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = C.borderHover;
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = C.border;
      if (onClick) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)';
      }
    }}
  >
    {children}
  </div>
);

// ── SVG: Simple Line Spline Chart ──────────────────────────────────────────────
const LineChart = ({ data, color = C.primary, height = 110 }) => {
  const W = 400, H = height, pad = 10;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });
  
  let pathD = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpX = pts[i][0] + (pts[i+1][0] - pts[i][0]) / 2;
    pathD += ` C ${cpX} ${pts[i][1]}, ${cpX} ${pts[i+1][1]}, ${pts[i+1][0]} ${pts[i+1][1]}`;
  }
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px` }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#ffffff" stroke={color} strokeWidth="1.5" />
      ))}
    </svg>
  );
};

// ── SVG: Simple Bar Chart ──────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = C.primary, height = 110 }) => {
  const W = 400, H = height, gap = 16, pad = 20;
  const max = Math.max(...data) || 1;
  const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: `${H}px` }} preserveAspectRatio="none">
      {data.map((v, i) => {
        const bh = ((v / max) * (H - 20));
        const x = pad + i * (bw + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - bh - 10} width={bw} height={bh} rx="3" fill={color} fillOpacity="0.8" />
            {labels && <text x={x + bw / 2} y={H - 1} textAnchor="middle" fontSize="9" fill={C.textMuted} fontWeight="500">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
};

// ── SVG: Simple Doughnut Chart ──────────────────────────────────────────────────
const DoughnutChart = ({ data, colors, size = 80 }) => {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size * 0.4, ir = size * 0.28;
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
      <circle cx={cx} cy={cy} r={ir - 1} fill="#FFFFFF" />
    </svg>
  );
};

// ── Simple Badge ────────────────────────────────────────────────────────────────
const Badge = ({ label, type = 'default' }) => {
  const map = {
    success: { bg: C.emeraldLight, color: C.emerald },
    warning: { bg: C.amberLight, color: C.amber },
    danger: { bg: C.roseLight, color: C.rose },
    primary: { bg: C.primaryLight, color: C.primary },
    default: { bg: '#F1F5F9', color: C.textSub },
  };
  const { bg, color } = map[type] || map.default;
  return (
    <span style={{ 
      display: 'inline-block', 
      padding: '2px 8px', 
      borderRadius: '6px', 
      fontSize: '11px', 
      fontWeight: 600, 
      background: bg, 
      color, 
      border: `1px solid ${color}15` 
    }}>
      {label}
    </span>
  );
};

// ── Section Header ──
const SectionHeader = ({ title, action, actionUrl }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
    <h2 style={T.h2}>{title}</h2>
    {action && (
      <button 
        onClick={() => { if (actionUrl) window.location.href = actionUrl; }}
        style={{ 
          border: 'none',
          background: 'none',
          color: C.primary,
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.primaryLight}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        {action}
      </button>
    )}
  </div>
);

// ── Main Dashboard ──
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={36} color={C.primary} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <p style={{ ...T.body, color: C.textMuted }}>Loading dashboard...</p>
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
  const attendData = [95, 96, 92, 94, 95, 82, 48];
  const attendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const totalRev = stats.monthlyRevenue || 0;
  const totalExp = finance.filter(f => f.type === 'Expense').reduce((sum, f) => sum + (f.amount || 0), 0) || 35000;

  const statCards = [
    { icon: <Users />, label: 'Active Employees', value: stats.totalEmployees || 0, sub: 'Registered staff', badge: 'Active', badgeType: 'success', color: C.primary, bg: C.primaryLight },
    { icon: <GraduationCap />, label: 'Active Interns', value: stats.totalInterns || 0, sub: 'Assigned interns', badge: 'Active', badgeType: 'primary', color: C.indigo, bg: C.indigoLight },
    { icon: <FolderOpen />, label: 'Active Projects', value: stats.activeProjects || 0, sub: 'Ongoing contracts', badge: 'Running', badgeType: 'warning', color: C.amber, bg: C.amberLight },
    { icon: <CheckSquare />, label: 'Pending Tasks', value: stats.pendingTasks || 0, sub: 'Awaiting completion', badge: 'Tasks', badgeType: 'danger', color: C.rose, bg: C.roseLight },
    { icon: <IndianRupee />, label: 'Monthly Revenue', value: "₹" + (stats.monthlyRevenue || 0).toLocaleString('en-IN'), sub: 'Calculated this month', badge: '+18.5%', badgeType: 'success', color: C.emerald, bg: C.emeraldLight },
    { icon: <FileText />, label: 'Pending Invoices', value: "₹" + (stats.pendingPayments || 0).toLocaleString('en-IN'), sub: 'Unbilled payouts', badge: 'Pending', badgeType: 'warning', color: C.amber, bg: C.amberLight },
    { icon: <CalendarCheck />, label: 'Attendance Rate', value: (stats.attendanceRate || 0) + "%", sub: "Today's check-ins", badge: 'Good', badgeType: 'success', color: C.primary, bg: C.primaryLight },
    { icon: <Mail />, label: 'CRM Leads', value: stats.totalLeads || 0, sub: 'Qualified accounts', badge: 'Total', badgeType: 'primary', color: C.indigo, bg: C.indigoLight },
  ];

  const tMetrics = stats.ticketMetrics || { total: 0, open: 0, closed: 0, urgent: 0, pending: 0 };
  const ticketCards = [
    { icon: <Mail />, label: 'Total Tickets', value: tMetrics.total, sub: 'All tickets', color: C.primary, bg: C.primaryLight },
    { icon: <History />, label: 'In Progress', value: tMetrics.pending, sub: 'Assigned', color: C.amber, bg: C.amberLight },
    { icon: <CheckCircle />, label: 'Closed Tickets', value: tMetrics.closed, sub: 'Resolved', color: C.emerald, bg: C.emeraldLight },
    { icon: <AlertCircle />, label: 'Urgent Alert', value: tMetrics.urgent, sub: 'High priority', color: C.rose, bg: C.roseLight },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '20px 24px', fontFamily: "'Inter', sans-serif", color: C.text, boxSizing: 'border-box' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={T.h1}>Admin Operations Center</h1>
          <p style={{ ...T.body, color: C.textMuted, marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        {/* Search / Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 12px' }}>
            <Search size={14} color={C.textMuted} style={{ marginRight: 6 }} />
            <input 
              placeholder="Search resource..." 
              style={{ border: 'none', outline: 'none', fontSize: '12.5px', color: C.textSub, background: 'transparent', width: '130px' }} 
            />
          </div>
          
          <button style={{ position: 'relative', background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', color: C.text }}>
            <Bell size={16} color={C.primary} />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '5px', height: '5px', background: C.rose, borderRadius: '50%' }} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: s.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: s.color,
              }}>
                {React.cloneElement(s.icon, { size: 18, color: 'currentColor' })}
              </div>
              <Badge label={s.badge} type={s.badgeType} />
            </div>
            
            <p style={{ ...T.label, marginBottom: '4px' }}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.5px' }}>
              {s.value}
            </p>
            <p style={{ ...T.small, marginTop: '4px' }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="System Shortcuts" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Live chat', desc: 'Message employees', url: '/admin/pages/admin-chat', color: C.primary, icon: <Mail size={16} />, bg: C.primaryLight },
            { label: 'Project assignments', desc: 'Manage crew allocations', url: '/admin/pages/project-assignment', color: C.indigo, icon: <Briefcase size={16} />, bg: C.indigoLight },
            { label: 'Track employees', desc: 'Attendance updates', url: '/admin/pages/employee-tracking', color: C.emerald, icon: <History size={16} />, bg: C.emeraldLight },
            { label: 'System tools', desc: 'Audit configurations', url: '/admin/resources/Tool', color: C.rose, icon: <Wrench size={16} />, bg: C.roseLight },
          ].map((item, i) => (
            <Card key={i} onClick={() => window.location.href = item.url}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ ...T.h3, fontSize: '13.5px' }}>{item.label}</p>
                  <p style={T.small}>{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Ticket metrics ── */}
      <div style={{ marginBottom: '28px' }}>
        <SectionHeader title="Complaint Tickets" action="View Tickets" actionUrl="/admin/resources/Ticket" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {ticketCards.map((s, i) => (
            <Card key={i} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {React.cloneElement(s.icon, { size: 16, color: 'currentColor' })}
                </div>
                <div>
                  <p style={{ ...T.label, marginBottom: '2px', fontSize: '9px' }}>{s.label}</p>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={T.h2}>Revenue performance</h3>
              <p style={{ ...T.small, marginTop: '2px' }}>Audited monthly earnings (2026)</p>
            </div>
            <Badge label="Audited" type="success" />
          </div>
          <LineChart data={revenueData} color={C.emerald} height={120} />
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={T.h2}>Daily Attendance rate</h3>
              <p style={{ ...T.small, marginTop: '2px' }}>Weekly clock-in presence ratios</p>
            </div>
            <Badge label="Weekly" type="primary" />
          </div>
          <BarChart data={attendData} labels={attendLabels} color={C.primary} height={120} />
        </Card>
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
        
        {/* Left Side: Projects and Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Projects */}
          <Card style={{ padding: 0 }}>
            <div style={{ padding: '18px 20px 10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={T.h2}>Active Projects Portfolio</h3>
              <button 
                onClick={() => window.location.href = '/admin/resources/Project'}
                style={{ border: 'none', background: 'transparent', color: C.primary, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                View All
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 450 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: `1px solid ${C.border}` }}>
                    {['Project Name', 'Client', 'Deadline', 'Progress', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: '10.5px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => {
                    const bType = p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'primary' : 'warning';
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                              {p.name ? p.name[0].toUpperCase() : 'P'}
                            </div>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12.5px', color: C.textSub }}>{p.client}</td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: C.textMuted }}>
                          {new Date(p.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ flex: 1, height: '4px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', minWidth: '50px' }}>
                              <div style={{ height: '100%', width: `${p.progress}%`, background: p.status === 'Completed' ? C.emerald : C.primary, borderRadius: '10px' }} />
                            </div>
                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: C.textMuted }}>{p.progress}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <Badge label={p.status} type={bType} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <SectionHeader title="Tasks Operations Checklist" action="New Task" actionUrl="/admin/resources/Task" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.length === 0 && <p style={{ ...T.small, textAlign: 'center', padding: '12px 0' }}>No pending tasks assigned</p>}
              {tasks.map((t, i) => {
                const pType = t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'default';
                const sType = t.status === 'In Progress' ? 'primary' : 'default';
                return (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      background: '#F8FAFC', 
                      border: `1px solid ${C.border}` 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.priority === 'Urgent' ? C.rose : (t.priority === 'High' ? C.amber : C.primary), flexShrink: 0 }} />
                      <span style={{ fontSize: '12.5px', fontWeight: 500, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <Badge label={t.priority} type={pType} />
                      <Badge label={t.status} type={sType} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Finances, Meetings, Activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Finance */}
          <Card>
            <SectionHeader title="Expense analytics" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <DoughnutChart
                data={[totalRev || 1, totalExp || 1]}
                colors={[C.emerald, C.rose]}
                size={70}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {[
                  { label: 'Revenues', value: `₹${totalRev.toLocaleString('en-IN')}`, color: C.emerald },
                  { label: 'Expenses', value: `₹${totalExp.toLocaleString('en-IN')}`, color: C.rose },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '1.5px', background: item.color }} />
                      <span style={{ fontSize: '11px', color: C.textSub, fontWeight: 500 }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: C.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* mini list */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {finance.slice(0, 3).map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: f.type === 'Revenue' ? C.emerald : C.rose, fontWeight: 700 }}>
                      {f.type === 'Revenue' ? '▲' : '▼'}
                    </span>
                    <span style={{ color: C.textSub }}>{f.category}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: f.type === 'Revenue' ? C.emerald : C.rose }}>
                    {f.type === 'Revenue' ? '+' : '-'}₹{f.amount?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Meetings */}
          <Card>
            <SectionHeader title="Meetings agenda" action="Schedule" actionUrl="/admin/resources/Meeting" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meetings.length === 0 && (
                <p style={{ ...T.small, textAlign: 'center', padding: '12px 0' }}>No active meetings</p>
              )}
              {meetings.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: C.primaryLight, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Video size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</p>
                    <p style={{ margin: '1px 0 0', fontSize: '10.5px', color: C.textMuted }}>{m.time} · {m.participants?.length || 0} crew</p>
                  </div>
                  <Badge label="Scheduled" type="primary" />
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Events */}
          <Card>
            <SectionHeader title="Platform Logs" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activities.length === 0 && <p style={{ ...T.small, textAlign: 'center', padding: '12px 0' }}>No recent events</p>}
              {activities.slice(0, 4).map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: C.primaryLight, 
                    color: C.primary, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '10px', 
                    fontWeight: 700, 
                    flexShrink: 0 
                  }}>
                    {act.user ? act.user[0].toUpperCase() : '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '12px', color: C.textSub, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <strong style={{ color: C.text, fontWeight: 600 }}>{act.user}</strong> {act.action} <span style={{ color: C.primary, fontWeight: 500 }}>{act.target}</span>
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '10px', color: C.textMuted }}>
                      {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
