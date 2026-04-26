import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { applyLeave, updateLeaveStatus, deleteLeave } from '../store';
import {
  CalendarDays, CheckCircle, XCircle, Clock, Plus, Filter,
  Trash2, ChevronDown, AlarmCheck, UserCheck
} from 'lucide-react';
import { SectionHeader, StatusChip, Button, Input, Modal } from '../components/ui';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Pending:  'bg-amber-100 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-700 border border-rose-200',
};

const STATUS_ICONS = {
  Pending:  Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
};

function daysBetween(from, to) {
  if (!from || !to) return 1;
  const diff = new Date(to) - new Date(from);
  return Math.max(1, Math.round(diff / 86400000) + 1);
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-3xl p-5 border border-opacity-30 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-15 flex items-center justify-center`}>
        <Icon size={22} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Admin Leave Row ──────────────────────────────────────────────────────────
function LeaveRow({ req, onApprove, onReject, onDelete, isAdmin }) {
  const Icon = STATUS_ICONS[req.status] || Clock;
  const days = daysBetween(req.fromDate, req.toDate);

  return (
    <div className="flex items-center flex-wrap gap-4 px-6 py-4 hover:bg-slate-50/60 group transition-colors">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
        {req.userName.split(' ').map(n => n[0]).join('')}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-[120px]">
        <p className="text-sm font-black text-slate-800">{req.userName}</p>
        <p className="text-[11px] text-slate-400 font-bold capitalize">{req.role}</p>
      </div>

      {/* Dates */}
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{req.fromDate} → {req.toDate}</p>
        <p className="text-[10px] font-bold text-slate-400">{days} day{days > 1 ? 's' : ''}</p>
      </div>

      {/* Reason */}
      <div className="flex-1 min-w-[120px] max-w-xs hidden md:block">
        <p className="text-xs text-slate-500 font-medium truncate" title={req.reason}>{req.reason}</p>
      </div>

      {/* Applied */}
      <p className="text-[10px] text-slate-400 font-bold hidden lg:block">{req.appliedOn}</p>

      {/* Status Badge */}
      <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${STATUS_STYLES[req.status]}`}>
        <Icon size={11} />
        {req.status}
      </span>

      {/* Actions */}
      {isAdmin && req.status === 'Pending' && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onApprove(req.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-black transition-colors">
            <CheckCircle size={13} /> Approve
          </button>
          <button onClick={() => onReject(req.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-black transition-colors">
            <XCircle size={13} /> Reject
          </button>
        </div>
      )}
      {isAdmin && (
        <button onClick={() => onDelete(req.id)} className="p-1.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Main Leave Page ───────────────────────────────────────────────────────────
const EMPTY_FORM = { fromDate: '', toDate: '', reason: '' };

export default function Leave() {
  const dispatch    = useDispatch();
  const requests    = useSelector(s => s.leave.items);
  const currentUser = useSelector(s => s.auth.currentUser);

  const isAdmin   = currentUser?.role === 'admin';
  const [filter, setFilter]     = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);

  // Filtered view
  const visible = isAdmin
    ? (filter === 'All' ? requests : requests.filter(r => r.status === filter))
    : requests.filter(r => r.userId === currentUser?.id && (filter === 'All' || r.status === filter));

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  const submit = () => {
    if (!form.fromDate || !form.toDate || !form.reason) return;
    dispatch(applyLeave({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      ...form,
    }));
    setForm(EMPTY_FORM); setShowForm(false);
  };

  const FILTER_TABS = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={isAdmin ? 'Leave Management' : 'My Leave Requests'}
        subtitle={isAdmin ? `${stats.pending} pending · ${stats.approved} approved` : 'Track and apply for your leaves'}
        action={!isAdmin && <Button icon={Plus} onClick={() => setShowForm(true)}>Apply for Leave</Button>}
      />

      {/* Stats Row (admin only) */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CalendarDays} label="Total Requests" value={stats.total}    color="bg-blue-500"    bg="bg-blue-50" />
          <StatCard icon={Clock}        label="Pending"        value={stats.pending}  color="bg-amber-500"   bg="bg-amber-50" />
          <StatCard icon={CheckCircle}  label="Approved"       value={stats.approved} color="bg-emerald-500" bg="bg-emerald-50" />
          <StatCard icon={XCircle}      label="Rejected"       value={stats.rejected} color="bg-rose-500"    bg="bg-rose-50" />
        </div>
      )}

      {/* Employee quick stats */}
      {!isAdmin && (
        <div className="grid grid-cols-3 gap-4">
          {['Pending', 'Approved', 'Rejected'].map(s => {
            const count = requests.filter(r => r.userId === currentUser?.id && r.status === s).length;
            const colors = { Pending: 'bg-amber-50 text-amber-600', Approved: 'bg-emerald-50 text-emerald-600', Rejected: 'bg-rose-50 text-rose-600' };
            const Icon = STATUS_ICONS[s];
            return (
              <div key={s} className={`${colors[s].split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
                <Icon size={20} className={colors[s].split(' ')[1]} />
                <div>
                  <p className="text-xs font-bold text-slate-500">{s}</p>
                  <p className="text-xl font-black text-slate-800">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex p-1 bg-slate-100/60 rounded-2xl gap-1">
          {FILTER_TABS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
        {!isAdmin && (
          <Button icon={Plus} onClick={() => setShowForm(true)} className="ml-auto">
            Apply for Leave
          </Button>
        )}
      </div>

      {/* Leave Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-6 py-3 bg-slate-50/60 border-b border-slate-100">
          <div className="w-10" />
          <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</div>
          <div className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Reason</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">Applied</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</div>
          {isAdmin && <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</div>}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {visible.length === 0
            ? (
              <div className="py-20 text-center">
                <CalendarDays size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="text-sm font-bold text-slate-300">No leave requests found</p>
              </div>
            )
            : visible.map(req => (
              <LeaveRow
                key={req.id}
                req={req}
                isAdmin={isAdmin}
                onApprove={id => dispatch(updateLeaveStatus({ id, status: 'Approved' }))}
                onReject={id  => dispatch(updateLeaveStatus({ id, status: 'Rejected' }))}
                onDelete={id  => dispatch(deleteLeave(id))}
              />
            ))
          }
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Apply for Leave">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              value={form.fromDate}
              onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))}
            />
            <Input
              label="To Date"
              type="date"
              value={form.toDate}
              onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))}
            />
          </div>

          {form.fromDate && form.toDate && (
            <div className="px-4 py-3 bg-blue-50 rounded-2xl text-sm font-bold text-blue-600">
              📅 {daysBetween(form.fromDate, form.toDate)} day(s) requested
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Reason</label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Briefly describe your reason for leave..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={submit}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
