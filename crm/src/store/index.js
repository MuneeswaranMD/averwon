import { configureStore, createSlice } from '@reduxjs/toolkit';

// ─── Mock Users ───────────────────────────────────────────────────────────────
const usersMock = [
  { id: 'u1', name: 'Muneeswaran', role: 'admin',    email: 'admin@averqon.in',   assignedProjects: [] },
  { id: 'u2', name: 'Priya Nair',  role: 'employee', email: 'priya@averqon.ai',  assignedProjects: ['p1', 'p2'] },
  { id: 'u3', name: 'Rahul Das',   role: 'employee', email: 'rahul@averqon.ai',  assignedProjects: ['p1'] },
  { id: 'u4', name: 'Ankit Joshi', role: 'intern',   email: 'ankit@averqon.ai',  assignedProjects: ['p2', 'p3'] },
  { id: 'u5', name: 'Sneha Patel', role: 'intern',   email: 'sneha@averqon.ai',  assignedProjects: ['p3'] },
];

// ─── Mock Projects ────────────────────────────────────────────────────────────
const projectsMock = [
  {
    id: 'p1', name: 'CRM System', client: 'TechWave Solutions',
    description: 'Build a full-featured CRM platform with leads, deals, and reporting.',
    status: 'In Progress', progress: 65, deadline: '2026-07-15',
    assignedUsers: ['u2', 'u3'],
    tools: [
      { id: 't1', name: 'Figma',  link: 'https://figma.com' },
      { id: 't2', name: 'GitHub', link: 'https://github.com' },
    ],
    budget: 480000, spent: 210000,
  },
  {
    id: 'p2', name: 'DataSync Customization', client: 'DataSync Inc',
    description: 'Custom module development and API integration for DataSync platform.',
    status: 'In Progress', progress: 40, deadline: '2026-08-01',
    assignedUsers: ['u2', 'u4'],
    tools: [
      { id: 't3', name: 'Jira',    link: 'https://jira.atlassian.com' },
      { id: 't4', name: 'Postman', link: 'https://postman.com' },
    ],
    budget: 325000, spent: 130000,
  },
  {
    id: 'p3', name: 'HR Portal', client: 'InnovateCo',
    description: 'Employee self-service portal with leave, payroll and attendance management.',
    status: 'Planning', progress: 10, deadline: '2026-09-01',
    assignedUsers: ['u4', 'u5'],
    tools: [
      { id: 't5', name: 'Notion', link: 'https://notion.so' },
    ],
    budget: 210000, spent: 20000,
  },
];

// ─── Mock Tasks ───────────────────────────────────────────────────────────────
const tasksMock = [
  { id: 1, title: 'Design Dashboard', priority: 'High',   status: 'In Progress', assignedTo: 'u2', assignee: 'Priya Nair', due: '2026-04-28', projectId: 'p1', project: 'CRM System' },
  { id: 2, title: 'API Integration',  priority: 'High',   status: 'Todo',        assignedTo: 'u3', assignee: 'Rahul Das',  due: '2026-05-05', projectId: 'p1', project: 'CRM System' },
  { id: 3, title: 'DB Schema Setup',  priority: 'Medium', status: 'Done',        assignedTo: 'u4', assignee: 'Ankit Joshi',due: '2026-04-20', projectId: 'p2', project: 'DataSync Customization' },
  { id: 4, title: 'UI Wireframes',    priority: 'Low',    status: 'Todo',        assignedTo: 'u5', assignee: 'Sneha Patel',due: '2026-05-10', projectId: 'p3', project: 'HR Portal' },
  { id: 5, title: 'Unit Tests',       priority: 'Medium', status: 'In Progress', assignedTo: 'u4', assignee: 'Ankit Joshi',due: '2026-05-12', projectId: 'p2', project: 'DataSync Customization' },
];

// ─── Mock Leave Requests ──────────────────────────────────────────────────────
const leaveMock = [
  { id: 'l1', userId: 'u2', userName: 'Priya Nair',  role: 'employee', fromDate: '2026-04-28', toDate: '2026-04-30', reason: 'Family function',       status: 'Pending',  appliedOn: '2026-04-20' },
  { id: 'l2', userId: 'u4', userName: 'Ankit Joshi', role: 'intern',   fromDate: '2026-05-05', toDate: '2026-05-06', reason: 'Medical appointment',   status: 'Approved', appliedOn: '2026-04-22' },
  { id: 'l3', userId: 'u5', userName: 'Sneha Patel', role: 'intern',   fromDate: '2026-05-10', toDate: '2026-05-10', reason: 'Personal work',         status: 'Rejected', appliedOn: '2026-04-23' },
];

