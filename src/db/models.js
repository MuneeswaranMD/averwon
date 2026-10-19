import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For portal login
  role: { type: String, enum: ['Employee', 'Manager', 'HR'], default: 'Employee' },
  phone: { type: String },
  department: { type: String, enum: ['IT', 'HR', 'Design', 'Finance', 'Marketing', 'Sales', 'Operations'], default: 'IT' },
  designation: { type: String },
  joinDate: { type: Date },
  salary: { type: Number },
  address: { type: String },
  profileImage: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  reportingManager: { type: String, default: 'Sarah Chen' },
  emergencyContacts: {
    type: [{
      name: String,
      rel: String,
      phone: String
    }],
    default: [
      { name: 'Muneeswaran', rel: 'Primary Contact', phone: '+91 8300864083' },
      { name: 'Mary Jane', rel: 'Mother', phone: '+91 98765 12345' }
    ]
  },
  allowedPages: { 
    type: [String], 
    default: [
      'Dashboard', 
      'My Profile', 
      'My Projects', 
      'My Tasks', 
      'Attendance', 
      'Leave Requests', 
      'Meetings', 
      'Activity Logs', 
      'Live Chat', 
      'Tools', 
      'Calendar', 
      'Notifications', 
      'Documents', 
      'Settings'
    ] 
  },
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
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  teamMembers: [String],
  progress: { type: Number, default: 0 },
  deadline: { type: Date },
  status: { type: String, enum: ['Completed', 'In Progress', 'Pending', 'Delayed', 'Urgent', 'Confirmed'], default: 'Confirmed' },
  projectValue: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Fully Paid', 'Partially Paid', 'Pending', 'Unpaid'], default: 'Fully Paid' },
  outstandingBalance: { type: Number, default: 0 },
  services: [String],
  address: { type: String },
  maintenanceNotes: { type: String }
}, { timestamps: true });
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
  resolutionNotes: { type: String },
  history: [{
    action: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

TicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Ticket.countDocuments();
    this.ticketId = `TKT-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
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
    const year = new Date().getFullYear();
    const last = await mongoose.models.Invoice.findOne({ invoiceId: new RegExp(`^INV-${year}-`) }).sort({ invoiceId: -1 });
    let nextNum = 1;
    if (last && last.invoiceId) {
      const parts = last.invoiceId.split('-');
      const parsed = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    } else {
      const c = await mongoose.models.Invoice.countDocuments();
      nextNum = c + 1;
    }
    this.invoiceId = `INV-${year}-${String(nextNum).padStart(4, '0')}`;
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
  receiver: { type: String }, // Optional for room-based chat
  roomId: { type: String },    // For group chats or specific threads
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Sent', 'Delivered', 'Read'], default: 'Sent' },
  isGroup: { type: Boolean, default: false }
});
const LiveChat = mongoose.model('LiveChat', LiveChatSchema);

const ChatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [String], // Names or IDs
  isPrivate: { type: Boolean, default: false },
  lastMessage: { type: String },
  updatedAt: { type: Date, default: Date.now }
});
const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, default: 'General' },
  icon: { type: String }, // Icon name from Lucide
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Tool = mongoose.model('Tool', ToolSchema);

const SettingSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Averon HRMS' },
  theme: { type: String, enum: ['Light', 'Dark', 'System'], default: 'Light' },
  language: { type: String, default: 'English' },
  timeZone: { type: String, default: 'UTC' }
});
const Setting = mongoose.model('Setting', SettingSchema);

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
  role: { type: String, enum: ['Super Admin', 'Admin', 'HR Manager', 'Finance Manager', 'Sales Manager', 'Viewer'], default: 'Admin' },
  loginHistory: [Date],
}, { timestamps: true });
const Manager = mongoose.model('Manager', ManagerSchema);

const ClientSchema = new mongoose.Schema({
  clientName: { type: String, required: true, unique: true },
  email: { type: String }, // Optional so unprovided contact details are not invented
  phone: { type: String },
  company: { type: String },
  organization: { type: String },
  designation: { type: String },
  address: { type: String },
  location: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Confirmed'], default: 'Confirmed' },
  totalProjectValue: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  outstandingBalance: { type: Number, default: 0 }
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

const ClientRequestSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    projectType: {
      type: String,
      enum: [
        'Website Development',
        'Mobile App',
        'UI/UX Design',
        'CRM System',
        'Billing Software',
        'E-Commerce',
        'Other',
      ],
    },
    budget: { type: String },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Approved', 'Rejected', 'Completed'],
      default: 'New',
    },
    description: { type: String },
  },
  { timestamps: true }
);
const ClientRequest = mongoose.model('ClientRequest', ClientRequestSchema);

const DocumentSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Offer Letter', 'Contract', 'Payslip', 'Policy', 'Other'], default: 'Other' },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
  fileUrl: { type: String },
  size: { type: String }
}, { timestamps: true });
const Document = mongoose.model('Document', DocumentSchema);

const PortfolioProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  category: { 
    type: String, 
    enum: ['Web Development', 'Mobile App', 'AI & Data Science', 'Cloud & DevOps', 'Blockchain', 'Enterprise Software', 'UI/UX Design', 'Other'], 
    default: 'Web Development' 
  },
  description: { type: String, required: true },
  image: { type: String },
  technologies: [String],
  liveUrl: { type: String },
  githubUrl: { type: String },
  clientName: { type: String },
  featured: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });
const PortfolioProject = mongoose.model('PortfolioProject', PortfolioProjectSchema);

// --- Post-Delivery Service & Renewal Tracking ---
const ServiceRenewalSchema = new mongoose.Schema({
  serviceId: { type: String, unique: true },
  serviceName: { type: String, required: true },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'Domain renewal',
      'Hosting / VPS renewal',
      'AMC / Maintenance renewal',
      'Extra development and additional feature requests',
      'Other'
    ],
    default: 'Domain renewal'
  },
  clientName: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  projectName: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  renewalAmount: { type: Number, required: true },
  billingFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'One-Time', 'Custom'],
    default: 'Annual'
  },
  status: {
    type: String,
    enum: ['Active', 'Pending Renewal', 'Renewed', 'Expired', 'Cancelled', 'Overdue'],
    default: 'Active'
  },
  nextFollowupDate: { type: Date },
  notes: { type: String },
  clientEmail: { type: String },
  clientNotificationEnabled: { type: Boolean, default: false },
  autoReminderEnabled: { type: Boolean, default: true },
  latestInvoiceReference: { type: String },
  latestPaymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Unbilled'],
    default: 'Unbilled'
  }
}, { timestamps: true });

ServiceRenewalSchema.pre('save', async function(next) {
  if (!this.serviceId) {
    const year = new Date().getFullYear();
    const last = await mongoose.models.ServiceRenewal.findOne({ serviceId: new RegExp(`^SRV-${year}-`) }).sort({ serviceId: -1 });
    let nextNum = 1;
    if (last && last.serviceId) {
      const parts = last.serviceId.split('-');
      const parsed = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    } else {
      const c = await mongoose.models.ServiceRenewal.countDocuments();
      nextNum = c + 1;
    }
    this.serviceId = `SRV-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  next();
});

