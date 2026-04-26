import { createTheme } from '@mui/material/styles';

const baseTheme = (mode) => ({
  palette: {
    mode,
    primary: { main: '#2563EB', light: '#60A5FA', dark: '#1D4ED8' },
    secondary: { main: '#7C3AED' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#06B6D4' },
    background: {
      default: mode === 'dark' ? '#0F172A' : '#F1F5F9',
      paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
    },
    text: {
      primary: mode === 'dark' ? '#F1F5F9' : '#0F172A',
      secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
    },
    divider: mode === 'dark' ? '#334155' : '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
    '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)',
    '0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)',
    ...Array(20).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        contained: { padding: '9px 20px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 2px 12px rgba(0,0,0,0.06)',
          border: `1px solid ${mode === 'dark' ? '#334155' : '#E2E8F0'}`,
        },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } } },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          border: 'none',
          boxShadow: mode === 'dark'
            ? '2px 0 20px rgba(0,0,0,0.4)'
            : '2px 0 20px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          color: mode === 'dark' ? '#F1F5F9' : '#0F172A',
          boxShadow: `0 1px 0 ${mode === 'dark' ? '#334155' : '#E2E8F0'}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: mode === 'dark' ? '#94A3B8' : '#64748B',
            background: mode === 'dark' ? '#0F172A' : '#F8FAFC',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 10, marginBottom: 2 },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(baseTheme(mode));
