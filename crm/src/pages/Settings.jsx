import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Grid, Switch, FormControlLabel,
  TextField, Button, Divider, Select, MenuItem, FormControl, InputLabel,
  Avatar, Chip, Stack, Tabs, Tab
} from '@mui/material';
import { SectionHeader } from '../components/ui';

export default function Settings() {
  const { themeMode } = useSelector(s => s.ui);
  const [tab, setTab] = useState(0);
  const [company, setCompany] = useState({ name: 'averqon CRM', email: 'admin@averqon.ai', phone: '+91 98765 43210', address: 'Bangalore, India', timezone: 'Asia/Kolkata', language: 'English' });
  const [notifs, setNotifs] = useState({ newLead: true, dealUpdate: true, ticketOpen: true, teamReport: false });
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: '30', ipWhitelist: false });

  return (
    <Box>
      <SectionHeader title="Settings" subtitle="Manage your CRM preferences and configurations" />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { fontSize: '13px', fontWeight: 600 } }}>
        {['Company', 'Notifications', 'Security', 'Appearance'].map((label, i) => (
          <Tab key={label} label={label} id={`setting-tab-${i}`} />
        ))}
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Company Profile</Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', fontSize: 26, fontWeight: 800, borderRadius: '18px' }}>A</Avatar>
                <Box>
                  <Typography fontWeight={700}>{company.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{company.email}</Typography>
                  <Box sx={{ mt: 0.8 }}><Button size="small" variant="outlined" sx={{ borderRadius: '8px', fontSize: '11px' }}>Change Logo</Button></Box>
                </Box>
              </Grid>
              <Divider sx={{ width: '100%', mt: 1, mb: 1, borderColor: 'divider' }} />
              {[['Company Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Address', 'address']].map(([label, key]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField fullWidth size="small" label={label} value={company[key]} onChange={e => setCompany(c => ({ ...c, [key]: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                </Grid>
              ))}
              {[['Timezone', 'timezone', ['Asia/Kolkata', 'UTC', 'America/New_York']], ['Language', 'language', ['English', 'Hindi', 'Tamil', 'French']]].map(([label, key, opts]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControl fullWidth size="small"><InputLabel>{label}</InputLabel>
                    <Select value={company[key]} label={label} onChange={e => setCompany(c => ({ ...c, [key]: e.target.value }))} sx={{ borderRadius: '10px' }}>
                      {opts.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button variant="contained" sx={{ borderRadius: '10px' }}>Save Changes</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Notification Preferences</Typography>
            <Stack gap={2}>
              {[
                ['New Lead Assigned', 'newLead', 'Get notified when a new lead is assigned to you'],
                ['Deal Status Update', 'dealUpdate', 'Alerts when deal stage changes'],
                ['Ticket Opened', 'ticketOpen', 'Notification for each new support ticket'],
                ['Weekly Team Report', 'teamReport', 'Weekly summary email every Monday'],
              ].map(([label, key, desc]) => (
                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Box>
                    <Typography fontSize="14px" fontWeight={600}>{label}</Typography>
                    <Typography variant="caption" color="text.secondary">{desc}</Typography>
                  </Box>
                  <Switch checked={notifs[key]} onChange={e => setNotifs(n => ({ ...n, [key]: e.target.checked }))} />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Security Settings</Typography>
            <Stack gap={2}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography fontSize="14px" fontWeight={600}>Two-Factor Authentication</Typography>
                  <Typography variant="caption" color="text.secondary">Add extra layer of security to your account</Typography>
                </Box>
                <Switch checked={security.twoFactor} onChange={e => setSecurity(s => ({ ...s, twoFactor: e.target.checked }))} />
              </Box>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography fontSize="14px" fontWeight={600} sx={{ mb: 1 }}>Session Timeout</Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))} sx={{ borderRadius: '10px' }}>
                    {['15', '30', '60', '120'].map(v => <MenuItem key={v} value={v}>{v} minutes</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography fontSize="14px" fontWeight={600}>IP Allowlist</Typography>
                  <Typography variant="caption" color="text.secondary">Restrict login to specific IP addresses</Typography>
                </Box>
                <Switch checked={security.ipWhitelist} onChange={e => setSecurity(s => ({ ...s, ipWhitelist: e.target.checked }))} />
              </Box>
              <Button variant="outlined" color="error" sx={{ borderRadius: '10px', width: 'fit-content' }}>Change Password</Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {tab === 3 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Appearance</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['Light', 'Dark', 'System'].map(t => (
                <Box key={t} sx={{ p: 2, border: '2px solid', borderColor: t === 'Light' ? 'primary.main' : 'divider', borderRadius: 2, cursor: 'pointer', textAlign: 'center', minWidth: 120, '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.2s' }}>
                  <Typography fontSize="28px">{t === 'Light' ? '☀️' : t === 'Dark' ? '🌙' : '💻'}</Typography>
                  <Typography fontWeight={600} fontSize="13px" sx={{ mt: 1 }}>{t}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
