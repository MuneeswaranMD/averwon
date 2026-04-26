import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, IconButton, Chip, Stack } from '@mui/material';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { SectionHeader } from '../components/ui';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EVENTS = [
  { date: '2026-04-18', title: 'TechWave Demo Call', color: '#2563EB', time: '10:00 AM' },
  { date: '2026-04-21', title: 'Deal Review - CloudForge', color: '#7C3AED', time: '2:00 PM' },
  { date: '2026-04-24', title: 'Team Standup', color: '#10B981', time: '9:00 AM' },
  { date: '2026-04-28', title: 'Invoice Due - DataSync', color: '#EF4444', time: 'All day' },
  { date: '2026-05-02', title: 'Q2 Pipeline Review', color: '#F59E0B', time: '11:00 AM' },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDay(current.year, current.month);

  const upcoming = EVENTS.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

  const getEventsForDay = (day) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return EVENTS.filter(e => e.date === dateStr);
  };

  const isToday = (day) => today.getFullYear() === current.year && today.getMonth() === current.month && today.getDate() === day;

  return (
    <Box>
      <SectionHeader title="Calendar" subtitle="Schedule and manage your events" />

      <Grid container spacing={2.5}>
        {/* Calendar Grid */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>{MONTHS[current.month]} {current.year}</Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Button size="small" startIcon={<TodayRoundedIcon />} variant="outlined" sx={{ borderRadius: '10px', fontSize: '12px' }} onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}>Today</Button>
                  <IconButton size="small" onClick={prev}><NavigateBeforeRoundedIcon /></IconButton>
                  <IconButton size="small" onClick={next}><NavigateNextRoundedIcon /></IconButton>
                </Stack>
              </Box>

              {/* Day names */}
              <Grid container sx={{ mb: 1 }}>
                {DAYS.map(d => (
                  <Grid item xs key={d} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>{d}</Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar cells */}
              <Grid container>
                {[...Array(firstDay)].map((_, i) => <Grid item xs key={`empty-${i}`} sx={{ minHeight: 80, borderRadius: 2 }} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const events = getEventsForDay(day);
                  const todayFlag = isToday(day);
                  return (
                    <Grid item xs key={day} sx={{ minHeight: 80, p: 0.3 }}>
                      <Box sx={{
                        height: '100%', minHeight: 80, p: 1, borderRadius: 2, cursor: 'pointer',
                        border: '1px solid', borderColor: todayFlag ? 'primary.main' : 'transparent',
                        background: todayFlag ? 'rgba(37,99,235,0.06)' : 'transparent',
                        '&:hover': { background: 'action.hover' }, transition: 'all 0.15s',
                      }}>
                        <Box sx={{ width: 26, height: 26, borderRadius: '50%', background: todayFlag ? 'primary.main' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                          <Typography sx={{ fontSize: '12px', fontWeight: todayFlag ? 800 : 500, color: todayFlag ? '#fff' : 'text.primary' }}>{day}</Typography>
                        </Box>
                        {events.map(ev => (
                          <Box key={ev.title} sx={{ background: ev.color, borderRadius: 1, px: 0.5, py: 0.2, mb: 0.3 }}>
                            <Typography sx={{ fontSize: '9px', color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Upcoming Events</Typography>
              <Stack gap={2}>
                {upcoming.map(event => (
                  <Box key={event.title} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 4, borderRadius: 2, background: event.color, alignSelf: 'stretch', flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontSize="13px" fontWeight={700}>{event.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {upcoming.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No upcoming events</Typography>}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
