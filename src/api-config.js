const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  // Public
  JOBS: `${API_BASE_URL}/api/jobs`,
  APPLICATIONS: `${API_BASE_URL}/api/applications`,
  TICKETS: `${API_BASE_URL}/api/support/tickets`,
  TICKET_TRACK: (id) => `${API_BASE_URL}/api/support/tickets/${id}`,
  TICKET_COMMENTS: (id) => `${API_BASE_URL}/api/support/tickets/${id}/comments`,

  // Auth
  EMPLOYEE_LOGIN: `${API_BASE_URL}/api/employee/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/google-auth`,

  // Admin
  DASHBOARD_STATS: `${API_BASE_URL}/api/admin/dashboard-stats`,

  // Employee Portal
  EMPLOYEE_PROFILE: `${API_BASE_URL}/api/employee/profile`,
  EMPLOYEE_DASHBOARD: `${API_BASE_URL}/api/employee/dashboard`,
  EMPLOYEE_TASKS: `${API_BASE_URL}/api/employee/tasks`,
  EMPLOYEE_TASK_UPDATE: (id) => `${API_BASE_URL}/api/employee/tasks/${id}`,
  EMPLOYEE_ATTENDANCE: `${API_BASE_URL}/api/employee/attendance`,
  EMPLOYEE_ATTENDANCE_CHECKIN: `${API_BASE_URL}/api/employee/attendance/check-in`,
  EMPLOYEE_ATTENDANCE_CHECKOUT: (id) => `${API_BASE_URL}/api/employee/attendance/${id}/check-out`,
  EMPLOYEE_LEAVES: `${API_BASE_URL}/api/employee/leaves`,
  EMPLOYEE_MEETINGS: `${API_BASE_URL}/api/employee/meetings`,
  EMPLOYEE_PAYROLL: `${API_BASE_URL}/api/employee/payroll`,
  EMPLOYEE_ACTIVITY_LOG: `${API_BASE_URL}/api/employee/activity`,
  EMPLOYEE_PROJECTS: `${API_BASE_URL}/api/employee/projects`,
  EMPLOYEE_DOCUMENTS: `${API_BASE_URL}/api/employee/documents`,
  
  // Sales & CRM
  EMPLOYEE_SALES_OVERVIEW: `${API_BASE_URL}/api/employee/sales/overview`,
  EMPLOYEE_SALES_LEADS: `${API_BASE_URL}/api/employee/sales/leads`,
  EMPLOYEE_SALES_DEALS: `${API_BASE_URL}/api/employee/sales/deals`,
  
  // System Admin & Settings
  EMPLOYEE_ADMIN_EMPLOYEES: `${API_BASE_URL}/api/employee/admin/employees`,
  EMPLOYEE_ADMIN_ACCESS_UPDATE: (id) => `${API_BASE_URL}/api/employee/admin/access/${id}`,
  EMPLOYEE_ADMIN_SETTINGS: `${API_BASE_URL}/api/employee/admin/settings`,
  EMPLOYEE_ADMIN_SETTINGS_UPDATE: (id) => `${API_BASE_URL}/api/employee/admin/settings/${id}`,
  
  // Chat
  CHAT_MESSAGE: `${API_BASE_URL}/api/chat/message`,
  CHAT_HISTORY: (roomId) => `${API_BASE_URL}/api/chat/history/${roomId}`,
  CHAT_PRIVATE: (u1, u2) => `${API_BASE_URL}/api/chat/private/${u1}/${u2}`,
  CHAT_ROOMS: `${API_BASE_URL}/api/chat/rooms`,
  CHAT_RECENT: (username) => `${API_BASE_URL}/api/chat/recent/${username}`,
};

export default API_BASE_URL;

