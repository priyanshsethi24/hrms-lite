import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_UR || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeAPI = {
  getAll: () => api.get('/employees'),
  create: (data) => api.post('/employees', data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceAPI = {
  mark: (data) => api.post('/attendance', data),
  getByEmployee: (id) => api.get(`/attendance/${id}`),
};

export default api;
