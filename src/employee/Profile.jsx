import React, { useState, useEffect } from 'react';

import { 
  Camera, 
  IdCard, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  User, 
  Calendar, 
  CreditCard, 
  Users, 
  Edit3,
  Circle,
  Lock
} from 'lucide-react';

const Z = {
  accent:  '#2563EB',
  success: '#10B981',
  text:    '#1E293B',
  muted:   '#64748B',
  border:  '#E2E8F0',
  cardBg:  '#FFFFFF',
  pageBg:  '#F8FAFC',
  inputBg: '#F1F5F9',
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: Z.cardBg, borderRadius: 12,
    border: `1px solid ${Z.border}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    ...style,
  }}>{children}</div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${Z.border}` }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: `${Z.accent}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={16} color={Z.accent} />
    </div>
    <div>
      <div style={{ fontSize: 11, color: Z.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: Z.text }}>{value || '-'}</div>
    </div>
  </div>
);

const SectionHeader = ({ title }) => (
  <div style={{
    fontSize: 13, fontWeight: 700, color: Z.muted,
    textTransform: 'uppercase', letterSpacing: 0.8,
    padding: '20px 0 10px',
    borderBottom: `2px solid ${Z.accent}`,
    marginBottom: 16,
  }}>{title}</div>
);

const Profile = () => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('employeeData');
    if (data) setEmployee(JSON.parse(data));
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: Z.text }}>

      {/* Page header band */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
        borderRadius: 16, padding: '28px 32px',
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 24,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}>
        <img src="/logo.png" alt="Averqon" style={{ height: 36, objectFit: 'contain' }} />
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>My Profile</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>View and manage your personal information</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 22, alignItems: 'start' }}>

        {/* Left: Avatar card */}
        <Card style={{ padding: '28px 22px', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, fontWeight: 800, color: '#fff',
              margin: '0 auto',
              border: `4px solid ${Z.border}`,
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.25)',
            }}>
              {employee?.name?.charAt(0) || 'E'}
            </div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: Z.accent, border: '2px solid white',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Camera size={14} color="#fff" />
            </button>
          </div>

          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{employee?.name || 'Employee Name'}</div>
          <div style={{ fontSize: 13, color: Z.muted, marginBottom: 12 }}>{employee?.designation || 'Staff'}</div>

          <span style={{
            display: 'inline-block', padding: '4px 12px',
            background: `${Z.success}15`, color: Z.success,
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            marginBottom: 20,
          }}><Circle size={8} fill={Z.success} /> {employee?.status || 'Active'}</span>

          <div style={{ borderTop: `1px solid ${Z.border}`, paddingTop: 16, textAlign: 'left' }}>
            <InfoRow icon={IdCard} label="Employee ID" value={employee?.employeeId} />
            <InfoRow icon={Mail} label="Email"        value={employee?.email} />
            <InfoRow icon={Phone} label="Phone"        value={employee?.phone} />
            <InfoRow icon={MapPin} label="Address"      value={employee?.address} />
          </div>

          <button style={{
            marginTop: 18, width: '100%', padding: '10px',
            background: Z.accent, color: '#fff',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Edit3 size={14} /> Edit Profile
          </button>
        </Card>

        {/* Right: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Professional Details */}
          <Card style={{ padding: '24px 26px' }}>
            <SectionHeader title="Professional Details" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
              <InfoRow icon={Building2} label="Department"       value={employee?.department} />
              <InfoRow icon={Briefcase} label="Designation"      value={employee?.designation} />
              <InfoRow icon={User} label="Role"             value={employee?.role} />
              <InfoRow icon={Calendar} label="Joining Date"     value={employee?.joinDate ? new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
              <InfoRow icon={CreditCard} label="Salary"           value={employee?.salary ? `₹${Number(employee.salary).toLocaleString()}` : null} />
              <InfoRow icon={Users} label="Reporting Manager" value="Sarah Chen" />
            </div>
          </Card>

          {/* Change Password */}
          <Card style={{ padding: '24px 26px' }}>
            <SectionHeader title="Account Security" />
            <div style={{ color: Z.muted, fontSize: 13, marginBottom: 18 }}>
              Update your password to keep your account secure.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {['New Password', 'Confirm Password'].map(lbl => (
                <div key={lbl}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: Z.text, marginBottom: 6 }}>{lbl}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px 14px',
                      border: `1.5px solid ${Z.border}`, borderRadius: 8,
                      fontSize: 14, background: Z.inputBg, outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = Z.accent}
                    onBlur={e => e.target.style.borderColor = Z.border}
                  />
                </div>
              ))}
            </div>
            <button style={{
              padding: '10px 24px', background: Z.accent,
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Lock size={14} /> Change Password
            </button>
          </Card>

          {/* Emergency contacts */}
          <Card style={{ padding: '24px 26px' }}>
            <SectionHeader title="Emergency Contacts" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { name: 'John Doe', rel: 'Brother', phone: '+1 987 654 321' },
                { name: 'Mary Jane', rel: 'Mother', phone: '+1 555 444 333' },
              ].map((c, i) => (
                <div key={i} style={{ background: Z.inputBg, borderRadius: 10, padding: '14px 16px', border: `1px solid ${Z.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: Z.muted, marginBottom: 8 }}>{c.rel}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: Z.accent, fontWeight: 600 }}>
                    <Phone size={14} /> {c.phone}
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

export default Profile;
