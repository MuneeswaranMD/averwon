import React, { useState, useEffect } from 'react';

const C = {
  bg: '#F8FAFC', white: '#FFFFFF', primary: '#2563EB', border: '#E2E8F0',
  text: '#0F172A', success: '#10B981', warning: '#F59E0B', error: '#E11D48',
  muted: '#64748B', purple: '#8B5CF6', primaryLight: '#EFF6FF'
};

const card = { background: C.white, borderRadius: '14px', border: `1px solid ${C.border}`, padding: '28px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', color: C.text, width: '100%', boxSizing: 'border-box', background: C.white };
const label = { fontSize: '12px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${C.border}` }}>
    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{icon}</div>
    <div>
      <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: C.text }}>{title}</h2>
      <p style={{ margin: '2px 0 0', fontSize: '13px', color: C.muted }}>{subtitle}</p>
    </div>
  </div>
);

const Toast = ({ msg, ok }) => (
  <div style={{ position: 'fixed', bottom: '28px', right: '28px', padding: '14px 22px', background: ok ? C.success : C.error, color: '#fff', borderRadius: '12px', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px' }}>
    {ok ? '✅' : '❌'} {msg}
  </div>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState({ companyName: '', theme: 'Light', language: 'English', timeZone: 'Asia/Kolkata' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [settingId, setSettingId] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch('/api/admin/system/settings')
      .then(r => r.json())
      .then(d => {
        if (d._id) {
          setSettingId(d._id);
          setSettings({ companyName: d.companyName || '', theme: d.theme || 'Light', language: d.language || 'English', timeZone: d.timeZone || 'Asia/Kolkata' });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const url = settingId ? `/api/admin/system/settings/${settingId}` : '/api/admin/system/settings';
      const method = settingId ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      const d = await r.json();
      if (d._id) setSettingId(d._id);
      showToast('Settings saved successfully!');
    } catch {
      showToast('Failed to save settings.', false);
    }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', color: C.muted }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
        <p>Loading settings...</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: C.text }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Settings</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '14px' }}>Configure platform defaults and system preferences</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: '11px 28px', background: saving ? C.muted : C.primary, color: '#fff', border: 'none', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
        >
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Company Details */}
        <div style={card}>
          <SectionHeader icon="🏢" title="Company Details" subtitle="Basic organization information" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={label}>Company Name</span>
              <input style={inp} value={settings.companyName} onChange={e => setSettings(s => ({ ...s, companyName: e.target.value }))} placeholder="e.g. averqon HRMS" />
            </div>
            <div>
              <span style={label}>Default Language</span>
              <select style={inp} value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
                {['English', 'Tamil', 'Hindi', 'French', 'German', 'Spanish'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div style={card}>
          <SectionHeader icon="🎨" title="Display Preferences" subtitle="Theme and localization settings" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={label}>Theme</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Light', 'Dark', 'System'].map(t => (
                  <button key={t} onClick={() => setSettings(s => ({ ...s, theme: t }))} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${settings.theme === t ? C.primary : C.border}`, background: settings.theme === t ? C.primaryLight : C.bg, color: settings.theme === t ? C.primary : C.text, cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }}>
                    {t === 'Light' ? '☀️' : t === 'Dark' ? '🌙' : '💻'} {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span style={label}>Timezone</span>
              <select style={inp} value={settings.timeZone} onChange={e => setSettings(s => ({ ...s, timeZone: e.target.value }))}>
                {['Asia/Kolkata', 'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Singapore', 'Asia/Tokyo'].map(tz => <option key={tz}>{tz}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Security Configuration */}
        <div style={card}>
          <SectionHeader icon="🔒" title="Security & Access" subtitle="Authentication and session policies" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Two-Factor Authentication', value: 'Enabled', color: C.success },
              { label: 'Password Policy', value: 'Strict (8+ chars, mixed)', color: C.primary },
              { label: 'Session Timeout', value: '30 Minutes', color: C.text },
              { label: 'Login History Tracking', value: 'Enabled', color: C.success },
              { label: 'IP Allowlist', value: 'Disabled', color: C.muted },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: C.bg, borderRadius: '10px' }}>
                <span style={{ fontSize: '14px', color: C.text }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API & Integrations */}
        <div style={card}>
          <SectionHeader icon="🔌" title="API & Integrations" subtitle="Connected external services" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'MongoDB Atlas', status: 'Connected', color: C.success, icon: '🗄️' },
              { name: 'Email Service (AWS SES)', status: 'Connected', color: C.success, icon: '📧' },
              { name: 'Cloud Storage (S3)', status: 'Connected', color: C.success, icon: '☁️' },
              { name: 'Payment Gateway (Razorpay)', status: 'Sandbox Mode', color: C.warning, icon: '💳' },
              { name: 'Push Notifications', status: 'Not Configured', color: C.muted, icon: '🔔' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: C.bg, borderRadius: '10px' }}>
                <span style={{ fontSize: '14px', color: C.text }}>{item.icon} {item.name}</span>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: item.color + '20', color: item.color }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Info */}
        <div style={{ ...card, gridColumn: 'span 2' }}>
          <SectionHeader icon="ℹ️" title="Platform Information" subtitle="Current system and deployment details" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Version', value: 'v2.4.1' },
              { label: 'Default Currency', value: 'INR (₹)' },
              { label: 'Date Format', value: 'DD MMM YYYY' },
              { label: 'Database', value: 'MongoDB Atlas' },
              { label: 'Server', value: 'Node.js + Express' },
              { label: 'Auth Provider', value: 'Firebase Auth' },
              { label: 'Deployment', value: 'Render.com' },
              { label: 'Last Updated', value: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
            ].map(item => (
              <div key={item.label} style={{ padding: '16px', background: C.bg, borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
