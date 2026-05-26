import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Building, 
  Globe, 
  Clock, 
  Sun, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  cardBg: '#FFFFFF',
  pageBg: '#F8FAFC',
  inputBg: '#FFFFFF',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 16, border: `1px solid ${Z.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '28px', ...style }}>
    {children}
  </div>
);

const SystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) { navigate('/employee/login'); return; }

    fetch(API_ENDPOINTS.EMPLOYEE_ADMIN_SETTINGS, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('employeeData');
          navigate('/employee/login');
          throw new Error('Session expired. Please log in.');
        }
        return res.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setSettings(d);
        setCompanyName(d.companyName || 'Averqon');
        setTheme(d.theme || 'Light');
        setLanguage(d.language || 'English');
        setTimeZone(d.timeZone || 'Asia/Kolkata');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('Company name cannot be blank!');
      return;
    }

    const token = localStorage.getItem('employeeToken');
    if (!token || !settings?._id) return;

    setSaving(true);
    setSaveSuccess(false);

    fetch(API_ENDPOINTS.EMPLOYEE_ADMIN_SETTINGS_UPDATE(settings._id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        companyName,
        theme,
        language,
        timeZone
      })
    })
      .then(res => {
        if (res.status === 403) {
          throw new Error('Access Denied: You do not have permission to modify system settings.');
        }
        return res.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setSettings(d);
        setSaveSuccess(true);
        // Dispatch custom event to notify layout sidebar to reload
        window.dispatchEvent(new Event('brandSettingsUpdated'));
      })
      .catch(err => setError(err.message))
      .finally(() => setSaving(false));
  };

  const handleHotReload = () => {
    window.location.reload();
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: Z.muted, fontSize: 15, fontWeight: 500 }}>Loading global configurations...</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 24, background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', color: Z.danger }}>
      <AlertCircle size={24} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Access Denied / System Error</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div style={{ color: Z.text, fontFamily: "'Inter', sans-serif", maxWidth: 800, margin: '0 auto' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', 
        borderRadius: 16,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        boxShadow: '0 10px 25px -5px rgba(15,23,42,0.15)',
        color: '#FFFFFF'
      }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>System Global Settings</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '6px 0 0 0', fontWeight: 500 }}>
            Configure corporate branding assets, platform locales, default themes, and system timezones.
          </p>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Settings size={28} color="#E2E8F0" />
        </div>
      </div>

      {/* Success notification banner */}
      {saveSuccess && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: 12,
          color: Z.success,
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 24,
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={20} />
            <span>Platform configurations committed successfully! Hot-reload to sync immediately.</span>
          </div>
          <button 
            onClick={handleHotReload}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: Z.success,
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <RefreshCw size={13} /> Sync Brand
          </button>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section: Corporate Branding */}
          <Card>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 15, fontWeight: 800, borderBottom: `1.5px solid ${Z.border}`, paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={18} color={Z.accent} /> Corporate Branding Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: Z.muted }}>Company Display Name</label>
              <input 
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Enter corporate brand name (e.g. Averqon)"
                style={{
                  padding: '11px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${Z.border}`,
                  background: Z.inputBg,
                  color: Z.text,
                  fontSize: 13.5,
                  fontWeight: 500,
                  outline: 'none',
                  marginTop: 4,
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: 11, color: Z.muted, marginTop: 4 }}>
                This is displayed in the sidebar logo header, page titles, and transactional reports portal-wide.
              </span>
            </div>
          </Card>

          {/* Section: Localization & Theme Preferences */}
          <Card>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 15, fontWeight: 800, borderBottom: `1.5px solid ${Z.border}`, paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={18} color={Z.purple} /> Regional & Visual Localization
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Theme selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: Z.muted }}>Default Interface Theme</label>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1.5px solid ${Z.border}`,
                    background: '#FFF',
                    fontSize: 13,
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                >
                  <option value="Light">Light Mode Theme</option>
                  <option value="Dark">Dark Mode Theme</option>
                  <option value="System">System Default Theme</option>
                </select>
              </div>

              {/* Language selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: Z.muted }}>Primary Portal Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1.5px solid ${Z.border}`,
                    background: '#FFF',
                    fontSize: 13,
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                >
                  <option value="English">English (United States)</option>
                  <option value="Hindi">Hindi (India)</option>
                  <option value="Spanish">Spanish (Latin America)</option>
                  <option value="French">French (Europe)</option>
                  <option value="Tamil">Tamil (India)</option>
                </select>
              </div>

              {/* Timezone selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: Z.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} /> Corporate Server Timezone
                </label>
                <select
                  value={timeZone}
                  onChange={e => setTimeZone(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1.5px solid ${Z.border}`,
                    background: '#FFF',
                    fontSize: 13,
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                >
                  <option value="Asia/Kolkata">India Standard Time (IST) - GMT+05:30 (Asia/Kolkata)</option>
                  <option value="UTC">Coordinated Universal Time (UTC) - GMT+00:00 (UTC)</option>
                  <option value="America/New_York">Eastern Standard Time (EST) - GMT-05:00 (America/New_York)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT) - GMT+00:00 (Europe/London)</option>
                  <option value="Asia/Singapore">Singapore Standard Time (SST) - GMT+08:00 (Asia/Singapore)</option>
                </select>
                <span style={{ fontSize: 11.5, color: Z.muted, marginTop: 4 }}>
                  Setting this forces Date formatting, log generation, and attendance check-in trackers to align cleanly with regional guidelines.
                </span>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate('/employee/dashboard')}
              style={{
                padding: '11px 20px',
                borderRadius: 8,
                border: `1.5px solid ${Z.border}`,
                background: '#FFF',
                color: Z.muted,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = Z.pageBg}
              onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
            >
              Discard Changes
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '11px 24px',
                borderRadius: 8,
                border: 'none',
                background: Z.accent,
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = Z.accentHover}
              onMouseLeave={e => e.currentTarget.style.background = Z.accent}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Saving Config...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Configurations
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