ServiceRenewalSchema.index({ clientName: 1 });
ServiceRenewalSchema.index({ projectName: 1 });
ServiceRenewalSchema.index({ expiryDate: 1 });
ServiceRenewalSchema.index({ status: 1 });

const ServiceRenewal = mongoose.model('ServiceRenewal', ServiceRenewalSchema);

// --- Renewal History ---
const RenewalHistorySchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRenewal', required: true },
  serviceIdentifier: { type: String },
  serviceName: { type: String, required: true },
  clientName: { type: String, required: true },
  projectName: { type: String },
  previousPeriodStart: { type: Date, required: true },
  previousExpiryDate: { type: Date, required: true },
  newPeriodStart: { type: Date },
  newExpiryDate: { type: Date, required: true },
  renewalPrice: { type: Number, required: true },
  invoiceReference: { type: String },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Unbilled'],
    default: 'Pending'
  },
  paymentRecordId: { type: String },
  renewedAt: { type: Date, default: Date.now },
  renewedBy: { type: String, default: 'Admin' },
  notes: { type: String }
}, { timestamps: true });

RenewalHistorySchema.index({ serviceId: 1 });
RenewalHistorySchema.index({ clientName: 1 });
RenewalHistorySchema.index({ renewedAt: -1 });

const RenewalHistory = mongoose.model('RenewalHistory', RenewalHistorySchema);

