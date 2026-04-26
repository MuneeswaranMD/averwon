import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Tooltip, Typography, Avatar, Divider, IconButton
} from '@mui/material';

// MUI Icons
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

// Child icons
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import BeachAccessRoundedIcon from '@mui/icons-material/BeachAccessRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';

// Using static path for AdminJS bundling stability
const averqonLogo = '/logo.png';

const COLLAPSED_W = 72;
const EXPANDED_W = 260;

const PRIMARY = '#2563EB';
const PRIMARY_LIGHT = '#EFF6FF';
const BG = '#FFFFFF';
const BORDER = '#E2E8F0';
const TEXT = '#334155';
const MUTED = '#64748B';
const NAV_SELECTED_BG = '#EFF6FF';
const NAV_HOVER_BG = '#F8FAFC';

const navConfig = [
  {
    name: 'HR Management',
    icon: <PeopleAltRoundedIcon />,
    items: [
      { name: 'Employees', path: '/admin/resources/Employee', icon: <BadgeRoundedIcon fontSize="small" /> },
      { name: 'Interns', path: '/admin/resources/Intern', icon: <SchoolRoundedIcon fontSize="small" /> },
      { name: 'Attendance', path: '/admin/resources/Attendance', icon: <AccessTimeRoundedIcon fontSize="small" /> },
      { name: 'Leave Requests', path: '/admin/resources/LeaveRequest', icon: <BeachAccessRoundedIcon fontSize="small" /> },
      { name: 'Payroll', path: '/admin/resources/Payroll', icon: <PaymentsRoundedIcon fontSize="small" /> },
    ],
  },
  {
    name: 'Recruitment',
    icon: <ManageSearchRoundedIcon />,
    items: [
      { name: 'Job Postings', path: '/admin/resources/JobPosting', icon: <WorkRoundedIcon fontSize="small" /> },
      { name: 'Applications', path: '/admin/resources/JobApplication', icon: <AssignmentIndRoundedIcon fontSize="small" /> },
    ],
  },
  {
    name: 'Operations',
    icon: <BusinessCenterRoundedIcon />,
    items: [
      { name: 'Projects', path: '/admin/resources/Project', icon: <FolderOpenRoundedIcon fontSize="small" /> },
      { name: 'Tasks', path: '/admin/resources/Task', icon: <CheckBoxRoundedIcon fontSize="small" /> },
      { name: 'Meetings', path: '/admin/resources/Meeting', icon: <VideocamRoundedIcon fontSize="small" /> },
    ],
  },
  {
    name: 'Support',
    icon: <SupportAgentRoundedIcon />,
    items: [
      { name: 'Tickets', path: '/admin/resources/Ticket', icon: <ConfirmationNumberRoundedIcon fontSize="small" /> },
    ],
  },
  {
    name: 'Finance',
    icon: <AccountBalanceWalletRoundedIcon />,
    items: [
      { name: 'Revenue', path: '/admin/resources/Revenue', icon: <TrendingUpRoundedIcon fontSize="small" /> },
      { name: 'Invoices', path: '/admin/resources/Invoice', icon: <ReceiptLongRoundedIcon fontSize="small" /> },
      { name: 'Bills', path: '/admin/resources/Bill', icon: <CreditCardRoundedIcon fontSize="small" /> },
    ],
  },
  {
    name: 'Sales',
    icon: <TrackChangesRoundedIcon />,
    items: [
      { name: 'Leads', path: '/admin/resources/Lead', icon: <PersonSearchRoundedIcon fontSize="small" /> },
      { name: 'Deals', path: '/admin/resources/Sales', icon: <HandshakeRoundedIcon fontSize="small" /> },
    ],
  },
  {
    name: 'System',
    icon: <ShieldRoundedIcon />,
    items: [
      { name: 'Settings', path: '/admin/resources/Setting', icon: <SettingsRoundedIcon fontSize="small" /> },
      { name: 'Admin Account', path: '/admin/resources/Manager', icon: <AdminPanelSettingsRoundedIcon fontSize="small" /> },
    ],
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState({ 'HR Management': true, Operations: true });
  const currentPath = window.location.pathname;

  const toggle = (name) => setOpen(prev => ({ ...prev, [name]: !prev[name] }));
  const isActive = (path) => currentPath === path;
  const sectionActive = (items) => items.some(i => currentPath === i.path);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_W : EXPANDED_W,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? COLLAPSED_W : EXPANDED_W,
          boxSizing: 'border-box',
          background: BG,
          borderRight: `1px solid ${BORDER}`,
          overflowX: 'hidden',
          transition: 'width 0.28s cubic-bezier(0.4,0,0.6,1)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ── Brand ── */}
      <Box
        sx={{
          px: collapsed ? 0 : 2,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          borderBottom: `1px solid ${BORDER}`,
          mb: 1,
        }}
      >
        {/* Collapse Toggle */}
        <IconButton
          onClick={() => setCollapsed(c => !c)}
          size="small"
          sx={{
            position: 'absolute',
            right: -12,
            top: 28,
            width: 24,
            height: 24,
            background: '#fff',
            border: `1px solid ${BORDER}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            zIndex: 10,
            '&:hover': { background: PRIMARY_LIGHT },
          }}
        >
          {collapsed
            ? <ChevronRightRoundedIcon sx={{ fontSize: 14, color: PRIMARY }} />
            : <ChevronLeftRoundedIcon sx={{ fontSize: 14, color: PRIMARY }} />}
        </IconButton>

        {!collapsed && (
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Box
              component="img"
              src={averqonLogo}
              sx={{
                height: 48,
                width: 'auto',
                mb: 1.5,
                borderRadius: '8px'
              }}
            />
            <Typography variant="subtitle1" fontWeight={800} color={PRIMARY} sx={{ fontSize: '18px', lineHeight: 1.2, letterSpacing: '1px' }}>
              AVERQON
            </Typography>
            <Typography variant="caption" sx={{ color: PRIMARY, fontWeight: 700, letterSpacing: '1.5px', opacity: 0.8, fontSize: '10px' }}>
              SMART MANAGEMENT
            </Typography>
          </Box>
        )}
        {collapsed && (
          <Box
            component="img"
            src={averqonLogo}
            sx={{ height: 32, width: 32, borderRadius: '6px' }}
          />
        )}
      </Box>

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: 1.5, pb: 2, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { borderRadius: 4, background: BORDER } }}>

        {/* Dashboard */}
        <Tooltip title={collapsed ? 'Dashboard' : ''} placement="right" arrow>
          <ListItemButton
            component="a"
            href="/admin"
            selected={currentPath === '/admin'}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              py: 1.1,
              px: 1.5,
              gap: 1.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: currentPath === '/admin' ? PRIMARY : TEXT,
              background: currentPath === '/admin' ? NAV_SELECTED_BG : 'transparent',
              border: `1px solid ${currentPath === '/admin' ? BORDER : 'transparent'}`,
              '&:hover': { background: NAV_HOVER_BG, color: PRIMARY },
              '&.Mui-selected': { background: NAV_SELECTED_BG, '&:hover': { background: NAV_SELECTED_BG } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
              <DashboardRoundedIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 600, color: 'inherit' }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {/* Sections */}
        {navConfig.map((section) => {
          const secActive = sectionActive(section.items);
          const isOpen = open[section.name];

          return (
            <Box key={section.name}>
              <Tooltip title={collapsed ? section.name : ''} placement="right" arrow>
                <ListItemButton
                  onClick={() => !collapsed && toggle(section.name)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.1,
                    px: 1.5,
                    gap: 1.5,
                    justifyContent: collapsed ? 'center' : 'space-between',
                    color: secActive ? PRIMARY : TEXT,
                    '&:hover': { background: PRIMARY_LIGHT, color: PRIMARY },
                    mb: 0.25,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 0, color: secActive ? PRIMARY : MUTED }}>
                      {React.cloneElement(section.icon, { sx: { fontSize: 20 } })}
                    </ListItemIcon>
                    {!collapsed && (
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'inherit' }}>
                        {section.name}
                      </Typography>
                    )}
                  </Box>
                  {!collapsed && (
                    <ExpandMoreRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: MUTED,
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>

              {/* Child items */}
              {!collapsed && (
                <Collapse in={isOpen} timeout={200} unmountOnExit>
                  <Box
                    sx={{
                      mx: 0.5,
                      mb: 1,
                      background: '#fff',
                      borderRadius: '12px',
                      border: `1px solid ${BORDER}`,
                      overflow: 'hidden',
                    }}
                  >
                    <List disablePadding>
                      {section.items.map((item) => {
                        const active = isActive(item.path);
                        return (
                          <ListItemButton
                            key={item.name}
                            component="a"
                            href={item.path}
                            sx={{
                              py: 0.9,
                              px: 1.5,
                              gap: 1.2,
                              color: active ? PRIMARY : MUTED,
                              background: active ? PRIMARY_LIGHT : 'transparent',
                              borderLeft: `3px solid ${active ? PRIMARY : 'transparent'}`,
                              '&:hover': { background: PRIMARY_LIGHT, color: PRIMARY },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', opacity: active ? 1 : 0.65 }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.name}
                              primaryTypographyProps={{
                                fontSize: '13px',
                                fontWeight: active ? 600 : 400,
                                color: 'inherit',
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Box>
                </Collapse>
              )}
            </Box>
          );
        })}
      </Box>

      {/* ── Profile Footer ── */}
      <Divider sx={{ borderColor: BORDER }} />
      <Box
        sx={{
          p: collapsed ? 1 : 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Avatar
          src={`https://ui-avatars.com/api/?name=Admin&background=2563EB&color=fff&size=36`}
          sx={{ width: 36, height: 36, borderRadius: '10px', flexShrink: 0 }}
        />
        {!collapsed && (
          <>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Admin User
              </Typography>
              <Typography sx={{ fontSize: '11px', color: MUTED }}>Super Admin</Typography>
            </Box>
            <Tooltip title="Logout" placement="top" arrow>
              <IconButton
                component="a"
                href="/admin/logout"
                size="small"
                sx={{ color: MUTED, '&:hover': { color: '#EF4444', background: '#FEF2F2' } }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
