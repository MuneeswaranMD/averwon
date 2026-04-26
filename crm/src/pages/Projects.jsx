import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Calendar, Clock, Users, IndianRupee, BarChart3 } from 'lucide-react';
import { 
  SectionHeader, 
  StatusChip, 
  Card, 
  Button 
} from '../components/ui';

export default function Projects() {
  const projects = useSelector(s => s.projects.items);
  const [tab, setTab] = useState('All');

  const tabs = ['All', 'In Progress', 'Completed', 'Planning'];
  const statusFilter = tab === 'All' ? projects : projects.filter(p => p.status === tab);
  
  const statusColors = { 
    'In Progress': 'bg-amber-500', 
    'Completed': 'bg-emerald-500', 
    'Planning': 'bg-blue-600' 
  };

  const statusTextColors = { 
    'In Progress': 'text-amber-600', 
    'Completed': 'text-emerald-600', 
    'Planning': 'text-blue-600' 
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Projects"
        subtitle={`${projects.length} total · ${projects.filter(p => p.status === 'In Progress').length} active`}
        action={<Button icon={Plus}>New Project</Button>}
      />

      {/* Modern Tabs */}
      <div className="flex p-1 bg-slate-100/50 rounded-2xl w-fit mb-8">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              tab === t 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statusFilter.map(project => {
          const budgetPct = Math.round((project.spent / project.budget) * 100);
          const colorClass = statusColors[project.status] || 'bg-slate-400';
          const textClass = statusTextColors[project.status] || 'text-slate-400';
          
          return (
            <div 
              key={project.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {project.client}
                  </p>
                </div>
                <StatusChip label={project.status} size="medium" />
              </div>

              {/* Progress Section */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Completion Rate</span>
                  </div>
                  <span className={`text-[13px] font-black ${textClass}`}>{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colorClass} transition-all duration-500`} 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Budget</span>
                    <span className={budgetPct > 90 ? 'text-rose-500' : 'text-emerald-500'}>
                      {budgetPct}% Used
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-800">
                    ₹{project.budget.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Deadline
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                    <Calendar size={14} className="text-slate-300" />
                    {project.deadline}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-1.5 mr-auto">
                  <Users size={14} className="text-slate-300" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Team:</span>
                </div>
                {project.team.map(member => (
                  <span 
                    key={member} 
                    className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
