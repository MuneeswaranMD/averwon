import React from 'react';
import { 
  Wrench, ExternalLink, Mail, MessageSquare, 
  Globe, Shield, Cpu, Cloud, FileText, 
  Terminal, Layout, Zap 
} from 'lucide-react';

const Z = {
  primary: '#2563EB',
  secondary: '#1E293B',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
};

const TOOLS = [
  {
    category: 'Communication',
    items: [
      { name: 'Corporate Email', icon: Mail, desc: 'Access your official Averqon email account.', link: 'https://mail.google.com' },
      { name: 'Slack / Teams', icon: MessageSquare, desc: 'Internal team communication and collaboration.', link: 'https://slack.com' },
    ]
  },
  {
    category: 'Development',
    items: [
      { name: 'GitHub', icon: Terminal, desc: 'Source control and code repository management.', link: 'https://github.com/Averqon' },
      { name: 'Jira / Trello', icon: Layout, desc: 'Project tracking and management tools.', link: 'https://atlassian.com' },
    ]
  },
  {
    category: 'Resources',
    items: [
      { name: 'Company Wiki', icon: Globe, desc: 'Internal documentation and company policies.', link: '#' },
      { name: 'IT Support', icon: Shield, desc: 'Submit tickets for hardware or software issues.', link: '/employee/tasks' },
    ]
  },
  {
    category: 'Productivity',
    items: [
      { name: 'Cloud Drive', icon: Cloud, desc: 'Shared storage for project files and assets.', link: 'https://drive.google.com' },
      { name: 'AI Assistant', icon: Zap, desc: 'Leverage Averqon AI for productivity.', link: '#' },
    ]
  }
];

const Tools = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: Z.secondary, margin: 0 }}>Company Tools</h1>
        <p style={{ color: Z.muted, marginTop: 4 }}>Quick access to internal and external resources.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {TOOLS.map((group) => (
          <section key={group.category}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: Z.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 2, background: Z.primary }} /> {group.category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {group.items.map((tool) => (
                <a 
                  key={tool.name} 
                  href={tool.link} 
                  target={tool.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  style={{
                    background: Z.card,
                    borderRadius: 12,
                    padding: 20,
                    border: `1px solid ${Z.border}`,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = Z.primary;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = Z.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: `${Z.primary}08`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: Z.primary, flexShrink: 0
                  }}>
                    <tool.icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: Z.secondary, fontSize: 15 }}>{tool.name}</span>
                      <ExternalLink size={12} color={Z.muted} />
                    </div>
                    <p style={{ fontSize: 13, color: Z.muted, margin: 0, lineHeight: 1.5 }}>{tool.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Tools;
