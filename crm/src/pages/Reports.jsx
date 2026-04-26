import React from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Activity, 
  ChevronRight,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { SectionHeader, Card, ProgressRow, UserAvatar } from '../components/ui';

const performanceData = [
  { name: 'Priya Nair', leads: 14, deals: 8 },
  { name: 'Rahul Das', leads: 11, deals: 5 },
  { name: 'Ankit Joshi', leads: 9, deals: 4 },
];

export default function Reports() {
  const leads = useSelector(s => s.leads.items);
  const deals = useSelector(s => s.deals.items);
  
  const gridColor = '#F1F5F9';
  const textColor = '#94A3B8';

  const conversionRate = Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100);
  const wonDeals = deals.filter(d => d.stage === 'Won');

  const leadsByStatus = [
    { name: 'New', value: leads.filter(l => l.status === 'New').length },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length },
    { name: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length },
    { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Reports & Analytics" subtitle="Performance metrics and business insights" />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Deals Won', value: wonDeals.length, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Lead Conversion', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Deal Prob', value: wonDeals.length ? `${Math.round(wonDeals.reduce((a, c) => a + (c.probability || 0), 0) / wonDeals.length)}%` : '0%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Closed Deals', value: deals.filter(d => ['Won', 'Lost'].includes(d.stage)).length, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon size={24} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lead Status Bar */}
        <div className="lg:col-span-12 xl:col-span-8">
          <Card className="!p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <BarChart3 className="text-indigo-600" size={20} />
                  Lead Status Distribution
                </h2>
                <p className="text-xs font-medium text-slate-400 mt-1">Status breakdown across the entire funnel</p>
              </div>
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Funnel</button>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByStatus} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="6 6" stroke={gridColor} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: textColor, fontSize: 11, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fill: textColor, fontSize: 11, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: '800' }} 
                  />
                  <Bar dataKey="value" name="Leads" fill="#2563EB" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Team Performance */}
        <div className="lg:col-span-12 xl:col-span-4">
          <Card className="h-full !p-8">
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-8">Performance Leaderboard</h2>
            <div className="space-y-8">
              {performanceData.map((member, i) => (
                <div key={member.name} className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                    Ranking #{i + 1}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.name} size={36} className="shadow-lg shadow-slate-100" />
                      <div>
                        <p className="text-[13px] font-black text-slate-800 leading-none">{member.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">{member.leads} Leads Generated</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-indigo-600 leading-none">{member.deals}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Deals Won</p>
                    </div>
                  </div>
                  <ProgressRow 
                    value={member.deals} 
                    max={15} 
                    color={i === 0 ? "bg-indigo-600" : i === 1 ? "bg-blue-500" : "bg-slate-400"} 
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: leads.length, detail: 'Cumulative prospects', icon: '💎' },
          { label: 'Deals Closed', value: deals.filter(d => d.stage === 'Won' || d.stage === 'Lost').length, detail: 'Won vs Lost outcome', icon: '🎯' },
          { label: 'Win Rate', value: `${deals.filter(d => d.stage === 'Won').length ? Math.round((deals.filter(d => d.stage === 'Won').length / deals.filter(d => ['Won', 'Lost'].includes(d.stage)).length) * 100) : 0}%`, detail: 'Sales effectiveness', icon: '🏆' },
          { label: 'Pipeline Value', value: deals.filter(d => !['Won', 'Lost'].includes(d.stage)).length, detail: 'In-progress opportunities', icon: '⚡' },
        ].map(s => (
          <div key={s.label} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 text-center group hover:bg-white hover:shadow-xl transition-all">
            <span className="text-2xl mb-3 block">{s.icon}</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{s.label}</p>
            <p className="text-2xl font-black text-slate-800 mb-1">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 italic">{s.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
