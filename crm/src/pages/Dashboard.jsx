import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Card, CardContent, Typography, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Divider, Button, Paper, Stack, AvatarGroup } from '@mui/material';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer } from 'recharts';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { StatCard, StatusChip, SectionHeader, UserAvatar } from '../components/ui';



const dealStageData = [
  { stage: 'New', count: 5, value: 210000 },
  { stage: 'Qualification', count: 4, value: 88000 },
  { stage: 'Proposal', count: 2, value: 325000 },
  { stage: 'Negotiation', count: 1, value: 480000 },
  { stage: 'Won', count: 3, value: 195000 },
];

const leadSourceData = [
  { name: 'LinkedIn', value: 35, color: '#0A66C2' },
  { name: 'Website', value: 28, color: '#2563EB' },
  { name: 'Referral', value: 20, color: '#7C3AED' },
  { name: 'Email', value: 12, color: '#F59E0B' },
  { name: 'Cold Call', value: 5, color: '#EF4444' },
];

const activities = [
  { action: 'New lead added', detail: 'Arjun Sharma from TechWave', time: '5 min ago', color: '#2563EB', icon: '👤' },
  { action: 'Deal won', detail: 'Zenith Analytics — ₹1,95,000', time: '1 hr ago', color: '#10B981', icon: '🎉' },
  { action: 'Lead updated', detail: 'Meena Iyer from GreenBridge', time: '2 hr ago', color: '#F59E0B', icon: '👤' },
  { action: 'Ticket raised', detail: 'TKT-004 — CloudForge integration', time: '3 hr ago', color: '#EF4444', icon: '🎫' },
  { action: 'Meeting scheduled', detail: 'TechWave demo — Apr 25', time: '5 hr ago', color: '#7C3AED', icon: '📅' },
];

const quickActions = [
  { label: 'Add Lead', color: 'primary', icon: '👤' },
  { label: 'New Deal', color: 'secondary', icon: '🤝' },

  { label: 'Add Task', color: 'warning', icon: '✅' },
];

export default function Dashboard() {
  const { themeMode } = useSelector(s => s.ui);
  const leads = useSelector(s => s.leads.items);
  const clients = useSelector(s => s.clients.items);
  const deals = useSelector(s => s.deals.items);
  const tickets = useSelector(s => s.tickets.items);

  const dark = themeMode === 'dark';

  const activeDeals = deals.filter(d => !['Won', 'Lost'].includes(d.stage)).length;
  const openTickets = tickets.filter(t => t.status !== 'Resolved').length;


  const chartColor = dark ? '#93C5FD' : '#2563EB';
  const gridColor = dark ? '#334155' : '#E2E8F0';
  const textColor = dark ? '#94A3B8' : '#64748B';

  return (
    <Box>
      {/* Welcome */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Good morning, Admin 👋</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's what's happening with your CRM today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Stack direction="row" gap={1}>
          {quickActions.map(a => (
            <Button key={a.label} variant="contained" color={a.color} size="small" startIcon={<span>{a.icon}</span>}
              sx={{ borderRadius: '10px', fontSize: '12px', py: 1 }}>
              {a.label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Total Leads', value: leads.length, icon: <PeopleAltRoundedIcon />, color: '#2563EB', trend: 12, trendLabel: 'vs last month' },
          { label: 'Total Clients', value: clients.length, icon: <BusinessRoundedIcon />, color: '#7C3AED', trend: 8, trendLabel: 'vs last month' },
          { label: 'Active Deals', value: activeDeals, icon: <HandshakeRoundedIcon />, color: '#F59E0B', trend: -3, trendLabel: 'vs last month' },
          { label: 'Open Tickets', value: openTickets, icon: <ConfirmationNumberRoundedIcon />, color: '#EF4444', trend: -5, trendLabel: 'vs last month' },
        ].map(s => (
          <Grid item xs={12} sm={6} md={2.4} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>


        {/* Lead Source */}
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Lead Sources</Typography>
              <Typography variant="caption" color="text.secondary">This month's lead origins</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {leadSourceData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <RTooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: 10, border: `1px solid ${gridColor}`, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mt: 1 }}>
                {leadSourceData.map(s => (
                  <Box key={s.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      <Typography variant="caption" fontWeight={500}>{s.name}</Typography>
                    </Box>
                    <Typography variant="caption" fontWeight={700}>{s.value}%</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>


        {/* Activity Feed */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} sx={{ fontSize: '12px' }}>View all</Button>
              </Box>
              <List disablePadding>
                {activities.map((a, i) => (
                  <React.Fragment key={i}>
                    <ListItem disablePadding sx={{ py: 1.2 }}>
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{a.icon}</Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography sx={{ fontSize: '12.5px', fontWeight: 600 }}>{a.action}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{a.detail}</Typography>}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <AccessTimeRoundedIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '10px' }}>{a.time}</Typography>
                      </Box>
                    </ListItem>
                    {i < activities.length - 1 && <Divider sx={{ borderColor: 'divider' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
           <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Deal Pipeline</Typography>
              <ResponsiveContainer width="100%" height={262}>
                <BarChart data={dealStageData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="stage" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{ borderRadius: 10, border: `1px solid ${gridColor}`, fontSize: 12 }} />
                  <Bar dataKey="count" name="Deals" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </Box>
  );
}
