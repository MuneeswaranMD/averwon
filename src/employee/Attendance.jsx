import { 
  Clock, 
  MapPin, 
  Building2, 
  Home, 
  CheckCircle, 
  LogOut, 
  Calendar, 
  Timer, 
  BarChart, 
  AlertTriangle, 
  Download,
  Globe 
} from 'lucide-react';

const Z = {
  accent:  '#2563EB', 
  success: '#10B981', 
  warning: '#F59E0B', 
  danger: '#EF4444',
  text: '#1E293B', 
  muted: '#64748B', 
  border: '#E2E8F0',
  cardBg: '#FFFFFF', 
  pageBg: '#F8FAFC', 
  inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 12, border: `1px solid ${Z.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

const PageBand = ({ icon: Icon, title, sub }) => (
  <div style={{
    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
    borderRadius: 16,
    padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }}>
    <img src="/logo.png" alt="Averqon" style={{ height: 34, objectFit: 'contain' }} />
    <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)' }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={24} color="#fff" />
    </div>
    <div>
      <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{title}</div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{sub}</div>
    </div>
  </div>
);

const StatBox = ({ label, value, color, icon: Icon }) => (
  <Card style={{ padding: '18px 20px', textAlign: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
      {React.createElement(Icon, { size: 24, color })}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: Z.muted, marginTop: 6, fontWeight: 600 }}>{label}</div>
  </Card>
);

const Th = ({ children }) => (
  <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, background: '#F8FAFC', borderBottom: `1px solid ${Z.border}`, whiteSpace: 'nowrap' }}>{children}</th>
);
const Td = ({ children, bold }) => (
  <td style={{ padding: '12px 14px', borderBottom: `1px solid ${Z.border}`, fontSize: 13, color: Z.text, fontWeight: bold ? 600 : 400 }}>{children}</td>
);

const StatusBadge = ({ status }) => {
  const map = { 
    Present: [`${Z.success}15`, Z.success], 
    Late: [`${Z.warning}15`, Z.warning], 
    Absent: [`${Z.danger}15`, Z.danger] 
  };
  const [bg, fg] = map[status] || [`${Z.muted}15`, Z.muted];
  return <span style={{ display: 'inline-block', padding: '4px 12px', background: bg, color: fg, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{status}</span>;
};

const Attendance = () => {
  const [checked, setChecked]   = useState(false);
  const [checkIn, setCheckIn]   = useState(null);
  const [mode, setMode]         = useState('Office');
  const [time, setTime]         = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const history = [
    { date: '2024-04-21', checkIn: '09:05 AM', checkOut: '06:15 PM', hours: '9h 10m', mode: 'Office', status: 'Present' },
    { date: '2024-04-20', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9h 15m', mode: 'WFH',    status: 'Present' },
    { date: '2024-04-19', checkIn: '10:00 AM', checkOut: '07:00 PM', hours: '9h 00m', mode: 'Office', status: 'Late'    },
    { date: '2024-04-18', checkIn: '-',        checkOut: '-',        hours: '0h 00m', mode: '-',      status: 'Absent'  },
    { date: '2024-04-17', checkIn: '08:55 AM', checkOut: '05:45 PM', hours: '8h 50m', mode: 'Office', status: 'Present' },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: Z.text }}>
      <PageBand icon={Clock} title="Attendance" sub="Mark your daily check-in and view attendance history" />

      {/* Top row: clock card + stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 24 }}>

        {/* Clock card */}
        <Card style={{ padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Live Clock</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: Z.text, letterSpacing: 1, marginBottom: 4 }}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: 13, color: Z.muted, marginBottom: 22 }}>
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>

          {/* Work mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {['Office', 'WFH'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: `1.5px solid ${mode === m ? Z.accent : Z.border}`,
                background: mode === m ? `${Z.accent}12` : '#fff',
                color: mode === m ? Z.accent : Z.muted,
                fontWeight: 700, fontSize: 13,
              }}>
                <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {m === 'Office' && <Building2 size={16} />}
                  {m === 'Work from Home' && <Home size={16} />}
                  {m === 'Remote' && <Globe size={16} />}
                  {m}
                </span>
              </button>
            ))}
          </div>

          {/* Check-in/out button */}
          {!checked ? (
            <button onClick={() => { setChecked(true); setCheckIn(new Date()); }} style={{
              width: '100%', padding: '14px',
              background: Z.success, color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <CheckCircle size={20} /> Check In
            </button>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: Z.text, fontWeight: 600 }}>
                <CheckCircle size={16} color={C.success} /> Checked in at {checkIn?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <button onClick={() => { setChecked(false); setCheckIn(null); }} style={{
                width: '100%', padding: '14px',
                background: Z.danger, color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <LogOut size={20} /> Check Out
              </button>
            </>
          )}
        </Card>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <StatBox label="Present Days"      value="21/24"  color={Z.accent}   icon={Calendar} />
          <StatBox label="Late Entries"      value="2"      color={Z.warning}  icon={Clock} />
          <StatBox label="Total Hours"       value="168.5h" color={Z.text}    icon={Timer} />
          <StatBox label="Avg Hours / Day"   value="8.2h"   color={Z.success}  icon={BarChart} />
        </div>
      </div>

      {/* Policy notice */}
      <div style={{
        background: '#F8FAFC', border: `1px solid ${Z.border}`, borderRadius: 10,
        padding: '12px 18px', marginBottom: 24, fontSize: 13, color: Z.text,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <AlertTriangle size={18} color={Z.warning} /> <strong>Policy:</strong> &nbsp;Daily minimum 8 hours. Arrival after 9:30 AM is marked <strong>Late</strong>.
      </div>

      {/* History table */}
      <Card>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Attendance History</div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', border: `1px solid ${Z.border}`, borderRadius: 8, background: '#fff', fontSize: 12, cursor: 'pointer', color: Z.muted }}>
            <Download size={14} /> Download Report
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><Th>Date</Th><Th>Check-In</Th><Th>Check-Out</Th><Th>Hours</Th><Th>Mode</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <Td bold>{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                <Td>{row.checkIn}</Td>
                <Td>{row.checkOut}</Td>
                <Td>{row.hours}</Td>
                <Td>{row.mode === '-' ? '-' : (row.mode === 'Office' ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> Office</div> : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Home size={14} /> WFH</div>)}</Td>
                <Td><StatusBadge status={row.status} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Attendance;
