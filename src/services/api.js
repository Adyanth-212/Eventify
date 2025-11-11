import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const eventService = {
  getAll: (params = {}) => apiClient.get('/events', { params }),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
  search: (query) => apiClient.get('/events/search', { params: { q: query } })
};

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  signup: (userData) => apiClient.post('/auth/signup', userData),
  verifyToken: () => apiClient.get('/auth/me')
};

export const registrationService = {
  register: (eventId) => apiClient.post(`/registrations/${eventId}`),
  unregister: (eventId) => apiClient.delete(`/registrations/${eventId}`),
  getMyRegistrations: () => apiClient.get('/registrations/my'),
  getEventRegistrations: (eventId) => apiClient.get(`/registrations/event/${eventId}`)
};

export const feedbackService = {
  submit: (data) => apiClient.post('/feedback', data),
  getAll: () => apiClient.get('/feedback')
};

export default apiClient;
