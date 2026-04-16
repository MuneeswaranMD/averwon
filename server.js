import express from 'express';
import AdminJS, { ComponentLoader, DefaultAuthProvider } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import bcrypt from 'bcrypt';
import session from 'express-session';
import multer from 'multer';
import fs from 'fs';

// --- DNS Workaround for SRV Records ---
dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminJS.registerAdapter(AdminJSMongoose);

// --- HR Management Models ---
const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String, enum: ['IT', 'HR', 'Design', 'Finance', 'Marketing', 'Sales', 'Operations'], default: 'IT' },
  designation: { type: String },
  joinDate: { type: Date },
  salary: { type: Number },
  address: { type: String },
  profileImage: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
});
EmployeeSchema.pre('save', async function(next) {
  if (!this.employeeId) {
    const c = await mongoose.models.Employee.countDocuments();
    this.employeeId = `EMP-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Employee = mongoose.model('Employee', EmployeeSchema);

const InternSchema = new mongoose.Schema({
  internId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  collegeName: { type: String },
  department: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  assignedMentor: { type: String },
  status: { type: String, enum: ['Active', 'Completed', 'Terminated'], default: 'Active' },
});
InternSchema.pre('save', async function(next) {
  if (!this.internId) {
    const c = await mongoose.models.Intern.countDocuments();
    this.internId = `INT-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Intern = mongoose.model('Intern', InternSchema);

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String },
  teamMembers: [String],
  progress: { type: Number, default: 0 },
  deadline: { type: Date },
  status: { type: String, enum: ['Completed', 'In Progress', 'Pending', 'Delayed', 'Urgent'], default: 'Pending' },
});
const Project = mongoose.model('Project', ProjectSchema);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: String },
  project: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  deadline: { type: Date },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done', 'Review'], default: 'To Do' },
  progress: { type: Number, default: 0 },
});
const Task = mongoose.model('Task', TaskSchema);

const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Technical Issue', 'HR Support', 'Finance Issue', 'Attendance Problem', 'Payroll Issue', 'Project Access', 'Leave Request', 'Login Problem', 'Software Bug', 'Hardware Request', 'General Query'],
    default: 'General Query'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  department: { type: String, enum: ['IT', 'HR', 'Finance', 'Management', 'Operations'], default: 'IT' },
  assignedTeam: { type: String },
  ticketType: { type: String, enum: ['Employee Ticket', 'Client Ticket', 'Internal Team Ticket', 'Vendor Ticket'], default: 'Employee Ticket' },
  description: { type: String, required: true },
  attachmentUrl: { type: String },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userRole: { type: String },
  contactNumber: { type: String },
  status: { type: String, enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Reopened'], default: 'Open' },
  dueDate: { type: Date },
  comments: [{
    sender: { type: String, required: true },
    senderRole: { type: String, enum: ['Client', 'Agent', 'System'], default: 'Client' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  adminNotes: { type: String },
  resolutionNotes: { type: String }
}, { timestamps: true });

// Auto-generate Ticket ID
TicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Ticket.countDocuments();
    this.ticketId = `TKT-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Mock Email Notification
TicketSchema.post('save', function (doc) {
  console.log(`📧 [MOCK EMAIL] To: ${doc.userEmail} | Subject: Ticket Created: ${doc.ticketId} | Status: ${doc.status}`);
});
const Ticket = mongoose.model('Ticket', TicketSchema);

const AttendanceSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
  workMode: { type: String, enum: ['Office', 'WFH', 'Client Site'], default: 'Office' }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

const LeaveRequestSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  leaveType: { type: String, enum: ['Sick Leave', 'Casual Leave', 'Paid Leave', 'Maternity/Paternity'], default: 'Casual Leave' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});
const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema);

const PayrollSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  salary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, required: true }
});
const Payroll = mongoose.model('Payroll', PayrollSchema);

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  participants: [String],
  meetingLink: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
});
const Meeting = mongoose.model('Meeting', MeetingSchema);

const ActivitySchema = new mongoose.Schema({
  user: { type: String },
  action: { type: String },
  target: { type: String },
  time: { type: Date, default: Date.now },
});
const Activity = mongoose.model('Activity', ActivitySchema);

const RevenueSchema = new mongoose.Schema({
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  growth: { type: Number, default: 0 }
});
const Revenue = mongoose.model('Revenue', RevenueSchema);

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true },
  clientName: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Draft'], default: 'Draft' }
});
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceId) {
    const c = await mongoose.models.Invoice.countDocuments();
    this.invoiceId = `INV-${new Date().getFullYear()}-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Invoice = mongoose.model('Invoice', InvoiceSchema);

const BillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Salary', 'Software', 'Hardware', 'Marketing', 'Travel', 'Office Expense'], default: 'Office Expense' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Paid', 'Approved'], default: 'Pending' }
});
const Bill = mongoose.model('Bill', BillSchema);

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  assignedSalesperson: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'], default: 'New' }
});
const Lead = mongoose.model('Lead', LeadSchema);

const DealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  clientName: { type: String, required: true },
  value: { type: Number, required: true },
  stage: { type: String, enum: ['Open', 'Negotiation', 'Won', 'Lost'], default: 'Open' },
  expectedClosingDate: { type: Date }
});
const Deal = mongoose.model('Deal', DealSchema);

const LiveChatSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Sent', 'Delivered', 'Read'], default: 'Sent' }
});
const LiveChat = mongoose.model('LiveChat', LiveChatSchema);

const SettingSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Averon HRMS' },
  theme: { type: String, enum: ['Light', 'Dark', 'System'], default: 'Light' },
  language: { type: String, default: 'English' },
  timeZone: { type: String, default: 'UTC' }
});
const Setting = mongoose.model('Setting', SettingSchema);

// --- ATS Recruitment Models ---
const JobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
  location: { type: String, required: true },
  department: { type: String },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  postedDate: { type: Date, default: Date.now }
});
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);

const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  candidateName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resumeUrl: { type: String },
  status: { type: String, enum: ['New', 'Reviewed', 'Interviewing', 'Offered', 'Hired', 'Rejected'], default: 'New' },
  appliedDate: { type: Date, default: Date.now },
  adminNotes: { type: String }
});
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

const ManagerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginHistory: [Date],
});
const Manager = mongoose.model('Manager', ManagerSchema);

// Component Loader
const componentLoader = new ComponentLoader();
const Components = {
  Dashboard: componentLoader.add('Dashboard', path.join(__dirname, './src/admin/components/Dashboard.jsx')),
  Sidebar: componentLoader.override('Sidebar', path.join(__dirname, './src/admin/components/Sidebar.jsx')),
  Login: componentLoader.override('Login', path.join(__dirname, './src/admin/components/Login.jsx')),
  JobShow: componentLoader.add('JobShow', path.join(__dirname, './src/admin/components/JobShow.jsx')),
  GlobalShow: componentLoader.add('GlobalShow', path.join(__dirname, './src/admin/components/GlobalShow.jsx')),
};

