import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Models from '../db/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminJS.registerAdapter(AdminJSMongoose);

export const componentLoader = new ComponentLoader();

// Component Registrations
export const Components = {
  Dashboard: componentLoader.add('Dashboard', path.join(__dirname, 'components/Dashboard.jsx')),
  Sidebar: componentLoader.override('Sidebar', path.join(__dirname, 'components/Sidebar.jsx')),
  Login: componentLoader.override('Login', path.join(__dirname, 'components/Login.jsx')),
  JobShow: componentLoader.add('JobShow', path.join(__dirname, 'components/JobShow.jsx')),
  GlobalShow: componentLoader.add('GlobalShow', path.join(__dirname, 'components/GlobalShow.jsx')),
  GlobalEdit: componentLoader.add('GlobalEdit', path.join(__dirname, 'components/GlobalEdit.jsx')),
  FinanceDashboard: componentLoader.add('FinanceDashboard', path.join(__dirname, 'components/FinanceDashboard.jsx')),
  SalesDashboard: componentLoader.add('SalesDashboard', path.join(__dirname, 'components/SalesDashboard.jsx')),
  StatusTag: componentLoader.add('StatusTag', path.join(__dirname, 'components/StatusBadge.jsx')),
  ContentToggle: componentLoader.add('ContentToggle', path.join(__dirname, 'components/LongText.jsx')),
};

const commonActions = {
  show: { component: Components.GlobalShow, showInDrawer: false },
  edit: { component: Components.GlobalEdit, showInDrawer: false }
};

