import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTicket, updateTicket } from '../store';
import {
  Box, Card, CardContent, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, FormControl, InputLabel, Grid, Chip, IconButton, Tooltip, Stack
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { SectionHeader, StatusChip } from '../components/ui';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];
const CLIENTS = ['TechWave Solutions', 'DataSync Inc', 'Zenith Analytics', 'CloudForge', 'GreenBridge Corp'];
const ASSIGNEES = ['Support Team', 'Priya Nair', 'Ankit Joshi', 'Sneha Patel'];

export default function Tickets() {
  const dispatch = useDispatch();
  const tickets = useSelector(s => s.tickets.items);
  const { themeMode } = useSelector(s => s.ui);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', client: '', priority: 'Medium', status: 'Open', assignee: 'Support Team' });

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;

  const save = () => { dispatch(addTicket(form)); setOpen(false); setForm({ subject: '', client: '', priority: 'Medium', status: 'Open', assignee: 'Support Team' }); };

  const resolve = (t) => dispatch(updateTicket({ ...t, status: 'Resolved', resolved: new Date().toISOString().split('T')[0] }));

  const priorityColor = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

  return (
    <Box>
      <SectionHeader
        title="Support Tickets"
        subtitle={`${openCount} open · ${inProgress} in progress · ${resolved} resolved`}
        action={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setOpen(true)}>Raise Ticket</Button>}
      />

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[{ label: 'Open', value: openCount, color: '#EF4444' }, { label: 'In Progress', value: inProgress, color: '#F59E0B' }, { label: 'Resolved', value: resolved, color: '#10B981' }].map(s => (
          <Grid item xs={4} key={s.label}>
            <Card>
              <CardContent sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: s.color, mt: 0.5 }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['ID', 'Subject', 'Client', 'Priority', 'Assignee', 'Status', 'Created', 'Resolved', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map(t => (
                <TableRow key={t.id} hover sx={{ '& td': { py: 1.2, fontSize: '13px' } }}>
                  <TableCell><Typography fontWeight={700} fontSize="12px" color="primary.main">{t.id}</Typography></TableCell>
                  <TableCell sx={{ maxWidth: 180 }}><Typography noWrap fontSize="13px" fontWeight={500}>{t.subject}</Typography></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '12px' }}>{t.client}</TableCell>
                  <TableCell>
                    <Chip label={t.priority} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 700, background: `${priorityColor[t.priority]}20`, color: priorityColor[t.priority] }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{t.assignee}</TableCell>
                  <TableCell><StatusChip label={t.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '12px' }}>{t.created}</TableCell>
                  <TableCell sx={{ color: 'success.main', fontSize: '12px' }}>{t.resolved || '—'}</TableCell>
                  <TableCell>
                    {t.status !== 'Resolved' && (
                      <Tooltip title="Mark Resolved" arrow>
                        <IconButton size="small" onClick={() => resolve(t)} sx={{ color: 'success.main' }}>
                          <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800}>Raise Support Ticket</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth size="small" label="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
            {[['Client', 'client', CLIENTS], ['Priority', 'priority', PRIORITIES], ['Assignee', 'assignee', ASSIGNEES]].map(([label, key, opts]) => (
              <Grid item xs={6} key={key}>
                <FormControl fullWidth size="small"><InputLabel>{label}</InputLabel>
                  <Select value={form[key]} label={label} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={{ borderRadius: '10px' }}>
                    {opts.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={save} variant="contained" sx={{ borderRadius: '10px' }}>Raise Ticket</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
