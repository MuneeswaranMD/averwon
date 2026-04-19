import mongoose from 'mongoose';

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

export {
  Employee, Intern, Project, Task, Ticket, Attendance, LeaveRequest, Payroll, 
  Meeting, Activity, Revenue, Invoice, Bill, Lead, Deal, LiveChat, Setting,
  JobPosting, JobApplication, Manager, Client, Vendor, ClientRequest
};
