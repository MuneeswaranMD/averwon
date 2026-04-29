import AdminJS from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Models from '../db/models.js';
import bcrypt from 'bcrypt';

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
  SystemDashboard: componentLoader.add('SystemDashboard', path.join(__dirname, 'components/SystemDashboard.jsx')),
  RevenuePage: componentLoader.add('RevenuePage', path.join(__dirname, 'components/RevenuePage.jsx')),
  InvoicePage: componentLoader.add('InvoicePage', path.join(__dirname, 'components/InvoicePage.jsx')),
  BillPage: componentLoader.add('BillPage', path.join(__dirname, 'components/BillPage.jsx')),
  LeadsPage: componentLoader.add('LeadsPage', path.join(__dirname, 'components/LeadsPage.jsx')),
  DealsPage: componentLoader.add('DealsPage', path.join(__dirname, 'components/DealsPage.jsx')),
  SettingsPage: componentLoader.add('SettingsPage', path.join(__dirname, 'components/SettingsPage.jsx')),
  AdminAccountPage: componentLoader.add('AdminAccountPage', path.join(__dirname, 'components/AdminAccountPage.jsx')),
  StatusTag: componentLoader.add('StatusTag', path.join(__dirname, 'components/StatusBadge.jsx')),
  ContentToggle: componentLoader.add('ContentToggle', path.join(__dirname, 'components/LongText.jsx')),
  EmployeeTracking: componentLoader.add('EmployeeTracking', path.join(__dirname, 'components/EmployeeTracking.jsx')),
  AdminChat: componentLoader.add('AdminChat', path.join(__dirname, 'components/AdminChat.jsx')),
  AdminProjectAssign: componentLoader.add('AdminProjectAssign', path.join(__dirname, 'components/AdminProjectAssign.jsx')),
  LeadImport: componentLoader.add('LeadImport', path.join(__dirname, 'components/LeadImport.jsx')),
};

const commonActions = {
  show: { component: Components.GlobalShow, showInDrawer: false },
  edit: { 
    component: Components.GlobalEdit, 
    showInDrawer: false,
  }
};

