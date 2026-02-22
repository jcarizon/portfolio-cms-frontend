import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// API ENDPOINTS
// ============================================

// Hero
export const heroApi = {
  get: () => api.get('/hero'),
  update: (data: any) => api.put('/hero', data),
};

// About
export const aboutApi = {
  get: () => api.get('/about'),
  update: (data: any) => api.put('/about', data),
};

// Skills
export const skillsApi = {
  getAll: () => api.get('/skills'),
  createCategory: (data: { name: string }) => api.post('/skills/categories', data),
  updateCategory: (id: string, data: { name: string }) =>
    api.put(`/skills/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/skills/categories/${id}`),
  reorderCategories: (data: { items: { id: string }[] }) =>
    api.put('/skills/categories/reorder', data),
  createSkill: (data: { categoryId: string; name: string }) =>
    api.post('/skills', data),
  updateSkill: (id: string, data: { name: string }) =>
    api.put(`/skills/${id}`, data),
  deleteSkill: (id: string) => api.delete(`/skills/${id}`),
  reorderSkills: (categoryId: string, data: { items: { id: string }[] }) =>
    api.put(`/skills/categories/${categoryId}/reorder`, data),
};

// Projects
export const projectsApi = {
  getAll: (includeHidden = false) =>
    api.get(`/projects${includeHidden ? '?all=true' : ''}`),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  toggleVisibility: (id: string) => api.put(`/projects/${id}/toggle-visibility`),
  toggleFeatured: (id: string) => api.put(`/projects/${id}/toggle-featured`),
  reorder: (data: { items: { id: string }[] }) => api.put('/projects/reorder', data),
};

// Experience
export const experienceApi = {
  getAll: (includeHidden = false) =>
    api.get(`/experience${includeHidden ? '?all=true' : ''}`),
  getOne: (id: string) => api.get(`/experience/${id}`),
  create: (data: any) => api.post('/experience', data),
  update: (id: string, data: any) => api.put(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
  toggleVisibility: (id: string) => api.put(`/experience/${id}/toggle-visibility`),
  reorder: (data: { items: { id: string }[] }) => api.put('/experience/reorder', data),
};

// Contact
export const contactApi = {
  getSettings: () => api.get('/contact/settings'),
  updateSettings: (data: any) => api.put('/contact/settings', data),
  sendMessage: (data: any) => api.post('/contact/messages', data),
  getMessages: () => api.get('/contact/messages'),
  markAsRead: (id: string) => api.put(`/contact/messages/${id}/read`),
};

// Settings
export const settingsApi = {
  getSite: () => api.get('/settings/site'),
  updateSite: (data: any) => api.put('/settings/site', data),
  getContact: () => api.get('/settings/contact'),
  updateContact: (data: any) => api.put('/settings/contact', data),
  getMessages: () => api.get('/settings/messages'),
  getUnreadCount: () => api.get('/settings/messages/unread-count'),
  markAsRead: (id: string) => api.put(`/settings/messages/${id}/read`),
  markAllAsRead: () => api.put('/settings/messages/mark-all-read'),
  deleteMessage: (id: string) => api.delete(`/settings/messages/${id}`),
  submitContact: (data: any) => api.post('/settings/messages', data),
};

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};
