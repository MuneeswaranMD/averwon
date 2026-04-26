import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toggleTheme } from '../store';
import {
  AppBar, Toolbar, IconButton, Typography, Box, InputBase, Badge,
  Avatar, Menu, MenuItem, Tooltip, Divider, ListItemIcon, Chip
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const breadcrumbMap = {
  '/': ['Dashboard'],
  '/leads': ['CRM', 'Leads'],
  '/clients': ['CRM', 'Clients'],
  '/deals': ['CRM', 'Deals'],
  '/projects': ['Work', 'Projects'],
  '/tasks': ['Work', 'Tasks'],
  '/invoices': ['Finance', 'Invoices'],
  '/payments': ['Finance', 'Payments'],
  '/tickets': ['Support', 'Tickets'],
  '/team': ['Organization', 'Team'],
  '/calendar': ['Work', 'Calendar'],
  '/reports': ['Analytics', 'Reports'],
  '/settings': ['System', 'Settings'],
};

export default function Topbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const crumbs = breadcrumbMap[location.pathname] || ['Dashboard'];

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 1100, backdropFilter: 'blur(12px)' }}>
      <Toolbar sx={{ gap: 1.5, minHeight: '64px !important' }}>

        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <NavigateNextRoundedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
              <Typography
                sx={{ fontSize: '13px', fontWeight: i === crumbs.length - 1 ? 700 : 500, color: i === crumbs.length - 1 ? 'text.primary' : 'text.secondary' }}
              >
                {crumb}
              </Typography>
            </React.Fragment>
          ))}
        </Box>

        {/* Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', background: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderRadius: '10px', px: 1.5, py: 0.6, gap: 1, width: 240 }}>
          <SearchRoundedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
          <InputBase placeholder="Search anything..." sx={{ fontSize: '13px', flex: 1, color: 'text.primary', '& input::placeholder': { color: 'text.disabled' } }} />
          <Chip label="⌘K" size="small" sx={{ height: 18, fontSize: '9px', background: dark ? '#334155' : '#E2E8F0', color: 'text.secondary' }} />
        </Box>

        {/* Notifications */}
        <Tooltip title="Notifications" arrow>
          <IconButton onClick={e => setNotifAnchor(e.currentTarget)} size="small" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: '9px' } }}>
              <NotificationsRoundedIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Messages */}
        <Tooltip title="Messages" arrow>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={2} color="primary">
              <ChatBubbleRoundedIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={dark ? 'Light Mode' : 'Dark Mode'} arrow>
          <IconButton onClick={() => dispatch(toggleTheme())} size="small" sx={{ color: 'text.secondary' }}>
            {dark ? <LightModeRoundedIcon sx={{ fontSize: 21 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 21 }} />}
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Box onClick={e => setAnchorEl(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', px: 1, py: 0.5, borderRadius: '10px', '&:hover': { background: dark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }, transition: 'background 0.2s' }}>
          <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', fontSize: 12, fontWeight: 700 }}>AD</Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontSize: '12.5px', fontWeight: 700, lineHeight: 1.2 }}>Admin User</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>Super Admin</Typography>
          </Box>
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </Box>

        {/* Profile Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { mt: 1, width: 200, borderRadius: 2, border: '1px solid', borderColor: 'divider' } }}>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={700} fontSize="14px">Admin User</Typography>
            <Typography variant="caption" color="text.secondary">admin@averqon.ai</Typography>
          </Box>
          <Divider />
          <MenuItem sx={{ gap: 1.5, fontSize: '13px' }}><ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>Profile</MenuItem>
          <MenuItem sx={{ gap: 1.5, fontSize: '13px' }}><ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>Settings</MenuItem>
          <Divider />
          <MenuItem sx={{ gap: 1.5, fontSize: '13px', color: 'error.main' }}><ListItemIcon><LogoutRoundedIcon fontSize="small" color="error" /></ListItemIcon>Logout</MenuItem>
        </Menu>

        {/* Notification Panel */}
        <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}
          PaperProps={{ sx: { mt: 1, width: 320, borderRadius: 2, border: '1px solid', borderColor: 'divider' } }}>
          <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontWeight={700}>Notifications</Typography>
            <Chip label="3 new" size="small" color="primary" />
          </Box>
          <Divider />
          {[
            { title: 'New lead from LinkedIn', time: '5 min ago', color: '#2563EB' },
            { title: 'Deal moved to Won stage', time: '1 hr ago', color: '#10B981' },
            { title: 'Ticket #TKT-004 opened', time: '2 hr ago', color: '#EF4444' },
          ].map(n => (
            <MenuItem key={n.title} sx={{ gap: 1.5, py: 1.2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
              <Box>
                <Typography fontSize="13px" fontWeight={500}>{n.title}</Typography>
                <Typography variant="caption" color="text.secondary">{n.time}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