export const adminOptions = {
  rootPath: '/admin',
  componentLoader,
  dashboard: { component: Components.Dashboard },
  pages: {
    'employee-tracking': {
      label: 'Employee Tracking',
      component: Components.EmployeeTracking,
      icon: 'Activity'
    },
    'admin-chat': {
      label: 'Live Chat',
      component: Components.AdminChat,
      icon: 'MessageSquare'
    },
    'project-assignment': {
      label: 'Assign Projects',
      component: Components.AdminProjectAssign,
      icon: 'Briefcase'
    },
    'sales-dashboard': {
      label: 'Sales Dashboard',
      component: Components.SalesDashboard,
      icon: 'TrendingUp'
    }
  },
  resources: [
    // --- HR Management ---
    { resource: Models.Employee, options: { 
      parent: { name: 'HR Management', icon: 'Users' },
      properties: {
        status: { components: { list: Components.StatusTag } },
        department: { components: { list: Components.StatusTag } },
        password: { type: 'password', isVisible: { list: false, filter: false, show: false, edit: true } }
      },
      listProperties: ['email', 'name', 'employeeId', 'department', 'designation', 'role', 'status'],
      actions: { 
        ...commonActions,
        new: {
          before: async (request) => {
            try {
              console.log('[AdminJS Hook] New Employee Payload:', request.payload);
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
                console.log('[AdminJS Hook] Password hashed');
              }
              return request;
            } catch (err) {
              console.error('[AdminJS Hook Error]', err);
              throw err;
            }
          }
        },
        edit: {
          ...commonActions.edit,
          before: async (request) => {
            try {
              console.log('[AdminJS Hook] Edit Employee Payload:', request.payload);
              if (request.payload.password) {
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
                console.log('[AdminJS Hook] Password hashed');
              } else {
                delete request.payload.password;
              }
              return request;
            } catch (err) {
              console.error('[AdminJS Hook Error]', err);
              throw err;
            }
          }
        }
      }
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
    { resource: Models.Document, options: {
      parent: { name: 'HR Management', icon: 'FileText' },
      actions: { ...commonActions }
    } },
    { resource: Models.Payroll, options: { 
      parent: { name: 'HR Management', icon: 'Wallet' },
      actions: { ...commonActions }
    } },

    // --- Recruitment ---
    { resource: Models.JobPosting, options: { 
      parent: { name: 'Recruitment', icon: 'Search' },
      properties: {
        description: { type: 'textarea', components: { list: Components.ContentToggle } },
        isActive: { components: { list: Components.StatusTag } }
      },
      listProperties: ['title', 'type', 'location', 'department', 'description', 'isActive'],
      actions: { 
        ...commonActions,
        show: { component: Components.JobShow }
      }
    } },

    { resource: Models.JobApplication, options: { 
      parent: { name: 'Recruitment', icon: 'FileUser' },
      actions: { ...commonActions }
    } },

    // --- Operations ---
    { resource: Models.Project, options: { 
      parent: { name: 'Operations', icon: 'Briefcase' },
      properties: { status: { components: { list: Components.StatusTag } } },
      actions: { 
        ...commonActions,
        edit: {
          ...commonActions.edit,
          after: async (response, request, context) => {
            if (request.method === 'post' && response.record) {
              const { record } = response;
              await Models.Activity.create({
                user: 'Admin',
                action: `Updated project: ${record.params.name} (Progress: ${record.params.progress}%)`,
                target: 'Project',
                time: new Date()
              });
            }
            return response;
          }
        }
      }
    } },
    { resource: Models.Task, options: { 
      parent: { name: 'Operations', icon: 'CheckSquare' },
      properties: { 
        status: { components: { list: Components.StatusTag } },
        priority: { components: { list: Components.StatusTag } }
      },
      actions: { 
        ...commonActions,
        edit: {
          ...commonActions.edit,
          after: async (response, request, context) => {
            if (request.method === 'post' && response.record) {
              const { record } = response;
              await Models.Activity.create({
                user: record.params.assignedTo || 'Admin',
                action: `Admin updated task: ${record.params.title} to ${record.params.status}`,
                target: 'Task',
                time: new Date()
              });
            }
            return response;
          }
        }
      }
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
          list: { component: Components.RevenuePage }
        },
        listProperties: ['revenueId', 'clientName', 'amount', 'status'],
        properties: { status: { components: { list: Components.StatusTag } } }
      } 
    },
    { resource: Models.Invoice, options: { 
      id: 'Invoice',
      parent: { name: 'Finance', icon: 'FileText' },
      actions: { ...commonActions, list: { component: Components.InvoicePage } },
      listProperties: ['invoiceId', 'clientName', 'totalAmount', 'status'],
      properties: { status: { components: { list: Components.StatusTag } } }
    } },
    { resource: Models.Bill, options: { 
      id: 'Bill',
      parent: { name: 'Finance', icon: 'CreditCard' },
      actions: { ...commonActions, list: { component: Components.BillPage } },
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
          list: { component: Components.DealsPage }
        },
        listProperties: ['dealId', 'dealName', 'clientName', 'dealValue', 'status'],
        properties: { status: { components: { list: Components.StatusTag } } }
      } 
    },
    { resource: Models.Lead, options: { 
      parent: { name: 'Sales', icon: 'UserPlus' },
      actions: { 
        ...commonActions, 
        list: { component: Components.LeadsPage },
        import: {
          actionType: 'resource',
          component: Components.LeadImport,
          icon: 'Upload',
          label: 'Import Leads'
        }
      },
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

    // --- Communication ---
    { resource: Models.ChatRoom, options: {
      parent: { name: 'Communication', icon: 'MessageSquare' },
      actions: { ...commonActions }
    } },
    { resource: Models.LiveChat, options: {
      parent: { name: 'Communication', icon: 'MessagesSquare' },
      actions: { ...commonActions }
    } },

    // --- System ---
    { resource: Models.Tool, options: {
      parent: { name: 'System', icon: 'Wrench' },
      actions: { ...commonActions }
    } },
    { resource: Models.Setting, options: { 
      parent: { name: 'System', icon: 'Settings' },
      actions: { 
        ...commonActions,
        list: { component: Components.SettingsPage }
      }
    } },
    { resource: Models.Manager, options: { 
      parent: { name: 'System', icon: 'Shield' },
      properties: {
        password: { type: 'password', isVisible: { list: false, filter: false, show: false, edit: true } }
      },
      actions: { 
        ...commonActions,
        list: { component: Components.AdminAccountPage },
        new: {
          before: async (request) => {
            if (request.payload.password) request.payload.password = await bcrypt.hash(request.payload.password, 10);
            return request;
          }
        },
        edit: {
          ...commonActions.edit,
          before: async (request) => {
            if (request.payload.password) {
              request.payload.password = await bcrypt.hash(request.payload.password, 10);
            } else {
              delete request.payload.password;
            }
            return request;
          }
        }
      }
    } },
  ],
  branding: {
    companyName: 'averqon HRMS',
    softwareBrothers: false,
    theme: {
      colors: {
        primary100: '#2563EB',
        accent: '#10B981',
        bg: '#F8FAFC',
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
