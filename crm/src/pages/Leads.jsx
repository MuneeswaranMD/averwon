import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addLead, updateLead, deleteLead } from '../store';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Grid,
  Table, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton,
  Chip, InputAdornment, Stack, Tabs, Tab, Tooltip, Avatar
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { SectionHeader, StatusChip, UserAvatar } from '../components/ui';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'];
const SOURCES = ['LinkedIn', 'Website', 'Referral', 'Cold Call', 'Email Campaign', 'Event'];
const INDUSTRIES = ['Technology', 'Finance', 'SaaS', 'Cloud', 'Analytics', 'Manufacturing', 'Healthcare', 'Retail'];
const SALES_REPS = ['Priya Nair', 'Rahul Das', 'Ankit Joshi'];

const DEFAULT_FORM = { name: '', company: '', email: '', phone: '', source: 'Website', industry: 'Technology', status: 'New', assignedTo: 'Priya Nair', notes: '', followUp: '' };

const statusCounts = (items) => STATUSES.reduce((acc, s) => { acc[s] = items.filter(l => l.status === s).length; return acc; }, {});

export default function Leads() {
  const dispatch = useDispatch();
  const leads = useSelector(s => s.leads.items);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [confirmDel, setConfirmDel] = useState(null);
  const { themeMode } = useSelector(s => s.ui);

  const counts = statusCounts(leads);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    return (!q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.email.toLowerCase().includes(q))
      && (statusFilter === 'All' || l.status === statusFilter);
  });

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const save = () => {
    if (editItem) dispatch(updateLead({ ...editItem, ...form }));
    else dispatch(addLead(form));
    setOpen(false); setEditItem(null); setForm(DEFAULT_FORM);
  };

  const del = (id) => { dispatch(deleteLead(id)); setConfirmDel(null); };

  const openEdit = (item) => { setEditItem(item); setForm(item); setOpen(true); };

  return (
    <Box>
      <SectionHeader
        title="Leads"
        subtitle={`${leads.length} total leads · ${counts['New'] || 0} new this month`}
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => { setOpen(true); setEditItem(null); setForm(DEFAULT_FORM); }}>
            Add Lead
          </Button>
        }
      />

      {/* Status Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STATUSES.map(s => (
          <Grid item key={s}>
            <Card onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              sx={{ cursor: 'pointer', border: '2px solid', borderColor: statusFilter === s ? 'primary.main' : 'divider', transition: 'all 0.2s', minWidth: 110, textAlign: 'center' }}>
              <CardContent sx={{ py: 1.5, px: 2 }}>
                <Typography variant="h5" fontWeight={800}>{counts[s] || 0}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{s}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
            <TextField
              size="small" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18 }} /></InputAdornment>, sx: { borderRadius: '10px', fontSize: '13px' } }}
              sx={{ width: 280 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)} sx={{ borderRadius: '10px', fontSize: '13px' }}>
                <MenuItem value="All">All Statuses</MenuItem>
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>{filtered.length} results</Typography>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                {['Lead', 'Company', 'Email', 'Source', 'Status', 'Assigned To', 'Follow-up', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', py: 1.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map(lead => (
                <TableRow key={lead.id} hover sx={{ '& td': { py: 1.2, fontSize: '13px' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <UserAvatar name={lead.name} size={30} />
                      <Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{lead.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{lead.industry}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{lead.email}</TableCell>
                  <TableCell>
                    <Chip label={lead.source} size="small" variant="outlined" sx={{ fontSize: '11px', height: 20 }} />
                  </TableCell>
                  <TableCell><StatusChip label={lead.status} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserAvatar name={lead.assignedTo} size={22} />
                      <Typography sx={{ fontSize: '12px' }}>{lead.assignedTo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{lead.followUp || '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" gap={0.5}>
                      <Tooltip title="Edit" arrow>
                        <IconButton size="small" onClick={() => openEdit(lead)} sx={{ color: 'primary.main' }}><EditRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton size="small" onClick={() => setConfirmDel(lead)} sx={{ color: 'error.main' }}><DeleteRoundedIcon sx={{ fontSize: 16 }} /></IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div" count={filtered.length} page={page} rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
            rowsPerPageOptions={[5, 8, 15, 25]} sx={{ fontSize: '12px' }}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '18px', pb: 1 }}>{editItem ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <Grid container spacing={2}>
            {[['Lead Name', 'name', 'text'], ['Company Name', 'company', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'text'], ['Follow-up Date', 'followUp', 'date']].map(([label, key, type]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField fullWidth size="small" label={label} type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} InputLabelProps={type === 'date' ? { shrink: true } : {}} />
              </Grid>
            ))}
            {[['Source', 'source', SOURCES], ['Industry', 'industry', INDUSTRIES], ['Status', 'status', STATUSES], ['Assigned To', 'assignedTo', SALES_REPS]].map(([label, key, options]) => (
              <Grid item xs={12} sm={6} key={key}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select value={form[key]} label={label} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} sx={{ borderRadius: '10px' }}>
                    {options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Notes" multiline rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={save} variant="contained" sx={{ borderRadius: '10px' }}>{editItem ? 'Update Lead' : 'Add Lead'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(confirmDel)} onClose={() => setConfirmDel(null)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle fontWeight={700}>Delete Lead?</DialogTitle>
        <DialogContent><Typography variant="body2">Remove <strong>{confirmDel?.name}</strong> from {confirmDel?.company}? This action cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ gap: 1, pb: 2, px: 2 }}>
          <Button onClick={() => setConfirmDel(null)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={() => del(confirmDel.id)} variant="contained" color="error" sx={{ borderRadius: '10px' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
