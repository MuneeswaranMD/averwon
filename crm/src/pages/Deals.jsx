import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveDeal, addDeal, updateDeal, deleteDeal } from '../store';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select,
  FormControl, InputLabel, Grid, IconButton, LinearProgress, Tooltip
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import { SectionHeader, StatusChip, UserAvatar } from '../components/ui';

const STAGES = ['New', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const SALESREPS = ['Priya Nair', 'Rahul Das', 'Ankit Joshi'];
const DEFAULT_FORM = { title: '', client: '', value: '', stage: 'New', salesperson: 'Priya Nair', expectedClose: '', probability: 30 };

const stageColors = {
  New: '#64748B', Qualification: '#2563EB', Proposal: '#7C3AED',
  Negotiation: '#F59E0B', Won: '#10B981', Lost: '#EF4444'
};

export default function Deals() {
  const dispatch = useDispatch();
  const deals = useSelector(s => s.deals.items);
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editItem, setEditItem] = useState(null);
  const [dragId, setDragId] = useState(null);

  const byStage = (stage) => deals.filter(d => d.stage === stage);
  const totalValue = deals.filter(d => d.stage !== 'Lost').reduce((a, c) => a + Number(c.value), 0);
  const wonValue = deals.filter(d => d.stage === 'Won').reduce((a, c) => a + Number(c.value), 0);

  const save = () => {
    if (editItem) dispatch(updateDeal({ ...editItem, ...form, value: Number(form.value) }));
    else dispatch(addDeal({ ...form, value: Number(form.value), id: Date.now() }));
    setOpen(false); setEditItem(null); setForm(DEFAULT_FORM);
  };

  const openEdit = (d) => { setEditItem(d); setForm({ ...d, value: String(d.value) }); setOpen(true); };

  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e, stage) => {
    e.preventDefault();
    if (dragId !== null) { dispatch(moveDeal({ id: dragId, stage })); setDragId(null); }
  };

  return (
    <Box>
      <SectionHeader
        title="Deals Pipeline"
        subtitle={`Pipeline value: ₹${totalValue.toLocaleString('en-IN')} · Won: ₹${wonValue.toLocaleString('en-IN')}`}
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => { setOpen(true); setEditItem(null); setForm(DEFAULT_FORM); }}>
            Add Deal
          </Button>
        }
      />

      {/* Kanban Board */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {STAGES.map(stage => {
          const stageDealss = byStage(stage);
          const stageValue = stageDealss.reduce((a, c) => a + Number(c.value), 0);
          return (
            <Box
              key={stage}
              onDragOver={onDragOver}
              onDrop={e => onDrop(e, stage)}
              sx={{ minWidth: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
              {/* Stage Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: stageColors[stage] }} />
                  <Typography variant="body2" fontWeight={700}>{stage}</Typography>
                  <Chip label={stageDealss.length} size="small" sx={{ height: 18, fontSize: '10px', fontWeight: 700 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>₹{(stageValue / 1000).toFixed(0)}k</Typography>
              </Box>

              {/* Deal Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 120 }}>
                {stageDealss.map(deal => (
                  <Card
                    key={deal.id}
                    draggable
                    onDragStart={() => setDragId(deal.id)}
                    sx={{
                      cursor: 'grab', borderLeft: `4px solid ${stageColors[deal.stage]}`,
                      transition: 'box-shadow 0.2s, transform 0.15s',
                      '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.3, flex: 1, mr: 1 }}>{deal.title}</Typography>
                        <DragIndicatorRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>{deal.client}</Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 800, color: stageColors[stage] }}>
                          ₹{Number(deal.value).toLocaleString('en-IN')}
                        </Typography>
                        <Chip label={`${deal.probability}%`} size="small" sx={{ height: 18, fontSize: '10px', fontWeight: 700, background: `${stageColors[stage]}20`, color: stageColors[stage] }} />
                      </Box>

                      <LinearProgress variant="determinate" value={deal.probability}
                        sx={{ height: 4, borderRadius: 2, mb: 1.5, background: `${stageColors[stage]}20`, '& .MuiLinearProgress-bar': { background: stageColors[stage] } }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <UserAvatar name={deal.salesperson} size={22} />
                          <Typography variant="caption" color="text.secondary">{deal.salesperson.split(' ')[0]}</Typography>
                        </Box>
                        <Stack direction="row">
                          <Tooltip title="Edit" arrow>
                            <IconButton size="small" onClick={() => openEdit(deal)} sx={{ p: 0.3 }}><EditRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} /></IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton size="small" onClick={() => dispatch(deleteDeal(deal.id))} sx={{ p: 0.3 }}><DeleteRoundedIcon sx={{ fontSize: 14, color: 'text.disabled' }} /></IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>

                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                        Close: {deal.expectedClose}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Deal Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800}>{editItem ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <Grid container spacing={2}>
            {[['Deal Title', 'title', 'text'], ['Client Name', 'client', 'text'], ['Expected Close', 'expectedClose', 'date']].map(([label, key, type]) => (
              <Grid item xs={12} key={key}>
                <TextField fullWidth size="small" label={label} type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} InputLabelProps={type === 'date' ? { shrink: true } : {}} />
              </Grid>
            ))}
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Deal Value (₹)" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Win Probability (%)" type="number" value={form.probability} onChange={e => setForm(f => ({ ...f, probability: Number(e.target.value) }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            </Grid>
            {[['Stage', 'stage', STAGES], ['Salesperson', 'salesperson', SALESREPS]].map(([label, key, options]) => (
              <Grid item xs={6} key={key}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select value={form[key]} label={label} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={{ borderRadius: '10px' }}>
                    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={save} variant="contained" sx={{ borderRadius: '10px' }}>{editItem ? 'Update Deal' : 'Add Deal'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