export const adminOptions = {
  rootPath: '/admin',
  componentLoader,
  dashboard: { component: Components.Dashboard },
  resources: [
    { resource: Models.Employee, options: { 
      parent: { name: 'HR Management', icon: 'Users' },
      properties: {
        status: { components: { list: Components.StatusTag } },
        department: { components: { list: Components.StatusTag } },
      },
      listProperties: ['email', 'name', 'employeeId', 'department', 'designation', 'status'],
      actions: { ...commonActions }
    } },
    { resource: Models.Intern, options: { 
      parent: { name: 'HR Management', icon: 'UserCheck' },
      properties: { status: { components: { list: Components.StatusTag } } },
      actions: { ...commonActions }
    } },
    { resource: Models.Project, options: { 
      parent: { name: 'Operations', icon: 'Briefcase' },
      properties: { status: { components: { list: Components.StatusTag } } },
      actions: { ...commonActions }
    } },
    { resource: Models.Task, options: { 
      parent: { name: 'Operations', icon: 'CheckSquare' },
      properties: { 
        status: { components: { list: Components.StatusTag } },
        priority: { components: { list: Components.StatusTag } }
      },
      actions: { ...commonActions }
    } },
    { resource: Models.Meeting, options: { 
      parent: { name: 'Operations', icon: 'Video' },
      properties: { status: { components: { list: Components.StatusTag } } },
      actions: { ...commonActions }
    } },
    { 
      resource: Models.Ticket, 
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
        },
        listProperties: ['ticketId', 'title', 'category', 'priority', 'status', 'assignedTeam'],
        actions: { ...commonActions }
      } 
    },
    // --- Sales Module ---
    { 
      resource: Models.Deal, 
      options: { 
        id: 'Sales', // This creates the /admin/resources/Sales URL
        parent: { name: 'Sales', icon: 'Target' },
        actions: { 
          ...commonActions,
          list: { component: Components.SalesDashboard }
        },
        listProperties: ['dealId', 'dealName', 'clientName', 'dealValue', 'status'],
        properties: { status: { components: { list: Components.StatusTag } } }
      } 
    },
    { resource: Models.Lead, options: { 
      parent: { name: 'Sales', icon: 'UserPlus' },
      actions: { ...commonActions },
      listProperties: ['leadId', 'leadName', 'companyName', 'leadSource', 'status', 'followupDate'],
      properties: {
        status: { components: { list: Components.StatusTag } },
        notes: { type: 'textarea', components: { list: Components.ContentToggle } }
      }
    } },
    { resource: Models.Client, options: { 
      parent: { name: 'Sales', icon: 'Contact' },
      actions: { ...commonActions },
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { 
      resource: Models.ClientRequest, 
      options: { 
        parent: { name: 'Sales', icon: 'FileText' },
        actions: { ...commonActions },
        listProperties: ['clientName', 'companyName', 'projectType', 'budget', 'status', 'createdAt'],
        properties: {
          status: { components: { list: Components.StatusTag } },
          description: { type: 'textarea' }
        }
      } 
    },

    // --- Finance Module ---
    { 
      resource: Models.Revenue, 
      options: { 
        // Using 'Revenue' ID to match sidebar expectations, but keeping the landing dashboard
        parent: { name: 'Finance', icon: 'DollarSign' },
        actions: { 
          ...commonActions,
          list: { component: Components.FinanceDashboard }
        },
        listProperties: ['revenueId', 'clientName', 'amount', 'status', 'receivedDate'],
        properties: { status: { components: { list: Components.StatusTag } } }
      } 
    },
    { resource: Models.Invoice, options: { 
      parent: { name: 'Finance', icon: 'FileText' },
      actions: { ...commonActions },
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { resource: Models.Bill, options: { 
      parent: { name: 'Finance', icon: 'CreditCard' },
      actions: { ...commonActions },
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { resource: Models.Payroll, options: { 
      parent: { name: 'Finance', icon: 'Wallet' },
      actions: { ...commonActions }
    } },
    { resource: Models.Vendor, options: { 
      parent: { name: 'Finance', icon: 'Truck' },
      actions: { ...commonActions }
    } },

    // --- Operations Module ---
    { resource: Models.Project, options: { 
      parent: { name: 'Operations', icon: 'Briefcase' },
      actions: { ...commonActions }
    } },
    { resource: Models.Task, options: { 
      parent: { name: 'Operations', icon: 'CheckSquare' },
      actions: { ...commonActions }
    } },
    { resource: Models.Meeting, options: { 
      parent: { name: 'Operations', icon: 'Video' },
      actions: { ...commonActions }
    } },
    { resource: Models.Activity, options: { 
      parent: { name: 'Operations', icon: 'Activity' },
      actions: { list: { isAccessible: true }, show: { isAccessible: true } }
    } },

    // --- Recruitment Module ---
    { resource: Models.JobPosting, options: { 
      parent: { name: 'Recruitment', icon: 'Search' },
      actions: { ...commonActions }
    } },
    { resource: Models.JobApplication, options: { 
      parent: { name: 'Recruitment', icon: 'FileUser' },
      actions: { ...commonActions }
    } },

    // --- Support & Attendance ---
    { resource: Models.Ticket, options: { 
      parent: { name: 'Support', icon: 'LifeBuoy' },
      actions: { ...commonActions }
    } },
    { resource: Models.Attendance, options: { 
      parent: { name: 'Support', icon: 'Clock' },
      actions: { ...commonActions }
    } },
    { resource: Models.LeaveRequest, options: { 
      parent: { name: 'Support', icon: 'Calendar' },
      actions: { ...commonActions }
    } },

    // --- System Module ---
    { resource: Models.Setting, options: { 
      parent: { name: 'System', icon: 'Settings' },
      actions: { ...commonActions }
    } },
    { resource: Models.Manager, options: { 
      parent: { name: 'System', icon: 'Shield' },
      actions: { ...commonActions }
    } },
  ],
  branding: {
    companyName: 'averqon HRMS',
    logo: '/logo.png',
    favicon: '/logo.png',
    softwareBrothers: false,
    assets: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
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
          IT: 'IT', HR: 'HR', Design: 'Design', Finance: 'Finance', Marketing: 'Marketing', Sales: 'Sales', Operations: 'Operations',
          Active: 'Active', Inactive: 'Inactive', 'On Leave': 'On Leave',
          Open: 'Open', 'In Progress': 'In Progress', Pending: 'Pending', Resolved: 'Resolved', Closed: 'Closed',
          JobPosting: 'Job Posting',
        }
      }
    }
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
  }
};
