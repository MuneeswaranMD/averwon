import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTicket, updateTicket } from '../store';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar
} from 'lucide-react';
import { 
  SectionHeader, 
  StatusChip, 
  Card, 
  Button, 
  Input, 
  Select, 
  Modal 
} from '../components/ui';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];
const CLIENTS = ['TechWave Solutions', 'DataSync Inc', 'Zenith Analytics', 'CloudForge', 'GreenBridge Corp'];
const ASSIGNEES = ['Support Team', 'Priya Nair', 'Ankit Joshi', 'Sneha Patel'];

export default function Tickets() {
  const dispatch = useDispatch();
  const tickets = useSelector(s => s.tickets.items);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', client: '', priority: 'Medium', status: 'Open', assignee: 'Support Team' });

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;

  const save = () => { 
    dispatch(addTicket({ ...form, id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`, created: new Date().toISOString().split('T')[0] })); 
    setOpen(false); 
    setForm({ subject: '', client: '', priority: 'Medium', status: 'Open', assignee: 'Support Team' }); 
  };

  const resolve = (t) => dispatch(updateTicket({ ...t, status: 'Resolved', resolved: new Date().toISOString().split('T')[0] }));

  const priorityColors = {
    Low: 'text-emerald-600 bg-emerald-50',
    Medium: 'text-amber-600 bg-amber-50',
    High: 'text-rose-600 bg-rose-50'
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Support Tickets"
        subtitle={`${openCount} open · ${inProgress} in progress · ${resolved} resolved`}
        action={<Button icon={Plus} onClick={() => setOpen(true)}>Raise Ticket</Button>}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Open', value: openCount, color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle },
          { label: 'In Progress', value: inProgress, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: 'Resolved', value: resolved, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon size={24} className={s.color} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label} Tickets</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden" title="All Support Tickets">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['ID & Subject', 'Client Details', 'Priority', 'Assigned To', 'Status', 'Resolution', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded">
                        {t.id}
                      </span>
                      <p className="text-[13px] font-bold text-slate-800 line-clamp-1">{t.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {t.client.slice(0, 1)}
                      </div>
                      <span className="text-[12px] font-medium text-slate-500">{t.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${priorityColors[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                      <User size={14} className="text-slate-300" />
                      {t.assignee}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusChip label={t.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                        <Calendar size={12} /> {t.created}
                      </div>
                      {t.resolved && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 size={12} /> {t.resolved}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {t.status !== 'Resolved' && (
                      <button 
                        onClick={() => resolve(t)}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors group/btn"
                        title="Resolve Ticket"
                      >
                        <CheckCircle2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        title="Raise Support Ticket"
      >
        <div className="space-y-4">
          <Input 
            label="Subject" 
            value={form.subject} 
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} 
            placeholder="Brief description of the issue"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Client" 
              value={form.client} 
              onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
              options={CLIENTS.map(c => ({ label: c, value: c }))}
            />
            <Select 
              label="Priority" 
              value={form.priority} 
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              options={PRIORITIES.map(p => ({ label: p, value: p }))}
            />
            <Select 
              label="Assign To" 
              value={form.assignee} 
              onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
              options={ASSIGNEES.map(a => ({ label: a, value: a }))}
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Raise Ticket</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
