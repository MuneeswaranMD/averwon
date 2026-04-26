import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color, trend, trendLabel, prefix = '' }) {
  const up = trend >= 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-800 leading-none">
            {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: `${color}15` }}
        >
          {React.cloneElement(icon, { size: 24, style: { color: color } })}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-bold ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {up ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
          {up ? '+' : ''}{trend}%
        </div>
        <span className="text-[11px] font-medium text-slate-400">{trendLabel}</span>
      </div>
    </div>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────
const statusClasses = {
  New: 'bg-blue-50 text-blue-600',
  Contacted: 'bg-indigo-50 text-indigo-600',
  Qualified: 'bg-purple-50 text-purple-600',
  'Proposal Sent': 'bg-amber-50 text-amber-600',
  Converted: 'bg-emerald-50 text-emerald-600',
  Closed: 'bg-slate-100 text-slate-600',
  Active: 'bg-emerald-50 text-emerald-600',
  Inactive: 'bg-slate-100 text-slate-600',
  Won: 'bg-emerald-50 text-emerald-600',
  Lost: 'bg-rose-50 text-rose-600',
  Negotiation: 'bg-amber-50 text-amber-600',
  Proposal: 'bg-blue-50 text-blue-600',
  Qualification: 'bg-purple-50 text-purple-600',
  Open: 'bg-rose-50 text-rose-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  Resolved: 'bg-emerald-50 text-emerald-600',
  Paid: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Overdue: 'bg-rose-50 text-rose-600',
  Todo: 'bg-slate-100 text-slate-600',
  Done: 'bg-emerald-50 text-emerald-600',
  Completed: 'bg-emerald-50 text-emerald-600',
  Planning: 'bg-cyan-50 text-cyan-600',
  High: 'bg-rose-50 text-rose-600',
  Medium: 'bg-amber-50 text-amber-600',
  Low: 'bg-emerald-50 text-emerald-600',
};

export function StatusChip({ label, size = 'small' }) {
  const baseClass = "inline-flex items-center justify-center font-bold rounded-full";
  const sizeClass = size === 'small' ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[12px]";
  const typeClass = statusClasses[label] || 'bg-slate-100 text-slate-600';
  
  return (
    <span className={`${baseClass} ${sizeClass} ${typeClass}`}>
      {label}
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div>{action}</div>
    </div>
  );
}

// ─── Progress Row ─────────────────────────────────────────────────────────────
export function ProgressRow({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold text-slate-600">{label}</span>
        <span className="text-[10px] font-black text-slate-400">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-5xl mb-4 grayscale opacity-20">{icon}</div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────
const avatarColors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
export function UserAvatar({ name, size = 32 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = avatarColors[name.charCodeAt(0) % avatarColors.length];
  
  return (
    <div 
      className="rounded-xl flex items-center justify-center text-white font-bold transition-transform hover:scale-110 cursor-pointer shadow-sm"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        fontSize: Math.max(10, Math.floor(size * 0.35))
      }}
      title={name}
    >
      {initials}
    </div>
  );
}
