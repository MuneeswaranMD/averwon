import { configureStore, createSlice } from '@reduxjs/toolkit';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const leadsMock = [
  { id: 1, name: 'Arjun Sharma', company: 'TechWave Solutions', email: 'arjun@techwave.in', phone: '+91 98765 43210', source: 'LinkedIn', industry: 'Technology', status: 'New', assignedTo: 'Priya Nair', notes: 'Interested in enterprise plan', followUp: '2026-04-25', createdAt: '2026-04-10' },
  { id: 2, name: 'Meena Iyer', company: 'GreenBridge Corp', email: 'meena@greenbridge.ai', phone: '+91 87654 32109', source: 'Website', industry: 'Finance', status: 'Contacted', assignedTo: 'Rahul Das', notes: 'Needs demo', followUp: '2026-04-22', createdAt: '2026-04-12' },
  { id: 3, name: 'Karthik Nair', company: 'DataSync Inc', email: 'karthik@datasync.io', phone: '+91 76543 21098', source: 'Referral', industry: 'SaaS', status: 'Qualified', assignedTo: 'Priya Nair', notes: 'Budget confirmed', followUp: '2026-04-28', createdAt: '2026-04-14' },
  { id: 4, name: 'Divya Menon', company: 'CloudForge', email: 'divya@cloudforge.tech', phone: '+91 65432 10987', source: 'Cold Call', industry: 'Cloud', status: 'Proposal Sent', assignedTo: 'Ankit Joshi', notes: 'Decision pending', followUp: '2026-05-01', createdAt: '2026-04-08' },
  { id: 5, name: 'Ravi Kumar', company: 'Zenith Analytics', email: 'ravi@zenith.ai', phone: '+91 54321 09876', source: 'Email Campaign', industry: 'Analytics', status: 'Converted', assignedTo: 'Rahul Das', notes: 'Signed contract', followUp: '2026-04-30', createdAt: '2026-04-05' },
  { id: 6, name: 'Sneha Patel', company: 'InnovateCo', email: 'sneha@innovateco.in', phone: '+91 43210 98765', source: 'Website', industry: 'Manufacturing', status: 'Closed', assignedTo: 'Ankit Joshi', notes: 'Not interested', followUp: '2026-04-15', createdAt: '2026-04-03' },
];

const clientsMock = [
  { id: 1, name: 'TechWave Solutions', contact: 'Arjun Sharma', email: 'contact@techwave.in', phone: '+91 98765 43210', industry: 'Technology', status: 'Active', projects: 3, location: 'Bangalore', since: '2025-01-15' },
  { id: 2, name: 'DataSync Inc', contact: 'Karthik Nair', email: 'info@datasync.io', phone: '+91 76543 21098', industry: 'SaaS', status: 'Active', projects: 2, location: 'Hyderabad', since: '2025-03-20' },
  { id: 3, name: 'Zenith Analytics', contact: 'Ravi Kumar', email: 'ravi@zenith.ai', phone: '+91 54321 09876', industry: 'Analytics', status: 'Active', projects: 1, location: 'Chennai', since: '2026-01-10' },
  { id: 4, name: 'CloudForge', contact: 'Divya Menon', email: 'support@cloudforge.tech', phone: '+91 65432 10987', industry: 'Cloud', status: 'Inactive', projects: 0, location: 'Mumbai', since: '2024-11-05' },
];

const dealsMock = [
  { id: 1, title: 'Enterprise License - TechWave', client: 'TechWave Solutions', value: 480000, stage: 'Negotiation', salesperson: 'Priya Nair', expectedClose: '2026-05-10', probability: 70 },
  { id: 2, title: 'SaaS Platform - DataSync', client: 'DataSync Inc', value: 325000, stage: 'Proposal', salesperson: 'Rahul Das', expectedClose: '2026-05-20', probability: 50 },
  { id: 3, title: 'Analytics Module - Zenith', client: 'Zenith Analytics', value: 195000, stage: 'Won', salesperson: 'Priya Nair', expectedClose: '2026-04-30', probability: 100 },
  { id: 4, title: 'Cloud Migration - CloudForge', client: 'CloudForge', value: 88000, stage: 'Qualification', salesperson: 'Ankit Joshi', expectedClose: '2026-06-01', probability: 30 },
  { id: 5, title: 'Mobile CRM - GreenBridge', client: 'GreenBridge Corp', value: 210000, stage: 'New', salesperson: 'Rahul Das', expectedClose: '2026-06-15', probability: 20 },
  { id: 6, title: 'HRMS Suite - InnovateCo', client: 'InnovateCo', value: 55000, stage: 'Lost', salesperson: 'Ankit Joshi', expectedClose: '2026-04-20', probability: 0 },
];

