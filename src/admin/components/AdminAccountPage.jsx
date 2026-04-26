import React, { useState, useEffect, useCallback } from 'react';

const C = {
  bg: '#F8FAFC', white: '#FFFFFF', primary: '#2563EB', border: '#E2E8F0',
  text: '#0F172A', success: '#10B981', warning: '#F59E0B', error: '#E11D48',
  muted: '#64748B', purple: '#8B5CF6', primaryLight: '#EFF6FF', cyan: '#0EA5E9'
};

const card = { background: C.white, borderRadius: '14px', border: `1px solid ${C.border}`, padding: '24px' };
const inp = { border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', color: C.text, width: '100%', boxSizing: 'border-box', background: C.white };
const labelSt = { fontSize: '12px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

const DEFAULT_FORM = { email: '', password: '', role: 'Admin' };

const ROLES = ['Super Admin', 'Admin', 'HR Manager', 'Finance Manager', 'Sales Manager', 'Viewer'];

const Toast = ({ msg, ok }) => (
  <div style={{ position: 'fixed', bottom: '28px', right: '28px', padding: '14px 22px', background: ok ? C.success : C.error, color: '#fff', borderRadius: '12px', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px' }}>
    {ok ? '✅' : '❌'} {msg}
  </div>
);

const Avatar = ({ email, size = 40 }) => {
  const initials = email ? email.slice(0, 2).toUpperCase() : 'AD';
  const colors = ['#1A73E8', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
  const colorIndex = email ? email.charCodeAt(0) % colors.length : 0;
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', background: colors[colorIndex], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: `${size * 0.36}px`, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

export default function AdminAccountPage() {
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/system/admins');
      const d = await r.json();
      setAdmins(d.records || []);
      setStats(d.stats || {});
    } catch { console.error('Failed to load admins'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = admins.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.email?.toLowerCase().includes(q))
      && (roleFilter === 'All' || (a.role || 'Admin') === roleFilter);
  });

  const save = async () => {
    if (!form.email) return showToast('Email is required.', false);
    if (!editItem && !form.password) return showToast('Password is required for new admin.', false);
    try {
      const url = editItem ? `/api/admin/system/admins/${editItem._id}` : '/api/admin/system/admins';
      const method = editItem ? 'PUT' : 'POST';
      const body = { email: form.email, role: form.role };
      if (form.password) body.password = form.password;
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) { const e = await r.json(); return showToast(e.error || 'Save failed.', false); }
      showToast(editItem ? 'Admin updated successfully!' : 'Admin account created!');
      setShowForm(false); setEditItem(null); setForm(DEFAULT_FORM);
      load();
    } catch { showToast('Save failed.', false); }
  };

  const del = async (id) => {
    try {
      await fetch(`/api/admin/system/admins/${id}`, { method: 'DELETE' });
      showToast('Admin account deleted.');
      setConfirmDelete(null);
      load();
    } catch { showToast('Delete failed.', false); }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ email: item.email, password: '', role: item.role || 'Admin' });
    setShowForm(true);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

  return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: C.text }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Admin Accounts</h1>
          <p style={{ margin: '6px 0 0', color: C.muted, fontSize: '14px' }}>Manage administrator access, roles, and permissions</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditItem(null); setForm(DEFAULT_FORM); }}
          style={{ padding: '11px 24px', background: C.primary, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
          + Add Admin
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Admins', value: stats.total || 0, color: C.text },
          { label: 'Super Admins', value: stats.superAdmins || 0, color: C.primary },
          { label: 'Active Today', value: stats.activeToday || 0, color: C.success },
          { label: 'Roles Assigned', value: stats.rolesCount || 0, color: C.purple },
        ].map(s => (
          <div key={s.label} style={card}>
            <div style={{ fontSize: '12px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ ...card, marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input style={{ ...inp, width: '260px' }} placeholder="🔍 Search by email..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...inp, width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          {['All', ...ROLES].map(r => <option key={r}>{r}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', color: C.muted, fontSize: '12px' }}>{filtered.length} account{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Admin Cards Grid */}
      {loading ? (
        <div style={{ ...card, textAlign: 'center', padding: '60px', color: C.muted }}>Loading admin accounts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '60px', color: C.muted }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
          <p>No admin accounts found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(admin => {
            const lastLogin = admin.loginHistory?.length > 0 ? admin.loginHistory[admin.loginHistory.length - 1] : null;
            const role = admin.role || 'Admin';
            const isSuperAdmin = role === 'Super Admin';
            return (
              <div key={admin._id} style={{ ...card, display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}>

                {isSuperAdmin && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '3px 10px', borderRadius: '20px', background: '#FFD70020', color: '#B8860B', fontSize: '11px', fontWeight: 700 }}>⭐ Super Admin</div>
                )}

                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <Avatar email={admin.email} size={52} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{admin.email}</div>
                    <div style={{ marginTop: '4px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: C.primaryLight, color: C.primary }}>{role}</span>
                    </div>
                  </div>
                </div>

                {/* Info Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: C.bg, borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: C.muted }}>Last Login</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: lastLogin ? C.success : C.muted }}>{lastLogin ? fmtDate(lastLogin) : 'Never'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: C.bg, borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: C.muted }}>Login Count</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>{admin.loginHistory?.length || 0} sessions</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: C.bg, borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: C.muted }}>Account Status</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: C.success }}>● Active</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button onClick={() => openEdit(admin)}
                    style={{ flex: 1, padding: '9px', border: `1px solid ${C.border}`, borderRadius: '8px', background: C.white, color: C.primary, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => setConfirmDelete(admin)}
                    style={{ flex: 1, padding: '9px', border: `1px solid ${C.error}20`, borderRadius: '8px', background: C.error + '10', color: C.error, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.white, borderRadius: '20px', padding: '36px', width: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 8px', fontWeight: 800, fontSize: '22px' }}>{editItem ? 'Edit Admin Account' : 'Create Admin Account'}</h2>
            <p style={{ margin: '0 0 28px', color: C.muted, fontSize: '14px' }}>{editItem ? 'Update account details or reset password' : 'Set up a new administrator account'}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <span style={labelSt}>Email Address</span>
                <input type="email" style={inp} placeholder="admin@averqon.ai" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>

              <div>
                <span style={labelSt}>{editItem ? 'New Password (leave blank to keep current)' : 'Password'}</span>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} style={{ ...inp, paddingRight: '44px' }} placeholder={editItem ? 'Enter new password to reset...' : 'Min 8 characters'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <button onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: C.muted, fontSize: '16px' }}>{showPw ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div>
                <span style={labelSt}>Role</span>
                <select style={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Role description */}
              <div style={{ padding: '14px', background: C.primaryLight, borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '18px' }}>ℹ️</span>
                <div style={{ fontSize: '12px', color: C.primary }}>
                  <strong>Role Permissions:</strong>
                  {form.role === 'Super Admin' && ' Full access to all modules, system settings, and admin management.'}
                  {form.role === 'Admin' && ' Access to all modules except system settings and admin management.'}
                  {form.role === 'HR Manager' && ' Access limited to HR, Recruitment, and Attendance modules.'}
                  {form.role === 'Finance Manager' && ' Access limited to Finance (Revenue, Invoices, Bills) module.'}
                  {form.role === 'Sales Manager' && ' Access limited to Sales (Leads, Deals, Clients) module.'}
                  {form.role === 'Viewer' && ' Read-only access to all modules. No create/edit/delete permissions.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={save} style={{ flex: 1, padding: '13px', background: C.primary, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>
                {editItem ? '💾 Update Admin' : '➕ Create Admin'}
              </button>
              <button onClick={() => { setShowForm(false); setEditItem(null); setForm(DEFAULT_FORM); }}
                style={{ flex: 1, padding: '13px', background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.white, borderRadius: '20px', padding: '36px', width: '420px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontWeight: 800, fontSize: '20px', color: C.text }}>Delete Admin Account?</h3>
            <p style={{ margin: '0 0 8px', color: C.muted, fontSize: '14px' }}>This will permanently remove</p>
            <p style={{ margin: '0 0 24px', color: C.error, fontWeight: 700 }}>{confirmDelete.email}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => del(confirmDelete._id)} style={{ flex: 1, padding: '13px', background: C.error, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>Delete</button>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '13px', background: C.bg, color: C.text, border: `1px solid ${C.border}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