// ─── Mock CRM Data ────────────────────────────────────────────────────────────
const leadsMock = [
  { id: 1, name: 'Arjun Sharma',  company: 'TechWave Solutions', email: 'arjun@techwave.in',  phone: '+91 98765 43210', source: 'LinkedIn',       industry: 'Technology',    status: 'New',           assignedTo: 'Priya Nair',  notes: 'Interested in enterprise plan', followUp: '2026-04-25', createdAt: '2026-04-10' },
  { id: 2, name: 'Meena Iyer',    company: 'GreenBridge Corp',   email: 'meena@greenbridge.ai',phone: '+91 87654 32109', source: 'Website',        industry: 'Finance',       status: 'Contacted',     assignedTo: 'Rahul Das',   notes: 'Needs demo',                   followUp: '2026-04-22', createdAt: '2026-04-12' },
  { id: 3, name: 'Karthik Nair',  company: 'DataSync Inc',       email: 'karthik@datasync.io', phone: '+91 76543 21098', source: 'Referral',       industry: 'SaaS',          status: 'Qualified',     assignedTo: 'Priya Nair',  notes: 'Budget confirmed',             followUp: '2026-04-28', createdAt: '2026-04-14' },
  { id: 4, name: 'Divya Menon',   company: 'CloudForge',         email: 'divya@cloudforge.tech',phone: '+91 65432 10987', source: 'Cold Call',     industry: 'Cloud',         status: 'Proposal Sent', assignedTo: 'Ankit Joshi', notes: 'Decision pending',             followUp: '2026-05-01', createdAt: '2026-04-08' },
  { id: 5, name: 'Ravi Kumar',    company: 'Zenith Analytics',   email: 'ravi@zenith.ai',      phone: '+91 54321 09876', source: 'Email Campaign', industry: 'Analytics',     status: 'Converted',     assignedTo: 'Rahul Das',   notes: 'Signed contract',             followUp: '2026-04-30', createdAt: '2026-04-05' },
  { id: 6, name: 'Sneha Patel',   company: 'InnovateCo',         email: 'sneha@innovateco.in', phone: '+91 43210 98765', source: 'Website',        industry: 'Manufacturing', status: 'Closed',        assignedTo: 'Ankit Joshi', notes: 'Not interested',               followUp: '2026-04-15', createdAt: '2026-04-03' },
];
const clientsMock = [
  { id: 1, name: 'TechWave Solutions', contact: 'Arjun Sharma', email: 'contact@techwave.in',  phone: '+91 98765 43210', industry: 'Technology', status: 'Active',   projects: 3, location: 'Bangalore', since: '2025-01-15' },
  { id: 2, name: 'DataSync Inc',       contact: 'Karthik Nair', email: 'info@datasync.io',     phone: '+91 76543 21098', industry: 'SaaS',       status: 'Active',   projects: 2, location: 'Hyderabad', since: '2025-03-20' },
  { id: 3, name: 'Zenith Analytics',   contact: 'Ravi Kumar',   email: 'ravi@zenith.ai',       phone: '+91 54321 09876', industry: 'Analytics',  status: 'Active',   projects: 1, location: 'Chennai',   since: '2026-01-10' },
  { id: 4, name: 'CloudForge',         contact: 'Divya Menon',  email: 'support@cloudforge.tech',phone: '+91 65432 10987',industry: 'Cloud',      status: 'Inactive', projects: 0, location: 'Mumbai',    since: '2024-11-05' },
];
const dealsMock = [
  { id: 1, title: 'Enterprise License - TechWave', client: 'TechWave Solutions', value: 480000, stage: 'Negotiation', salesperson: 'Priya Nair',  expectedClose: '2026-05-10', probability: 70 },
  { id: 2, title: 'SaaS Platform - DataSync',      client: 'DataSync Inc',       value: 325000, stage: 'Proposal',    salesperson: 'Rahul Das',   expectedClose: '2026-05-20', probability: 50 },
  { id: 3, title: 'Analytics Module - Zenith',     client: 'Zenith Analytics',   value: 195000, stage: 'Won',         salesperson: 'Priya Nair',  expectedClose: '2026-04-30', probability: 100 },
  { id: 4, title: 'Cloud Migration - CloudForge',  client: 'CloudForge',         value: 88000,  stage: 'Qualification',salesperson: 'Ankit Joshi',expectedClose: '2026-06-01', probability: 30 },
];
const ticketsMock = [
  { id: 'TKT-001', subject: 'Cannot access dashboard',      client: 'TechWave Solutions', priority: 'High',   status: 'Open',        assignee: 'Support Team', created: '2026-04-20', resolved: null },
  { id: 'TKT-002', subject: 'Platform integration error',   client: 'DataSync Inc',       priority: 'Medium', status: 'In Progress', assignee: 'Ankit Joshi',  created: '2026-04-19', resolved: null },
  { id: 'TKT-003', subject: 'Report export not working',    client: 'Zenith Analytics',   priority: 'Low',    status: 'Resolved',    assignee: 'Priya Nair',   created: '2026-04-15', resolved: '2026-04-18' },
  { id: 'TKT-004', subject: 'Integration with Slack failing',client: 'CloudForge',        priority: 'High',   status: 'Open',        assignee: 'Support Team', created: '2026-04-21', resolved: null },
];
const teamMock = [
  { id: 'u2', name: 'Priya Nair',  role: 'Sales Manager',    email: 'priya@averqon.ai',  avatar: 'PN', deals: 8,  leads: 14, status: 'Active' },
  { id: 'u3', name: 'Rahul Das',   role: 'Sales Executive',  email: 'rahul@averqon.ai',  avatar: 'RD', deals: 5,  leads: 11, status: 'Active' },
  { id: 'u4', name: 'Ankit Joshi', role: 'Business Analyst', email: 'ankit@averqon.ai',  avatar: 'AJ', deals: 4,  leads: 9,  status: 'Active' },
  { id: 'u5', name: 'Sneha Patel', role: 'Support Lead',     email: 'sneha@averqon.ai',  avatar: 'SP', deals: 0,  leads: 3,  status: 'Active' },
];

