import React, { useState, useEffect } from 'react';
import { History, Clock, Tag, User, Activity as ActivityIcon } from 'lucide-react';

const Z = {
  primary: '#2563EB',
  secondary: '#1E293B',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  indigo: '#6366F1',
};

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/employee/activity', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('employeeToken')}` }
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTargetColor = (target) => {
    switch (target) {
      case 'Task': return '#8B5CF6';
      case 'Leave': return '#F59E0B';
      case 'Meeting': return '#10B981';
      case 'Profile': return '#3B82F6';
      default: return Z.muted;
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: Z.muted }}>Loading activity logs...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: Z.secondary, margin: 0 }}>Activity Logs</h1>
        <p style={{ color: Z.muted, marginTop: 4 }}>A chronological record of your actions and system interactions.</p>
      </div>

      <div style={{ background: Z.card, borderRadius: 16, border: `1px solid ${Z.border}`, overflow: 'hidden' }}>
        {activities.length > 0 ? (
          <div style={{ padding: '8px 0' }}>
            {activities.map((act, idx) => (
              <div key={act._id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '20px 24px',
                borderBottom: idx === activities.length - 1 ? 'none' : `1px solid ${Z.border}`,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${getTargetColor(act.target)}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: getTargetColor(act.target), flexShrink: 0
                }}>
                  <ActivityIcon size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, color: Z.text, fontSize: 15 }}>{act.action}</div>
                    <div style={{ fontSize: 12, color: Z.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {new Date(act.time).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    <span style={{ 
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, 
                      background: `${getTargetColor(act.target)}10`, color: getTargetColor(act.target),
                      textTransform: 'uppercase'
                    }}>
                      {act.target}
                    </span>
                    <span style={{ fontSize: 13, color: Z.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={12} /> {act.user}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <History size={48} style={{ color: Z.border, marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: Z.secondary }}>No Activity Found</h3>
            <p style={{ color: Z.muted }}>Your recent actions will appear here once you start using the portal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
