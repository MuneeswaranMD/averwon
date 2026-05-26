import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  UserCheck, 
  Settings, 
  CheckSquare, 
  Users,
  Loader2, 
  AlertCircle,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { API_ENDPOINTS } from '../api-config';

const Z = {
  accent: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  teal: '#06B6D4',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  cardBg: '#FFFFFF',
  pageBg: '#F8FAFC',
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: Z.cardBg, borderRadius: 16, border: `1px solid ${Z.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '24px', ...style }}>
    {children}
  </div>
);

// All possible system permission keys that can be toggled
const ALL_PERMISSIONS = [
  { group: 'Core Portal', permission: 'Dashboard', label: 'Dashboard Control' },
  { group: 'Core Portal', permission: 'My Profile', label: 'My Profile Page' },
  { group: 'Core Portal', permission: 'My Projects', label: 'Project Management' },
  { group: 'Core Portal', permission: 'My Tasks', label: 'Task Checklist' },
  { group: 'Core Portal', permission: 'Attendance', label: 'Check-in & Clock' },
  { group: 'Core Portal', permission: 'Leave Requests', label: 'Leaves Panel' },
  { group: 'Core Portal', permission: 'Meetings', label: 'Video Meetings' },
  { group: 'Core Portal', permission: 'Activity Logs', label: 'Activity Logs' },
  { group: 'Core Portal', permission: 'Live Chat', label: 'Employee Live Chat' },
  { group: 'Core Portal', permission: 'Tools', label: 'Internal Developer Tools' },
  { group: 'Core Portal', permission: 'Calendar', label: 'Corporate Calendar' },
  { group: 'Core Portal', permission: 'Notifications', label: 'Notification Alerts' },
  { group: 'Core Portal', permission: 'Documents', label: 'Vault Documents' },
  
  { group: 'Sales & CRM', permission: 'Sales Dashboard', label: 'Sales Performance Dashboard' },
  { group: 'Sales & CRM', permission: 'Leads', label: 'Qualified Leads Manager' },
  { group: 'Sales & CRM', permission: 'Deals', label: 'Deals & Pipeline Grid' },
  
  { group: 'System Operations', permission: 'Admins', label: 'Employee Access Panel (Admins)' },
  { group: 'System Operations', permission: 'Settings', label: 'Global Settings Adjustment' },
];

const Admins = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Accordion
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const navigate = useNavigate();

  const fetchEmployees = () => {
    const token = localStorage.getItem('employeeToken');
    if (!token) { navigate('/employee/login'); return; }

    fetch(API_ENDPOINTS.EMPLOYEE_ADMIN_EMPLOYEES, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('employeeToken');
          localStorage.removeItem('employeeData');
          navigate('/employee/login');
          throw new Error('Session expired. Please log in.');
        }
        if (res.status === 403) {
          throw new Error('Access denied: You do not have permission to view the Access Management control center.');
        }
        return res.json();
      })
      .then(d => {
        if (d.error) throw new Error(d.error);
        setEmployees(d);
        setFilteredEmployees(d);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
  }, [navigate]);

  // Handle Search Filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredEmployees(employees.filter(e => 
        e.name?.toLowerCase().includes(q) || 
        e.department?.toLowerCase().includes(q) || 
        e.designation?.toLowerCase().includes(q)
      ));
    }
  }, [searchQuery, employees]);

  const handleExpandEmployee = (emp) => {
    if (expandedEmployee === emp._id) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(emp._id);
      // Initialize checkboxes state
      const defaultPages = emp.allowedPages || [
        'Dashboard', 'My Profile', 'My Projects', 'My Tasks', 'Attendance', 
        'Leave Requests', 'Meetings', 'Activity Logs', 'Live Chat', 'Tools', 
        'Calendar', 'Notifications', 'Documents', 'Settings'
      ];
      setSelectedPermissions(
        ALL_PERMISSIONS.reduce((acc, perm) => {
          acc[perm.permission] = defaultPages.includes(perm.permission);
          return acc;
        }, {})
      );
      setSaveSuccess(null);
    }
  };

  const handleCheckboxChange = (perm) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [perm]: !prev[perm]
    }));
  };

  const handleToggleGroup = (groupName, checked) => {
    setSelectedPermissions(prev => {
      const updated = { ...prev };
      ALL_PERMISSIONS.forEach(p => {
        if (p.group === groupName) {
          updated[p.permission] = checked;
        }
      });
      return updated;
    });
  };

  const handleSavePermissions = (empId) => {
    const token = localStorage.getItem('employeeToken');
    if (!token) return;

    setSavingId(empId);
    setSaveSuccess(null);

    // Filter checked keys
    const allowedPages = Object.keys(selectedPermissions).filter(key => selectedPermissions[key]);

    fetch(API_ENDPOINTS.EMPLOYEE_ADMIN_ACCESS_UPDATE(empId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ allowedPages })
    })
      .then(res => res.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setSaveSuccess(empId);
        // Refresh local employee array cleanly
        setEmployees(prev => prev.map(e => e._id === empId ? { ...e, allowedPages } : e));
        setTimeout(() => setSaveSuccess(null), 3000);
      })
      .catch(err => alert(`Error saving access: ${err.message}`))
      .finally(() => setSavingId(null));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', flexDirection: 'column', gap: 16 }}>
      <Loader2 size={40} color={Z.accent} style={{ animation: 'spin 1s linear infinite' }} />
      <div style={{ color: Z.muted, fontSize: 15, fontWeight: 500 }}>Loading employee credential records...</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 24, background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', color: Z.danger }}>
      <AlertCircle size={24} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Unauthorized / Access Restricted</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>{error}</div>
      </div>
    </div>
  );

  // Group permissions
  const groups = ['Core Portal', 'Sales & CRM', 'System Operations'];

  return (
    <div style={{ color: Z.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)', 
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
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Role Access Control Center</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '6px 0 0 0', fontWeight: 500 }}>
            Authorize portal menus, restrict system operations, and audit user permissions globally.
          </p>
        </div>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Shield size={28} color="#C7D2FE" />
        </div>
      </div>

      {/* Toolbar Search Box */}
      <Card style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color={Z.muted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search employees by name, department, designation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 16px 11px 42px',
              borderRadius: 10,
              border: `1.5px solid ${Z.border}`,
              fontSize: 13.5,
              background: '#F8FAFC',
              color: Z.text,
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = Z.accent}
            onBlur={e => e.target.style.borderColor = Z.border}
          />
        </div>
      </Card>

      {/* Grid List of Employee Folders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredEmployees.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '40px 0', color: Z.muted }}>
            <Users size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>No employee matches found</div>
          </Card>
        ) : (
          filteredEmployees.map(emp => {
            const isExpanded = expandedEmployee === emp._id;
            const permittedCount = emp.allowedPages ? emp.allowedPages.length : 14;
            return (
              <Card key={emp._id} style={{ padding: 0, overflow: 'hidden' }}>
                {/* Employee Row Summary */}
                <div 
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? '#F8FAFC' : 'transparent',
                    transition: 'background 0.2s',
                    gap: 16
                  }}
                  onClick={() => handleExpandEmployee(emp)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: emp.status === 'Inactive' ? Z.muted : Z.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#ffffff', fontWeight: 700, fontSize: 16,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                      {emp.name ? emp.name.charAt(0) : 'E'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {emp.name}
                        <span style={{
                          padding: '3px 6px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                          background: emp.status === 'Active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: emp.status === 'Active' ? Z.success : Z.danger
                        }}>{emp.status}</span>
                      </div>
                      <div style={{ color: Z.muted, fontSize: 12.5, marginTop: 4 }}>
                        {emp.designation || 'Staff'} • <strong style={{ color: Z.text }}>{emp.department || 'Operations'}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {/* Access Badges Count */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Menu Toggles</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, color: Z.accent }}>
                        <Sliders size={14} /> {permittedCount} of {ALL_PERMISSIONS.length} allowed
                      </div>
                    </div>
                    
                    {isExpanded ? <ChevronUp size={18} color={Z.muted} /> : <ChevronDown size={18} color={Z.muted} />}
                  </div>
                </div>

                {/* Expanded Checkboxes Controls */}
                {isExpanded && (
                  <div style={{ padding: '24px 28px', borderTop: `1px solid ${Z.border}`, background: '#FFFFFF' }}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <UserCheck size={16} color={Z.accent} /> System Menu Authorization Matrix
                      </h4>
                      {saveSuccess === emp._id && (
                        <div style={{ fontSize: 13, color: Z.success, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={16} /> Matrix updated successfully!
                        </div>
                      )}
                    </div>

                    {/* Matrix Row groups */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
                      {groups.map(group => {
                        const groupPerms = ALL_PERMISSIONS.filter(p => p.group === group);
                        const allGroupChecked = groupPerms.every(p => selectedPermissions[p.permission]);
                        return (
                          <div key={group} style={{ border: `1px solid ${Z.border}`, borderRadius: 10, padding: 16, background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: `1.5px solid ${Z.border}`, paddingBottom: 8 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 800, color: Z.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{group} Pages</span>
                              <button
                                type="button"
                                onClick={() => handleToggleGroup(group, !allGroupChecked)}
                                style={{ border: 'none', background: 'transparent', color: Z.accent, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                              >
                                {allGroupChecked ? 'Deselect All' : 'Select All'}
                              </button>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                              {groupPerms.map(p => (
                                <label 
                                  key={p.permission}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '8px 12px',
                                    borderRadius: 6,
                                    background: '#FFFFFF',
                                    border: `1px solid ${selectedPermissions[p.permission] ? Z.accent : Z.border}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    userSelect: 'none'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor = Z.accent}
                                  onMouseLeave={e => { if(!selectedPermissions[p.permission]) e.currentTarget.style.borderColor = Z.border; }}
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={!!selectedPermissions[p.permission]}
                                    onChange={() => handleCheckboxChange(p.permission)}
                                    style={{
                                      width: 16, height: 16,
                                      cursor: 'pointer',
                                      accentColor: Z.accent
                                    }}
                                  />
                                  <span style={{ fontSize: 13, fontWeight: 500, color: Z.text }}>{p.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => setExpandedEmployee(null)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: 8,
                          border: `1.5px solid ${Z.border}`,
                          background: '#FFF',
                          color: Z.muted,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = Z.pageBg}
                        onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSavePermissions(emp._id)}
                        disabled={savingId === emp._id}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: 'none',
                          background: Z.accent,
                          color: '#FFFFFF',
                          fontSize: 13,
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
                        {savingId === emp._id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save size={16} /> Commit Access Matrix
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Admins;