const tasksMock = [
  { id: 1, title: 'Prepare TechWave proposal', priority: 'High', status: 'In Progress', assignee: 'Priya Nair', due: '2026-04-24', project: 'TechWave Deal' },
  { id: 2, title: 'Send follow-up email to Meena', priority: 'Medium', status: 'Todo', assignee: 'Rahul Das', due: '2026-04-22', project: 'GreenBridge CRM' },
  { id: 3, title: 'Review DataSync contract', priority: 'High', status: 'Todo', assignee: 'Ankit Joshi', due: '2026-04-23', project: 'DataSync SaaS' },
  { id: 4, title: 'Update CRM dashboard', priority: 'Low', status: 'Done', assignee: 'Priya Nair', due: '2026-04-18', project: 'Internal' },
  { id: 5, title: 'Demo call with Zenith', priority: 'High', status: 'Done', assignee: 'Rahul Das', due: '2026-04-20', project: 'Zenith Analytics' },
  { id: 6, title: 'State reconciliation', priority: 'Medium', status: 'In Progress', assignee: 'Ankit Joshi', due: '2026-04-26', project: 'Internal' },
];

const ticketsMock = [
  { id: 'TKT-001', subject: 'Cannot access dashboard', client: 'TechWave Solutions', priority: 'High', status: 'Open', assignee: 'Support Team', created: '2026-04-20', resolved: null },
  { id: 'TKT-002', subject: 'Platform integration error', client: 'DataSync Inc', priority: 'Medium', status: 'In Progress', assignee: 'Ankit Joshi', created: '2026-04-19', resolved: null },
  { id: 'TKT-003', subject: 'Report export not working', client: 'Zenith Analytics', priority: 'Low', status: 'Resolved', assignee: 'Priya Nair', created: '2026-04-15', resolved: '2026-04-18' },
  { id: 'TKT-004', subject: 'Integration with Slack failing', client: 'CloudForge', priority: 'High', status: 'Open', assignee: 'Support Team', created: '2026-04-21', resolved: null },
];

const projectsMock = [
  { id: 1, name: 'TechWave Deployment', client: 'TechWave Solutions', status: 'In Progress', progress: 65, deadline: '2026-07-15', team: ['Priya Nair', 'Rahul Das', 'Dev Team'] },
  { id: 2, name: 'DataSync Customization', client: 'DataSync Inc', status: 'In Progress', progress: 40, deadline: '2026-08-01', team: ['Ankit Joshi', 'Dev Team'] },
  { id: 3, name: 'Zenith Setup', client: 'Zenith Analytics', status: 'Completed', progress: 100, deadline: '2026-04-18', team: ['Priya Nair'] },
  { id: 4, name: 'GreenBridge Portal', client: 'GreenBridge Corp', status: 'Planning', progress: 10, deadline: '2026-09-01', team: ['Rahul Das', 'Dev Team'] },
];

const teamMock = [
  { id: 1, name: 'Priya Nair', role: 'Sales Manager', email: 'priya@averqon.ai', avatar: 'PN', deals: 8, leads: 14, status: 'Active' },
  { id: 2, name: 'Rahul Das', role: 'Sales Executive', email: 'rahul@averqon.ai', avatar: 'RD', deals: 5, leads: 11, status: 'Active' },
  { id: 3, name: 'Ankit Joshi', role: 'Business Analyst', email: 'ankit@averqon.ai', avatar: 'AJ', deals: 4, leads: 9, status: 'Active' },
  { id: 4, name: 'Sneha Patel', role: 'Support Lead', email: 'sneha@averqon.ai', avatar: 'SP', deals: 0, leads: 3, status: 'Active' },
];

// ─── UI Slice ────────────────────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState: { themeMode: 'light', sidebarOpen: true, notifications: [] },
  reducers: {
    toggleTheme: (state) => { state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'; },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    addNotification: (state, action) => { state.notifications.unshift(action.payload); },
    clearNotifications: (state) => { state.notifications = []; },
  },
});

