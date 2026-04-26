const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  JOBS: `${API_BASE_URL}/api/jobs`,
  APPLICATIONS: `${API_BASE_URL}/api/applications`,
  TICKETS: `${API_BASE_URL}/api/support/tickets`,
  TICKET_TRACK: (id) => `${API_BASE_URL}/api/support/tickets/${id}`,
  TICKET_COMMENTS: (id) => `${API_BASE_URL}/api/support/tickets/${id}/comments`,
  EMPLOYEE_LOGIN: `${API_BASE_URL}/api/employee/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/google-auth`,
  DASHBOARD_STATS: `${API_BASE_URL}/api/admin/dashboard-stats`,
};

export default API_BASE_URL;
