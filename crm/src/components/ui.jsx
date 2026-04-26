import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Avatar, Chip, LinearProgress } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color, trend, trendLabel, prefix = '' }) {
  const up = trend >= 0;
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, lineHeight: 1.1 }}>{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</Typography>
          </Box>
          <Avatar sx={{ width: 46, height: 46, background: `${color}18`, borderRadius: '12px' }}>
            {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {up ? <TrendingUpRoundedIcon sx={{ fontSize: 16, color: 'success.main' }} /> : <TrendingDownRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />}
          <Typography variant="caption" fontWeight={700} color={up ? 'success.main' : 'error.main'}>{up ? '+' : ''}{trend}%</Typography>
          <Typography variant="caption" color="text.secondary">{trendLabel}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────
const statusColors = {
  New: 'info', Contacted: 'primary', Qualified: 'secondary', 'Proposal Sent': 'warning',
  Converted: 'success', Closed: 'default', Active: 'success', Inactive: 'default',
  Won: 'success', Lost: 'error', Negotiation: 'warning', Proposal: 'info', Qualification: 'secondary',
  Open: 'error', 'In Progress': 'warning', Resolved: 'success', Paid: 'success', Pending: 'warning', Overdue: 'error',
  Todo: 'default', Done: 'success', Completed: 'success', Planning: 'info', High: 'error', Medium: 'warning', Low: 'success',
};

export function StatusChip({ label, size = 'small' }) {
  return <Chip label={label} size={size} color={statusColors[label] || 'default'} sx={{ fontWeight: 700, fontSize: size === 'small' ? '11px' : '12px', height: size === 'small' ? 22 : 26 }} />;
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={800}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>{subtitle}</Typography>}
      </Box>
      {action}
    </Box>
  );
}

// ─── Progress Row ─────────────────────────────────────────────────────────────
export function ProgressRow({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" fontWeight={600}>{label}</Typography>
        <Typography variant="caption" color="text.secondary">{pct}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, background: `${color}20`, '& .MuiLinearProgress-bar': { background: color, borderRadius: 3 } }} />
    </Box>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
      <Typography sx={{ fontSize: 48, mb: 1 }}>{icon}</Typography>
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}

// ─── Avatar Group ──────────────────────────────────────────────────────────────
const avatarColors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
export function UserAvatar({ name, size = 32 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = avatarColors[name.charCodeAt(0) % avatarColors.length];
  return (
    <Tooltip title={name} arrow>
      <Avatar sx={{ width: size, height: size, background: color, fontSize: size * 0.34, fontWeight: 700 }}>{initials}</Avatar>
    </Tooltip>
  );
}