// ─── UI Slice ──────────────────────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState: { themeMode: 'light', sidebarOpen: true, notifications: [] },
  reducers: {
    toggleTheme: (s) => { s.themeMode = s.themeMode === 'light' ? 'dark' : 'light'; },
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    addNotification: (s, { payload }) => { s.notifications.unshift(payload); },
    clearNotifications: (s) => { s.notifications = []; },
  },
});

// ─── Auth / Current User Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: { currentUser: usersMock[0] }, // default: admin
  reducers: {
    setCurrentUser: (s, { payload }) => { s.currentUser = payload; },
    switchRole: (s, { payload }) => {
      const found = usersMock.find(u => u.id === payload);
      if (found) s.currentUser = found;
    },
  },
});

// ─── Users Slice ──────────────────────────────────────────────────────────────
const usersSlice = createSlice({
  name: 'users',
  initialState: { items: usersMock },
  reducers: {
    addUser: (s, { payload }) => { s.items.push({ ...payload, id: `u${Date.now()}` }); },
    updateUser: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
    assignProjectToUser: (s, { payload: { userId, projectId } }) => {
      const u = s.items.find(x => x.id === userId);
      if (u && !u.assignedProjects.includes(projectId)) u.assignedProjects.push(projectId);
    },
    removeProjectFromUser: (s, { payload: { userId, projectId } }) => {
      const u = s.items.find(x => x.id === userId);
      if (u) u.assignedProjects = u.assignedProjects.filter(p => p !== projectId);
    },
  },
});

// ─── Projects Slice ────────────────────────────────────────────────────────────
const projectsSlice = createSlice({
  name: 'projects',
  initialState: { items: projectsMock },
  reducers: {
    addProject: (s, { payload }) => { s.items.unshift({ ...payload, id: `p${Date.now()}`, assignedUsers: [], tools: [], progress: 0 }); },
    updateProject: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
    deleteProject: (s, { payload }) => { s.items = s.items.filter(x => x.id !== payload); },
    addTool: (s, { payload: { projectId, tool } }) => {
      const p = s.items.find(x => x.id === projectId);
      if (p) p.tools.push({ ...tool, id: `t${Date.now()}` });
    },
    removeTool: (s, { payload: { projectId, toolId } }) => {
      const p = s.items.find(x => x.id === projectId);
      if (p) p.tools = p.tools.filter(t => t.id !== toolId);
    },
    assignUser: (s, { payload: { projectId, userId } }) => {
      const p = s.items.find(x => x.id === projectId);
      if (p && !p.assignedUsers.includes(userId)) p.assignedUsers.push(userId);
    },
    removeUser: (s, { payload: { projectId, userId } }) => {
      const p = s.items.find(x => x.id === projectId);
      if (p) p.assignedUsers = p.assignedUsers.filter(u => u !== userId);
    },
  },
});

