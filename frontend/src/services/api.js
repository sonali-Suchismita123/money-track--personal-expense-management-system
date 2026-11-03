/**
 * MoneyTrack API Service
 * Centralized fetch wrapper and named API modules.
 * All requests include credentials for session-cookie auth.
 */

const hostname = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : 'localhost';
const isPort5000 = (typeof window !== 'undefined' && window.location.port === '5000');
const BASE_URL = isPort5000 ? '' : `http://${hostname}:5000`;

/**
 * Core fetch wrapper.
 * @param {string} method - HTTP verb
 * @param {string} endpoint - e.g. '/api/transactions'
 * @param {object|null} data - request body
 * @param {object} params - query params (for GET requests)
 * @returns {Promise<any>}
 */
async function apiRequest(method, endpoint, data = null, params = null) {
  let url = `${BASE_URL}${endpoint}`;

  // Append query params for GET requests
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== '')
      )
    ).toString();
    if (query) url += `?${query}`;
  }

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',   // send cookies for Flask-Login session
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      json.error ||
      json.message ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json;
}

/* =============================================
   Auth API
   ============================================= */
export const authAPI = {
  login: (email, password) =>
    apiRequest('POST', '/api/auth/login', { email, password }),

  register: (data) =>
    apiRequest('POST', '/api/auth/register', data),

  logout: () =>
    apiRequest('POST', '/api/auth/logout'),

  me: () =>
    apiRequest('GET', '/api/auth/me'),

  updateProfile: (data) =>
    apiRequest('PUT', '/api/auth/profile', data),

  changePassword: (data) =>
    apiRequest('PUT', '/api/auth/change-password', data),
};

/* =============================================
   Transaction API
   ============================================= */
export const transactionAPI = {
  getAll: (params) =>
    apiRequest('GET', '/api/transactions', null, params),

  getOne: (id) =>
    apiRequest('GET', `/api/transactions/${id}`),

  create: (data) =>
    apiRequest('POST', '/api/transactions', data),

  update: (id, data) =>
    apiRequest('PUT', `/api/transactions/${id}`, data),

  remove: (id) =>
    apiRequest('DELETE', `/api/transactions/${id}`),
};

/* =============================================
   Category API
   ============================================= */
export const categoryAPI = {
  getAll: (params) =>
    apiRequest('GET', '/api/categories', null, params),

  getOne: (id) =>
    apiRequest('GET', `/api/categories/${id}`),

  create: (data) =>
    apiRequest('POST', '/api/categories', data),

  update: (id, data) =>
    apiRequest('PUT', `/api/categories/${id}`, data),

  remove: (id) =>
    apiRequest('DELETE', `/api/categories/${id}`),
};

/* =============================================
   Budget API
   ============================================= */
export const budgetAPI = {
  getAll: (params) =>
    apiRequest('GET', '/api/budgets', null, params),

  getOne: (id) =>
    apiRequest('GET', `/api/budgets/${id}`),

  create: (data) =>
    apiRequest('POST', '/api/budgets', data),

  update: (id, data) =>
    apiRequest('PUT', `/api/budgets/${id}`, data),

  remove: (id) =>
    apiRequest('DELETE', `/api/budgets/${id}`),
};

/* =============================================
   Savings Goals API
   ============================================= */
export const savingsAPI = {
  getAll: (params) =>
    apiRequest('GET', '/api/savings', null, params),

  getOne: (id) =>
    apiRequest('GET', `/api/savings/${id}`),

  create: (data) =>
    apiRequest('POST', '/api/savings', data),

  update: (id, data) =>
    apiRequest('PUT', `/api/savings/${id}`, data),

  remove: (id) =>
    apiRequest('DELETE', `/api/savings/${id}`),

  addAmount: (id, amount) =>
    apiRequest('POST', `/api/savings/${id}/add`, { amount }),
};

/* =============================================
   Reports API
   ============================================= */
export const reportsAPI = {
  getSummary: (month, year) =>
    apiRequest('GET', '/api/reports/summary', null, { month, year }),

  getMonthly: () =>
    apiRequest('GET', '/api/reports/monthly'),

  getCategory: (month, year) =>
    apiRequest('GET', '/api/reports/category', null, { month, year }),

  getTrends: () =>
    apiRequest('GET', '/api/reports/trends'),
};

export default apiRequest;
