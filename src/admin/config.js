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
    // --- HR Management ---
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
    { resource: Models.Attendance, options: { 
      parent: { name: 'HR Management', icon: 'Clock' },
      actions: { ...commonActions }
    } },
    { resource: Models.LeaveRequest, options: { 
      parent: { name: 'HR Management', icon: 'Calendar' },
      actions: { ...commonActions }
    } },
    { resource: Models.Payroll, options: { 
      parent: { name: 'HR Management', icon: 'Wallet' },
      actions: { ...commonActions }
    } },

    // --- Recruitment ---
    { resource: Models.JobPosting, options: { 
      parent: { name: 'Recruitment', icon: 'Search' },
      actions: { ...commonActions }
    } },
    { resource: Models.JobApplication, options: { 
      parent: { name: 'Recruitment', icon: 'FileUser' },
      actions: { ...commonActions }
    } },

    // --- Operations ---
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
    { resource: Models.Activity, options: { 
      id: 'TeamActivity',
      parent: { name: 'Operations', icon: 'Activity' },
      actions: { list: { isAccessible: true }, show: { isAccessible: true } }
    } },

    // --- Support ---
    { 
      resource: Models.Ticket, 
      options: { 
        parent: { name: 'Support', icon: 'LifeBuoy' },
        properties: {
          status: { components: { list: Components.StatusTag } },
          priority: { components: { list: Components.StatusTag } },
          description: { type: 'textarea', components: { list: Components.ContentToggle } },
        },
        listProperties: ['ticketId', 'title', 'category', 'priority', 'status'],
        actions: { ...commonActions }
      } 
    },

    // --- Finance ---
    { 
      resource: Models.Revenue, 
      options: { 
        parent: { name: 'Finance', icon: 'DollarSign' },
        actions: { 
          ...commonActions,
          list: { component: Components.FinanceDashboard }
        },
        listProperties: ['revenueId', 'clientName', 'amount', 'status'],
        properties: { status: { components: { list: Components.StatusTag } } }
      } 
    },
    { resource: Models.Invoice, options: { 
      id: 'Invoice',
      parent: { name: 'Finance', icon: 'FileText' },
      actions: { ...commonActions },
      listProperties: ['invoiceId', 'clientName', 'totalAmount', 'status'],
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { resource: Models.Bill, options: { 
      id: 'Bill',
      parent: { name: 'Finance', icon: 'CreditCard' },
      actions: { ...commonActions },
      listProperties: ['vendorName', 'category', 'amount', 'status'],
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { resource: Models.Vendor, options: { 
      parent: { name: 'Finance', icon: 'Truck' },
      actions: { ...commonActions }
    } },

    // --- Sales ---
    { 
      resource: Models.Deal, 
      options: { 
        id: 'Sales', 
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
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { resource: Models.Client, options: { 
      parent: { name: 'Sales', icon: 'Contact' },
      actions: { ...commonActions }
    } },
    { resource: Models.ClientRequest, options: { 
      parent: { name: 'Sales', icon: 'Zap' },
      actions: { ...commonActions }
    } },

    // --- System ---
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
    softwareBrothers: false,
    theme: {
      colors: {
        primary100: '#2563EB',
        accent: '#2563EB',
        bg: '#F5F7FA',
      },
    },
  },
  locale: {
    language: 'en',
    translations: {
      en: {
        labels: {
          Employee: 'Employee',
          Payroll: 'Payroll',
          Attendance: 'Attendance',
          'LeaveRequest': 'Leave Request',
          JobPosting: 'Job Posting',
          'HR Management': 'HR Management',
          Operations: 'Operations',
          Support: 'Support',
          Sales: 'Sales',
          Finance: 'Finance',
          System: 'System',
        }
      }
    }
  }
};