// ─── Tasks Slice ──────────────────────────────────────────────────────────────
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: tasksMock },
  reducers: {
    addTask: (s, { payload }) => { s.items.unshift({ ...payload, id: Date.now() }); },
    updateTask: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
    deleteTask: (s, { payload }) => { s.items = s.items.filter(x => x.id !== payload); },
  },
});

// ─── Leave Slice ────────────────────────────────────────────────────────────
const leaveSlice = createSlice({
  name: 'leave',
  initialState: { items: leaveMock },
  reducers: {
    applyLeave: (s, { payload }) => {
      s.items.unshift({ ...payload, id: `l${Date.now()}`, status: 'Pending', appliedOn: new Date().toISOString().split('T')[0] });
    },
    updateLeaveStatus: (s, { payload: { id, status } }) => {
      const l = s.items.find(x => x.id === id);
      if (l) l.status = status;
    },
    deleteLeave: (s, { payload }) => { s.items = s.items.filter(x => x.id !== payload); },
  },
});

// ─── CRM Slices ────────────────────────────────────────────────────────────────
const leadsSlice = createSlice({
  name: 'leads',
  initialState: { items: leadsMock },
  reducers: {
    addLead: (s, { payload }) => { s.items.unshift({ ...payload, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }); },
    updateLead: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
    deleteLead: (s, { payload }) => { s.items = s.items.filter(x => x.id !== payload); },
  },
});
const clientsSlice = createSlice({
  name: 'clients',
  initialState: { items: clientsMock },
  reducers: {
    addClient: (s, { payload }) => { s.items.unshift({ ...payload, id: Date.now() }); },
    updateClient: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
    deleteClient: (s, { payload }) => { s.items = s.items.filter(x => x.id !== payload); },
  },
});
const dealsSlice = createSlice({
  name: 'deals',
  initialState: { items: dealsMock },
  reducers: {
    addDeal: (s, { payload }) => { s.items.unshift({ ...payload, id: Date.now() }); },
    updateDeal: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
    deleteDeal: (s, { payload }) => { s.items = s.items.filter(x => x.id !== payload); },
    moveDeal: (s, { payload: { id, stage } }) => { const d = s.items.find(x => x.id === id); if (d) d.stage = stage; },
  },
});
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: { items: ticketsMock },
  reducers: {
    addTicket: (s, { payload }) => { s.items.unshift({ ...payload, id: `TKT-00${Date.now() % 100}`, created: new Date().toISOString().split('T')[0], resolved: null }); },
    updateTicket: (s, { payload }) => { const i = s.items.findIndex(x => x.id === payload.id); if (i !== -1) s.items[i] = payload; },
  },
});
const teamSlice = createSlice({
  name: 'team',
  initialState: { items: teamMock },
  reducers: {
    addMember: (s, { payload }) => { s.items.push({ ...payload, id: Date.now() }); },
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────
export const { toggleTheme, toggleSidebar, addNotification, clearNotifications } = uiSlice.actions;
export const { setCurrentUser, switchRole } = authSlice.actions;
export const { addUser, updateUser, assignProjectToUser, removeProjectFromUser } = usersSlice.actions;
export const { addProject, updateProject, deleteProject, addTool, removeTool, assignUser, removeUser } = projectsSlice.actions;
export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export const { applyLeave, updateLeaveStatus, deleteLeave } = leaveSlice.actions;
export const { addLead, updateLead, deleteLead } = leadsSlice.actions;
export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export const { addDeal, updateDeal, deleteDeal, moveDeal } = dealsSlice.actions;
export const { addTicket, updateTicket } = ticketsSlice.actions;
export const { addProject: addProjectOld, updateProject: updateProjectOld } = projectsSlice.actions;
export const { addMember } = teamSlice.actions;

export const store = configureStore({
  reducer: {
    ui:       uiSlice.reducer,
    auth:     authSlice.reducer,
    users:    usersSlice.reducer,
    projects: projectsSlice.reducer,
    tasks:    tasksSlice.reducer,
    leave:    leaveSlice.reducer,
    leads:    leadsSlice.reducer,
    clients:  clientsSlice.reducer,
    deals:    dealsSlice.reducer,
    tickets:  ticketsSlice.reducer,
    team:     teamSlice.reducer,
  },
});
