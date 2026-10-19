import 'dotenv/config';
process.env.TZ = 'Asia/Kolkata';
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
import { 
  sendTicketNotificationEmail, 
  sendTicketStatusUpdateEmail,
  sendCustomerTicketConfirmationEmail, 
  sendCustomerTicketUpdateEmail 
} from './src/utils/ticketEmailService.js';
import {
  startRenewalScheduler,
  checkAndDispatchRenewalReminders
} from './src/utils/renewalEmailService.js';
import crypto from 'crypto';
import {
  sendFeedbackInviteEmail,
  sendFeedbackReceivedAdminNotification
} from './src/utils/feedbackEmailService.js';
import {
  sendProductEnquiryAdminNotification,
  sendProductEnquiryClientConfirmation
} from './src/utils/productEnquiryEmailService.js';

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
      
      // Allow requests with no origin, vercel domains, averqon domains, or if in allowed list
      if (
        !origin || 
        allowed.indexOf(origin) !== -1 || 
        origin.endsWith('.vercel.app') || 
        origin.includes('averqon.in') || 
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
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
    startRenewalScheduler(12);
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    process.exit(1);
  }

  async function seedDatabase() {
    try {
      let adminUser = await Models.Manager.findOne({ email: 'admin@averqon.ai' });
      if (!adminUser) {
        console.log('🧹 Initializing Admin User & Default Core Data...');
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
        const defaultContacts = [
          { name: 'Muneeswaran', rel: 'Primary Contact', phone: '+91 8300864083' },
        ];
        await Models.Employee.create([
          { name: 'Sarah Chen', email: 'sarah.c@averqon.ai', password: empPassword, role: 'Manager', department: 'IT', designation: 'Lead Architect', joinDate: new Date('2024-01-15'), salary: 145000, status: 'Active', reportingManager: 'Executive Board', emergencyContacts: defaultContacts },
          { name: 'Marcus Rodriguez', email: 'marcus.r@averqon.ai', password: empPassword, role: 'Employee', department: 'Design', designation: 'Senior UI/UX', joinDate: new Date('2024-02-10'), salary: 95000, status: 'Active', reportingManager: 'Sarah Chen', emergencyContacts: defaultContacts },
          { name: 'Priya Sharma', email: 'priya.s@averqon.ai', password: empPassword, role: 'HR', department: 'Finance', designation: 'Accounts Manager', joinDate: new Date('2023-11-20'), salary: 110000, status: 'Active', reportingManager: 'Sarah Chen', emergencyContacts: defaultContacts },
          { name: 'James Wilson', email: 'james.w@averqon.ai', password: empPassword, role: 'Employee', department: 'Operations', designation: 'Ops Director', joinDate: new Date('2024-03-05'), salary: 130000, status: 'Active', reportingManager: 'Sarah Chen', emergencyContacts: defaultContacts },
          { name: 'Aisha Khan', email: 'aisha.k@averqon.ai', password: empPassword, role: 'Employee', department: 'Marketing', designation: 'Growth Lead', joinDate: new Date('2024-03-12'), salary: 85000, status: 'Active', reportingManager: 'Sarah Chen', emergencyContacts: defaultContacts },
        ]);

        // Seed Projects
        await Models.Project.create([
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
      }

      // Check and seed Clients if empty
      const clientCount = await Models.Client.countDocuments();
      if (clientCount === 0) {
        console.log('🏢 Seeding initial Clients...');
        await Models.Client.create([
          { clientName: 'Meridian Global', email: 'operations@meridian.com', phone: '+1 (555) 234-5678', company: 'Meridian Global Logistics Inc.', address: 'San Francisco, CA', status: 'Active' },
          { clientName: 'ZenDesk Retail', email: 'tech@zendeskretail.com', phone: '+1 (555) 876-5432', company: 'ZenDesk Retail Co.', address: 'New York, NY', status: 'Active' },
          { clientName: 'Pulse Medicare', email: 'admin@pulsemedicare.org', phone: '+1 (555) 432-1098', company: 'Pulse Medicare Health Systems', address: 'Austin, TX', status: 'Active' },
        ]);
      }

      // Check and seed Services & Renewals if empty
      const srvCount = await Models.ServiceRenewal.countDocuments();
      if (srvCount === 0) {
        console.log('🔄 Seeding initial Post-Delivery Services & Renewals...');
        const now = new Date();
        const in14Days = new Date(now.getTime() + 14 * 86400000);
        const in28Days = new Date(now.getTime() + 28 * 86400000);
        const in45Days = new Date(now.getTime() + 45 * 86400000);
        const in75Days = new Date(now.getTime() + 75 * 86400000);
        const past3Days = new Date(now.getTime() - 3 * 86400000);
        const lastYear = new Date(now.getTime() - 365 * 86400000);

        const s1 = await Models.ServiceRenewal.create({
          serviceName: 'Primary Production Cloud VPS',
          serviceType: 'Hosting / VPS renewal',
          clientName: 'Meridian Global',
          projectName: 'AverLink Logistics',
          startDate: lastYear,
          expiryDate: in14Days,
          renewalAmount: 48000,
          billingFrequency: 'Annual',
          status: 'Pending Renewal',
          nextFollowupDate: new Date(now.getTime() + 5 * 86400000),
          notes: 'High-memory instance on AWS eu-west-1. Multi-AZ replication enabled.',
          clientEmail: 'operations@meridian.com',
          clientNotificationEnabled: true,
          autoReminderEnabled: true,
          latestInvoiceReference: 'INV-2025-0012',
          latestPaymentStatus: 'Pending'
        });

        await Models.ServiceRenewal.create({
          serviceName: 'Enterprise Domain & DNS Shield',
          serviceType: 'Domain renewal',
          clientName: 'Meridian Global',
          projectName: 'AverLink Logistics',
          startDate: lastYear,
          expiryDate: in45Days,
          renewalAmount: 3200,
          billingFrequency: 'Annual',
          status: 'Active',
          nextFollowupDate: new Date(now.getTime() + 25 * 86400000),
          notes: 'Includes WHOIS privacy and automated Cloudflare SSL.',
          clientEmail: 'operations@meridian.com',
          clientNotificationEnabled: false,
          autoReminderEnabled: true,
          latestPaymentStatus: 'Paid'
        });

        await Models.ServiceRenewal.create({
          serviceName: 'Annual Maintenance Contract (AMC)',
          serviceType: 'AMC / Maintenance renewal',
          clientName: 'Pulse Medicare',
          projectName: 'Pulse Health Suite',
          startDate: lastYear,
          expiryDate: past3Days,
          renewalAmount: 120000,
          billingFrequency: 'Annual',
          status: 'Overdue',
          nextFollowupDate: new Date(now.getTime() + 1 * 86400000),
          notes: 'Includes monthly SLA reports, security vulnerability patching, and 24/7 on-call tier-1 triage.',
          clientEmail: 'admin@pulsemedicare.org',
          clientNotificationEnabled: true,
          autoReminderEnabled: true,
          latestPaymentStatus: 'Overdue'
        });

        await Models.ServiceRenewal.create({
          serviceName: 'Real-Time Inventory AI Feature Enhancements',
          serviceType: 'Extra development and additional feature requests',
          clientName: 'ZenDesk Retail',
          projectName: 'NeoRetail Core',
          startDate: new Date(now.getTime() - 60 * 86400000),
          expiryDate: in28Days,
          renewalAmount: 75000,
          billingFrequency: 'One-Time',
          status: 'Pending Renewal',
          nextFollowupDate: new Date(now.getTime() + 7 * 86400000),
          notes: 'Custom forecasting integration and sub-second inventory sync.',
          clientEmail: 'tech@zendeskretail.com',
          clientNotificationEnabled: true,
          autoReminderEnabled: true,
          latestPaymentStatus: 'Pending'
        });

        await Models.ServiceRenewal.create({
          serviceName: 'Automated Disaster Recovery Cluster',
          serviceType: 'Hosting / VPS renewal',
          clientName: 'Pulse Medicare',
          projectName: 'Pulse Health Suite',
          startDate: lastYear,
          expiryDate: in75Days,
          renewalAmount: 64000,
          billingFrequency: 'Annual',
          status: 'Active',
          nextFollowupDate: new Date(now.getTime() + 40 * 86400000),
          notes: 'Offsite encrypted backup replication node.',
          clientEmail: 'admin@pulsemedicare.org',
          clientNotificationEnabled: false,
          autoReminderEnabled: true,
          latestPaymentStatus: 'Paid'
        });

        // Seed sample Renewal History for s1
        await Models.RenewalHistory.create({
          serviceId: s1._id,
          serviceIdentifier: s1.serviceId,
          serviceName: s1.serviceName,
          clientName: s1.clientName,
          projectName: s1.projectName,
          previousPeriodStart: new Date(now.getTime() - 730 * 86400000),
          previousExpiryDate: lastYear,
          newPeriodStart: lastYear,
          newExpiryDate: in14Days,
          renewalPrice: 45000,
          invoiceReference: 'INV-2024-0033',
          paymentStatus: 'Paid',
          paymentRecordId: 'REV-2024-0019',
          renewedAt: lastYear,
          renewedBy: 'Sarah Chen',
          notes: 'Successfully renewed for Year 2 with 5% loyalty discount.'
        });
      }

      // Check and seed Upsell Opportunities if empty
      const upsellCount = await Models.UpsellOpportunity.countDocuments();
      if (upsellCount === 0) {
        console.log('📈 Seeding initial Upsell Opportunities...');
        const now = new Date();
        await Models.UpsellOpportunity.create([
          {
            clientName: 'Meridian Global',
            title: 'IoT Sensor Telemetry Dashboard & Predictive Maintenance',
            description: 'Real-time thermal and shock sensor ingestion for refrigerated logistics fleet.',
            estimatedValue: 185000,
            nextFollowupDate: new Date(now.getTime() + 5 * 86400000),
            notes: 'Client expressed strong interest during quarterly business review. Architecture document sent.',
            quotationLink: 'https://averqon.in/docs/quotations/Q-2026-MG-01.pdf',
            status: 'Quotation Sent',
            createdBy: 'Sarah Chen'
          },
          {
            clientName: 'ZenDesk Retail',
            title: 'Vector Search & AI Recommendation Engine',
            description: 'AI-driven personalized item cross-selling to lift cart conversion by an estimated 14%.',
            estimatedValue: 240000,
            nextFollowupDate: new Date(now.getTime() + 3 * 86400000),
            notes: 'In final pricing review with Head of E-Commerce.',
            quotationLink: 'https://averqon.in/docs/quotations/Q-2026-ZD-04.pdf',
            status: 'Negotiation',
            createdBy: 'Admin'
          },
          {
            clientName: 'Pulse Medicare',
            title: 'Automated HIPAA Intake OCR Vault',
            description: 'Automatic text extraction from uploaded medical charts directly into patient profiles.',
            estimatedValue: 145000,
            nextFollowupDate: new Date(now.getTime() + 10 * 86400000),
            notes: 'Identified bottleneck in intake processing. Ready for demonstration.',
            status: 'Identified',
            createdBy: 'Admin'
          }
        ]);
      }

      // Check and seed Client Feedback & Testimonials if empty
      const feedbackCount = await Models.ClientFeedback.countDocuments();
      if (feedbackCount === 0) {
        console.log('⭐ Seeding initial Client Feedback & Testimonials...');
        const tokenRaw1 = 'demo-token-hyperion-2026';
        const tokenHash1 = crypto.createHash('sha256').update(tokenRaw1).digest('hex');

        const req1 = await Models.FeedbackRequest.create({
          clientName: 'Marcus Vance',
          companyName: 'Hyperion Labs',
          email: 'marcus@hyperionlabs.io',
          project: 'AI Analytics Pipeline',
          tokenHash: tokenHash1,
          rawToken: tokenRaw1,
          expiresAt: new Date(now.getTime() + 25 * 86400000),
          status: 'Pending',
          createdBy: 'Admin'
        });

        const tokenRaw2 = 'demo-token-apex-completed';
        const tokenHash2 = crypto.createHash('sha256').update(tokenRaw2).digest('hex');

        const req2 = await Models.FeedbackRequest.create({
          clientName: 'Sarah Jenkins',
          companyName: 'Apex Cloud Solutions',
          email: 'sarah@apexcloud.io',
          project: 'Enterprise SaaS Platform',
          tokenHash: tokenHash2,
          rawToken: tokenRaw2,
          expiresAt: new Date(now.getTime() + 20 * 86400000),
          status: 'Submitted',
          submittedAt: new Date(now.getTime() - 2 * 86400000),
          createdBy: 'Admin'
        });

        await Models.ClientFeedback.create([
          {
            requestId: req2.requestId,
            clientName: 'Sarah Jenkins',
            companyName: 'Apex Cloud Solutions',
            email: 'sarah@apexcloud.io',
            project: 'Enterprise SaaS Platform',
            rating: 5,
            qualityRating: 5,
            communicationRating: 5,
            deliveryRating: 5,
            feedbackText: 'Averqon delivered our mission-critical enterprise portal on time and exceeded our engineering standards. Their attention to security, modern React architecture, and post-delivery support is world-class.',
            publicationConsent: true,
            identityDisplayConsent: true,
            imageDisplayConsent: true,
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            status: 'Published',
            publishedAt: new Date(now.getTime() - 86400000),
            adminNotes: 'Verified client. High satisfaction.'
          },
          {
            requestId: 'FBR-2026-0002',
            clientName: 'David Kalu',
            companyName: 'OmniLogistics Core',
            email: 'david.kalu@omnilogistics.com',
            project: 'Fleet Management Engine',
            rating: 5,
            qualityRating: 5,
            communicationRating: 5,
            deliveryRating: 5,
            feedbackText: 'Working with Averqon transformed our logistics dispatch workflow. Their proactive communication and high-velocity development cycle gave us an undeniable competitive advantage.',
            publicationConsent: true,
            identityDisplayConsent: true,
            imageDisplayConsent: true,
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            status: 'Published',
            publishedAt: new Date(now.getTime() - 40000000),
            adminNotes: 'Closed and delivered.'
          }
        ]);
      }

      // Check and seed Job Postings if empty
      const jobCount = await Models.JobPosting.countDocuments();
      if (jobCount === 0) {
        console.log('💼 Seeding initial Job Postings...');
        await Models.JobPosting.create([
          {
            title: 'Senior Full-Stack Engineer',
            type: 'Full-time',
            location: 'San Francisco, CA / Remote',
            department: 'Engineering',
            description: 'Lead architecture and development of high-scale cloud platforms using React, Node.js, and TypeScript. Build resilient microservices and mentor junior developers.',
            isActive: true,
            postedDate: new Date()
          },
          {
            title: 'Lead UI/UX Designer',
            type: 'Full-time',
            location: 'New York, NY / Hybrid',
            department: 'Design',
            description: 'Shape end-to-end user experiences for enterprise SaaS and consumer applications. Drive design systems, user journey mapping, and interactive prototypes in Figma.',
            isActive: true,
            postedDate: new Date()
          },
          {
            title: 'AI & Data Science Architect',
            type: 'Full-time',
            location: 'Remote',
            department: 'AI & Research',
            description: 'Architect generative AI applications, fine-tune LLMs, and develop scalable ML pipelines. Integrate neural retrieval systems and vector databases into production workflows.',
            isActive: true,
            postedDate: new Date()
          },
          {
            title: 'Cloud DevOps Engineer',
            type: 'Contract',
            location: 'Austin, TX / Remote',
            department: 'Operations',
            description: 'Design CI/CD pipelines, manage multi-region Kubernetes clusters, and enforce enterprise infrastructure-as-code security standards across AWS and GCP.',
            isActive: true,
            postedDate: new Date()
          }
        ]);
        console.log('✅ Initial Job Postings seeded successfully.');
      }

      // Check and seed Portfolio Projects if empty
      const portfolioCount = await Models.PortfolioProject.countDocuments();
      if (portfolioCount === 0) {
        console.log('🚀 Seeding initial Showcase Portfolio Projects...');
        await Models.PortfolioProject.create([
          {
            title: 'AverLink Logistics',
            subtitle: 'AI-Driven Fleet & Supply Chain Intelligence',
            category: 'Enterprise Software',
            description: 'A NEXT-GEN logistics platform optimizing fleet management with real-time tracking, IoT sensors telemetry, and predictive maintenance algorithms.',
            image: '/src/assets/averlink_logistics.png',
            technologies: ['React', 'Node.js', 'AWS IoT', 'Python', 'Docker'],
            liveUrl: 'https://averqon.ai',
            githubUrl: 'https://github.com/averqon',
            clientName: 'Meridian Global',
            featured: true,
            isActive: true,
            order: 1
          },
          {
            title: 'NeoRetail Core',
            subtitle: 'High-Scale Multi-Tenant Commerce Architecture',
            category: 'Web Development',
            description: 'Multi-tenant e-commerce engine serving 1M+ monthly users with integrated AI-driven inventory forecasting and sub-second checkout.',
            image: '/src/assets/neoretail_core.png',
            technologies: ['Next.js', 'PostgreSQL', 'Redis', 'TensorFlow', 'Stripe'],
            liveUrl: 'https://averqon.ai',
            githubUrl: 'https://github.com/averqon',
            clientName: 'ZenDesk Retail',
            featured: true,
            isActive: true,
            order: 2
          },
          {
            title: 'Pulse Health Suite',
            subtitle: 'HIPAA-Compliant Telemedicine & EHR Portal',
            category: 'Mobile App',
            description: 'HIPAA-compliant telemedicine suite featuring real-time WebRTC video consultation, automated transcription, and end-to-end encrypted patient records.',
            image: '/src/assets/pulse_health.png',
            technologies: ['React Native', 'Firebase', 'WebRTC', 'Go', 'Kubernetes'],
            liveUrl: 'https://averqon.ai',
            githubUrl: 'https://github.com/averqon',
            clientName: 'Pulse Medicare',
            featured: true,
            isActive: true,
            order: 3
          },
          {
            title: 'Sentient Analytics',
            subtitle: 'Real-Time Financial Sentiment & Market Processing',
            category: 'AI & Data Science',
            description: 'Real-time sentiment analysis platform for hedge funds and fintechs, processing millions of unstructured financial feeds hourly with custom LLM pipelines.',
            image: '/src/assets/sentient_analytics.png',
            technologies: ['PyTorch', 'Rust', 'Apache Kafka', 'Next.js', 'ClickHouse'],
            liveUrl: 'https://averqon.ai',
            githubUrl: 'https://github.com/averqon',
            clientName: 'Alpha Horizon',
            featured: true,
            isActive: true,
            order: 4
          }
        ]);
        console.log('✅ Showcase Portfolio Projects seeded successfully.');
      }

      console.log('✅ Database initialization check complete.');
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

  // --- AdminJS (Enabled by default unless explicitly disabled) ---
  if (process.env.DISABLE_ADMINJS !== 'true') {
    try {
      console.log('🛡️  Initializing AdminJS panel...');
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

      // Redirects for legacy hardcoded system links
      app.get('/admin/system/admins', (req, res) => {
        res.redirect('/admin/resources/Manager');
      });
      app.get('/admin/system/settings', (req, res) => {
        res.redirect('/admin/resources/Setting');
      });

      // Mount AdminJS
      app.use(admin.options.rootPath, adminRouter);
      console.log(`🛡️  Admin panel available at root path: ${admin.options.rootPath}`);
    } catch (err) {
      console.error('❌ Failed to initialize AdminJS:', err);
    }
  } else {
    console.log('🛡️  AdminJS disabled via DISABLE_ADMINJS flag.');
    app.get('/admin*', (req, res) => {
      res.status(503).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #2563EB;">Admin Panel Disabled</h1>
          <p>The AdminJS dashboard is currently disabled via DISABLE_ADMINJS flag.</p>
        </div>
      `);
    });
  }

  // --- API Routes for External Interactions ---
  const upload = multer({ dest: 'uploads/' });
  if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

  // --- Cloudinary Server-Side Upload Helper ---
  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dtpqjzpnz';
  const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
  const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '222847537577522';

  const uploadToCloudinaryServer = async (fileObj, folder = 'averqon') => {
    try {
      if (!fileObj) return null;
      const filePath = fileObj.path;
      if (!fs.existsSync(filePath)) return null;

      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: fileObj.mimetype || 'image/png' });
      const formData = new FormData();
      formData.append('file', blob, fileObj.originalname || 'upload.png');
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      if (CLOUDINARY_API_KEY) formData.append('api_key', CLOUDINARY_API_KEY);
      if (folder) formData.append('folder', folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      // Clean up local temp file
      try { fs.unlinkSync(filePath); } catch (_) {}

      if (data.secure_url) {
        return { success: true, url: data.secure_url, publicId: data.public_id };
      }
      return { success: false, error: data.error?.message || 'Cloudinary upload failed' };
    } catch (err) {
      console.error('[SERVER] Cloudinary upload error:', err.message);
      return { success: false, error: err.message };
    }
  };

  // Dedicated Cloudinary Image Upload API
  app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
      const folder = req.body.folder || 'averqon/general';
      const result = await uploadToCloudinaryServer(req.file, folder);
      if (result && result.success) {
        return res.json({ success: true, url: result.url, publicId: result.publicId });
      }
      return res.status(500).json({ error: result?.error || 'Failed to upload image to Cloudinary' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

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
      const jobs = await Models.JobPosting.find({
        $or: [
          { isActive: true },
          { isActive: 'true' },
          { isActive: { $exists: false } },
          { status: 'Open' }
        ]
      }).sort({ postedDate: -1, _id: -1 });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Portfolio / Showcase Projects API ---
  app.get('/api/portfolio-projects', async (req, res) => {
    try {
      const filter = {
        $or: [
          { isActive: true },
          { isActive: 'true' },
          { isActive: { $exists: false } }
        ]
      };
      if (req.query.featured === 'true') {
        filter.featured = { $in: [true, 'true'] };
      }
      const projects = await Models.PortfolioProject.find(filter).sort({ order: 1, createdAt: -1, _id: -1 });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/portfolio-projects', upload.single('imageFile'), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        const cRes = await uploadToCloudinaryServer(req.file, 'averqon/portfolio');
        data.image = (cRes && cRes.success) ? cRes.url : `/uploads/${req.file.filename}`;
      }
      if (typeof data.technologies === 'string') {
        data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
      const project = await Models.PortfolioProject.create(data);
      res.json({ success: true, project });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/portfolio-projects/:id', upload.single('imageFile'), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        const cRes = await uploadToCloudinaryServer(req.file, 'averqon/portfolio');
        data.image = (cRes && cRes.success) ? cRes.url : `/uploads/${req.file.filename}`;
      }
      if (typeof data.technologies === 'string') {
        data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
      const project = await Models.PortfolioProject.findByIdAndUpdate(req.params.id, data, { new: true });
      res.json({ success: true, project });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/portfolio-projects/:id', async (req, res) => {
    try {
      await Models.PortfolioProject.findByIdAndDelete(req.params.id);
      res.json({ success: true });
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
      if (req.file) {
        if (req.file.mimetype && req.file.mimetype.startsWith('image/')) {
          const cRes = await uploadToCloudinaryServer(req.file, 'averqon/support');
          ticketData.attachmentUrl = (cRes && cRes.success) ? cRes.url : `/uploads/${req.file.filename}`;
        } else {
          ticketData.attachmentUrl = `/uploads/${req.file.filename}`;
        }
      }

      ticketData.history = [{
        action: 'Ticket Created',
        performedBy: ticketData.userName || 'Requester',
        details: `Ticket submitted with priority ${ticketData.priority || 'Medium'}`,
        timestamp: new Date()
      }];

      const ticket = await Models.Ticket.create(ticketData);

      // Send email notifications asynchronously
      sendTicketNotificationEmail(ticket).catch(err => {
        console.error('[SERVER] Failed to send admin ticket notification email:', err);
      });
      sendCustomerTicketConfirmationEmail(ticket).catch(err => {
        console.error('[SERVER] Failed to send customer ticket confirmation email:', err);
      });

      res.json({ success: true, ticketId: ticket.ticketId, ticket });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin / General Ticket Listing with Filtering & Search
  app.get('/api/admin/tickets', async (req, res) => {
    try {
      const { search, status, priority, category, department, ticketType } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (category) filter.category = category;
      if (department) filter.department = department;
      if (ticketType) filter.ticketType = ticketType;

      if (search) {
        filter.$or = [
          { ticketId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { userName: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const tickets = await Models.Ticket.find(filter).sort({ createdAt: -1 });

      const [total, open, inProgress, pending, resolved, closed, reopened, highPriority, urgent] = await Promise.all([
        Models.Ticket.countDocuments(),
        Models.Ticket.countDocuments({ status: 'Open' }),
        Models.Ticket.countDocuments({ status: 'In Progress' }),
        Models.Ticket.countDocuments({ status: 'Pending' }),
        Models.Ticket.countDocuments({ status: 'Resolved' }),
        Models.Ticket.countDocuments({ status: 'Closed' }),
        Models.Ticket.countDocuments({ status: 'Reopened' }),
        Models.Ticket.countDocuments({ priority: 'High' }),
        Models.Ticket.countDocuments({ priority: 'Urgent' }),
      ]);

      res.json({
        tickets,
        stats: {
          total, open, inProgress, pending, resolved, closed, reopened, highPriority, urgent
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/support/tickets/:ticketId', async (req, res) => {
    try {
      const { email } = req.query;
      const cleanTicketId = (req.params.ticketId || '').trim();
      const cleanEmail = (email || '').trim();

      const query = {
        ticketId: { $regex: `^${cleanTicketId.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, $options: 'i' }
      };
      if (cleanEmail) {
        query.userEmail = { $regex: `^${cleanEmail.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, $options: 'i' };
      }

      const ticket = await Models.Ticket.findOne(query);
      if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found with provided ID and Email.' });
      res.json({ success: true, ticket });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Ticket Update Endpoint (Status, Assignee, Notes, Priority, History)
  app.put('/api/support/tickets/:ticketId', async (req, res) => {
    try {
      const ticket = await Models.Ticket.findOne({ ticketId: req.params.ticketId });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

      const previousStatus = ticket.status;
      const { 
        status, 
        priority, 
        assignedTeam, 
        dueDate, 
        adminNotes, 
        resolutionNotes, 
        updatedBy,
        comment 
      } = req.body;

      const actor = updatedBy || 'Admin';
      let statusChanged = false;

      if (status && status !== previousStatus) {
        statusChanged = true;
        ticket.status = status;
        ticket.history.push({
          action: `Status Changed from ${previousStatus} to ${status}`,
          performedBy: actor,
          details: resolutionNotes ? `Resolution: ${resolutionNotes}` : `Status updated`,
          timestamp: new Date()
        });
      }

      if (priority && priority !== ticket.priority) {
        ticket.history.push({
          action: `Priority Changed from ${ticket.priority} to ${priority}`,
          performedBy: actor,
          timestamp: new Date()
        });
        ticket.priority = priority;
      }

      if (assignedTeam && assignedTeam !== ticket.assignedTeam) {
        ticket.history.push({
          action: `Assigned Team Changed to ${assignedTeam}`,
          performedBy: actor,
          timestamp: new Date()
        });
        ticket.assignedTeam = assignedTeam;
      }

      if (dueDate) ticket.dueDate = dueDate;
      if (adminNotes !== undefined) ticket.adminNotes = adminNotes;
      if (resolutionNotes !== undefined) ticket.resolutionNotes = resolutionNotes;

      if (comment) {
        ticket.comments.push({
          sender: actor,
          senderRole: 'Agent',
          message: comment,
          timestamp: new Date()
        });
        ticket.history.push({
          action: 'Comment Added',
          performedBy: actor,
          details: comment,
          timestamp: new Date()
        });
      }

      await ticket.save();

      // Send Status Update Email if status changed
      if (statusChanged) {
        sendTicketStatusUpdateEmail(ticket, previousStatus, status, {
          actorName: actor,
          comments: comment,
          resolutionNotes
        }).catch(err => {
          console.error('[SERVER] Failed to send status update email:', err);
        });
      }

      res.json({ success: true, ticket });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/support/tickets/:ticketId/comments', async (req, res) => {
    try {
      const { senderRole, message, senderName: customSender } = req.body;
      const ticket = await Models.Ticket.findOne({ ticketId: req.params.ticketId });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

      const senderName = customSender || (senderRole === 'Client' ? ticket.userName : 'Averqon Agent');
      ticket.comments.push({
        sender: senderName,
        senderRole,
        message,
        timestamp: new Date()
      });

      ticket.history.push({
        action: 'Comment Added',
        performedBy: senderName,
        details: message,
        timestamp: new Date()
      });

      await ticket.save();

      // If reply is from support agent/admin, send email update to customer
      if (senderRole !== 'Client') {
        sendCustomerTicketUpdateEmail(ticket, {
          commentMessage: message,
          senderName
        }).catch(err => {
          console.error('[SERVER] Failed to send customer comment update email:', err);
        });
      }

      res.json({ success: true, comments: ticket.comments, history: ticket.history });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Manual Email Dispatch Endpoint
  app.post('/api/support/tickets/:ticketId/send-email', async (req, res) => {
    try {
      const ticket = await Models.Ticket.findOne({ ticketId: req.params.ticketId });
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

      const actor = req.body.performedBy || 'Admin';

      ticket.history.push({
        action: 'Manual Email Dispatched',
        performedBy: actor,
        details: `Email notification sent manually to admin & customer (${ticket.userEmail})`,
        timestamp: new Date()
      });
      await ticket.save();

      // Trigger email sending
      const adminRes = await sendTicketNotificationEmail(ticket);
      const customerRes = await sendCustomerTicketConfirmationEmail(ticket);

      res.json({
        success: true,
        message: `Email notification sent for ticket #${ticket.ticketId}`,
        adminResult: adminRes,
        customerResult: customerRes,
        history: ticket.history
      });
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
        totalEmp, interns, activeProjectsCount, totalPortfolioProjects, pendingTasksCount,
        totalLeads, totalDeals,
        totalTickets, openTickets, closedTickets,
        revenueDataAggregate, overdueInvoices,
        projects, portfolioProjects, tasks, activities, meetings, 
        financeRecords, recentLeads, recentDeals, recentInvoices, recentBills
      ] = await Promise.all([
        Models.Employee.countDocuments(),
        Models.Intern.countDocuments(),
        Models.Project.countDocuments({ status: { $ne: 'Completed' } }),
        Models.PortfolioProject.countDocuments({ isActive: true }),
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
        Models.Project.find().limit(10).sort({ createdAt: -1, _id: -1 }),
        Models.PortfolioProject.find().limit(10).sort({ order: 1, createdAt: -1, _id: -1 }),
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

      const totalOperationsProjects = await Models.Project.countDocuments();

      // Renewal & Upsell Metrics & Forecast
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const in30Days = new Date(today.getTime() + 30 * 86400000);
      const in60Days = new Date(today.getTime() + 60 * 86400000);
      const in90Days = new Date(today.getTime() + 90 * 86400000);

      const [
        allServices,
        recentRenewalHistory,
        openUpsellsList,
        upsellAgg
      ] = await Promise.all([
        Models.ServiceRenewal.find().sort({ expiryDate: 1 }),
        Models.RenewalHistory.find().sort({ renewedAt: -1 }).limit(15),
        Models.UpsellOpportunity.find().sort({ nextFollowupDate: 1 }),
        Models.UpsellOpportunity.aggregate([
          { $match: { status: { $nin: ['Won', 'Lost'] } } },
          { $group: { _id: null, totalValue: { $sum: '$estimatedValue' }, count: { $sum: 1 } } }
        ])
      ]);

      let upcomingRenewalsCount = 0;
      let overdueServicesCount = 0;
      let expectedRenewalRevenue = 0;
      let forecast30 = 0;
      let forecast60 = 0;
      let forecast90 = 0;

      for (const s of allServices) {
        if (!s.expiryDate || s.status === 'Cancelled') continue;
        const exp = new Date(s.expiryDate);
        const amt = s.renewalAmount || 0;

        if (exp < today && s.status !== 'Renewed') {
          overdueServicesCount++;
        } else if (exp >= today && exp <= in30Days) {
          upcomingRenewalsCount++;
          forecast30 += amt;
        } else if (exp > in30Days && exp <= in60Days) {
          forecast60 += amt;
        } else if (exp > in60Days && exp <= in90Days) {
          forecast90 += amt;
        }

        if (exp >= today && exp <= in90Days) {
          expectedRenewalRevenue += amt;
        }
      }

      res.json({
        stats: {
          totalEmployees: totalEmp,
          totalInterns: interns,
          activeProjects: activeProjectsCount,
          totalProjects: totalOperationsProjects,
          totalPortfolioProjects,
          pendingTasks: pendingTasksCount,
          totalLeads,
          totalDeals,
          monthlyRevenue: monthlyRevenue[5] || 0,
          pendingPayments: overdueInvoices[0]?.total || 0,
          ticketMetrics: { 
            total: totalTickets, 
            open: openTickets, 
            inProgress: await Models.Ticket.countDocuments({ status: 'In Progress' }),
            pending: await Models.Ticket.countDocuments({ status: 'Pending' }),
            resolved: await Models.Ticket.countDocuments({ status: 'Resolved' }),
            closed: closedTickets,
            reopened: await Models.Ticket.countDocuments({ status: 'Reopened' }),
            highPriority: await Models.Ticket.countDocuments({ priority: 'High' }),
            urgent: await Models.Ticket.countDocuments({ priority: 'Urgent' })
          },
          attendanceRate: 94,
          renewalStats: {
            upcomingRenewalsCount,
            overdueServicesCount,
            expectedRenewalRevenue,
            openUpsellsCount: upsellAgg[0]?.count || 0,
            openUpsellsValue: upsellAgg[0]?.totalValue || 0,
            revenueForecast: {
              next30Days: forecast30,
              next60Days: forecast60,
              next90Days: forecast90,
              total90Days: forecast30 + forecast60 + forecast90
            }
          },
          clientSummary: {
            totalConfirmedClients: await Models.Client.countDocuments({ status: { $in: ['Active', 'Confirmed'] } }),
            totalProjectValue: 82000,
            totalRecordedPayments: 82000,
            recordedOutstandingBalance: 0,
            totalTestimonials: await Models.ClientFeedback.countDocuments(),
            testimonialsAwaitingApproval: await Models.ClientFeedback.countDocuments({
              status: { $in: ['Draft', 'Awaiting Client Approval', 'Awaiting Publication Consent', 'Pending Review'] }
            }),
            publishedTestimonials: await Models.ClientFeedback.countDocuments({
              status: 'Published',
              publicationConsent: true
            }),
            upcomingRenewalReviews: await Models.ServiceRenewal.countDocuments({ status: 'Active' }),
            pendingMaintenanceFollowups: 1, // Peeyem Traders follow-up August 19, 2027
            clientsList: await Models.Client.find({ clientName: { $in: ['MaxxJoy Tours', 'RetroStylings', 'Psychologist', 'Peeyem Traders', 'Dr. R. Murugadoss'] } }).lean(),
            projectsList: await Models.Project.find({ client: { $in: ['MaxxJoy Tours', 'RetroStylings', 'Psychologist', 'Peeyem Traders', 'Dr. R. Murugadoss'] } }).lean(),
            testimonialsList: await Models.ClientFeedback.find({ clientName: { $in: ['MaxxJoy Tours', 'RetroStylings', 'Psychologist', 'Peeyem Traders', 'Dr. R. Murugadoss'] } }).sort({ createdAt: -1 }).lean()
          }
        },
        monthlyRevenue: {
          data: monthlyRevenue,
          labels: monthlyLabels
        },
        projects,
        portfolioProjects,
        tasks,
        activities,
        meetings,
        finance: formattedFinance,
        leads: recentLeads,
        deals: recentDeals,
        invoices: recentInvoices,
        bills: recentBills,
        services: allServices,
        renewalHistory: recentRenewalHistory,
        upsellOpportunities: openUpsellsList
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===================== RENEWALS & POST-DELIVERY SERVICES APIS =====================

  // List all services with filters
  app.get('/api/admin/services', async (req, res) => {
    try {
      const { clientName, projectName, status, serviceType, search } = req.query;
      const query = {};
      if (clientName) query.clientName = clientName;
      if (projectName) query.projectName = projectName;
      if (status && status !== 'All') query.status = status;
      if (serviceType && serviceType !== 'All') query.serviceType = serviceType;
      if (search) {
        query.$or = [
          { serviceName: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
          { projectName: { $regex: search, $options: 'i' } }
        ];
      }
      const services = await Models.ServiceRenewal.find(query).sort({ expiryDate: 1 });
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create new service
  app.post('/api/admin/services', async (req, res) => {
    try {
      const service = await Models.ServiceRenewal.create(req.body);
      await Models.Activity.create({
        user: 'Admin',
        action: `Created new service: ${service.serviceName} for ${service.clientName}`,
        target: 'Service',
        time: new Date()
      });
      res.status(201).json({ success: true, service });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update service
  app.put('/api/admin/services/:id', async (req, res) => {
    try {
      const service = await Models.ServiceRenewal.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, service });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete service
  app.delete('/api/admin/services/:id', async (req, res) => {
    try {
      await Models.ServiceRenewal.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Renew a service and record renewal history (Preserve Renewal History)
  app.post('/api/admin/services/:id/renew', async (req, res) => {
    try {
      const { newExpiryDate, renewalPrice, generateInvoice, invoiceReference, notes, paymentRecordId } = req.body;
      const service = await Models.ServiceRenewal.findById(req.params.id);
      if (!service) return res.status(404).json({ error: 'Service not found' });

      const price = Number(renewalPrice) || service.renewalAmount;
      const newExpiry = newExpiryDate ? new Date(newExpiryDate) : new Date(new Date(service.expiryDate).getTime() + 365 * 86400000);

      // Verify payment record if paymentRecordId is provided
      let verifiedPayment = null;
      if (paymentRecordId) {
        verifiedPayment = await Models.Revenue.findOne({
          $or: [{ revenueId: paymentRecordId }, { _id: paymentRecordId }],
          status: 'Paid'
        });
      }

      // Rule: Never automatically mark an invoice as paid without a verified payment record.
      const paymentStatus = verifiedPayment ? 'Paid' : 'Pending';

      // Reuse existing Invoice table if generateInvoice is true
      let createdInvoice = null;
      let finalInvoiceRef = invoiceReference || service.latestInvoiceReference;

      if (generateInvoice) {
        createdInvoice = await Models.Invoice.create({
          clientName: service.clientName,
          projectName: service.projectName || service.serviceName,
          invoiceAmount: price,
          taxAmount: 0,
          discountAmount: 0,
          dueDate: newExpiry,
          status: paymentStatus === 'Paid' ? 'Paid' : 'Pending',
          paymentDate: paymentStatus === 'Paid' ? new Date() : null
        });
        finalInvoiceRef = createdInvoice.invoiceId;
      }

      // Create new Renewal History record retaining previous period
      const historyRecord = await Models.RenewalHistory.create({
        serviceId: service._id,
        serviceIdentifier: service.serviceId,
        serviceName: service.serviceName,
        clientName: service.clientName,
        projectName: service.projectName,
        previousPeriodStart: service.startDate,
        previousExpiryDate: service.expiryDate,
        newPeriodStart: service.expiryDate,
        newExpiryDate: newExpiry,
        renewalPrice: price,
        invoiceReference: finalInvoiceRef,
        invoiceId: createdInvoice?._id,
        paymentStatus,
        paymentRecordId: verifiedPayment ? (verifiedPayment.revenueId || verifiedPayment._id) : null,
        renewedAt: new Date(),
        renewedBy: req.session?.adminUser?.email || 'Admin',
        notes: notes || `Service renewed successfully for period ending ${newExpiry.toLocaleDateString()}`
      });

      // Update service with new period
      service.startDate = service.expiryDate;
      service.expiryDate = newExpiry;
      service.renewalAmount = price;
      service.status = 'Renewed';
      service.latestInvoiceReference = finalInvoiceRef;
      service.latestPaymentStatus = paymentStatus;
      await service.save();

      // Log activity
      await Models.Activity.create({
        user: req.session?.adminUser?.email || 'Admin',
        action: `Renewed service: ${service.serviceName} for ${service.clientName} (₹${price.toLocaleString()})`,
        target: 'Renewal',
        time: new Date()
      });

      res.json({
        success: true,
        service,
        history: historyRecord,
        invoice: createdInvoice
      });
    } catch (err) {
      console.error('[Renew API Error]', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get service renewal history
  app.get('/api/admin/services/:id/history', async (req, res) => {
    try {
      const history = await Models.RenewalHistory.find({ serviceId: req.params.id }).sort({ renewedAt: -1 });
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all renewal history
  app.get('/api/admin/renewals/history', async (req, res) => {
    try {
      const history = await Models.RenewalHistory.find().sort({ renewedAt: -1 }).limit(100);
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Client-specific services & history
  app.get('/api/admin/clients/:clientName/services', async (req, res) => {
    try {
      const clientName = decodeURIComponent(req.params.clientName);
      const services = await Models.ServiceRenewal.find({ clientName }).sort({ expiryDate: 1 });
      const history = await Models.RenewalHistory.find({ clientName }).sort({ renewedAt: -1 });
      res.json({ services, history });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Project-specific services & history
  app.get('/api/admin/projects/:projectName/services', async (req, res) => {
    try {
      const projectName = decodeURIComponent(req.params.projectName);
      const services = await Models.ServiceRenewal.find({ projectName }).sort({ expiryDate: 1 });
      const history = await Models.RenewalHistory.find({ projectName }).sort({ renewedAt: -1 });
      res.json({ services, history });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===================== UPSELL OPPORTUNITIES APIS =====================

  // Get client upsells
  app.get('/api/admin/clients/:clientName/upsells', async (req, res) => {
    try {
      const clientName = decodeURIComponent(req.params.clientName);
      const upsells = await Models.UpsellOpportunity.find({ clientName }).sort({ createdAt: -1 });
      res.json(upsells);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create upsell opportunity for client
  app.post('/api/admin/clients/:clientName/upsells', async (req, res) => {
    try {
      const clientName = decodeURIComponent(req.params.clientName);
      const opportunity = await Models.UpsellOpportunity.create({
        ...req.body,
        clientName
      });
      await Models.Activity.create({
        user: 'Admin',
        action: `Created upsell opportunity: "${opportunity.title}" for ${clientName}`,
        target: 'Upsell',
        time: new Date()
      });
      res.status(201).json({ success: true, opportunity });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update upsell opportunity
  app.put('/api/admin/upsells/:id', async (req, res) => {
    try {
      const opportunity = await Models.UpsellOpportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, opportunity });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Convert upsell opportunity into project (reusing existing project-creation workflow)
  app.post('/api/admin/upsells/:id/convert-to-project', async (req, res) => {
    try {
      const opportunity = await Models.UpsellOpportunity.findById(req.params.id);
      if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

      // Create new Project using existing model schema
      const project = await Models.Project.create({
        name: req.body.projectName || opportunity.title,
        client: opportunity.clientName,
        teamMembers: req.body.teamMembers || [],
        progress: 0,
        deadline: opportunity.nextFollowupDate || new Date(Date.now() + 30 * 86400000),
        status: 'Pending'
      });

      // Mark opportunity as Won and link project
      opportunity.status = 'Won';
      opportunity.convertedToProject = true;
      opportunity.convertedProjectId = project._id;
      opportunity.convertedProjectName = project.name;
      await opportunity.save();

      // Log activity
      await Models.Activity.create({
        user: req.session?.adminUser?.email || 'Admin',
        action: `Converted upsell "${opportunity.title}" to project "${project.name}" for ${opportunity.clientName}`,
        target: 'Project',
        time: new Date()
      });

      res.json({ success: true, project, opportunity });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trigger manual check and dispatch of renewal email reminders
  app.post('/api/admin/renewals/check-reminders', async (req, res) => {
    try {
      const report = await checkAndDispatchRenewalReminders();
      res.json({ success: true, report });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ===================== CLIENT FEEDBACK & TESTIMONIAL APIS =====================

  // 1. Public Testimonials Endpoint (only returns published testimonials with explicit publication consent)
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await Models.ClientFeedback.find({
        status: 'Published',
        publicationConsent: true
      })
      .sort({ rating: -1, publishedAt: -1, createdAt: -1 })
      .limit(20)
      .lean();

      // Sanitize fields - never expose private emails or unconsented info
      const sanitized = testimonials.map(t => ({
        id: t.feedbackId,
        feedback: t.feedbackText,
        name: t.identityDisplayConsent ? t.clientName : 'Verified Client',
        company: t.identityDisplayConsent ? (t.organization || t.companyName || '') : '',
        designation: t.identityDisplayConsent ? (t.designation || '') : '',
        project: t.project,
        rating: t.rating || null,
        image: (t.imageDisplayConsent && t.photoUrl) ? t.photoUrl : null,
        publishedAt: t.publishedAt || t.createdAt
      }));

      res.json(sanitized);
    } catch (err) {
      console.error('Failed to fetch public testimonials:', err);
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  });

  // 2. Validate Public Feedback Link Token
  app.get('/api/public/feedback/:token', async (req, res) => {
    try {
      const { token } = req.params;
      if (!token) return res.status(400).json({ error: 'Token is required' });

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const request = await Models.FeedbackRequest.findOne({
        $or: [{ tokenHash }, { rawToken: token }]
      });

      if (!request) {
        return res.status(404).json({ error: 'Invalid or unknown feedback link. Please check your URL.' });
      }

      if (request.status === 'Revoked') {
        return res.status(403).json({ error: 'This feedback link has been revoked by an administrator.' });
      }

      if (request.status === 'Submitted') {
        return res.status(409).json({ error: 'Feedback has already been submitted for this request. Thank you!' });
      }

      if (new Date() > new Date(request.expiresAt)) {
        if (request.status !== 'Expired') {
          request.status = 'Expired';
          await request.save();
        }
        return res.status(410).json({ error: 'This feedback link expired on ' + new Date(request.expiresAt).toLocaleDateString() });
      }

      res.json({
        valid: true,
        requestId: request.requestId,
        clientName: request.clientName,
        companyName: request.companyName,
        email: request.email,
        project: request.project,
        expiresAt: request.expiresAt
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Submit Client Feedback
  app.post('/api/public/feedback/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const request = await Models.FeedbackRequest.findOne({
        $or: [{ tokenHash }, { rawToken: token }]
      });

      if (!request) {
        return res.status(404).json({ error: 'Invalid feedback link' });
      }
      if (request.status === 'Revoked') {
        return res.status(403).json({ error: 'This feedback link has been revoked' });
      }
      if (request.status === 'Submitted') {
        return res.status(409).json({ error: 'Feedback already submitted for this request' });
      }
      if (new Date() > new Date(request.expiresAt)) {
        return res.status(410).json({ error: 'This feedback link has expired' });
      }

      const {
        clientName,
        companyName,
        email,
        project,
        rating,
        qualityRating,
        communicationRating,
        deliveryRating,
        feedbackText,
        publicationConsent,
        identityDisplayConsent,
        imageDisplayConsent,
        photoUrl
      } = req.body;

      if (!clientName || !email || !project || !feedbackText || !rating) {
        return res.status(400).json({ error: 'Client name, email, project, rating, and feedback text are required' });
      }

      const feedback = await Models.ClientFeedback.create({
        requestId: request.requestId,
        clientId: request.clientId,
        clientName: clientName.trim(),
        companyName: (companyName || request.companyName || '').trim(),
        email: email.trim().toLowerCase(),
        project: project.trim(),
        rating: Number(rating) || 5,
        qualityRating: Number(qualityRating) || 5,
        communicationRating: Number(communicationRating) || 5,
        deliveryRating: Number(deliveryRating) || 5,
        feedbackText: feedbackText.trim(),
        publicationConsent: Boolean(publicationConsent),
        identityDisplayConsent: Boolean(identityDisplayConsent),
        imageDisplayConsent: Boolean(imageDisplayConsent),
        photoUrl: photoUrl || null,
        status: 'Pending Review'
      });

      // Update FeedbackRequest status
      request.status = 'Submitted';
      request.submittedAt = new Date();
      await request.save();

      // Create Audit Log
      await Models.FeedbackAuditLog.create({
        feedbackId: feedback.feedbackId,
        requestId: request.requestId,
        actorId: 'Client (' + clientName + ')',
        action: 'submitted_feedback',
        newValues: {
          rating: feedback.rating,
          publicationConsent: feedback.publicationConsent,
          identityDisplayConsent: feedback.identityDisplayConsent
        },
        ipAddress: req.ip
      });

      // Notify administrator via email
      sendFeedbackReceivedAdminNotification({
        clientName: feedback.clientName,
        companyName: feedback.companyName,
        email: feedback.email,
        project: feedback.project,
        rating: feedback.rating,
        feedbackText: feedback.feedbackText,
        publicationConsent: feedback.publicationConsent
      }).catch(e => console.error('Admin feedback notification error:', e));

      res.status(201).json({
        success: true,
        message: 'Thank you for your valuable feedback!',
        feedbackId: feedback.feedbackId
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Admin: Get all feedback requests & statistics
  app.get('/api/admin/feedback-requests', async (req, res) => {
    try {
      const { status, search } = req.query;
      let query = {};
      if (status && status !== 'All') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { clientName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { project: { $regex: search, $options: 'i' } },
          { requestId: { $regex: search, $options: 'i' } }
        ];
      }

      const requests = await Models.FeedbackRequest.find(query).sort({ createdAt: -1 });

      // Automatically mark expired requests
      const now = new Date();
      for (const r of requests) {
        if (r.status === 'Pending' && new Date(r.expiresAt) < now) {
          r.status = 'Expired';
          await r.save();
        }
      }

      // Compute stats
      const [total, pending, submitted, expired, revoked] = await Promise.all([
        Models.FeedbackRequest.countDocuments(),
        Models.FeedbackRequest.countDocuments({ status: 'Pending' }),
        Models.FeedbackRequest.countDocuments({ status: 'Submitted' }),
        Models.FeedbackRequest.countDocuments({ status: 'Expired' }),
        Models.FeedbackRequest.countDocuments({ status: 'Revoked' })
      ]);

      res.json({
        requests,
        stats: { total, pending, submitted, expired, revoked }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Admin: Create a new feedback request & generate link
  app.post('/api/admin/feedback-requests', async (req, res) => {
    try {
      const { clientName, companyName, email, project, expiryDays, sendEmail, customMessage, clientId } = req.body;

      if (!clientName || !email || !project) {
        return res.status(400).json({ error: 'Client name, email, and project are required' });
      }

      const rawToken = crypto.randomBytes(24).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      const days = parseInt(expiryDays, 10) || 30;
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const request = await Models.FeedbackRequest.create({
        clientName: clientName.trim(),
        companyName: (companyName || '').trim(),
        email: email.trim().toLowerCase(),
        project: project.trim(),
        clientId: clientId || undefined,
        tokenHash,
        rawToken,
        expiresAt,
        status: 'Pending',
        createdBy: req.session?.adminUser?.email || 'Admin'
      });

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.get('host') || 'localhost:3000';
      const feedbackUrl = `${protocol}://${host}/feedback/${rawToken}`;

      let emailStatus = null;
      if (sendEmail) {
        emailStatus = await sendFeedbackInviteEmail({
          clientName: request.clientName,
          email: request.email,
          project: request.project,
          feedbackUrl,
          expiresAt: request.expiresAt,
          customMessage
        });
      }

      // Audit Log
      await Models.FeedbackAuditLog.create({
        requestId: request.requestId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'created_request',
        newValues: {
          clientName: request.clientName,
          email: request.email,
          project: request.project,
          expiresAt: request.expiresAt,
          sentEmail: Boolean(sendEmail)
        }
      });

      res.status(201).json({
        success: true,
        request,
        token: rawToken,
        feedbackUrl,
        emailStatus
      });
    } catch (err) {
      console.error('Failed to create feedback request:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Admin: Revoke feedback link
  app.post('/api/admin/feedback-requests/:id/revoke', async (req, res) => {
    try {
      const request = await Models.FeedbackRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: 'Feedback request not found' });

      const prevStatus = request.status;
      request.status = 'Revoked';
      await request.save();

      await Models.FeedbackAuditLog.create({
        requestId: request.requestId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'revoked_request',
        previousValues: { status: prevStatus },
        newValues: { status: 'Revoked' }
      });

      res.json({ success: true, request });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. Admin: Resend feedback invitation / extend link
  app.post('/api/admin/feedback-requests/:id/resend', async (req, res) => {
    try {
      const request = await Models.FeedbackRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: 'Feedback request not found' });

      // Extend expiration by 30 days if expired
      if (new Date(request.expiresAt) < new Date() || request.status === 'Expired') {
        request.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        request.status = 'Pending';
      }
      if (request.status === 'Revoked') {
        request.status = 'Pending';
      }

      await request.save();

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.get('host') || 'localhost:3000';
      const feedbackUrl = `${protocol}://${host}/feedback/${request.rawToken}`;

      let emailStatus = null;
      if (req.body.sendEmail !== false) {
        emailStatus = await sendFeedbackInviteEmail({
          clientName: request.clientName,
          email: request.email,
          project: request.project,
          feedbackUrl,
          expiresAt: request.expiresAt,
          customMessage: req.body.customMessage
        });
      }

      await Models.FeedbackAuditLog.create({
        requestId: request.requestId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'resent_request',
        newValues: { expiresAt: request.expiresAt }
      });

      res.json({ success: true, request, feedbackUrl, emailStatus });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. Admin: Reopen submitted feedback request
  app.post('/api/admin/feedback-requests/:id/reopen', async (req, res) => {
    try {
      const request = await Models.FeedbackRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ error: 'Feedback request not found' });

      request.status = 'Pending';
      request.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      await request.save();

      await Models.FeedbackAuditLog.create({
        requestId: request.requestId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'reopened_request',
        newValues: { status: 'Pending', expiresAt: request.expiresAt }
      });

      res.json({ success: true, request });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. Admin: Get all feedback submissions
  app.get('/api/admin/feedbacks', async (req, res) => {
    try {
      const { status, consent, search } = req.query;
      let query = {};

      if (status && status !== 'All') {
        query.status = status;
      }
      if (consent === 'granted') {
        query.publicationConsent = true;
      } else if (consent === 'denied') {
        query.publicationConsent = false;
      }

      if (search) {
        query.$or = [
          { clientName: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { project: { $regex: search, $options: 'i' } },
          { feedbackId: { $regex: search, $options: 'i' } }
        ];
      }

      const feedbacks = await Models.ClientFeedback.find(query).sort({ createdAt: -1 });

      const [total, pendingReview, approved, published, rejected, consentedCount] = await Promise.all([
        Models.ClientFeedback.countDocuments(),
        Models.ClientFeedback.countDocuments({ status: 'Pending Review' }),
        Models.ClientFeedback.countDocuments({ status: 'Approved' }),
        Models.ClientFeedback.countDocuments({ status: 'Published' }),
        Models.ClientFeedback.countDocuments({ status: 'Rejected' }),
        Models.ClientFeedback.countDocuments({ publicationConsent: true })
      ]);

      const avgAgg = await Models.ClientFeedback.aggregate([
        { $match: { rating: { $gt: 0 } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);
      const avgRating = (avgAgg.length > 0 && typeof avgAgg[0].avgRating === 'number') 
        ? parseFloat(avgAgg[0].avgRating.toFixed(1)) 
        : 5.0;

      res.json({
        feedbacks,
        stats: {
          total,
          pendingReview,
          approved,
          published,
          rejected,
          consentedCount,
          avgRating
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10. Admin: Update feedback moderation status (Approve, Reject, Publish, Unpublish, Archive)
  app.put('/api/admin/feedbacks/:id/status', async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const feedback = await Models.ClientFeedback.findById(req.params.id);
      if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

      // Verification constraint 1: Cannot publish if client did NOT grant publication consent
      if ((status === 'Approved' || status === 'Published') && !feedback.publicationConsent) {
        return res.status(400).json({
          error: 'Action Denied: This client has not granted explicit website publication consent. It must remain private for internal review only.'
        });
      }

      // Verification constraint 2: Cannot publish suggested draft without client approval
      if ((status === 'Approved' || status === 'Published') && feedback.source === 'Suggested Draft' && !feedback.clientApproved) {
        return res.status(400).json({
          error: 'Action Denied: Suggested draft has not been approved by the client yet. Obtain client approval first.'
        });
      }

      const prevStatus = feedback.status;
      feedback.status = status;
      if (adminNotes !== undefined) feedback.adminNotes = adminNotes;
      if (status === 'Published' || status === 'Approved') {
        feedback.publishedAt = feedback.publishedAt || new Date();
        feedback.approvedBy = req.session?.adminUser?.email || 'Admin';
        feedback.approvedAt = new Date();
      } else if (status === 'Rejected' || status === 'Archived') {
        feedback.publishedAt = null;
      }

      await feedback.save();

      await Models.FeedbackAuditLog.create({
        feedbackId: feedback.feedbackId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: `status_changed_to_${status.toLowerCase().replace(/\s+/g, '_')}`,
        previousValues: { status: prevStatus },
        newValues: { status: feedback.status, adminNotes: feedback.adminNotes },
        notes: adminNotes
      });

      res.json({ success: true, feedback });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10b. Admin: Record client approval and/or publication consent
  app.put('/api/admin/feedbacks/:id/consent-approval', async (req, res) => {
    try {
      const feedback = await Models.ClientFeedback.findById(req.params.id);
      if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

      const prevValues = {
        clientApproved: feedback.clientApproved,
        publicationConsent: feedback.publicationConsent,
        status: feedback.status
      };

      if (req.body.clientApproved !== undefined) {
        feedback.clientApproved = Boolean(req.body.clientApproved);
        if (feedback.clientApproved) feedback.clientApprovalDate = new Date();
      }

      if (req.body.publicationConsent !== undefined) {
        feedback.publicationConsent = Boolean(req.body.publicationConsent);
        if (feedback.publicationConsent) feedback.publicationConsentDate = new Date();
      }

      if (req.body.identityDisplayConsent !== undefined) {
        feedback.identityDisplayConsent = Boolean(req.body.identityDisplayConsent);
      }

      if (req.body.imageDisplayConsent !== undefined) {
        feedback.imageDisplayConsent = Boolean(req.body.imageDisplayConsent);
      }

      // If both client approval and publication consent are given, advance to Approved or Published
      if (req.body.status) {
        feedback.status = req.body.status;
      } else if (feedback.clientApproved && feedback.publicationConsent && feedback.status === 'Draft') {
        feedback.status = 'Approved';
      }

      await feedback.save();

      await Models.FeedbackAuditLog.create({
        feedbackId: feedback.feedbackId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'consent_and_approval_updated',
        previousValues,
        newValues: {
          clientApproved: feedback.clientApproved,
          publicationConsent: feedback.publicationConsent,
          status: feedback.status
        }
      });

      res.json({ success: true, feedback });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10c. Admin: Create testimonial / draft directly
  app.post('/api/admin/feedbacks', async (req, res) => {
    try {
      const {
        clientName,
        companyName,
        organization,
        designation,
        project,
        feedbackText,
        source = 'Suggested Draft',
        status = 'Draft',
        clientApproved = false,
        publicationConsent = false,
        adminNotes
      } = req.body;

      if (!clientName || !project || !feedbackText) {
        return res.status(400).json({ error: 'Client name, project, and testimonial text are required.' });
      }

      const client = await Models.Client.findOne({ clientName: new RegExp(`^${clientName.trim()}$`, 'i') });
      const proj = await Models.Project.findOne({ name: new RegExp(`^${project.trim()}$`, 'i') });

      const feedback = await Models.ClientFeedback.create({
        clientName: clientName.trim(),
        clientId: client?._id,
        projectId: proj?._id,
        companyName: (companyName || client?.company || '').trim(),
        organization: (organization || client?.organization || '').trim(),
        designation: (designation || client?.designation || '').trim(),
        project: project.trim(),
        feedbackText: feedbackText.trim(),
        draftText: feedbackText.trim(),
        source,
        status,
        clientApproved: Boolean(clientApproved),
        publicationConsent: Boolean(publicationConsent),
        adminNotes
      });

      await Models.FeedbackAuditLog.create({
        feedbackId: feedback.feedbackId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'created_testimonial_draft',
        newValues: { clientName, project, status, source }
      });

      res.json({ success: true, feedback });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. Admin: Edit feedback text or details with audit history
  app.put('/api/admin/feedbacks/:id/edit', async (req, res) => {
    try {
      const feedback = await Models.ClientFeedback.findById(req.params.id);
      if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

      const prevValues = {
        feedbackText: feedback.feedbackText,
        project: feedback.project,
        rating: feedback.rating,
        identityDisplayConsent: feedback.identityDisplayConsent,
        imageDisplayConsent: feedback.imageDisplayConsent
      };

      const { feedbackText, project, rating, identityDisplayConsent, imageDisplayConsent, adminNotes } = req.body;
      if (feedbackText) feedback.feedbackText = feedbackText.trim();
      if (project) feedback.project = project.trim();
      if (rating) feedback.rating = Number(rating);
      if (identityDisplayConsent !== undefined) feedback.identityDisplayConsent = Boolean(identityDisplayConsent);
      if (imageDisplayConsent !== undefined) feedback.imageDisplayConsent = Boolean(imageDisplayConsent);
      if (adminNotes) feedback.adminNotes = adminNotes;

      await feedback.save();

      await Models.FeedbackAuditLog.create({
        feedbackId: feedback.feedbackId,
        actorId: req.session?.adminUser?.email || 'Admin',
        action: 'edited_feedback_content',
        previousValues: prevValues,
        newValues: {
          feedbackText: feedback.feedbackText,
          project: feedback.project,
          rating: feedback.rating,
          identityDisplayConsent: feedback.identityDisplayConsent,
          imageDisplayConsent: feedback.imageDisplayConsent
        },
        notes: adminNotes || 'Edited by admin'
      });

      res.json({ success: true, feedback });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 12. Admin: Get audit logs for feedback
  app.get('/api/admin/feedbacks/audit-logs', async (req, res) => {
    try {
      const { feedbackId, requestId } = req.query;
      let query = {};
      if (feedbackId) query.feedbackId = feedbackId;
      if (requestId) query.requestId = requestId;

      const logs = await Models.FeedbackAuditLog.find(query).sort({ createdAt: -1 }).limit(100);
      res.json(logs);
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

  app.get('/api/admin/sales/overview', async (req, res) => {
    try {
      const leadStatuses = ['New','Contacted','Qualified','Proposal Sent','Converted','Closed'];
      const dealStatuses = ['Open','Negotiation','Proposal Sent','Won','Lost'];

      const [
        leads,
        deals,
        leadCounts,
        dealCounts,
        pipelineValueAgg,
        wonValueAgg,
        forecastValueAgg,
        dealValueByStatus
      ] = await Promise.all([
        Models.Lead.find().sort({ createdAt: -1 }).limit(8),
        Models.Deal.find().sort({ createdAt: -1 }).limit(8),
        Promise.all(leadStatuses.map(async status => [status, await Models.Lead.countDocuments({ status })])),
        Promise.all(dealStatuses.map(async status => [status, await Models.Deal.countDocuments({ status })])),
        Models.Deal.aggregate([
          { $match: { status: { $nin: ['Won', 'Lost'] } } },
          { $group: { _id: null, total: { $sum: '$dealValue' } } }
        ]),
        Models.Deal.aggregate([
          { $match: { status: 'Won' } },
          { $group: { _id: null, total: { $sum: '$dealValue' } } }
        ]),
        Models.Deal.aggregate([
          { $match: { status: { $nin: ['Won', 'Lost'] } } },
          { $group: { _id: null, total: { $sum: { $multiply: ['$dealValue', { $divide: ['$probability', 100] }] } } } }
        ]),
        Models.Deal.aggregate([
          { $group: { _id: '$status', total: { $sum: '$dealValue' } } }
        ])
      ]);

      const leadStats = Object.fromEntries(leadCounts);
      const dealStats = Object.fromEntries(dealCounts);
      const totalLeads = Object.values(leadStats).reduce((sum, count) => sum + count, 0);
      const totalDeals = Object.values(dealStats).reduce((sum, count) => sum + count, 0);
      const convertedLeads = leadStats.Converted || 0;
      const wonDeals = dealStats.Won || 0;
      const valuesByStatus = Object.fromEntries(dealValueByStatus.map(item => [item._id, item.total]));

      res.json({
        stats: {
          totalLeads,
          totalDeals,
          convertedLeads,
          wonDeals,
          activeDeals: totalDeals - wonDeals - (dealStats.Lost || 0),
          pipelineValue: pipelineValueAgg[0]?.total || 0,
          wonValue: wonValueAgg[0]?.total || 0,
          forecastValue: forecastValueAgg[0]?.total || 0,
          leadConversionRate: totalLeads ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0,
          dealWinRate: totalDeals ? Number(((wonDeals / totalDeals) * 100).toFixed(1)) : 0
        },
        charts: {
          leadStatuses,
          leadCounts: leadStatuses.map(status => leadStats[status] || 0),
          dealStatuses,
          dealCounts: dealStatuses.map(status => dealStats[status] || 0),
          dealValues: dealStatuses.map(status => valuesByStatus[status] || 0)
        },
        leads,
        deals
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

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

  // Employee Password Change
  app.post('/api/employee/change-password', authenticateEmployee, async (req, res) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const employee = await Models.Employee.findByIdAndUpdate(
        req.employee.id,
        { password: hashedPassword },
        { new: true }
      );

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      await Models.Activity.create({
        user: employee.name,
        action: 'Updated account password',
        target: 'Account Security',
        time: new Date()
      });

      res.json({ success: true, message: 'Password updated successfully!' });
    } catch (err) {
      console.error('[CHANGE PASSWORD]', err);
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

      // Find projects the employee is part of
      const projects = await Models.Project.find({ teamMembers: { $in: [employee.name] } });
      const projectNames = projects.map(p => p.name);

      // Create a query that finds activities by the user OR activities mentioning their projects
      const query = {
        $or: [
          { user: employee.name },
          { 
            target: { $in: ['Project', 'Task'] },
            action: { $regex: projectNames.length > 0 ? projectNames.join('|') : 'NONE_EXISTENT_PROJECT', $options: 'i' }
          }
        ]
      };

      const activities = await Models.Activity.find(query).sort({ time: -1 }).limit(50);
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

  // --- Dynamic RBAC Helper Middleware ---
  const checkPagePermission = (pageName) => {
    return async (req, res, next) => {
      try {
        const employee = await Models.Employee.findById(req.employee.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        
        const allowed = employee.allowedPages || [];
        if (allowed.includes(pageName)) {
          req.employeeDoc = employee;
          return next();
        }
        return res.status(403).json({ error: `Forbidden: Access to '${pageName}' is disabled` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
  };

  // --- Admin Access Endpoints in Employee Portal ---
  app.get('/api/employee/admin/employees', authenticateEmployee, checkPagePermission('Admins'), async (req, res) => {
    try {
      const employees = await Models.Employee.find().select('-password').sort({ name: 1 });
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/employee/admin/access/:id', authenticateEmployee, checkPagePermission('Admins'), async (req, res) => {
    try {
      const { allowedPages, reportingManager } = req.body;
      const updateData = {};

      if (Array.isArray(allowedPages)) {
        updateData.allowedPages = allowedPages;
      }
      if (reportingManager !== undefined) {
        updateData.reportingManager = reportingManager;
      }

      const employee = await Models.Employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select('-password');
      
      await Models.Activity.create({
        user: req.employeeDoc.name,
        action: `Updated access permissions & reporting manager for ${employee.name}`,
        target: 'System',
        time: new Date()
      });

      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- System Settings Endpoints in Employee Portal ---
  app.get('/api/employee/admin/settings', authenticateEmployee, async (req, res) => {
    try {
      let setting = await Models.Setting.findOne();
      if (!setting) {
        setting = await Models.Setting.create({
          companyName: 'Averqon',
          theme: 'Light',
          language: 'English',
          timeZone: 'Asia/Kolkata'
        });
      }
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/employee/admin/settings/:id', authenticateEmployee, checkPagePermission('Settings'), async (req, res) => {
    try {
      const setting = await Models.Setting.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      await Models.Activity.create({
        user: req.employeeDoc.name,
        action: 'Updated global system settings',
        target: 'System',
        time: new Date()
      });

      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Sales & CRM Employee Endpoints ---
  app.get('/api/employee/sales/overview', authenticateEmployee, checkPagePermission('Sales Dashboard'), async (req, res) => {
    try {
      const [leadsCount, dealsCount, dealsPipeline, wonDeals] = await Promise.all([
        Models.Lead.countDocuments(),
        Models.Deal.countDocuments(),
        Models.Deal.aggregate([
          { $match: { status: { $nin: ['Won', 'Lost'] } } },
          { $group: { _id: null, total: { $sum: '$dealValue' } } }
        ]),
        Models.Deal.aggregate([
          { $match: { status: 'Won' } },
          { $group: { _id: null, total: { $sum: '$dealValue' } } }
        ])
      ]);

      const leadStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Closed'];
      const leadCounts = await Promise.all(leadStatuses.map(status => Models.Lead.countDocuments({ status })));

      const dealStatuses = ['Open', 'Negotiation', 'Proposal Sent', 'Won', 'Lost'];
      const dealCounts = await Promise.all(dealStatuses.map(status => Models.Deal.countDocuments({ status })));
      
      const [recentLeads, recentDeals] = await Promise.all([
        Models.Lead.find().sort({ createdAt: -1 }).limit(5),
        Models.Deal.find().sort({ createdAt: -1 }).limit(5)
      ]);

      res.json({
        stats: {
          totalLeads: leadsCount,
          totalDeals: dealsCount,
          pipelineValue: dealsPipeline[0]?.total || 0,
          wonValue: wonDeals[0]?.total || 0,
        },
        charts: {
          leadStatuses,
          leadCounts,
          dealStatuses,
          dealCounts
        },
        recentLeads,
        recentDeals
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/employee/sales/leads', authenticateEmployee, checkPagePermission('Leads'), async (req, res) => {
    try {
      const leads = await Models.Lead.find().sort({ createdAt: -1 });
      res.json(leads);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/employee/sales/deals', authenticateEmployee, checkPagePermission('Deals'), async (req, res) => {
    try {
      const deals = await Models.Deal.find().sort({ createdAt: -1 });
      res.json(deals);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/employees/all', async (req, res) => {
    try {
      const employees = await Models.Employee.find({}).select('name department designation status');
      res.json(employees);
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
      const { sender, receiver, content, message: bodyMessage, roomId, isGroup, time, timestamp } = req.body;
      const messageText = bodyMessage || content;
      if (!sender || !messageText) {
        return res.status(400).json({ error: 'Sender and message are required' });
      }

      const message = await Models.LiveChat.create({
        sender,
        receiver,
        message: messageText,
        roomId,
        isGroup: !!isGroup,
        timestamp: timestamp || time ? new Date(timestamp || time) : new Date()
      });

      if (roomId) {
        await Models.ChatRoom.findByIdAndUpdate(roomId, {
          lastMessage: messageText,
          updatedAt: new Date()
        });
      }

      res.json(message);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Get Chat History
  app.get('/api/chat/history/:roomId', async (req, res) => {
    try {
      const messages = await Models.LiveChat.find({ roomId: req.params.roomId })
        .sort({ timestamp: 1 })
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
      }).sort({ timestamp: 1 }).limit(100);
      res.json(messages);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Get Rooms
  app.get('/api/chat/rooms', async (req, res) => {
    try {
      const rooms = await Models.ChatRoom.find().sort({ updatedAt: -1 });
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/chat/rooms', async (req, res) => {
    const { name, participants, isPrivate } = req.body;
    try {
      const room = await Models.ChatRoom.create({ 
        name, 
        participants: participants || [], 
        isPrivate: isPrivate || false 
      });
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Recent Chats for a user
  app.get('/api/chat/recent/:username', async (req, res) => {
    try {
      const messages = await Models.LiveChat.find({
        $or: [{ sender: req.params.username }, { receiver: req.params.username }]
      }).sort({ timestamp: -1 }).limit(50);
      
      const contacts = new Set();
      messages.forEach(m => {
        if (!m.isGroup) {
          contacts.add(m.sender === req.params.username ? m.receiver : m.sender);
        }
      });
      res.json(Array.from(contacts));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Admin Project Management
  app.get('/api/admin/projects', async (req, res) => {
    try {
      const projects = await Models.Project.find().sort({ createdAt: -1, _id: -1 });
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

  // Lead Import API
  app.post('/api/admin/leads/import', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      
      // Multer with 'dest' provides 'path', not 'buffer'
      const content = fs.readFileSync(req.file.path).toString();
      let leads = [];
      
      if (req.file.originalname.endsWith('.json')) {
        leads = JSON.parse(content);
      } else {
        // Basic CSV parsing
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        leads = lines.slice(1).filter(l => l.trim()).map(line => {
          const values = line.split(',').map(v => v.trim());
          const lead = {};
          headers.forEach((h, i) => {
            if (values[i] !== undefined) lead[h] = values[i];
          });
          return lead;
        });
      }
      
      const results = await Models.Lead.insertMany(leads);
      
      // Clean up temp file
      fs.unlinkSync(req.file.path);
      
      res.json({ success: true, count: results.length });
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ error: err.message });
    }
  });

  // Product Inquiries & Quotation Requests
  app.post('/api/products/enquiry', async (req, res) => {
    try {
      const {
        productName = 'Crackers POS',
        customerName,
        shopName,
        email,
        phone,
        city,
        operationType,
        countersCount,
        gstin,
        address,
        notes
      } = req.body;

      if (!customerName || !phone) {
        return res.status(400).json({ error: 'Customer name and phone number are required.' });
      }

      // Save as lead for sales CRM
      const lead = await Models.Lead.create({
        leadName: customerName.trim(),
        companyName: (shopName || 'Retail Crackers Counter').trim(),
        phoneNumber: phone.trim(),
        email: (email || `${phone.replace(/\D/g, '')}@pos-lead.averqon.com`).trim(),
        leadSource: 'Website',
        status: 'New',
        notes: `[Product: ${productName}] City: ${city || 'N/A'} | Counters: ${countersCount || '1'} | Operation: ${operationType || 'Seasonal'} | GSTIN: ${gstin || 'N/A'} | Address: ${address || 'N/A'} | Notes: ${notes || 'N/A'}`
      });

      // Log system activity
      await Models.Activity.create({
        user: customerName.trim(),
        action: `Requested quote for ${productName}`,
        target: 'Product Enquiry',
        time: new Date()
      });

      // Dispatch direct email alert to averqonhq@gmail.com
      sendProductEnquiryAdminNotification({
        productName,
        customerName: customerName.trim(),
        shopName: (shopName || '').trim(),
        email: email ? email.trim() : '',
        phone: phone.trim(),
        city: (city || '').trim(),
        operationType,
        countersCount,
        gstin,
        address,
        notes,
        leadId: lead.leadId
      }).catch(err => console.error('Failed to send admin enquiry notification:', err));

      // Optional acknowledgment to customer
      if (email && email.includes('@')) {
        sendProductEnquiryClientConfirmation({
          productName,
          customerName: customerName.trim(),
          email: email.trim(),
          shopName: (shopName || '').trim()
        }).catch(err => console.error('Failed to send client confirmation:', err));
      }

      res.json({
        success: true,
        message: 'Quotation request submitted successfully. Our sales engineer will get in touch shortly.',
        leadId: lead.leadId
      });
    } catch (err) {
      console.error('Error submitting product enquiry:', err);
      res.status(500).json({ error: err.message || 'Failed to submit enquiry' });
    }
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    const errorLog = `[${new Date().toISOString()}] ${req.method} ${req.url}\n${err.stack}\n\n`;
    fs.appendFileSync('server-errors.log', errorLog);
    console.error('!!! SERVER ERROR !!!', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
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