// ─── Leads Slice ─────────────────────────────────────────────────────────────
const leadsSlice = createSlice({
  name: 'leads',
  initialState: { items: leadsMock },
  reducers: {
    addLead: (state, { payload }) => { state.items.unshift({ ...payload, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }); },
    updateLead: (state, { payload }) => { const i = state.items.findIndex(x => x.id === payload.id); if (i !== -1) state.items[i] = payload; },
    deleteLead: (state, { payload }) => { state.items = state.items.filter(x => x.id !== payload); },
  },
});

// ─── Clients Slice ────────────────────────────────────────────────────────────
const clientsSlice = createSlice({
  name: 'clients',
  initialState: { items: clientsMock },
  reducers: {
    addClient: (state, { payload }) => { state.items.unshift({ ...payload, id: Date.now() }); },
    updateClient: (state, { payload }) => { const i = state.items.findIndex(x => x.id === payload.id); if (i !== -1) state.items[i] = payload; },
    deleteClient: (state, { payload }) => { state.items = state.items.filter(x => x.id !== payload); },
  },
});

// ─── Deals Slice ─────────────────────────────────────────────────────────────
const dealsSlice = createSlice({
  name: 'deals',
  initialState: { items: dealsMock },
  reducers: {
    addDeal: (state, { payload }) => { state.items.unshift({ ...payload, id: Date.now() }); },
    updateDeal: (state, { payload }) => { const i = state.items.findIndex(x => x.id === payload.id); if (i !== -1) state.items[i] = payload; },
    deleteDeal: (state, { payload }) => { state.items = state.items.filter(x => x.id !== payload); },
    moveDeal: (state, { payload: { id, stage } }) => { const deal = state.items.find(x => x.id === id); if (deal) deal.stage = stage; },
  },
});

// ─── Tasks Slice ─────────────────────────────────────────────────────────────
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: tasksMock },
  reducers: {
    addTask: (state, { payload }) => { state.items.unshift({ ...payload, id: Date.now() }); },
    updateTask: (state, { payload }) => { const i = state.items.findIndex(x => x.id === payload.id); if (i !== -1) state.items[i] = payload; },
    deleteTask: (state, { payload }) => { state.items = state.items.filter(x => x.id !== payload); },
  },
});

// ─── Tickets Slice ────────────────────────────────────────────────────────────
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: { items: ticketsMock },
  reducers: {
    addTicket: (state, { payload }) => { state.items.unshift({ ...payload, id: `TKT-00${Date.now() % 100}`, created: new Date().toISOString().split('T')[0], resolved: null }); },
    updateTicket: (state, { payload }) => { const i = state.items.findIndex(x => x.id === payload.id); if (i !== -1) state.items[i] = payload; },
  },
});

// ─── Projects Slice ───────────────────────────────────────────────────────────
const projectsSlice = createSlice({
  name: 'projects',
  initialState: { items: projectsMock },
  reducers: {
    addProject: (state, { payload }) => { state.items.unshift({ ...payload, id: Date.now() }); },
    updateProject: (state, { payload }) => { const i = state.items.findIndex(x => x.id === payload.id); if (i !== -1) state.items[i] = payload; },
  },
});

// ─── Team Slice ────────────────────────────────────────────────────────────────
const teamSlice = createSlice({
  name: 'team',
  initialState: { items: teamMock },
  reducers: {
    addMember: (state, { payload }) => { state.items.push({ ...payload, id: Date.now() }); },
  },
});

export const { toggleTheme, toggleSidebar, addNotification, clearNotifications } = uiSlice.actions;
export const { addLead, updateLead, deleteLead } = leadsSlice.actions;
export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export const { addDeal, updateDeal, deleteDeal, moveDeal } = dealsSlice.actions;
export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export const { addTicket, updateTicket } = ticketsSlice.actions;
export const { addProject, updateProject } = projectsSlice.actions;
export const { addMember } = teamSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    leads: leadsSlice.reducer,
    clients: clientsSlice.reducer,
    deals: dealsSlice.reducer,
    tasks: tasksSlice.reducer,
    tickets: ticketsSlice.reducer,
    projects: projectsSlice.reducer,
    team: teamSlice.reducer,
  },
});
