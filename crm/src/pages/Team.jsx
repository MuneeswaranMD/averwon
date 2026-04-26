import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid, Chip, Avatar, LinearProgress } from '@mui/material';
import { SectionHeader, UserAvatar } from '../components/ui';

export default function Team() {
  const team = useSelector(s => s.team.items);
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const maxRevenue = Math.max(...team.map(m => m.revenue));

  const avatarColors = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B'];

  return (
    <Box>
      <SectionHeader title="Team" subtitle={`${team.length} members · Sales & Support`} />
      <Grid container spacing={2.5}>
        {team.map((member, i) => (
          <Grid item xs={12} sm={6} md={3} key={member.id}>
            <Card sx={{ '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }, transition: 'all 0.25s', cursor: 'pointer' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, background: `linear-gradient(135deg, ${avatarColors[i % 4]}, ${avatarColors[(i + 1) % 4]})`, fontSize: 22, fontWeight: 800, borderRadius: '16px' }}>
                  {member.avatar}
                </Avatar>
                <Typography fontWeight={800} fontSize="15px">{member.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>{member.role}</Typography>
                <Chip label={member.status} size="small" color="success" sx={{ mb: 2, fontWeight: 700, fontSize: '11px' }} />

                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  {[{ label: 'Leads', value: member.leads }, { label: 'Deals', value: member.deals }].map(s => (
                    <Grid item xs={6} key={s.label}>
                      <Box sx={{ p: 1, background: dark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', borderRadius: 2 }}>
                        <Typography fontWeight={800} fontSize="18px">{s.value}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Revenue</Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main">₹{(member.revenue / 1000).toFixed(0)}k</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.round((member.revenue / maxRevenue) * 100)}
                    sx={{ height: 6, borderRadius: 3, background: `${avatarColors[i % 4]}20`, '& .MuiLinearProgress-bar': { background: avatarColors[i % 4], borderRadius: 3 } }} />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>📧 {member.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
