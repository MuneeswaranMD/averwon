import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../store';
import {
  Box, Card, CardContent, Typography, Button, Chip, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select,
  FormControl, InputLabel, Grid, IconButton, Tooltip, Avatar
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { SectionHeader, StatusChip, UserAvatar } from '../components/ui';

const STATUSES = ['Todo', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const ASSIGNEES = ['Priya Nair', 'Rahul Das', 'Ankit Joshi', 'Sneha Patel'];
const statusColors = { Todo: '#64748B', 'In Progress': '#F59E0B', Done: '#10B981' };
const priorityColors = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };
const DEFAULT_FORM = { title: '', priority: 'Medium', status: 'Todo', assignee: 'Priya Nair', due: '', project: '' };

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector(s => s.tasks.items);
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [editItem, setEditItem] = useState(null);
  const [dragId, setDragId] = useState(null);

  const byStatus = (st) => tasks.filter(t => t.status === st);

  const save = () => {
    if (editItem) dispatch(updateTask({ ...editItem, ...form }));
    else dispatch(addTask(form));
    setOpen(false); setEditItem(null); setForm(DEFAULT_FORM);
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    if (dragId) { dispatch(updateTask({ ...tasks.find(t => t.id === dragId), status })); setDragId(null); }
  };

  return (
    <Box>
      <SectionHeader
        title="Tasks"
        subtitle={`${tasks.length} total · ${byStatus('In Progress').length} in progress · ${byStatus('Done').length} completed`}
        action={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => { setOpen(true); setEditItem(null); setForm(DEFAULT_FORM); }}>Add Task</Button>}
      />

      <Box sx={{ display: 'flex', gap: 2.5 }}>
        {STATUSES.map(status => {
          const cols = byStatus(status);
          return (
            <Box key={status} sx={{ flex: 1, minWidth: 0 }} onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, status)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: statusColors[status] }} />
                <Typography fontWeight={700} fontSize="14px">{status}</Typography>
                <Chip label={cols.length} size="small" sx={{ height: 18, fontSize: '10px', fontWeight: 700 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 200 }}>
                {cols.map(task => (
                  <Card key={task.id} draggable onDragStart={() => setDragId(task.id)}
                    sx={{ cursor: 'grab', borderLeft: `4px solid ${priorityColors[task.priority]}`, transition: 'all 0.2s', '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' } }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, flex: 1, mr: 1 }}>{task.title}</Typography>
                        <Stack direction="row">
                          <Tooltip title="Edit" arrow><IconButton size="small" onClick={() => { setEditItem(task); setForm(task); setOpen(true); }} sx={{ p: 0.3 }}><EditRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} /></IconButton></Tooltip>
                          <Tooltip title="Delete" arrow><IconButton size="small" onClick={() => dispatch(deleteTask(task.id))} sx={{ p: 0.3 }}><DeleteRoundedIcon sx={{ fontSize: 14, color: 'text.disabled' }} /></IconButton></Tooltip>
                        </Stack>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>{task.project}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={task.priority} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 700, background: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }} />
                        <UserAvatar name={task.assignee} size={24} />
                      </Box>
                      {task.due && <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>Due: {task.due}</Typography>}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={800}>{editItem ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth size="small" label="Task Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Project" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} /></Grid>
            {[['Priority', 'priority', PRIORITIES], ['Status', 'status', STATUSES], ['Assignee', 'assignee', ASSIGNEES]].map(([label, key, opts]) => (
              <Grid item xs={6} key={key}>
                <FormControl fullWidth size="small"><InputLabel>{label}</InputLabel>
                  <Select value={form[key]} label={label} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={{ borderRadius: '10px' }}>
                    {opts.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={6}><TextField fullWidth size="small" type="date" label="Due Date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={save} variant="contained" sx={{ borderRadius: '10px' }}>{editItem ? 'Update' : 'Add Task'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
