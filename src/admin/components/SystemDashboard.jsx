import React, { useState, useEffect } from 'react';

const C = {
  bg: '#F3F4F6',
  white: '#FFFFFF',
  primary: '#2563EB',
  secondary: '#334155',
  border: '#E2E8F0',
  text: '#1E293B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#E11D48',
  muted: '#64748B'
};

const SystemDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ padding: '40px', color: C.muted }}>Loading System Configuration...</div>;

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: C.primary, margin: 0 }}>System Management</h1>
        <p style={{ color: C.muted, margin: '4px 0 0 0' }}>Core platform settings and administrative controls</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Security & Audit</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={settingItem}>
              <span>Two-Factor Authentication</span>
              <span style={{ color: C.success, fontWeight: 600 }}>Enabled</span>
            </div>
            <div style={settingItem}>
              <span>Password Policy</span>
              <span style={{ color: C.primary, fontWeight: 600 }}>Strict</span>
            </div>
            <div style={settingItem}>
              <span>Session Timeout</span>
              <span>30 Minutes</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Platform Defaults</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={settingItem}>
              <span>Default Currency</span>
              <span>INR (₹)</span>
            </div>
            <div style={settingItem}>
              <span>Timezone</span>
              <span>Asia/Kolkata (GMT+5:30)</span>
            </div>
            <div style={settingItem}>
              <span>Language</span>
              <span>English (International)</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>API & Integrations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={settingItem}>
              <span>Email Service (AWS SES)</span>
              <span style={{ color: C.success }}>Connected</span>
            </div>
            <div style={settingItem}>
              <span>Cloud Storage (S3)</span>
              <span style={{ color: C.success }}>Connected</span>
            </div>
            <div style={settingItem}>
              <span>Payment Gateway (Razorpay)</span>
              <span style={{ color: C.warning }}>Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Admin Accounts</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, textAlign: 'left' }}>
              <th style={{ padding: '12px', fontSize: '14px', color: C.muted }}>User</th>
              <th style={{ padding: '12px', fontSize: '14px', color: C.muted }}>Role</th>
              <th style={{ padding: '12px', fontSize: '14px', color: C.muted }}>Last Login</th>
              <th style={{ padding: '12px', fontSize: '14px', color: C.muted }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: '12px', fontWeight: 600 }}>Muneeswaran (Admin)</td>
              <td style={{ padding: '12px' }}>Super Admin</td>
              <td style={{ padding: '12px' }}>Active Now</td>
              <td style={{ padding: '12px', color: C.success }}>Active</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: '12px', fontWeight: 600 }}>Sarah Chen</td>
              <td style={{ padding: '12px' }}>HR Manager</td>
              <td style={{ padding: '12px' }}>2 hours ago</td>
              <td style={{ padding: '12px', color: C.success }}>Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  background: C.white,
  padding: '24px',
  borderRadius: '16px',
  border: `1px solid ${C.border}`,
};

const settingItem = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px',
  background: C.bg,
  borderRadius: '8px',
  fontSize: '14px'
};

export default SystemDashboard;
