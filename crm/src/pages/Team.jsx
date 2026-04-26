import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Award, TrendingUp } from 'lucide-react';
import { SectionHeader, Card, StatusChip } from '../components/ui';

export default function Team() {
  const team = useSelector(s => s.team.items);
  const maxRevenue = Math.max(...team.map(m => m.revenue));

  const avatarGradients = [
    'from-blue-600 to-indigo-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-orange-600'
  ];

  const ringColors = [
    'ring-blue-100',
    'ring-purple-100',
    'ring-emerald-100',
    'ring-amber-100'
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Team Directory" 
        subtitle={`${team.length} specialists · Engineering & Operations`} 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, i) => {
          const revenueProgress = Math.round((member.revenue / maxRevenue) * 100);
          const gradient = avatarGradients[i % 4];
          const ring = ringColors[i % 4];

          return (
            <div key={member.id} className="group relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Member Header */}
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${gradient} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <div className="w-full h-full rounded-[1.4rem] bg-white p-0.5">
                    <div className={`w-full h-full rounded-[1.2rem] bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl font-black text-white`}>
                      {member.avatar}
                    </div>
                  </div>
                </div>
                
                <h3 className="mt-4 text-[16px] font-black text-slate-800 tracking-tight">{member.name}</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                
                <div className="mt-4">
                  <StatusChip label={member.status} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { label: 'Leads', value: member.leads, icon: Award, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Deals', value: member.deals, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-50/50 rounded-2xl p-3 text-center border border-slate-50">
                    <p className="text-lg font-black text-slate-800">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Progress */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Achieved</span>
                  <span className="text-[12px] font-black text-indigo-600">₹{(member.revenue / 1000).toFixed(0)}k</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000`}
                    style={{ width: `${revenueProgress}%` }}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-center gap-4">
                <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title={member.email}>
                  <Mail size={16} />
                </button>
                <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Call Member">
                  <Phone size={16} />
                </button>
                <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Office Location">
                  <MapPin size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
