import React from 'react';

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  bg: '#F5F7FA',
  white: '#FFFFFF',
  border: '#E5E7EB',
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  text: '#111827',
  textMuted: '#6B7280',
};

const Login = (props) => {
  const { action, message, branding } = props;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: C.bg,
      fontFamily: "'Inter', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: C.white,
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        padding: '40px',
        border: `1px solid ${C.border}`,
        textAlign: 'center'
      }}>
        {/* Logo Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            height: '64px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <img src="/logo.png" style={{ 
              height: '100%', 
              objectFit: 'contain' 
            }} alt="Logo" />
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: C.text }}>Welcome Back</h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: C.textMuted }}>
            Enter your credentials to access the admin portal.
          </p>
        </div>

        {/* Error Message */}
        {message && (
          <div style={{
            padding: '12px',
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            {message.message}
          </div>
        )}

        {/* Form */}
        <form action={action} method="POST" style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: C.text }}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@averon.ai"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                boxSizing: 'border-box',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = C.primary}
              onBlur={(e) => e.target.style.borderColor = C.border}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: C.text }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                boxSizing: 'border-box',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = C.primary}
              onBlur={(e) => e.target.style.borderColor = C.border}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: C.primary,
              border: 'none',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.background = C.primaryHover}
            onMouseLeave={(e) => e.target.style.background = C.primary}
          >
            Login to Workspace
          </button>
        </form>

        <div style={{ marginTop: '32px', borderTop: `1px solid ${C.border}`, paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: C.textMuted, margin: 0 }}>
            Powered by <strong>Averon HRMS Engine</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