// --- Upsell Tracking ---
const UpsellOpportunitySchema = new mongoose.Schema({
  opportunityId: { type: String, unique: true },
  clientName: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  title: { type: String, required: true },
  description: { type: String },
  estimatedValue: { type: Number, required: true },
  nextFollowupDate: { type: Date },
  notes: { type: String },
  quotationLink: { type: String },
  status: {
    type: String,
    enum: ['Identified', 'Contacted', 'Quotation Sent', 'Negotiation', 'Won', 'Lost'],
    default: 'Identified'
  },
  convertedToProject: { type: Boolean, default: false },
  convertedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  convertedProjectName: { type: String },
  createdBy: { type: String, default: 'Admin' }
}, { timestamps: true });

UpsellOpportunitySchema.pre('save', async function(next) {
  if (!this.opportunityId) {
    const year = new Date().getFullYear();
    const last = await mongoose.models.UpsellOpportunity.findOne({ opportunityId: new RegExp(`^UPS-${year}-`) }).sort({ opportunityId: -1 });
    let nextNum = 1;
    if (last && last.opportunityId) {
      const parts = last.opportunityId.split('-');
      const parsed = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    } else {
      const c = await mongoose.models.UpsellOpportunity.countDocuments();
      nextNum = c + 1;
    }
    this.opportunityId = `UPS-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  next();
});

UpsellOpportunitySchema.index({ clientName: 1 });
UpsellOpportunitySchema.index({ status: 1 });
UpsellOpportunitySchema.index({ nextFollowupDate: 1 });

const UpsellOpportunity = mongoose.model('UpsellOpportunity', UpsellOpportunitySchema);

// --- Renewal Email Reminder Delivery Log ---
const RenewalReminderLogSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRenewal', required: true },
  serviceName: { type: String },
  clientName: { type: String },
  reminderType: {
    type: String,
    enum: ['30_days_before', '15_days_before', '7_days_before', '1_day_before', 'on_expiry', 'after_expiry_followup'],
    required: true
  },
  targetExpiryDate: { type: Date, required: true },
  recipientEmail: { type: String, required: true },
  recipientType: { type: String, enum: ['Admin', 'Client'], required: true },
  status: { type: String, enum: ['Sent', 'Failed', 'Pending Retry'], default: 'Sent' },
  attemptCount: { type: Number, default: 1 },
  lastAttemptAt: { type: Date, default: Date.now },
  error: { type: String },
  sentAt: { type: Date }
}, { timestamps: true });

RenewalReminderLogSchema.index({ serviceId: 1, reminderType: 1, recipientEmail: 1, targetExpiryDate: 1 }, { unique: true });

const RenewalReminderLog = mongoose.model('RenewalReminderLog', RenewalReminderLogSchema);

// --- Client Feedback Request Schema ---
const FeedbackRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  clientName: { type: String, required: true },
  companyName: { type: String },
  email: { type: String, required: true },
  project: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  tokenHash: { type: String, required: true, index: true },
  rawToken: { type: String },
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Expired', 'Revoked'],
    default: 'Pending'
  },
  createdBy: { type: String, default: 'Admin' },
  submittedAt: { type: Date },
}, { timestamps: true });

FeedbackRequestSchema.pre('save', async function(next) {
  if (!this.requestId) {
    const year = new Date().getFullYear();
    const last = await mongoose.models.FeedbackRequest.findOne({ requestId: new RegExp(`^FBR-${year}-`) }).sort({ requestId: -1 });
    let nextNum = 1;
    if (last && last.requestId) {
      const parts = last.requestId.split('-');
      const parsed = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    } else {
      const c = await mongoose.models.FeedbackRequest.countDocuments();
      nextNum = c + 1;
    }
    this.requestId = `FBR-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  next();
});

FeedbackRequestSchema.index({ email: 1 });
FeedbackRequestSchema.index({ status: 1 });
FeedbackRequestSchema.index({ expiresAt: 1 });

const FeedbackRequest = mongoose.model('FeedbackRequest', FeedbackRequestSchema);

// --- Client Feedback / Testimonial Submission Schema ---
const ClientFeedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, unique: true },
  requestId: { type: String, index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  clientName: { type: String, required: true },
  companyName: { type: String },
  organization: { type: String },
  designation: { type: String },
  email: { type: String },
  project: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }, // Left blank unless client provides one
  qualityRating: { type: Number, min: 1, max: 5 },
  communicationRating: { type: Number, min: 1, max: 5 },
  deliveryRating: { type: Number, min: 1, max: 5 },
  feedbackText: { type: String, required: true },
  draftText: { type: String },
  source: { 
    type: String, 
    enum: ['Client-Provided', 'Suggested Draft'], 
    default: 'Suggested Draft' 
  },
  clientApproved: { type: Boolean, default: false },
  clientApprovalDate: { type: Date },
  publicationConsent: { type: Boolean, required: true, default: false },
  publicationConsentDate: { type: Date },
  identityDisplayConsent: { type: Boolean, default: false },
  imageDisplayConsent: { type: Boolean, default: false },
  photoUrl: { type: String },
  status: {
    type: String,
    enum: [
      'Draft', 
      'Awaiting Client Approval', 
      'Awaiting Publication Consent', 
      'Pending Review', 
      'Approved', 
      'Published', 
      'Rejected', 
      'Archived'
    ],
    default: 'Draft'
  },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  publishedAt: { type: Date },
  adminNotes: { type: String },
}, { timestamps: true });

