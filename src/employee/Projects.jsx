import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Users, ExternalLink, ChevronRight, Clock, Target } from 'lucide-react';

const Z = {
  primary: '#2563EB',
  secondary: '#1E293B',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  indigo: '#6366F1',
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/employee/projects', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('employeeToken')}` }
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return Z.success;
      case 'In Progress': return Z.primary;
      case 'Urgent': return Z.danger;
      case 'Delayed': return Z.warning;
      default: return Z.muted;
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: Z.muted }}>Loading projects...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: Z.secondary, margin: 0 }}>My Projects</h1>
        <p style={{ color: Z.muted, marginTop: 4 }}>Manage and track your active project involvement.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {projects.length > 0 ? projects.map((project) => (
          <div key={project._id} style={{
            background: Z.card,
            borderRadius: 16,
            padding: 24,
            border: `1px solid ${Z.border}`,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
          }}>
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: 4, height: '100%', 
              background: getStatusColor(project.status) 
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: `${Z.primary}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: Z.primary
              }}>
                <Briefcase size={24} />
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: `${getStatusColor(project.status)}15`,
                color: getStatusColor(project.status)
              }}>
                {project.status}
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: Z.secondary, marginBottom: 8 }}>{project.name}</h3>
            <p style={{ fontSize: 14, color: Z.muted, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={14} /> Client: <span style={{ color: Z.text, fontWeight: 500 }}>{project.client || 'Internal'}</span>
            </p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: Z.muted, marginBottom: 6 }}>
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div style={{ height: 6, background: Z.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${project.progress}%`, height: '100%', background: Z.primary, borderRadius: 3 }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 16, borderTop: `1px solid ${Z.border}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Deadline</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: Z.secondary, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} /> {new Date(project.deadline).toLocaleDateString()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: Z.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Team Size</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: Z.secondary, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} /> {project.teamMembers?.length || 0} Members
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', padding: 60, textAlign: 'center', background: '#fff', borderRadius: 20, border: `1px dashed ${Z.border}` }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: Z.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: Z.muted }}>
              <Briefcase size={32} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: Z.secondary }}>No Projects Assigned</h3>
            <p style={{ color: Z.muted }}>You are not currently listed as a team member on any active projects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
