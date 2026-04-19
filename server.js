import 'dotenv/config';
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
import cookieParser from 'cookie-parser';
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
  revenueId: { type: String, unique: true },
  clientName: { type: String, required: true },
  projectName: { type: String },
  paymentMethod: { type: String, enum: ['Bank Transfer', 'Credit Card', 'PayPal', 'Cash', 'Stripe'], default: 'Bank Transfer' },
  amount: { type: Number, required: true },
  receivedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Partially Paid'], default: 'Paid' },
  growth: { type: Number, default: 0 }
}, { timestamps: true });
RevenueSchema.pre('save', async function(next) {
  if (!this.revenueId) {
    const c = await mongoose.models.Revenue.countDocuments();
    this.revenueId = `REV-${new Date().getFullYear()}-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Revenue = mongoose.model('Revenue', RevenueSchema);

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true },
  clientName: { type: String, required: true },
  projectName: { type: String },
  invoiceAmount: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number },
  dueDate: { type: Date, required: true },
  paymentDate: { type: Date },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

InvoiceSchema.pre('save', async function(next) {
  this.totalAmount = (this.invoiceAmount + (this.taxAmount || 0)) - (this.discountAmount || 0);
  if (!this.invoiceId) {
    const c = await mongoose.models.Invoice.countDocuments();
    this.invoiceId = `INV-${new Date().getFullYear()}-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Invoice = mongoose.model('Invoice', InvoiceSchema);

const BillSchema = new mongoose.Schema({
  billId: { type: String, unique: true },
  vendorName: { type: String, required: true },
  category: { type: String, enum: ['Salary', 'Software', 'Office Expense', 'Hardware', 'Marketing', 'Travel', 'Internet', 'Maintenance'], default: 'Office Expense' },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paymentMethod: { type: String, enum: ['Bank Transfer', 'Credit Card', 'Cash', 'UPI'], default: 'Bank Transfer' },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue', 'Rejected'], default: 'Pending' },
  receiptUrl: { type: String }
}, { timestamps: true });
BillSchema.pre('save', async function(next) {
  if (!this.billId) {
    const c = await mongoose.models.Bill.countDocuments();
    this.billId = `BIL-${new Date().getFullYear()}-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Bill = mongoose.model('Bill', BillSchema);

const LeadSchema = new mongoose.Schema({
  leadId: { type: String, unique: true },
  leadName: { type: String, required: true },
  companyName: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  leadSource: { type: String, enum: ['Website', 'Referral', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp', 'Direct Call'], default: 'Website' },
  assignedTo: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'], default: 'New' },
  followupDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });
LeadSchema.pre('save', async function(next) {
  if (!this.leadId) {
    const c = await mongoose.models.Lead.countDocuments();
    this.leadId = `LD-${new Date().getFullYear()}-${String(c + 1).padStart(4, '0')}`;
  }
  next();
});
const Lead = mongoose.model('Lead', LeadSchema);

const DealSchema = new mongoose.Schema({
  dealId: { type: String, unique: true },
  dealName: { type: String, required: true },
  clientName: { type: String, required: true },
  assignedSalesperson: { type: String },
  dealValue: { type: Number, required: true },
  expectedClosingDate: { type: Date },
  status: { type: String, enum: ['Open', 'Negotiation', 'Proposal Sent', 'Won', 'Lost'], default: 'Open' },
  probability: { type: Number, min: 0, max: 100, default: 50 }
}, { timestamps: true });
DealSchema.pre('save', async function(next) {
  if (!this.dealId) {
    const c = await mongoose.models.Deal.countDocuments();
    this.dealId = `DL-${new Date().getFullYear()}-${String(c + 1).padStart(4, '0')}`;
  }
  next();
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

const ClientSchema = new mongoose.Schema({
  clientName: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });
const Client = mongoose.model('Client', ClientSchema);

const VendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true, unique: true },
  category: { type: String },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });
const Vendor = mongoose.model('Vendor', VendorSchema);

// Component Loader
const componentLoader = new ComponentLoader();
const Components = {
  Dashboard: componentLoader.add('Dashboard', path.join(__dirname, './src/admin/components/Dashboard.jsx')),
  Sidebar: componentLoader.override('Sidebar', path.join(__dirname, './src/admin/components/Sidebar.jsx')),
  Login: componentLoader.override('Login', path.join(__dirname, './src/admin/components/Login.jsx')),
  JobShow: componentLoader.add('JobShow', path.join(__dirname, './src/admin/components/JobShow.jsx')),
  GlobalShow: componentLoader.add('GlobalShow', path.join(__dirname, './src/admin/components/GlobalShow.jsx')),
  GlobalEdit: componentLoader.add('GlobalEdit', path.join(__dirname, './src/admin/components/GlobalEdit.jsx')),
  FinanceDashboard: componentLoader.add('FinanceDashboard', path.join(__dirname, './src/admin/components/FinanceDashboard.jsx')),
  SalesDashboard: componentLoader.add('SalesDashboard', path.join(__dirname, './src/admin/components/SalesDashboard.jsx')),
  StatusTag: componentLoader.add('StatusTag', path.join(__dirname, './src/admin/components/StatusBadge.jsx')),
  ContentToggle: componentLoader.add('ContentToggle', path.join(__dirname, './src/admin/components/LongText.jsx')),
};

const start = async () => {
  const app = express();

  app.use((req, res, next) => {
    console.log(`[DEBUG LOG] ${req.method} ${req.url}`);
    // Relaxed CSP for development and AdminJS assets
    res.setHeader("Content-Security-Policy", "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;");
    next();
  });

  // Silence browser internal noise
  app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => res.status(200).json({}));

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

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());
  
  // NOTE: Global body parsers (json/urlencoded) are moved AFTER AdminJS router 
  // to prevent conflicts with AdminJS's internal body parsing (formidable).

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', time: new Date().toISOString() });
  });

  async function seedDatabase() {
    try {
      let adminUser = await Manager.findOne({ email: 'admin@averqon.ai' });
      if (adminUser) {
        console.log('✅ Admin user already exists. Updating password to admin123...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminUser.password = hashedPassword;
        await adminUser.save();
        console.log('✅ Admin password reset to admin123');
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
          totalLeads: newLeads, // Already fetched as newLeads in Promise.all
          totalDeals: await Deal.countDocuments(),
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


  const commonActions = {
    show: { component: Components.GlobalShow, showInDrawer: false },
    edit: { component: Components.GlobalEdit, showInDrawer: false }
  };

  const adminOptions = {
    pages: {
      Finance_Insights: {
        label: 'Finance Insights',
        component: Components.FinanceDashboard,
        icon: 'Activity'
      },
      Sales_Performance: {
        label: 'Sales Performance',
        component: Components.SalesDashboard,
        icon: 'BarChart'
      }
    },
    resources: [
      { resource: Employee, options: { 
        parent: { name: 'HR Management', icon: 'Users' },
        properties: {
          status: { components: { list: Components.StatusTag } },
          employeeId: { label: 'Employee ID' },
          joinDate: { label: 'Join Date' },
          profileImage: { label: 'Profile Image' },
          department: {
            components: { list: Components.StatusBadge },
            availableValues: [
              { value: 'IT', label: 'IT' },
              { value: 'HR', label: 'HR' },
              { value: 'Design', label: 'Design' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Sales', label: 'Sales' },
              { value: 'Operations', label: 'Operations' },
            ],
          },
        },
        listProperties: ['email', 'name', 'employeeId', 'department', 'designation', 'status'],
        actions: { ...commonActions }
      } },
      { resource: Intern, options: { 
        parent: { name: 'HR Management', icon: 'Users' },
        properties: { status: { components: { list: Components.StatusTag } } },
        actions: { ...commonActions }
      } },
      { resource: Attendance, options: { 
        parent: { name: 'HR Management', icon: 'Clock' },
        properties: { status: { components: { list: Components.StatusTag } } },
        actions: { ...commonActions }
      } },
      { resource: LeaveRequest, options: { 
        parent: { name: 'HR Management', icon: 'Calendar' },
        properties: { status: { components: { list: Components.StatusTag } } },
        actions: { ...commonActions }
      } },
      { resource: Payroll, options: { 
        parent: { name: 'HR Management', icon: 'DollarSign' },
        actions: { ...commonActions }
      } },

      { 
        resource: JobPosting, 
        options: { 
          parent: { name: 'Recruitment', icon: 'Layers' }, 
          properties: { 
            description: { 
              type: 'textarea',
              components: { list: Components.ContentToggle }
            } 
          },
          actions: { ...commonActions }
        } 
      },
      { resource: JobApplication, options: { 
        parent: { name: 'Recruitment', icon: 'Inbox' }, 
        properties: { 
          status: { components: { list: Components.StatusTag } },
          adminNotes: { type: 'textarea' } 
        },
        actions: { ...commonActions }
      } },
      
      { resource: Project, options: { 
        parent: { name: 'Operations', icon: 'Briefcase' },
        properties: { status: { components: { list: Components.StatusTag } } },
        actions: { ...commonActions }
      } },
      { resource: Task, options: { 
        parent: { name: 'Operations', icon: 'CheckSquare' },
        properties: { 
          status: { components: { list: Components.StatusTag } },
          priority: { components: { list: Components.StatusTag } }
        },
        actions: { ...commonActions }
      } },
      { resource: Meeting, options: { 
        parent: { name: 'Operations', icon: 'Video' },
        properties: { status: { components: { list: Components.StatusTag } } },
        actions: { ...commonActions }
      } },
      { resource: Activity, options: { 
        parent: { name: 'Operations', icon: 'Activity' },
        actions: { ...commonActions }
      } },

      { 
        resource: Ticket, 
        options: { 
          parent: { name: 'Support', icon: 'LifeBuoy' },
          properties: {
            status: { components: { list: Components.StatusTag } },
            priority: { components: { list: Components.StatusTag } },
            description: { 
              type: 'textarea',
              components: { list: Components.ContentToggle }
            },
            adminNotes: { type: 'textarea' },
            resolutionNotes: { type: 'textarea' },
            ticketId: { isVisible: { edit: false, filter: true, list: true, show: true } }
          },
          listProperties: ['ticketId', 'title', 'category', 'priority', 'status', 'assignedTeam'],
          actions: { ...commonActions }
        } 
      },
      { resource: LiveChat, options: { 
        parent: { name: 'Support', icon: 'MessageSquare' },
        actions: { ...commonActions }
      } },

      { resource: Revenue, options: { 
        parent: { name: 'Finance', icon: 'TrendingUp' },
        actions: { ...commonActions },
        listProperties: ['revenueId', 'clientName', 'projectName', 'amount', 'receivedDate', 'status'],
        properties: {
          receivedDate: { type: 'date' },
          status: { 
            components: { list: Components.StatusBadge },
            availableValues: [
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Partially Paid', label: 'Partially Paid' },
            ],
          },
        }
      } },
      { resource: Invoice, options: { 
        parent: { name: 'Finance', icon: 'FileText' },
        actions: { ...commonActions },
        listProperties: ['invoiceId', 'clientName', 'totalAmount', 'dueDate', 'status'],
        properties: {
          dueDate: { type: 'date' },
          paymentDate: { type: 'date' },
          status: { 
            components: { list: Components.StatusBadge },
            availableValues: [
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Cancelled', label: 'Cancelled' },
            ],
          },
        }
      } },
      { resource: Bill, options: { 
        parent: { name: 'Finance', icon: 'FileMinus' },
        actions: { ...commonActions },
        listProperties: ['billId', 'vendorName', 'category', 'amount', 'dueDate', 'status'],
        properties: {
          dueDate: { type: 'date' },
          status: { 
            components: { list: Components.StatusBadge },
            availableValues: [
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Rejected', label: 'Rejected' },
            ],
          },
        }
      } },

      { resource: Lead, options: { 
        parent: { name: 'Sales', icon: 'UserPlus' },
        actions: { ...commonActions },
        listProperties: ['leadId', 'leadName', 'companyName', 'leadSource', 'status', 'followupDate'],
        properties: {
          status: { components: { list: Components.StatusTag } },
          followupDate: { type: 'date' },
          notes: { 
            type: 'textarea',
            components: { list: Components.ContentToggle }
          },
        }
      } },
      { resource: Deal, options: { 
        parent: { name: 'Sales', icon: 'Target' },
        actions: { ...commonActions },
        listProperties: ['dealId', 'dealName', 'clientName', 'dealValue', 'status', 'probability'],
        properties: {
          status: { components: { list: Components.StatusTag } },
          expectedClosingDate: { type: 'date' },
        }
      } },

      { resource: Setting, options: { 
        parent: { name: 'System', icon: 'Settings' },
        actions: { ...commonActions }
      } },
      { resource: Manager, options: { 
        parent: { name: 'System', icon: 'Shield' },
        actions: { ...commonActions }
      } },
      { resource: Client, options: { 
        parent: { name: 'Sales', icon: 'Users' },
        actions: { ...commonActions }
      } },
      { resource: Vendor, options: { 
        parent: { name: 'Finance', icon: 'Truck' },
        actions: { ...commonActions }
      } },
    ],
    componentLoader,
    dashboard: { component: Components.Dashboard },
    rootPath: '/admin',
    branding: {
      companyName: 'averqon HRMS',
      logo: '/logo.png',
      favicon: '/logo.png',
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
            'Finance Insights': 'Finance Insights',
            'Sales Performance': 'Sales Performance',
            ClientRequest: 'Client Request',
            Meeting: 'Meeting',
            Manager: 'Manager',
            Client: 'Client',
            Vendor: 'Vendor',
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
            // Enum Value Labels
            IT: 'IT',
            HR: 'HR',
            Design: 'Design',
            Finance: 'Finance',
            Marketing: 'Marketing',
            Sales: 'Sales',
            Operations: 'Operations',
            Active: 'Active',
            Inactive: 'Inactive',
            'On Leave': 'On Leave',
            // Finance Labels
            Paid: 'Paid',
            Overdue: 'Overdue',
            Draft: 'Draft',
            Salary: 'Salary',
            Software: 'Software',
            Hardware: 'Hardware',
            Travel: 'Travel',
            'Office Expense': 'Office Expense',
            Approved: 'Approved',
            // Sales Labels
            New: 'New',
            Contacted: 'Contacted',
            Qualified: 'Qualified',
            'Proposal Sent': 'Proposal Sent',
            Negotiation: 'Negotiation',
            Won: 'Won',
            Lost: 'Lost',
            Converted: 'Converted',
            // Additional Category Labels
            Internet: 'Internet',
            Maintenance: 'Maintenance',
            'Partially Paid': 'Partially Paid',
            Rejected: 'Rejected',
            Cancelled: 'Cancelled',
            status: {
              Completed: 'Completed',
              'In Progress': 'In Progress',
              Pending: 'Pending',
              Delayed: 'Delayed',
              Urgent: 'Urgent',
              Active: 'Active',
              Inactive: 'Inactive',
              'On Leave': 'On Leave',
              Paid: 'Paid',
              Overdue: 'Overdue',
              'Partially Paid': 'Partially Paid',
              Won: 'Won',
              Lost: 'Lost',
            },
            // Lead Sources
            Website: 'Website',
            Referral: 'Referral',
            LinkedIn: 'LinkedIn',
            Facebook: 'Facebook',
            Instagram: 'Instagram',
            WhatsApp: 'WhatsApp',
            'Direct Call': 'Direct Call',
          },
          properties: {
            name: 'Name',
            email: 'Email',
            employeeId: 'Employee ID',
            phone: 'Phone',
            designation: 'Designation',
            joinDate: 'Join Date',
            salary: 'Salary',
            address: 'Address',
            profileImage: 'Profile Image',
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
            // Revenue
            revenueId: 'Revenue ID',
            receivedDate: 'Received Date',
            paymentMethod: 'Payment Method',
            projectName: 'Project Name',
            growth: 'Growth %',
            // Invoices
            invoiceId: 'Invoice ID',
            invoiceAmount: 'Invoice Amount',
            taxAmount: 'Tax Amount',
            discountAmount: 'Discount Amount',
            totalAmount: 'Total Amount',
            paymentDate: 'Payment Date',
            // Bills
            billId: 'Bill ID',
            vendorName: 'Vendor Name',
            receiptUrl: 'Receipt URL',
            // Leads
            leadId: 'Lead ID',
            leadName: 'Lead Name',
            companyName: 'Company Name',
            phoneNumber: 'Phone Number',
            leadSource: 'Lead Source',
            assignedTo: 'Assigned To',
            followupDate: 'Follow-up Date',
            // Deals
            dealId: 'Deal ID',
            dealName: 'Deal Name',
            dealValue: 'Deal Value',
            probability: 'Probability %',
            expectedClosingDate: 'Expected Closing Date',
            // Recruitment
            type: 'Type',
            location: 'Location',
            isActive: 'Is Active',
            postedDate: 'Posted Date',
            description: 'Description',
            notes: 'Notes / Remarks',
            client: 'Client',
            progress: 'Progress',
            deadline: 'Deadline',
            teamMembers: 'Team Members',
          },
          labels: {
            JobPosting: 'Job Posting',
            isActive: {
              true: 'Yes',
              false: 'No'
            },
            type: {
              'Full-time': 'Full-time',
              'Part-time': 'Part-time',
              'Contract': 'Contract',
              'Internship': 'Internship'
            }
          }
        },
      },
    },
  };

  const authenticate = async ({ email, password }) => {
    console.log(`[AUTH] Attempting login for: ${email}`);
    
    try {
      const manager = await Manager.findOne({ email: email.toLowerCase() });
      if (manager) {
        // Verify password using bcrypt
        const isMatch = await bcrypt.compare(password, manager.password);
        if (isMatch) {
          console.log(`[AUTH] Success for: ${email}`);
          return manager;
        } else {
          console.log(`[AUTH] Password mismatch for: ${email}`);
        }
      } else {
        console.log(`[AUTH] User not found: ${email}`);
      }
    } catch (error) {
      console.error('[AUTH] Integration Error:', error.message);
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
      cookiePassword: 'super-secret-password-32-chars-long', 
      provider: authProvider,
    },
    null,
    {
      secret: 'averqon-session-secret',
      resave: false,
      saveUninitialized: true,
    }
  );

  // Mount AdminJS router BEFORE generic body parsers
  app.use(admin.options.rootPath, adminRouter);

  // Serve corporate site (Vite build) from dist
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Now apply generic body parsers for the rest of the application
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Fallback for SPA (Single Page Application)
  app.get('*', (req, res, next) => {
    // Skip if it's an API or AdminJS route
    if (req.url.startsWith('/admin') || req.url.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
  
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Global Error Handler for detailed 500 logging
  app.use((err, req, res, next) => {
    console.error('💥 SERVER ERROR:', err);
    res.status(500).send('Internal Server Error');
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 AdminJS is running on port ${port}`);
  });
};

start();
