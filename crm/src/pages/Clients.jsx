import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Mail, MapPin, Calendar, Briefcase, IndianRupee } from 'lucide-react';
import { 
  SectionHeader, 
  StatusChip, 
  UserAvatar, 
  Card, 
  Button 
} from '../components/ui';

export default function Clients() {
  const clients = useSelector(s => s.clients.items);
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Clients"
        subtitle={`${clients.length} total clients · ${clients.filter(c => c.status === 'Active').length} active`}
        action={<Button icon={Plus}>Add Client</Button>}
      />

      {/* Clients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {clients.map(client => (
          <div 
            key={client.id} 
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <UserAvatar name={client.name} size={48} />
              <StatusChip label={client.status} size="medium" />
            </div>
            
            <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
              {client.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-6">
              <Briefcase size={12} /> {client.industry} · <MapPin size={12} /> {client.location}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-slate-50">
              <div className="text-center">
                <p className="text-sm font-black text-blue-600">₹{(client.totalRevenue / 1000).toFixed(0)}k</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
              </div>
              <div className="text-center border-x border-slate-50">
                <p className="text-sm font-black text-slate-800">{client.projects}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800">
                  {Math.floor((new Date() - new Date(client.since)) / (1000 * 60 * 60 * 24 * 30))}m
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Tenure</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
              <Mail size={14} className="text-slate-400" />
              <span className="truncate">{client.email}</span>
            </div>
          </div>
        ))}
      </div>

      <Card className="!p-0" title="Client Directory">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['Client', 'Industry', 'Contact person', 'Total Revenue', 'Projects', 'Status', 'Client Since'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={c.name} size={32} />
                      <span className="text-[13px] font-bold text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-500">{c.industry}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-500">{c.contact}</td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-bold text-blue-600">₹{c.totalRevenue.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{c.projects}</td>
                  <td className="px-6 py-4">
                    <StatusChip label={c.status} />
                  </td>
                  <td className="px-6 py-4 text-[12px] font-medium text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(c.since).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
