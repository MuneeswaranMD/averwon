import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store';
import {
  Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Tooltip, Typography, Avatar, Divider, IconButton, Chip
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const EXPANDED_W = 265;
const COLLAPSED_W = 70;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/', badge: null },
  { label: 'Leads', icon: <PeopleAltRoundedIcon />, path: '/leads', badge: 6 },
  { label: 'Clients', icon: <BusinessRoundedIcon />, path: '/clients', badge: null },
  { label: 'Deals', icon: <HandshakeRoundedIcon />, path: '/deals', badge: null },
  { label: 'Projects', icon: <FolderOpenRoundedIcon />, path: '/projects', badge: null },
  { label: 'Tasks', icon: <CheckBoxRoundedIcon />, path: '/tasks', badge: 3 },
  { label: 'Tickets', icon: <ConfirmationNumberRoundedIcon />, path: '/tickets', badge: 2 },
  { label: 'Team', icon: <GroupsRoundedIcon />, path: '/team', badge: null },
  { label: 'Calendar', icon: <CalendarMonthRoundedIcon />, path: '/calendar', badge: null },
  { label: 'Reports', icon: <BarChartRoundedIcon />, path: '/reports', badge: null },
  { label: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings', badge: null },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, themeMode } = useSelector(s => s.ui);
  const dark = themeMode === 'dark';

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? EXPANDED_W : COLLAPSED_W,
        flexShrink: 0,
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? EXPANDED_W : COLLAPSED_W,
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Brand */}
      <Box sx={{ px: sidebarOpen ? 2.5 : 1.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', borderBottom: '1px solid', borderColor: 'divider', minHeight: 72 }}>
        <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: '10px', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>A</Avatar>
        {sidebarOpen && (
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2, fontSize: '15px' }}>averqon CRM</Typography>
            <Typography variant="caption" color="text.secondary">Enterprise Suite</Typography>
          </Box>
        )}
        <IconButton
          onClick={() => dispatch(toggleSidebar())}
          size="small"
          sx={{
            position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
            width: 24, height: 24, background: dark ? '#334155' : '#fff',
            border: '1px solid', borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 10,
            '&:hover': { background: 'primary.light' },
          }}
        >
          {sidebarOpen
            ? <ChevronLeftRoundedIcon sx={{ fontSize: 14 }} />
            : <ChevronRightRoundedIcon sx={{ fontSize: 14 }} />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5, px: 1.2, '&::-webkit-scrollbar': { width: 3 } }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip key={item.path} title={sidebarOpen ? '' : item.label} placement="right" arrow>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: '10px', mb: 0.3, py: 1.1,
                  px: sidebarOpen ? 1.5 : 1.2,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  color: active ? 'primary.main' : 'text.secondary',
                  background: active ? (dark ? 'rgba(37,99,235,0.15)' : '#EFF6FF') : 'transparent',
                  borderLeft: `3px solid ${active ? '#2563EB' : 'transparent'}`,
                  '&:hover': { background: dark ? 'rgba(37,99,235,0.1)' : '#EFF6FF', color: 'primary.main' },
                  '&.Mui-selected': { background: dark ? 'rgba(37,99,235,0.15)' : '#EFF6FF', '&:hover': { background: dark ? 'rgba(37,99,235,0.2)' : '#DBEAFE' } },
                  transition: 'all 0.18s',
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: sidebarOpen ? 1.5 : 0, color: 'inherit' }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 21 } })}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '13.5px', fontWeight: active ? 700 : 500, color: 'inherit' }}
                    sx={{ my: 0 }}
                  />
                )}
                {sidebarOpen && item.badge && (
                  <Chip label={item.badge} size="small" color="primary" sx={{ height: 18, fontSize: '10px', fontWeight: 700, ml: 1 }} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </Box>

      {/* Footer */}
      <Divider sx={{ borderColor: 'divider' }} />
      <Box sx={{ p: sidebarOpen ? 1.5 : 1, display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
        <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg,#10B981,#059669)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>AD</Avatar>
        {sidebarOpen && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</Typography>
            <Typography variant="caption" color="text.secondary">Super Admin</Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
