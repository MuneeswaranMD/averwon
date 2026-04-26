import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Chip, Avatar, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { SectionHeader, UserAvatar, ProgressRow } from '../components/ui';

const performanceData = [
  { name: 'Priya Nair', leads: 14, deals: 8 },
  { name: 'Rahul Das', leads: 11, deals: 5 },
  { name: 'Ankit Joshi', leads: 9, deals: 4 },
];

export default function Reports() {
  const leads = useSelector(s => s.leads.items);
  const deals = useSelector(s => s.deals.items);
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const gridColor = dark ? '#334155' : '#E2E8F0';
  const textColor = dark ? '#94A3B8' : '#64748B';

  const conversionRate = Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100);
  const wonDeals = deals.filter(d => d.stage === 'Won');

  const leadsByStatus = [
    { name: 'New', value: leads.filter(l => l.status === 'New').length },
    { name: 'Contacted', value: leads.filter(l => l.status === 'Contacted').length },
    { name: 'Qualified', value: leads.filter(l => l.status === 'Qualified').length },
    { name: 'Converted', value: leads.filter(l => l.status === 'Converted').length },
  ];

  return (
    <Box>
      <SectionHeader title="Reports & Analytics" subtitle="Performance metrics and business insights" />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Deals Won', value: wonDeals.length, color: '#7C3AED' },
          { label: 'Lead Conversion', value: `${conversionRate}%`, color: '#2563EB' },
          { label: 'Avg Deal Prob', value: wonDeals.length ? `${Math.round(wonDeals.reduce((a, c) => a + (c.probability || 0), 0) / wonDeals.length)}%` : '0%', color: '#F59E0B' },
          { label: 'Closed Deals', value: deals.filter(d => ['Won', 'Lost'].includes(d.stage)).length, color: '#EF4444' },
        ].map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card>
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', mb: 0.8 }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Lead Status Bar */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Lead Status Distribution</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={leadsByStatus} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${gridColor}`, fontSize: 12 }} />
                  <Bar dataKey="value" name="Leads" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Team Performance</Typography>
              {performanceData.map((member, i) => (
                <Box key={member.name} sx={{ mb: i < performanceData.length - 1 ? 2.5 : 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserAvatar name={member.name} size={28} />
                      <Typography fontSize="12.5px" fontWeight={600}>{member.name}</Typography>
                    </Box>
                    <Typography fontSize="12px" fontWeight={700} color="primary.main">{member.deals} Deals</Typography>
                  </Box>
                  <ProgressRow label={`${member.leads} leads`} value={member.deals} max={15} color="#2563EB" />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Summary Table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Sales Summary</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {[
              { label: 'Total Leads', value: leads.length, detail: 'All time' },
              { label: 'Deals Closed', value: deals.filter(d => d.stage === 'Won' || d.stage === 'Lost').length, detail: 'Won + Lost' },
              { label: 'Win Rate', value: `${deals.filter(d => d.stage === 'Won').length ? Math.round((deals.filter(d => d.stage === 'Won').length / deals.filter(d => ['Won', 'Lost'].includes(d.stage)).length) * 100) : 0}%`, detail: 'Won deals ratio' },
              { label: 'Pipeline Deals', value: deals.filter(d => !['Won', 'Lost'].includes(d.stage)).length, detail: 'Active deals' },
            ].map(s => (
              <Box key={s.label} sx={{ p: 2, background: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>{s.label}</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ my: 0.5 }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.detail}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
