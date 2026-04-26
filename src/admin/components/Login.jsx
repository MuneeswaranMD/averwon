import React, { useState } from 'react';

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

import { auth } from '../../lib/firebase.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = (props) => {
  const { action, message, branding } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // If successful, we can auto-fill and submit or hit a special endpoint
      // For now, let's fill the email and a "magic" password the server recognizes
      // or redirect to a callback route if we set one up.
      
      // Simpler approach for AdminJS integration:
      // Post to a dedicated Google Auth endpoint that sets the session
      const response = await fetch('/api/admin/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email,
          uid: user.uid,
          idToken: await user.getIdToken()
        })
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Google login failed for this account');
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError(err.message);
    }
  };

  const handleDemoLogin = (e) => {
    const form = e.currentTarget.closest('form');
    setEmail('admin@averqon.ai');
    setPassword('admin123');
    setTimeout(() => {
      form.submit();
    }, 50);
  };

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
        {(message || error) && (
          <div style={{
            padding: '12px',
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            borderRadius: '8px',
            color: '#991B1B',
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            {error || message.message}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@averqon.ai"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#FFFFFF';
              }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
              Login with Google
            </button>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: `${C.primary}10`,
                border: `1px solid ${C.primary}30`,
                color: C.primary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = `${C.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = `${C.primary}10`;
              }}
            >
              🚀 One-Click Demo Login
            </button>
          </div>
        </form>

        <div style={{ marginTop: '24px' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: C.textMuted,
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = C.primary}
            onMouseLeave={(e) => e.target.style.color = C.textMuted}
          >
            ← Back to Main Website
          </a>
        </div>

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
