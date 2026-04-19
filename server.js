import 'dotenv/config';
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';

// --- Shared Assets ---
import { adminOptions, componentLoader } from './src/admin/config.js';
import * as Models from './src/db/models.js';

// --- DNS Workaround for SRV Records ---
dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const start = async () => {
  const app = express();

  // Basic Middleware
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use((req, res, next) => {
    console.log(`[DEBUG LOG] ${req.method} ${req.url}`);
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

      console.log('🧹 Initializing Admin User...');
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
    } catch (error) {
      console.error('❌ Seeding Error:', error);
    }
  }

  // --- AdminJS Authentication ---
  const authenticate = async (email, password) => {
    try {
      if (!email || !password) return null;
      const manager = await Models.Manager.findOne({ email: email.toLowerCase() });
      if (manager) {
        const isMatch = await bcrypt.compare(password, manager.password);
        if (isMatch) return manager;
      }
    } catch (error) {
      console.error('[AUTH] Error:', error.message);
    }
    return null;
  };

  const admin = new AdminJS(adminOptions);
  await admin.initialize();
  
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: 'super-secret-password-32-chars-long', 
    },
    null,
    {
      secret: 'averqon-session-secret',
      resave: false,
      saveUninitialized: true,
      name: 'adminjs'
    }
  );

  // Serve pre-bundled AdminJS assets explicitly to resolve 404s and MIME type errors on Render
  // This MUST be before adminRouter to intercept asset requests correctly
  app.use('/admin/frontend/assets', express.static(path.join(__dirname, '.adminjs')));

  // Mount AdminJS
  app.use(admin.options.rootPath, adminRouter);

  // --- API Routes for External Interactions ---
  app.use(express.json());
  const upload = multer({ dest: 'uploads/' });
  if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

  app.post('/api/support/tickets', upload.single('attachment'), async (req, res) => {
    try {
      const ticketData = {
        ...req.body,
        status: 'Open'
      };
      if (req.file) ticketData.attachmentUrl = `/uploads/${req.file.filename}`;
      const ticket = await Models.Ticket.create(ticketData);
      res.json({ success: true, ticketId: ticket.ticketId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
      const [
        totalEmp, interns, activeProjects, pendingTasks,
        newLeads, ticketsToday,
        totalTickets, openTickets, closedTickets
      ] = await Promise.all([
        Models.Employee.countDocuments(),
        Models.Intern.countDocuments(),
        Models.Project.countDocuments({ status: 'In Progress' }),
        Models.Task.countDocuments({ status: { $ne: 'Done' } }),
        Models.Lead.countDocuments({ status: 'New' }),
        Models.Ticket.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
        Models.Ticket.countDocuments(),
        Models.Ticket.countDocuments({ status: 'Open' }),
        Models.Ticket.countDocuments({ status: 'Closed' })
      ]);

      res.json({
        stats: {
          totalEmployees: totalEmp,
          totalInterns: interns,
          activeProjects,
          pendingTasks,
          newClientRequests: newLeads,
          ticketsToday,
          ticketMetrics: { total: totalTickets, open: openTickets, closed: closedTickets }
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🛡️  Admin panel at http://localhost:${PORT}${admin.options.rootPath}`);
  });
};

start();
