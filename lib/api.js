// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body, includeAuth = true } = options;

  const config = {
    method,
    headers: createHeaders(includeAuth),
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Specific API methods
export const api = {
  // Auth endpoints
  auth: {
    register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData, includeAuth: false }),
    login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials, includeAuth: false }),
    getMe: () => apiRequest('/auth/me'),
    createAdmin: (userData) => apiRequest('/auth/register-admin', { method: 'POST', body: userData }),
  },

  // Add more API endpoints as needed
  // Example:
  // orders: {
  //   getAll: () => apiRequest('/orders'),
  //   getById: (id) => apiRequest(`/orders/${id}`),
  //   create: (data) => apiRequest('/orders', { method: 'POST', body: data }),
  //   update: (id, data) => apiRequest(`/orders/${id}`, { method: 'PUT', body: data }),
  //   delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
  // },
};

export default api;