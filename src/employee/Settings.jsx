import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Lock, Download, List, Trash2 } from 'lucide-react';

const Z = {
  accent:  '#2563EB', 
  text:    '#1E293B', 
  muted:   '#64748B',
  border:  '#E2E8F0', 
  cardBg:  '#FFFFFF', 
  inputBg: '#F1F5F9',
};

const inp = {
  width:'100%', boxSizing:'border-box',
  padding:'10px 14px', border:`1.5px solid ${Z.border}`,
  borderRadius:8, fontSize:14, background:Z.inputBg, outline:'none',
  color: Z.text,
};

const Card = ({ children, style = {} }) => (
  <div style={{ background:Z.cardBg, borderRadius:12, border:`1px solid ${Z.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', ...style }}>
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
    <img src="/logo.png" alt="Averqon" style={{ height:34, objectFit:'contain' }} />
    <div style={{ width:1, height:36, background:'rgba(255,255,255,0.2)' }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ color:'#fff', fontSize:17, fontWeight:700 }}>{title}</div>
      <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12 }}>{sub}</div>
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{
    fontSize:11, fontWeight:700, color:Z.muted,
    textTransform:'uppercase', letterSpacing:0.8,
    paddingBottom:10, marginBottom:18,
    borderBottom:`2px solid ${Z.accent}`,
  }}>{children}</div>
);

const Settings = () => {
  const [notifs, setNotifs] = useState({ email:true, push:true, sms:false, leaveAlerts:true, taskAlerts:true, meetingAlerts:true });
  const [theme, setTheme] = useState('Light');
  const [lang, setLang]   = useState('English');

  const toggle = key => setNotifs(p => ({ ...p, [key]:!p[key] }));

  const Toggle = ({ label, desc, k }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${Z.border}` }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600 }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:Z.muted, marginTop:2 }}>{desc}</div>}
      </div>
      <div
        onClick={() => toggle(k)}
        style={{
          width:42, height:24, borderRadius:12, cursor:'pointer', flexShrink:0,
          background: notifs[k] ? Z.accent : '#D1D5DB',
          position:'relative', transition:'background 0.2s',
        }}
      >
        <div style={{
          width:18, height:18, borderRadius:'50%', background:'#fff',
          position:'absolute', top:3,
          left: notifs[k] ? 21 : 3,
          transition:'left 0.2s',
          boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:Z.text }}>
      <PageBand icon={SettingsIcon} title="Settings" sub="Manage your preferences and account settings" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Notification Preferences */}
        <Card style={{ padding:'24px' }}>
          <SectionTitle>Notification Channels</SectionTitle>
          <Toggle label="Email Notifications"  desc="Receive updates via email"        k="email" />
          <Toggle label="Push Notifications"   desc="Browser & mobile push alerts"     k="push" />
          <Toggle label="SMS Notifications"    desc="Text messages to your phone"      k="sms" />
        </Card>

        {/* Alert Types */}
        <Card style={{ padding:'24px' }}>
          <SectionTitle>Alert Types</SectionTitle>
          <Toggle label="Leave Alerts"     desc="Approval/rejection updates"    k="leaveAlerts" />
          <Toggle label="Task Alerts"      desc="New assignments, deadlines"     k="taskAlerts" />
          <Toggle label="Meeting Alerts"   desc="Reminders 30 min before"       k="meetingAlerts" />
        </Card>

        {/* Appearance */}
        <Card style={{ padding:'24px' }}>
          <SectionTitle>Appearance</SectionTitle>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:700, marginBottom:8 }}>Theme</label>
            <div style={{ display:'flex', gap:10 }}>
              {[
                { t: 'Light', icon: Sun },
                { t: 'Dark', icon: Moon },
                { t: 'System', icon: Monitor }
              ].map(({ t, icon: Icon }) => (
                <button key={t} onClick={() => setTheme(t)} style={{
                  flex:1, padding:'9px', borderRadius:8, cursor:'pointer',
                  border:`1.5px solid ${theme===t ? Z.accent : Z.border}`,
                  background:theme===t ? `${Z.accent}12` : '#fff',
                  color:theme===t ? Z.accent : Z.muted,
                  fontWeight:700, fontSize:13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Icon size={14} /> {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:700, marginBottom:8 }}>Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} style={inp}>
              {['English', 'Tamil', 'Hindi', 'French', 'Spanish'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </Card>

        {/* Change Password */}
        <Card style={{ padding:'24px' }}>
          <SectionTitle>Change Password</SectionTitle>
          {['Current Password', 'New Password', 'Confirm New Password'].map(lbl => (
            <div key={lbl} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, marginBottom:6 }}>{lbl}</label>
              <input type="password" placeholder="••••••••" style={inp}
                onFocus={e => e.target.style.borderColor = Z.accent}
                onBlur={e => e.target.style.borderColor = Z.border}
              />
            </div>
          ))}
          <button style={{
            padding:'10px 22px', background:Z.accent, color:'#fff',
            border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Lock size={14} /> Update Password
          </button>
        </Card>

        {/* Privacy & Data */}
        <Card style={{ padding:'24px', gridColumn:'1 / -1' }}>
          <SectionTitle>Privacy & Data</SectionTitle>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[
              { label:'Download My Data', icon: Download, color:'#F8FAFC', text:Z.text },
              { label:'View Activity Log', icon: List, color:'#F8FAFC', text:Z.text },
              { label:'Delete Account',   icon: Trash2, color:'#F8FAFC', text:Z.text },
            ].map(b => (
              <button key={b.label} style={{
                padding:'10px 20px', borderRadius:8, border:'none',
                background:b.color, color:b.text, fontSize:13, fontWeight:700, cursor:'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <b.icon size={14} /> {b.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
