import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Grid, LinearProgress, Chip, Tabs, Tab, Button
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SectionHeader, StatusChip, ProgressRow } from '../components/ui';

export default function Projects() {
  const projects = useSelector(s => s.projects.items);
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const [tab, setTab] = useState(0);

  const statusFilter = tab === 0 ? projects : tab === 1 ? projects.filter(p => p.status === 'In Progress') : tab === 2 ? projects.filter(p => p.status === 'Completed') : projects.filter(p => p.status === 'Planning');
  const statusColors = { 'In Progress': '#F59E0B', Completed: '#10B981', Planning: '#2563EB' };

  return (
    <Box>
      <SectionHeader
        title="Projects"
        subtitle={`${projects.length} total · ${projects.filter(p => p.status === 'In Progress').length} active`}
        action={<Button variant="contained" startIcon={<AddRoundedIcon />}>New Project</Button>}
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { fontSize: '13px', fontWeight: 600 } }}>
        {['All', 'In Progress', 'Completed', 'Planning'].map((label, i) => (
          <Tab key={label} label={label} id={`tab-${i}`} />
        ))}
      </Tabs>

      <Grid container spacing={2.5}>
        {statusFilter.map(project => {
          const budgetPct = Math.round((project.spent / project.budget) * 100);
          const color = statusColors[project.status] || '#64748B';
          return (
            <Grid item xs={12} md={6} key={project.id}>
              <Card sx={{ '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' }, transition: 'all 0.2s', cursor: 'pointer' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography fontWeight={700} fontSize="15px" sx={{ mb: 0.3 }}>{project.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{project.client}</Typography>
                    </Box>
                    <StatusChip label={project.status} />
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">Progress</Typography>
                      <Typography variant="caption" fontWeight={700}>{project.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={project.progress}
                      sx={{ height: 8, borderRadius: 4, background: `${color}20`, '& .MuiLinearProgress-bar': { background: color, borderRadius: 4 } }} />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, background: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>BUDGET</Typography>
                        <Typography fontWeight={800} fontSize="13px">₹{project.budget.toLocaleString('en-IN')}</Typography>
                        <Typography variant="caption" color={budgetPct > 90 ? 'error.main' : 'text.secondary'}>Used: {budgetPct}%</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, background: dark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>DEADLINE</Typography>
                        <Typography fontWeight={700} fontSize="13px">{project.deadline}</Typography>
                        <Typography variant="caption" color="text.secondary">Due date</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, display: 'flex', gap: 0.6, flexWrap: 'wrap' }}>
                    {project.team.map(member => (
                      <Chip key={member} label={member} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
