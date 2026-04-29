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
  
  // Chat
  CHAT_MESSAGE: `${API_BASE_URL}/api/chat/message`,
  CHAT_HISTORY: (roomId) => `${API_BASE_URL}/api/chat/history/${roomId}`,
  CHAT_PRIVATE: (u1, u2) => `${API_BASE_URL}/api/chat/private/${u1}/${u2}`,
  CHAT_ROOMS: `${API_BASE_URL}/api/chat/rooms`,
  CHAT_RECENT: (username) => `${API_BASE_URL}/api/chat/recent/${username}`,
};

export default API_BASE_URL;