ClientFeedbackSchema.pre('save', async function(next) {
  if (!this.feedbackId) {
    const year = new Date().getFullYear();
    const last = await mongoose.models.ClientFeedback.findOne({ feedbackId: new RegExp(`^FDB-${year}-`) }).sort({ feedbackId: -1 });
    let nextNum = 1;
    if (last && last.feedbackId) {
      const parts = last.feedbackId.split('-');
      const parsed = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsed)) nextNum = parsed + 1;
    } else {
      const c = await mongoose.models.ClientFeedback.countDocuments();
      nextNum = c + 1;
    }
    this.feedbackId = `FDB-${year}-${String(nextNum).padStart(4, '0')}`;
  }
  next();
});

ClientFeedbackSchema.index({ status: 1 });
ClientFeedbackSchema.index({ publicationConsent: 1 });
ClientFeedbackSchema.index({ rating: -1 });

const ClientFeedback = mongoose.model('ClientFeedback', ClientFeedbackSchema);

// --- Feedback Audit Log Schema ---
const FeedbackAuditLogSchema = new mongoose.Schema({
  feedbackId: { type: String },
  requestId: { type: String },
  actorId: { type: String, default: 'Admin' },
  action: { type: String, required: true },
  previousValues: { type: mongoose.Schema.Types.Mixed },
  newValues: { type: mongoose.Schema.Types.Mixed },
  notes: { type: String },
  ipAddress: { type: String },
}, { timestamps: true });

FeedbackAuditLogSchema.index({ feedbackId: 1 });
FeedbackAuditLogSchema.index({ requestId: 1 });
FeedbackAuditLogSchema.index({ createdAt: -1 });

const FeedbackAuditLog = mongoose.model('FeedbackAuditLog', FeedbackAuditLogSchema);

export {
  Employee, Intern, Project, Task, Ticket, Attendance, LeaveRequest, Payroll, 
  Meeting, Activity, Revenue, Invoice, Bill, Lead, Deal, LiveChat, Setting,
  JobPosting, JobApplication, Manager, Client, Vendor, ClientRequest, Document,
  Tool, ChatRoom, PortfolioProject,
  ServiceRenewal, RenewalHistory, UpsellOpportunity, RenewalReminderLog,
  FeedbackRequest, ClientFeedback, FeedbackAuditLog
};


