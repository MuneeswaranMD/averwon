import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const JWT_SECRET = process.env.JWT_SECRET || 'averqon-employee-secret-key';

// --- Auth Middleware for Employees ---
const authenticateEmployee = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.employeeToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.employee = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// --- Shared Assets (AdminJS config moved inside start for memory optimization) ---
import * as Models from './src/db/models.js';

// --- DNS Workaround for SRV Records ---
dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const start = async () => {
  const app = express();

  // Basic Middleware
  app.use(cors({
    origin: (origin, callback) => {
      const allowed = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : [];
      
      // Allow requests with no origin (like mobile apps or curl) or if in allowed list
      if (!origin || allowed.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
  app.use((req, res, next) => {
    if (req.url.startsWith('/admin')) return next();
    express.json()(req, res, next);
  });
  app.use((req, res, next) => {
    if (req.url.startsWith('/admin')) return next();
    express.urlencoded({ extended: true })(req, res, next);
  });
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;");
    next();
  });

  // MongoDB Connection
  const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    await seedDatabase();
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    process.exit(1);
  }

  async function seedDatabase() {
    try {
      let adminUser = await Models.Manager.findOne({ email: 'admin@averqon.ai' });
      if (adminUser) {
        console.log('✅ Admin user detected.');
        return;
      }

      console.log('🧹 Initializing Real Seed Data...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Models.Manager.create({
        email: 'admin@averqon.ai',
        password: hashedPassword
      });
      console.log('🔑 Admin User Created (admin@averqon.ai / admin123)');

      await Models.Setting.create({ 
        companyName: 'averqon HRMS', 
        theme: 'System', 
        language: 'English', 
        timeZone: 'Asia/Kolkata' 
      });

      // Seed Employees
      const empPassword = await bcrypt.hash('employee123', 10);
      const employees = await Models.Employee.create([
        { name: 'Sarah Chen', email: 'sarah.c@averqon.ai', password: empPassword, role: 'Manager', department: 'IT', designation: 'Lead Architect', joinDate: new Date('2024-01-15'), salary: 145000, status: 'Active' },
        { name: 'Marcus Rodriguez', email: 'marcus.r@averqon.ai', password: empPassword, role: 'Employee', department: 'Design', designation: 'Senior UI/UX', joinDate: new Date('2024-02-10'), salary: 95000, status: 'Active' },
        { name: 'Priya Sharma', email: 'priya.s@averqon.ai', password: empPassword, role: 'HR', department: 'Finance', designation: 'Accounts Manager', joinDate: new Date('2023-11-20'), salary: 110000, status: 'Active' },
        { name: 'James Wilson', email: 'james.w@averqon.ai', password: empPassword, role: 'Employee', department: 'Operations', designation: 'Ops Director', joinDate: new Date('2024-03-05'), salary: 130000, status: 'Active' },
        { name: 'Aisha Khan', email: 'aisha.k@averqon.ai', password: empPassword, role: 'Employee', department: 'Marketing', designation: 'Growth Lead', joinDate: new Date('2024-03-12'), salary: 85000, status: 'Active' },
      ]);

      // Seed Projects
      const projects = await Models.Project.create([
        { name: 'AverLink Logistics', client: 'Meridian Global', teamMembers: ['Sarah Chen', 'Marcus Rodriguez'], progress: 65, deadline: new Date('2024-06-30'), status: 'In Progress' },
        { name: 'NeoRetail Core', client: 'ZenDesk Retail', teamMembers: ['James Wilson'], progress: 40, deadline: new Date('2024-08-15'), status: 'In Progress' },
        { name: 'Pulse Health Suite', client: 'Pulse Medicare', teamMembers: ['Sarah Chen'], progress: 95, deadline: new Date('2024-05-20'), status: 'In Progress' },
      ]);

      // Seed Tasks
      await Models.Task.create([
        { title: 'API Integration with AWS IoT', assignedTo: 'Sarah Chen', project: 'AverLink Logistics', priority: 'Urgent', deadline: new Date('2024-05-10'), status: 'In Progress' },
        { title: 'Inventory Forecasting Logic', assignedTo: 'James Wilson', project: 'NeoRetail Core', priority: 'High', deadline: new Date('2024-05-15'), status: 'To Do' },
        { title: 'Encrypted Records Audit', assignedTo: 'Sarah Chen', project: 'Pulse Health Suite', priority: 'Medium', deadline: new Date('2024-05-12'), status: 'Review' },
      ]);

      // Seed Tickets
      await Models.Ticket.create([
        { title: 'Login failure in staging', category: 'Technical Issue', priority: 'High', department: 'IT', description: 'Production users unable to bypass auth', userName: 'Eleanor Thorne', userEmail: 'eleanor@meridian.com', status: 'Open' },
        { title: 'Missing invoice for Q1', category: 'Finance Issue', priority: 'Medium', department: 'Finance', description: 'Requesting duplicate of invoice INV-2024-001', userName: 'David Matsumo', userEmail: 'david@zendesk.com', status: 'In Progress' },
        { title: 'Security patch update', category: 'General Query', priority: 'Urgent', department: 'IT', description: 'Need to update OpenSSL versions across clusters', userName: 'System', userEmail: 'admin@averqon.ai', status: 'Open' },
      ]);

      // Seed Revenue/Finance
      await Models.Revenue.create([
        { clientName: 'Meridian Global', amount: 45000, paymentMethod: 'Bank Transfer', status: 'Paid', receivedDate: new Date('2024-04-10') },
        { clientName: 'ZenDesk Retail', amount: 32000, paymentMethod: 'Stripe', status: 'Paid', receivedDate: new Date('2024-04-12') },
        { clientName: 'Pulse Medicare', amount: 55000, paymentMethod: 'Credit Card', status: 'Paid', receivedDate: new Date('2024-04-05') },
      ]);

      // Seed Activities
      await Models.Activity.create([
        { user: 'Sarah Chen', action: 'committed code to', target: 'AverLink Logistics', time: new Date() },
        { user: 'Marcus Rodriguez', action: 'uploaded design for', target: 'NeoRetail Core', time: new Date(Date.now() - 3600000) },
        { user: 'Admin', action: 'approved leave for', target: 'Priya Sharma', time: new Date(Date.now() - 7200000) },
      ]);

      // Seed Invoices
      await Models.Invoice.create([
        { clientName: 'Meridian Global', projectName: 'AverLink Logistics', invoiceAmount: 42000, taxAmount: 3000, dueDate: new Date('2024-05-15'), status: 'Pending' },
        { clientName: 'ZenDesk Retail', projectName: 'NeoRetail Core', invoiceAmount: 30000, taxAmount: 2000, dueDate: new Date('2024-04-20'), status: 'Paid', paymentDate: new Date('2024-04-18') },
        { clientName: 'Pulse Medicare', projectName: 'Pulse Health Suite', invoiceAmount: 50000, taxAmount: 5000, dueDate: new Date('2024-05-25'), status: 'Pending' },
      ]);

      // Seed Bills
      await Models.Bill.create([
        { vendorName: 'AWS Cloud Services', category: 'Software', amount: 1200, dueDate: new Date('2024-05-01'), status: 'Paid' },
        { vendorName: 'WeWork Office', category: 'Office Expense', amount: 4500, dueDate: new Date('2024-05-05'), status: 'Pending' },
        { vendorName: 'Digital Ocean', category: 'Software', amount: 450, dueDate: new Date('2024-05-10'), status: 'Pending' },
      ]);

      // Seed Leads
      await Models.Lead.create([
        { leadName: 'Robert Vance', companyName: 'Vance Refrigeration', email: 'vance@refrigeration.com', leadSource: 'LinkedIn', status: 'Qualified', followupDate: new Date('2024-05-08') },
        { leadName: 'Jan Levinson', companyName: 'White Pages', email: 'jan@whitepages.com', leadSource: 'Website', status: 'New', followupDate: new Date('2024-05-12') },
        { leadName: 'Stanley Hudson', companyName: 'Pretzel Day Inc', email: 'stanley@pretzels.com', leadSource: 'Referral', status: 'Contacted', followupDate: new Date('2024-05-05') },
      ]);

      // Seed Deals
      await Models.Deal.create([
        { dealName: 'Enterprise SaaS License', clientName: 'Meridian Global', dealValue: 125000, expectedClosingDate: new Date('2024-07-01'), status: 'Negotiation', probability: 75 },
        { dealName: 'Mobile App Revamp', clientName: 'ZenDesk Retail', dealValue: 85000, expectedClosingDate: new Date('2024-06-15'), status: 'Proposal Sent', probability: 40 },
      ]);

      console.log('✅ Real-world seed data initialized.');
    } catch (error) {
      console.error('❌ Seeding Error:', error);
    }
  }

  // --- AdminJS Authentication ---
  const authenticate = async (email, password) => {
    console.log('[AUTH] Admin login attempt:', email);
    try {
      if (!email || !password) return null;
      const manager = await Models.Manager.findOne({ email: email.toLowerCase() });
      if (manager) {
        console.log('[AUTH] Admin found, checking password...');
        const isMatch = await bcrypt.compare(password, manager.password);
        if (isMatch) {
          console.log('[AUTH] Admin login successful');
          return manager;
        }
        console.log('[AUTH] Admin password mismatch');
      } else {
        console.log('[AUTH] Admin not found');
      }
    } catch (error) {
      console.error('[AUTH] ERROR:', error.message);
    }
    return null;
  };

  const sessionOptions = {
    secret: 'averqon-session-secret',
    resave: false,
    saveUninitialized: true,
    name: 'adminjs',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  };

  app.use(session(sessionOptions));

  // --- Google Auth API ---
  app.post('/api/admin/google-auth', async (req, res) => {
    const { email } = req.body;
    console.log('[AUTH] Google login attempt:', email);
    try {
      if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
      const manager = await Models.Manager.findOne({ email: email.toLowerCase() });
      if (manager) {
        req.session.adminUser = manager;
        console.log('[AUTH] Google login successful for:', email);
        return res.json({ success: true });
      }
      console.log('[AUTH] Google login denied (email not in manager list):', email);
      res.status(401).json({ success: false, error: 'Access denied. Account not found in Managers.' });
    } catch (err) {
      console.error('[AUTH] Google Auth Error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- AdminJS (Conditional based on Environment) ---
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('🛡️  Loading AdminJS in development mode...');
      const AdminJSImport = await import('adminjs');
      const AdminJS = AdminJSImport.default || AdminJSImport;
      
      const AdminJSExpressImport = await import('@adminjs/express');
      const AdminJSExpress = AdminJSExpressImport.default || AdminJSExpressImport;
      
      const { adminOptions } = await import('./src/admin/config.js');
      
      const admin = new AdminJS(adminOptions);
      await admin.initialize();
      
      const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
          authenticate,
          cookiePassword: 'super-secret-password-32-chars-long', 
        },
        null,
        sessionOptions
      );

      // Serve pre-bundled AdminJS assets explicitly
      app.use('/admin/frontend/assets', express.static(path.join(__dirname, '.adminjs')));

      // Mount AdminJS
      app.use(admin.options.rootPath, adminRouter);
      console.log(`🛡️  Admin panel available at root path: ${admin.options.rootPath}`);
    } catch (err) {
      console.error('❌ Failed to initialize AdminJS:', err);
    }
  } else {
    console.log('🛡️  AdminJS disabled in production to save memory.');
    app.get('/admin*', (req, res) => {
      res.status(503).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #2563EB;">Admin Panel Disabled</h1>
          <p>The AdminJS dashboard is disabled in production to optimize memory usage on the Render free tier.</p>
          <p>Please use the local development environment for administrative tasks.</p>
        </div>
      `);
    });
  }

  // --- API Routes for External Interactions ---
  const upload = multer({ dest: 'uploads/' });
  if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

  // --- Public API for Website Contact Form ---
  app.post('/api/client-requests', async (req, res) => {
    try {
      const clientRequest = await Models.ClientRequest.create(req.body);
      res.json({ success: true, id: clientRequest._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Recruitment API ---
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await Models.JobPosting.find({ status: 'Open' });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/applications', upload.single('resume'), async (req, res) => {
    try {
      const appData = { ...req.body };
      if (req.file) appData.resumeUrl = `/uploads/${req.file.filename}`;
      const application = await Models.JobApplication.create(appData);
      res.json({ success: true, id: application._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/support/tickets', upload.single('attachment'), async (req, res) => {
    try {
      const ticketData = { ...req.body };
      if (req.file) ticketData.attachmentUrl = `/uploads/${req.file.filename}`;
      const ticket = await Models.Ticket.create(ticketData);
      res.json({ success: true, ticketId: ticket.ticketId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/support/tickets/:ticketId', async (req, res) => {
    try {
      const { email } = req.query;
      const ticket = await Models.Ticket.findOne({ 
        ticketId: req.params.ticketId,
        userEmail: email 
      });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found or email mismatch' });
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/support/tickets/:ticketId/comments', async (req, res) => {
    try {
      const { senderRole, message } = req.body;
      const ticket = await Models.Ticket.findOne({ ticketId: req.params.ticketId });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

      ticket.comments.push({
        sender: senderRole === 'Client' ? ticket.userName : 'Averqon Agent',
        senderRole,
        message,
        timestamp: new Date()
      });

      await ticket.save();
      res.json({ success: true, comments: ticket.comments });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===================== EMPLOYEE PORTAL APIS =====================

  app.post('/api/employee/login', async (req, res) => {
    console.log('[LOGIN] Employee login attempt:', req.body.email);
    try {
      const { email, password, rememberMe } = req.body;
      const employee = await Models.Employee.findOne({ email: email.toLowerCase() });
      if (!employee) {
        console.log('[LOGIN] Employee not found');
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.log('[LOGIN] Employee found, checking password...');
      const isMatch = await bcrypt.compare(password, employee.password || '');
      if (!isMatch) {
        console.log('[LOGIN] Password mismatch');
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.log('[LOGIN] Login successful, generating token...');

      const token = jwt.sign(
        { id: employee._id, email: employee.email, role: employee.role },
        JWT_SECRET,
        { expiresIn: rememberMe ? '30d' : '24h' }
      );

      // Set cookie if needed
      res.cookie('employeeToken', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 
      });

      res.json({ 
        success: true, 
        token, 
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          designation: employee.designation,
          department: employee.department,
          profileImage: employee.profileImage
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/employee/profile', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id).select('-password');
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/employee/tasks', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const tasks = await Models.Task.find({ assignedTo: employee.name });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/employee/attendance/check-in', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const attendance = await Models.Attendance.create({
        employeeName: employee.name,
        checkInTime: new Date().toLocaleTimeString(),
        workMode: req.body.workMode || 'Office',
        status: 'Present'
      });
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/employee/leaves', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const leaves = await Models.LeaveRequest.find({ employeeName: employee.name });
      res.json(leaves);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/employee/leaves', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const leave = await Models.LeaveRequest.create({
        ...req.body,
        employeeName: employee.name,
        status: 'Pending'
      });
      res.json(leave);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/dashboard-stats', async (req, res) => {
    console.log('[DASHBOARD] Fetching stats...');
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      const [
        totalEmp, interns, activeProjectsCount, pendingTasksCount,
        totalLeads, totalDeals,
        totalTickets, openTickets, closedTickets,
        revenueDataAggregate, overdueInvoices,
        projects, tasks, activities, meetings, 
        financeRecords, recentLeads, recentDeals, recentInvoices, recentBills
      ] = await Promise.all([
        Models.Employee.countDocuments(),
        Models.Intern.countDocuments(),
        Models.Project.countDocuments({ status: 'In Progress' }),
        Models.Task.countDocuments({ status: { $ne: 'Done' } }),
        Models.Lead.countDocuments(),
        Models.Deal.countDocuments(),
        Models.Ticket.countDocuments(),
        Models.Ticket.countDocuments({ status: 'Open' }),
        Models.Ticket.countDocuments({ status: 'Closed' }),
        Models.Revenue.aggregate([
          { $match: { receivedDate: { $gte: sixMonthsAgo } } },
          { $group: { 
            _id: { $month: "$receivedDate" }, 
            total: { $sum: "$amount" } 
          }},
          { $sort: { "_id": 1 } }
        ]),
        Models.Invoice.aggregate([{ $match: { status: 'Pending' } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
        Models.Project.find().limit(5).sort({ updatedAt: -1 }),
        Models.Task.find({ status: { $ne: 'Done' } }).limit(5),
        Models.Activity.find().sort({ time: -1 }).limit(5),
        Models.Meeting.find({ status: 'Scheduled' }).limit(3),
        Models.Revenue.find().sort({ receivedDate: -1 }).limit(5),
        Models.Lead.find().sort({ createdAt: -1 }).limit(5),
        Models.Deal.find().sort({ createdAt: -1 }).limit(5),
        Models.Invoice.find().sort({ createdAt: -1 }).limit(5),
        Models.Bill.find().sort({ createdAt: -1 }).limit(5)
      ]);

      // Map month numbers to names and ensure all 6 months are present
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenue = [];
      const monthlyLabels = [];
      
      for(let i=5; i>=0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const m = d.getMonth() + 1;
        const revenueForMonth = revenueDataAggregate.find(item => item._id === m)?.total || 0;
        monthlyRevenue.push(revenueForMonth);
        monthlyLabels.push(monthNames[m-1]);
      }

      const formattedFinance = financeRecords.map(f => ({
        type: 'Revenue',
        category: f.clientName,
        amount: f.amount,
        date: f.receivedDate
      }));

      res.json({
        stats: {
          totalEmployees: totalEmp,
          totalInterns: interns,
          activeProjects: activeProjectsCount,
          pendingTasks: pendingTasksCount,
          totalLeads,
          totalDeals,
          monthlyRevenue: monthlyRevenue[5] || 0,
          pendingPayments: overdueInvoices[0]?.total || 0,
          ticketMetrics: { 
            total: totalTickets, 
            open: openTickets, 
            closed: closedTickets,
            pending: totalTickets - openTickets - closedTickets,
            urgent: openTickets
          },
          attendanceRate: 94
        },
        monthlyRevenue: {
          data: monthlyRevenue,
          labels: monthlyLabels
        },
        projects,
        tasks,
        activities,
        meetings,
        finance: formattedFinance,
        leads: recentLeads,
        deals: recentDeals,
        invoices: recentInvoices,
        bills: recentBills
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===================== FINANCE APIS =====================

  // --- Revenue ---
  app.get('/api/admin/finance/revenue', async (req, res) => {
    try {
      const records = await Models.Revenue.find().sort({ receivedDate: -1 });
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const now = new Date();
      const fy = new Date(now.getFullYear(), 0, 1);
      const fm = new Date(now.getFullYear(), now.getMonth(), 1);

      const [total, thisMonth, thisYear, pending, monthlyAgg, deptAgg, projAgg] = await Promise.all([
        Models.Revenue.aggregate([{ $group: { _id: null, t: { $sum: '$amount' } } }]),
        Models.Revenue.aggregate([{ $match: { receivedDate: { $gte: fm } } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
        Models.Revenue.aggregate([{ $match: { receivedDate: { $gte: fy } } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
        Models.Revenue.aggregate([{ $match: { status: 'Pending' } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
        Models.Revenue.aggregate([{ $group: { _id: { $month: '$receivedDate' }, total: { $sum: '$amount' } } }, { $sort: { _id: 1 } }]),
        Models.Revenue.aggregate([{ $group: { _id: '$department', total: { $sum: '$amount' } } }]),
        Models.Revenue.aggregate([{ $group: { _id: '$projectName', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }, { $limit: 6 }])
      ]);

      const monthly = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
        return monthlyAgg.find(m => m._id === d.getMonth() + 1)?.total || 0;
      });
      const monthlyLabels = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return monthNames[d.getMonth()]; });

      res.json({
        records,
        stats: { total: total[0]?.t || 0, thisMonth: thisMonth[0]?.t || 0, thisYear: thisYear[0]?.t || 0, pending: pending[0]?.t || 0, profitMargin: '32.4%', growth: '+18.2%' },
        charts: { monthly, monthlyLabels, deptLabels: deptAgg.map(d => d._id || 'Other'), deptValues: deptAgg.map(d => d.total), projLabels: projAgg.map(p => p._id || 'Other'), projValues: projAgg.map(p => p.total) }
      });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/finance/revenue', async (req, res) => {
    try { res.json(await Models.Revenue.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/finance/revenue/:id', async (req, res) => {
    try { res.json(await Models.Revenue.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.delete('/api/admin/finance/revenue/:id', async (req, res) => {
    try { await Models.Revenue.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // --- Invoices ---
  app.get('/api/admin/finance/invoices', async (req, res) => {
    try {
      const records = await Models.Invoice.find().sort({ createdAt: -1 });
      const [total, paid, pending, overdue, outstanding] = await Promise.all([
        Models.Invoice.countDocuments(),
        Models.Invoice.countDocuments({ status: 'Paid' }),
        Models.Invoice.countDocuments({ status: 'Pending' }),
        Models.Invoice.countDocuments({ status: 'Overdue' }),
        Models.Invoice.aggregate([{ $match: { status: { $ne: 'Paid' } } }, { $group: { _id: null, t: { $sum: '$totalAmount' } } }])
      ]);
      res.json({ records, stats: { total, paid, pending, overdue, outstanding: outstanding[0]?.t || 0 } });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/finance/invoices', async (req, res) => {
    try { res.json(await Models.Invoice.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/finance/invoices/:id', async (req, res) => {
    try { res.json(await Models.Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.delete('/api/admin/finance/invoices/:id', async (req, res) => {
    try { await Models.Invoice.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // --- Bills ---
  app.get('/api/admin/finance/bills', async (req, res) => {
    try {
      const records = await Models.Bill.find().sort({ createdAt: -1 });
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const fm = new Date(); fm.setDate(1); fm.setHours(0,0,0,0);
      const [total, paid, pending, monthlyExpenses, outstanding, monthlyAgg] = await Promise.all([
        Models.Bill.countDocuments(),
        Models.Bill.countDocuments({ status: 'Paid' }),
        Models.Bill.countDocuments({ status: 'Pending' }),
        Models.Bill.aggregate([{ $match: { dueDate: { $gte: fm } } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
        Models.Bill.aggregate([{ $match: { status: { $ne: 'Paid' } } }, { $group: { _id: null, t: { $sum: '$amount' } } }]),
        Models.Bill.aggregate([{ $group: { _id: { $month: '$dueDate' }, total: { $sum: '$amount' } } }, { $sort: { _id: 1 } }])
      ]);
      const monthly = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return monthlyAgg.find(m => m._id === d.getMonth() + 1)?.total || 0; });
      const labels = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return monthNames[d.getMonth()]; });
      res.json({ records, stats: { total, paid, pending, monthlyExpenses: monthlyExpenses[0]?.t || 0, outstanding: outstanding[0]?.t || 0 }, charts: { monthly, labels } });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/finance/bills', async (req, res) => {
    try { res.json(await Models.Bill.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/finance/bills/:id', async (req, res) => {
    try { res.json(await Models.Bill.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.delete('/api/admin/finance/bills/:id', async (req, res) => {
    try { await Models.Bill.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // ===================== SALES APIS =====================

  // --- Leads ---
  app.get('/api/admin/sales/leads', async (req, res) => {
    try {
      const records = await Models.Lead.find().sort({ createdAt: -1 });
      const statuses = ['New','Contacted','Qualified','Proposal Sent','Converted','Closed'];
      const counts = Object.fromEntries(await Promise.all(statuses.map(async s => [s, await Models.Lead.countDocuments({ status: s })])));
      res.json({ records, stats: { total: records.length, ...counts } });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/sales/leads', async (req, res) => {
    try { res.json(await Models.Lead.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/sales/leads/:id', async (req, res) => {
    try { res.json(await Models.Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.delete('/api/admin/sales/leads/:id', async (req, res) => {
    try { await Models.Lead.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // --- Deals ---
  app.get('/api/admin/sales/deals', async (req, res) => {
    try {
      const records = await Models.Deal.find().sort({ createdAt: -1 });
      const statuses = ['Open','Negotiation','Proposal Sent','Won','Lost'];
      const counts = Object.fromEntries(await Promise.all(statuses.map(async s => [s, await Models.Deal.countDocuments({ status: s })])));
      const [totalValue] = await Models.Deal.aggregate([{ $group: { _id: null, t: { $sum: '$dealValue' } } }]);
      res.json({ records, stats: { total: records.length, ...counts, totalValue: totalValue?.t || 0 } });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/sales/deals', async (req, res) => {
    try { res.json(await Models.Deal.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/sales/deals/:id', async (req, res) => {
    try { res.json(await Models.Deal.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.delete('/api/admin/sales/deals/:id', async (req, res) => {
    try { await Models.Deal.findByIdAndDelete(req.params.id); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // ===================== SYSTEM APIS =====================

  // --- Settings ---
  app.get('/api/admin/system/settings', async (req, res) => {
    try {
      const setting = await Models.Setting.findOne();
      res.json(setting || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/system/settings', async (req, res) => {
    try { res.json(await Models.Setting.create(req.body)); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/system/settings/:id', async (req, res) => {
    try { res.json(await Models.Setting.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // --- Admin Accounts ---
  app.get('/api/admin/system/admins', async (req, res) => {
    try {
      const records = await Models.Manager.find().select('-password').sort({ createdAt: -1 });
      const total = records.length;
      const superAdmins = records.filter(m => m.role === 'Super Admin').length;
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeToday = records.filter(m => m.loginHistory?.some(d => new Date(d) > oneDayAgo)).length;
      const rolesCount = new Set(records.map(m => m.role || 'Admin')).size;
      res.json({ records, stats: { total, superAdmins, activeToday, rolesCount } });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.post('/api/admin/system/admins', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
      const exists = await Models.Manager.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(409).json({ error: 'An admin with this email already exists.' });
      const hashed = await bcrypt.hash(password, 10);
      const manager = await Models.Manager.create({ email: email.toLowerCase(), password: hashed, role: role || 'Admin' });
      res.json({ _id: manager._id, email: manager.email, role: manager.role });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.put('/api/admin/system/admins/:id', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      const update = { email: email?.toLowerCase(), role };
      if (password) update.password = await bcrypt.hash(password, 10);
      const manager = await Models.Manager.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
      res.json(manager);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.delete('/api/admin/system/admins/:id', async (req, res) => {
    try {
      const remaining = await Models.Manager.countDocuments();
      if (remaining <= 1) return res.status(400).json({ error: 'Cannot delete the last admin account.' });
      await Models.Manager.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });


  // ===================== EXTENDED EMPLOYEE PORTAL APIS =====================

  // Employee Dashboard — aggregated stats for the logged-in employee
  app.get('/api/employee/dashboard', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id).select('-password');
      if (!employee) return res.status(404).json({ error: 'Employee not found' });

      const [tasks, leaves, meetings, payroll, attendance, recentActivities, projects, tools] = await Promise.all([
        Models.Task.find({ assignedTo: employee.name }),
        Models.LeaveRequest.find({ employeeName: employee.name }).sort({ startDate: -1 }).limit(5),
        Models.Meeting.find({
          participants: employee.name,
          status: 'Scheduled',
          date: { $gte: new Date() }
        }).sort({ date: 1 }).limit(5),
        Models.Payroll.findOne({ employeeName: employee.name }).sort({ paymentDate: -1 }),
        Models.Attendance.find({ employeeName: employee.name }).sort({ date: -1 }).limit(30),
        Models.Activity.find({ user: employee.name }).sort({ time: -1 }).limit(10),
        Models.Project.find({ teamMembers: { $in: [employee.name] } }),
        Models.Tool.find({ isActive: true }),
      ]);

      const completedTasks = tasks.filter(t => t.status === 'Done').length;
      const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
      const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
      const attendanceRate = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;
      const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
      const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

      // Calculate leave balance (20 days per year - approved leaves)
      const thisYearLeaves = leaves.filter(l => {
        return l.status === 'Approved' && new Date(l.startDate).getFullYear() === new Date().getFullYear();
      });
      const usedLeaveDays = thisYearLeaves.reduce((sum, l) => {
        const days = Math.ceil((new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24)) + 1;
        return sum + days;
      }, 0);

      // Today's attendance record
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
      const todayRecord = await Models.Attendance.findOne({
        employeeName: employee.name,
        date: { $gte: todayStart, $lte: todayEnd }
      });

      res.json({
        employee,
        stats: {
          totalTasks: tasks.length,
          completedTasks,
          pendingTasks,
          activeProjects: projects.filter(p => p.status === 'Active').length,
          attendanceRate,
          leaveBalance: Math.max(0, 20 - usedLeaveDays),
          approvedLeaves,
          pendingLeaves,
        },
        tasks: tasks.slice(0, 5),
        meetings,
        recentLeaves: leaves,
        payroll,
        recentActivities,
        projects: projects.slice(0, 3),
        todayAttendance: todayRecord,
        tools,
      });
    } catch (err) {
      console.error('[EMPLOYEE DASHBOARD]', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Employee Attendance — history
  app.get('/api/employee/attendance', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const { month, year } = req.query;
      const query = { employeeName: employee.name };
      if (month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        query.date = { $gte: start, $lte: end };
      } else {
        // Default: last 30 days
        const ago = new Date(); ago.setDate(ago.getDate() - 30);
        query.date = { $gte: ago };
      }
      const records = await Models.Attendance.find(query).sort({ date: -1 });
      const present = records.filter(r => r.status === 'Present').length;
      const late = records.filter(r => r.status === 'Late').length;
      const absent = records.filter(r => r.status === 'Absent').length;
      const totalHours = records.reduce((sum, r) => {
        if (r.checkInTime && r.checkOutTime) {
          try {
            const [inH, inM] = r.checkInTime.split(':').map(Number);
            const [outH, outM] = r.checkOutTime.split(':').map(Number);
            return sum + (outH * 60 + outM - inH * 60 - inM) / 60;
          } catch { return sum; }
        }
        return sum;
      }, 0);

      // Today's record
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
      const todayRecord = await Models.Attendance.findOne({
        employeeName: employee.name,
        date: { $gte: todayStart, $lte: todayEnd }
      });

      res.json({
        records,
        stats: { present, late, absent, totalHours: Math.round(totalHours * 10) / 10 },
        todayRecord,
      });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Check-in (already exists, enhance with activity log)
  app.post('/api/employee/attendance/check-in', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      
      // Prevent duplicate check-in
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const existing = await Models.Attendance.findOne({ employeeName: employee.name, date: { $gte: todayStart } });
      if (existing && existing.checkInTime) {
        return res.status(409).json({ error: 'Already checked in today', record: existing });
      }

      const now = new Date();
      const checkInStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

      const attendance = existing
        ? await Models.Attendance.findByIdAndUpdate(existing._id, { checkInTime: checkInStr, workMode: req.body.workMode || 'Office', status: isLate ? 'Late' : 'Present' }, { new: true })
        : await Models.Attendance.create({
            employeeName: employee.name,
            checkInTime: checkInStr,
            workMode: req.body.workMode || 'Office',
            status: isLate ? 'Late' : 'Present',
            date: now,
          });

      // Log activity
      await Models.Activity.create({ user: employee.name, action: `Checked in (${req.body.workMode || 'Office'})`, target: 'Attendance', time: now });

      res.json({ success: true, attendance });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Check-out
  app.post('/api/employee/attendance/check-out', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const record = await Models.Attendance.findOne({ employeeName: employee.name, date: { $gte: todayStart } });
      if (!record) return res.status(404).json({ error: 'No check-in found for today' });
      if (record.checkOutTime) return res.status(409).json({ error: 'Already checked out today', record });

      const now = new Date();
      const checkOutStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      record.checkOutTime = checkOutStr;
      await record.save();

      await Models.Activity.create({ user: employee.name, action: 'Checked out', target: 'Attendance', time: now });
      res.json({ success: true, attendance: record });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Meetings
  app.get('/api/employee/meetings', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const meetings = await Models.Meeting.find({
        $or: [
          { participants: employee.name },
          { participants: employee.department },
        ]
      }).sort({ date: 1 });
      res.json(meetings);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Payroll history
  app.get('/api/employee/payroll', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const payroll = await Models.Payroll.find({ employeeName: employee.name }).sort({ paymentDate: -1 });
      res.json(payroll);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Tasks update (progress / status)
  app.patch('/api/employee/tasks/:id', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const task = await Models.Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      if (task.assignedTo !== employee.name) return res.status(403).json({ error: 'Not your task' });

      const updated = await Models.Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      let actionStr = `Updated task: ${task.title}`;
      const changes = [];
      if (req.body.status && req.body.status !== task.status) {
        changes.push(`status to ${req.body.status}`);
      }
      if (req.body.progress !== undefined && req.body.progress !== task.progress) {
        changes.push(`progress to ${req.body.progress}%`);
      }
      if (changes.length > 0) {
        actionStr = `Changed ${task.title} ${changes.join(' and ')}`;
      }

      await Models.Activity.create({ user: employee.name, action: actionStr, target: 'Task', time: new Date() });
      res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Leave apply (enhance existing with activity log)
  app.post('/api/employee/leaves', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const leave = await Models.LeaveRequest.create({
        ...req.body,
        employeeName: employee.name,
        status: 'Pending'
      });
      await Models.Activity.create({ user: employee.name, action: `Applied for ${req.body.leaveType}`, target: 'Leave', time: new Date() });
      res.json(leave);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Activity Log
  app.get('/api/employee/activity', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      const activities = await Models.Activity.find({ user: employee.name }).sort({ time: -1 }).limit(30);
      res.json(activities);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Projects (where employee is in teamMembers)
  app.get('/api/employee/projects', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      const projects = await Models.Project.find({ 
        teamMembers: { $in: [employee.name] } 
      }).sort({ deadline: 1 });
      res.json(projects);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Employee Documents
  app.get('/api/employee/documents', authenticateEmployee, async (req, res) => {
    try {
      const employee = await Models.Employee.findById(req.employee.id);
      const docs = await Models.Document.find({ employeeName: employee.name }).sort({ createdAt: -1 });
      res.json(docs);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // ===================== ADMIN — EMPLOYEE TRACKING =====================

  app.get('/api/admin/tracking/employees', async (req, res) => {
    try {
      const employees = await Models.Employee.find({ status: 'Active' }).select('-password');
      const today = new Date(); today.setHours(0, 0, 0, 0);

      const trackingData = await Promise.all(employees.map(async (emp) => {
        const todayRecord = await Models.Attendance.findOne({
          employeeName: emp.name,
          date: { $gte: today }
        });
        const recentActivities = await Models.Activity.find({ user: emp.name }).sort({ time: -1 }).limit(5);
        const pendingTasks = await Models.Task.countDocuments({ assignedTo: emp.name, status: { $ne: 'Done' } });
        const completedTasks = await Models.Task.countDocuments({ assignedTo: emp.name, status: 'Done' });
        const pendingLeave = await Models.LeaveRequest.findOne({ employeeName: emp.name, status: 'Pending' });

        return {
          employee: emp,
          todayAttendance: todayRecord,
          status: todayRecord?.checkInTime ? (todayRecord.checkOutTime ? 'Checked Out' : 'Online') : 'Absent',
          lastSeen: recentActivities[0]?.time || null,
          pendingTasks,
          completedTasks,
          recentActivities,
          hasPendingLeave: !!pendingLeave,
        };
      }));

      res.json(trackingData);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Admin leave approval
  app.patch('/api/admin/leaves/:id', async (req, res) => {
    try {
      const { status, adminNote } = req.body;
      const leave = await Models.LeaveRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (leave) {
        await Models.Activity.create({ user: 'Admin', action: `${status} leave for ${leave.employeeName}`, target: 'Leave', time: new Date() });
      }
      res.json(leave);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Admin — all pending leaves
  app.get('/api/admin/leaves/pending', async (req, res) => {
    try {
      const leaves = await Models.LeaveRequest.find({ status: 'Pending' }).sort({ createdAt: -1 });
      res.json(leaves);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // --- Corporate Website & SPA Fallback ---


  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Custom SPA Fallback Middleware
  app.use((req, res, next) => {
    // Don't intercept AdminJS or API routes - let them 404 naturally
    if (req.url.startsWith('/admin') || req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  // ===================== CHAT APIS =====================

  // Send Message
  app.post('/api/chat/message', async (req, res) => {
    try {
      const { sender, receiver, content, roomId, isGroup } = req.body;
      const message = await Models.LiveChat.create({
        sender,
        receiver,
        content,
        roomId,
        isGroup: !!isGroup,
        time: new Date()
      });
      res.json(message);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Get Chat History
  app.get('/api/chat/history/:roomId', async (req, res) => {
    try {
      const messages = await Models.LiveChat.find({ roomId: req.params.roomId })
        .sort({ time: 1 })
        .limit(100);
      res.json(messages);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Get Private Chat History
  app.get('/api/chat/private/:user1/:user2', async (req, res) => {
    try {
      const messages = await Models.LiveChat.find({
        isGroup: false,
        $or: [
          { sender: req.params.user1, receiver: req.params.user2 },
          { sender: req.params.user2, receiver: req.params.user1 }
        ]
      }).sort({ time: 1 }).limit(100);
      res.json(messages);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Get Rooms
  app.get('/api/chat/rooms', async (req, res) => {
    try {
      const rooms = await Models.ChatRoom.find({ isActive: true });
      res.json(rooms);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Get Recent Chats for a user
  app.get('/api/chat/recent/:username', async (req, res) => {
    try {
      const messages = await Models.LiveChat.find({
        $or: [{ sender: req.params.username }, { receiver: req.params.username }]
      }).sort({ time: -1 }).limit(50);
      
      const contacts = new Set();
      messages.forEach(m => {
        if (!m.isGroup) {
          contacts.add(m.sender === req.params.username ? m.receiver : m.sender);
        }
      });
      res.json(Array.from(contacts));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    const errorLog = `[${new Date().toISOString()}] ${req.method} ${req.url}\n${err.stack}\n\n`;
    fs.appendFileSync('server-errors.log', errorLog);
    console.error('!!! SERVER ERROR !!!', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });

  // Admin Project Management
app.get('/api/admin/projects', async (req, res) => {
  try {
    const projects = await Models.Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/projects/assign', async (req, res) => {
  const { projectId, employeeName } = req.body;
  try {
    const project = await Models.Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    if (!project.teamMembers.includes(employeeName)) {
      project.teamMembers.push(employeeName);
      await project.save();
      
      // Log activity
      await Models.Activity.create({
        user: 'Admin',
        action: `Assigned ${employeeName} to project:`,
        target: project.name,
        time: new Date()
      });
    }
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🛡️  Admin panel available at: http://localhost:${PORT}/admin`);
    }
  });
};

start();