const start = async () => {
  const app = express();

  // MongoDB Connection
  const uri = "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    await seedDatabase();
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    process.exit(1);
  }

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());

  async function seedDatabase() {
    try {
      const adminExists = await Manager.findOne({ email: 'admin@averqon.ai' });
      if (adminExists) {
        console.log('✅ Real Database Active - Mocks Bypassed');
        return;
      }

      console.log('🧹 Empty Database Detected. Initializing Core Engine...');

      // 0. Manager (Admin)
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Manager.create({
        email: 'admin@averqon.ai',
        password: hashedPassword
      });
      console.log('🔑 Admin User Created (admin@averqon.ai / admin123)');

      await Setting.create({ companyName: 'Averon HRMS', theme: 'System', language: 'English', timeZone: 'Asia/Kolkata' });
      
    } catch (error) {
      console.error('❌ Seeding Error:', error);
    }
  }

  app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
      const [
        totalEmp, interns, activeProjects, pendingTasks,
        newLeads, ticketsToday, presentToday, revenueMonthly,
        pendingPayments, totalDepts, completedProjects, leaveRequests,
        recentActivities, projectsArr, tasksArr, ticketsArr, financeArr,
        meetingsArr,
        totalTickets, openTickets, closedTickets, urgentTickets, pendingTickets
      ] = await Promise.all([
        Employee.countDocuments(),
        Intern.countDocuments(),
        Project.countDocuments({ status: 'In Progress' }),
        Task.countDocuments({ status: { $ne: 'Done' } }),
        Lead.countDocuments({ status: 'New' }),
        Ticket.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
        Attendance.countDocuments({ date: { $gte: new Date().setHours(0, 0, 0, 0) }, status: 'Present' }),
        Revenue.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Invoice.aggregate([{ $match: { status: { $in: ['Pending', 'Draft'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        Employee.distinct('department'),
        Project.countDocuments({ status: 'Completed' }),
        LeaveRequest.countDocuments({ status: 'Pending' }),
        Activity.find().sort({ time: -1 }).limit(5),
        Project.find().limit(5),
        Task.find().limit(5),
        Ticket.find().limit(5),
        Revenue.find().sort({ date: -1 }).limit(6),
        Meeting.find().limit(3),
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: 'Open' }),
        Ticket.countDocuments({ status: 'Closed' }),
        Ticket.countDocuments({ priority: 'Urgent' }),
        Ticket.countDocuments({ status: 'Pending' })
      ]);

      res.json({
        stats: {
          totalEmployees: totalEmp,
          totalInterns: interns,
          activeProjects,
          pendingTasks,
          newClientRequests: newLeads,
          ticketsToday,
          attendanceRate: presentToday ? ((presentToday / (totalEmp + interns)) * 100).toFixed(1) : 0,
          monthlyRevenue: revenueMonthly[0]?.total || 0,
          pendingPayments: pendingPayments[0]?.total || 0,
          departments: totalDepts.length,
          completedProjects,
          leaveRequests,
          ticketMetrics: {
            total: totalTickets,
            open: openTickets,
            closed: closedTickets,
            urgent: urgentTickets,
            pending: pendingTickets
          }
        },
        projects: projectsArr,
        tasks: tasksArr,
        tickets: ticketsArr,
        finance: financeArr,
        activities: recentActivities,
        meetings: meetingsArr
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  const adminOptions = {
    resources: [
      { resource: Employee, options: { 
        parent: { name: 'HR Management', icon: 'Users' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Intern, options: { 
        parent: { name: 'HR Management', icon: 'Users' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Attendance, options: { 
        parent: { name: 'HR Management', icon: 'Clock' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: LeaveRequest, options: { 
        parent: { name: 'HR Management', icon: 'Calendar' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Payroll, options: { 
        parent: { name: 'HR Management', icon: 'DollarSign' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },

      { 
        resource: JobPosting, 
        options: { 
          parent: { name: 'Recruitment', icon: 'Layers' }, 
          properties: { description: { type: 'textarea' } },
          actions: {
            show: {
              component: 'JobShow', 
              showInDrawer: false,
              actionType: 'record'
            }
          }
        } 
      },
      { resource: JobApplication, options: { 
        parent: { name: 'Recruitment', icon: 'Inbox' }, 
        properties: { adminNotes: { type: 'textarea' } },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      
      { resource: Project, options: { 
        parent: { name: 'Operations', icon: 'Briefcase' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Task, options: { 
        parent: { name: 'Operations', icon: 'CheckSquare' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Meeting, options: { 
        parent: { name: 'Operations', icon: 'Video' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Activity, options: { 
        parent: { name: 'Operations', icon: 'Activity' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },

      { 
        resource: Ticket, 
        options: { 
          parent: { name: 'Support', icon: 'LifeBuoy' },
          properties: {
            description: { type: 'textarea' },
            adminNotes: { type: 'textarea' },
            resolutionNotes: { type: 'textarea' },
            ticketId: { isVisible: { edit: false, filter: true, list: true, show: true } }
          },
          listProperties: ['ticketId', 'title', 'category', 'priority', 'status', 'assignedTeam'],
          actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
        } 
      },
      { resource: LiveChat, options: { 
        parent: { name: 'Support', icon: 'MessageSquare' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },

      { resource: Revenue, options: { 
        parent: { name: 'Finance', icon: 'TrendingUp' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Invoice, options: { 
        parent: { name: 'Finance', icon: 'FileText' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Bill, options: { 
        parent: { name: 'Finance', icon: 'FileMinus' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },

      { resource: Lead, options: { 
        parent: { name: 'Sales', icon: 'UserPlus' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Deal, options: { 
        parent: { name: 'Sales', icon: 'Target' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },

      { resource: Setting, options: { 
        parent: { name: 'System', icon: 'Settings' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
      { resource: Manager, options: { 
        parent: { name: 'System', icon: 'Shield' },
        actions: { show: { component: 'GlobalShow', showInDrawer: false, actionType: 'record' } }
      } },
    ],
    componentLoader,
    dashboard: { component: Components.Dashboard },
    rootPath: '/admin',
    branding: {
      companyName: 'averqon HRMS',
      logo: '/logo.png',
      softwareBrothers: false,
      assets: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
          '/zoho-theme.css',
        ],
      },
      theme: {
        colors: {
          primary100: '#2563EB',
          accent: '#2563EB',
          hoverBg: '#F3F4F6',
          bg: '#F5F7FA',
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
    locale: {
      language: 'en',
      translations: {
        en: {
          labels: {
            Employee: 'Employee',
            Project: 'Project',
            Task: 'Task',
            Ticket: 'Ticket',
            Attendance: 'Attendance',
            Finance: 'Finance',
            ClientRequest: 'Client Request',
            Meeting: 'Meeting',
            Manager: 'Manager',
            'HR Management': 'HR Management',
            Operations: 'Operations',
            Support: 'Support',
            Sales: 'Sales',
            System: 'System',
            'Technical Issue': 'Technical Issue',
            'HR Support': 'HR Support',
            'Finance Issue': 'Finance Issue',
            'Attendance Problem': 'Attendance Problem',
            'Payroll Issue': 'Payroll Issue',
            'Project Access': 'Project Access',
            'Leave Request': 'Leave Request',
            'Login Problem': 'Login Problem',
            'Software Bug': 'Software Bug',
            'Hardware Request': 'Hardware Request',
            'General Query': 'General Query',
            'Employee Ticket': 'Employee Ticket',
            'Client Ticket': 'Client Ticket',
            'Internal Team Ticket': 'Internal Team Ticket',
            'Vendor Ticket': 'Vendor Ticket',
            Open: 'Open',
            'In Progress': 'In Progress',
            Pending: 'Pending',
            Resolved: 'Resolved',
            Closed: 'Closed',
            Reopened: 'Reopened',
            Low: 'Low',
            Medium: 'Medium',
            High: 'High',
            Urgent: 'Urgent',
          },
          properties: {
            title: 'Title',
            _id: 'ID',
            ticketId: 'Ticket ID',
            category: 'Category',
            priority: 'Priority',
            department: 'Department',
            assignedTeam: 'Assigned Team',
            ticketType: 'Ticket Type',
            description: 'Description',
            attachmentUrl: 'Attachment URL',
            userName: 'User Name',
            userEmail: 'User Email',
            userRole: 'User Role',
            contactNumber: 'Contact Number',
            status: 'Status',
            dueDate: 'Due Date',
            adminNotes: 'Admin Notes',
            resolutionNotes: 'Resolution Notes',
            createdAt: 'Created At',
            updatedAt: 'Updated At',
          },
        },
      },
    },
  };

  const authenticate = async ({ email, password }) => {
    const manager = await Manager.findOne({ email });
    if (manager) {
      const matched = await bcrypt.compare(password, manager.password);
      if (matched) return manager;
    }
    return null;
  };
  // --- Client Support Portal APIs ---
  const upload = multer({ dest: 'uploads/' });
  if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

  app.post('/api/support/tickets', upload.single('attachment'), async (req, res) => {
    try {
      const ticketData = {
        title: req.body.title,
        category: req.body.category,
        priority: req.body.priority || 'Medium',
        description: req.body.description,
        department: req.body.department,
        ticketType: req.body.ticketType,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        contactNumber: req.body.contactNumber,
        status: 'Open'
      };
      if (req.file) ticketData.attachmentUrl = `/uploads/${req.file.filename}`;
      const ticket = await Ticket.create(ticketData);
      res.json({ success: true, ticketId: ticket.ticketId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/support/tickets/:ticketId', async (req, res) => {
    try {
      const { email } = req.query;
      const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      // Minor security check
      if (email && ticket.userEmail.toLowerCase() !== email.toLowerCase()) {
        return res.status(403).json({ error: 'Unauthorized email for this ticket' });
      }
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/support/tickets/:ticketId/comments', async (req, res) => {
    try {
      const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      
      ticket.comments.push({
        sender: req.body.sender || ticket.userName,
        senderRole: req.body.senderRole || 'Client',
        message: req.body.message
      });
      await ticket.save();
      res.json({ success: true, comments: ticket.comments });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Recruitment ATS APIs ---
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await JobPosting.find({ isActive: true }).sort({ postedDate: -1 });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/applications', upload.single('resume'), async (req, res) => {
    try {
      const applicationData = {
        jobId: req.body.jobId,
        candidateName: req.body.candidateName,
        email: req.body.email,
        phone: req.body.phone,
        status: 'New'
      };
      if (req.file) applicationData.resumeUrl = `/uploads/${req.file.filename}`;
      const appRecord = await JobApplication.create(applicationData);
      
      console.log(`📧 [MOCK EMAIL] To: hr@averqon.ai | Subject: New Applicant: ${req.body.candidateName} for Job ID ${req.body.jobId}`);
      console.log(`📧 [MOCK EMAIL] To: ${req.body.email} | Subject: Application Received! | Dear ${req.body.candidateName}, we've received your resume.`);
      
      res.json({ success: true, applicationId: appRecord._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // -----------------------------------
  const authProvider = new DefaultAuthProvider({
    componentLoader,
    authenticate,
  });

  const admin = new AdminJS(adminOptions);
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: 'super-secret-password-32-chars-long', // Use environment variable in production
      provider: authProvider,
    },
    null,
    {
      secret: 'averqon-session-secret',
      resave: false,
      saveUninitialized: true,
    }
  );
  app.use(admin.options.rootPath, adminRouter);

  // Global Error Handler for detailed 500 logging
  app.use((err, req, res, next) => {
    console.error('💥 SERVER ERROR:', err);
    res.status(500).send('Internal Server Error');
  });

  app.listen(3000, () => {
    console.log(`🚀 AdminJS is running on http://localhost:3000/admin`);
  });
};

start();
