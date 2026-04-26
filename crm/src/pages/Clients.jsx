import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, Grid, Table, TableHead,
  TableRow, TableCell, TableBody, TablePagination, Chip, Avatar, LinearProgress, Stack
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SectionHeader, StatusChip, UserAvatar, ProgressRow } from '../components/ui';

export default function Clients() {
  const clients = useSelector(s => s.clients.items);
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const [page, setPage] = useState(0);

  return (
    <Box>
      <SectionHeader
        title="Clients"
        subtitle={`${clients.length} total clients · ${clients.filter(c => c.status === 'Active').length} active`}
        action={<Button variant="contained" startIcon={<AddRoundedIcon />}>Add Client</Button>}
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {clients.map(client => (
          <Grid item xs={12} sm={6} md={3} key={client.id}>
            <Card sx={{ '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' }, transition: 'all 0.2s', cursor: 'pointer' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ width: 44, height: 44, background: `#2563EB20`, color: '#2563EB', fontWeight: 700, fontSize: 14, borderRadius: '12px' }}>
                    {client.name.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <StatusChip label={client.status} />
                </Box>
                <Typography fontWeight={700} fontSize="14px" sx={{ mb: 0.3 }}>{client.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{client.industry} · {client.location}</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography fontWeight={800} fontSize="16px" color="primary.main">₹{(client.totalRevenue / 1000).toFixed(0)}k</Typography>
                    <Typography variant="caption" color="text.secondary">Revenue</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography fontWeight={800} fontSize="16px">{client.projects}</Typography>
                    <Typography variant="caption" color="text.secondary">Projects</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography fontWeight={800} fontSize="16px">
                      {Math.floor((new Date() - new Date(client.since)) / (1000 * 60 * 60 * 24 * 30))}mo
                    </Typography>
                    <Typography variant="caption" color="text.secondary">As Client</Typography>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary">📧 {client.email}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>All Clients</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Client', 'Industry', 'Contact', 'Revenue', 'Projects', 'Status', 'Since'].map(h => <TableCell key={h} sx={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map(c => (
                <TableRow key={c.id} hover sx={{ '& td': { py: 1.2, fontSize: '13px' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 30, height: 30, background: '#2563EB20', color: '#2563EB', fontSize: 11, borderRadius: '8px' }}>{c.name.slice(0, 2)}</Avatar>
                      <Typography fontSize="13px" fontWeight={600}>{c.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{c.industry}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{c.contact}</TableCell>
                  <TableCell fontWeight={700} color="primary.main">₹{c.totalRevenue.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{c.projects}</TableCell>
                  <TableCell><StatusChip label={c.status} /></TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{c.since}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
