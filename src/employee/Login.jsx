import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  pageBg: '#F8FAFC',
  white: '#FFFFFF',
  red: '#EF4444',
  inputBg: '#F1F5F9',
};

const Login = () => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    const demoEmail = 'sarah.c@averqon.ai';
    const demoPassword = 'employee123';
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      const res  = await fetch(API_ENDPOINTS.EMPLOYEE_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword, rememberMe: remember }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('employeeToken', data.token);
        localStorage.setItem('employeeData', JSON.stringify(data.employee));
        navigate('/employee/dashboard');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(API_ENDPOINTS.EMPLOYEE_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: remember }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('employeeToken', data.token);
        localStorage.setItem('employeeData', JSON.stringify(data.employee));
        navigate('/employee/dashboard');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F7FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: 20,
    }}>
      <div style={{
        background: Z.white,
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        width: '100%',
        maxWidth: 420,
        overflow: 'hidden',
      }}>
        {/* Header band */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          padding: '40px 36px 36px',
          textAlign: 'center',
        }}>
          <img src="/logo.png" alt="Averqon" style={{ height: 40, marginBottom: 16, objectFit: 'contain' }} />
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: 0.5 }}>Employee Portal</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Sign in to your workspace</div>
        </div>

        {/* Form */}
        <div style={{ padding: '32px 36px' }}>
          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FED7D7',
              borderRadius: 8, padding: '10px 14px',
              color: Z.red, fontSize: 13, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: Z.text, marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@averqon.com"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 14px',
                    border: `1.5px solid ${Z.border}`,
                    borderRadius: 8, fontSize: 14,
                    background: Z.inputBg, color: Z.text,
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = Z.accent}
                  onBlur={e => e.target.style.borderColor = Z.border}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: Z.text, marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '11px 14px',
                    border: `1.5px solid ${Z.border}`,
                    borderRadius: 8, fontSize: 14,
                    background: Z.inputBg, color: Z.text,
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = Z.accent}
                  onBlur={e => e.target.style.borderColor = Z.border}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    border: 'none', background: 'none', cursor: 'pointer', display: 'flex', color: Z.muted,
                  }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: Z.text }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: Z.accent }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: 13, color: Z.accent, textDecoration: 'none' }}>Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#93C5FD' : Z.accent,
                color: '#fff', border: 'none',
                borderRadius: 8, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: 0.3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = Z.accentHover; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = Z.accent; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Demo Employee Login */}
            <button
              type="button"
              disabled={loading}
              onClick={handleDemoLogin}
              style={{
                width: '100%', padding: '12px',
                marginTop: 12,
                background: '#F0FDF4',
                color: '#166534',
                border: '1px solid #BBF7D0',
                borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#DCFCE7'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#F0FDF4'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#166534' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Demo Employee Login
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: Z.muted }}>
            Don't have an account? Contact your <span style={{ color: Z.accent, fontWeight: 600 }}>HR Department</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#F8FAFD', borderTop: `1px solid ${Z.border}`,
          padding: '12px 36px', textAlign: 'center',
          fontSize: 11, color: Z.muted,
        }}>
          © 2025 Averqon HRMS · All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Login;
