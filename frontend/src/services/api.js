import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Public API ──────────────────────────────
export const paintingsAPI = {
  getAll:     (params) => api.get('/paintings', { params }),
  getFeatured: ()      => api.get('/paintings/featured'),
  getById:    (id)     => api.get(`/paintings/${id}`),
  getArtists: ()       => api.get('/artists'),
};

// ── Admin Auth API ──────────────────────────
export const adminAuthAPI = {
  login:  (credentials) => api.post('/admin/login', credentials),
  logout: ()             => api.post('/admin/logout'),
  me:     ()             => api.get('/admin/me'),
};

// ── Admin Paintings API ─────────────────────
export const adminPaintingsAPI = {
  getAll:  (params)       => api.get('/admin/paintings', { params }),
  getById: (id)           => api.get(`/admin/paintings/${id}`),
  create:  (formData)     => api.post('/admin/paintings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update:  (id, data)     => api.post(`/admin/paintings/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete:  (id)           => api.delete(`/admin/paintings/${id}`),
};

// ── Admin Orders ─────────────────────────────────────────
export const adminOrdersAPI = {
  getAll:       (params)       => api.get('/admin/orders', { params }),
  getById:      (id)           => api.get(`/admin/orders/${id}`),
  getStats:     ()             => api.get('/admin/orders/stats'),
  updateStatus: (id, status)   => api.patch(`/admin/orders/${id}/status`, { status }),
};

// ── Delivery Regions (public) ─────────────────────────────
export const deliveryRegionsAPI = {
  getAll: () => api.get('/delivery-regions'),
};

// ── Admin Delivery Regions ────────────────────────────────
export const adminDeliveryRegionsAPI = {
  getAll:  ()          => api.get('/admin/delivery-regions'),
  create:  (data)      => api.post('/admin/delivery-regions', data),
  update:  (id, data)  => api.put(`/admin/delivery-regions/${id}`, data),
  delete:  (id)        => api.delete(`/admin/delivery-regions/${id}`),
};

// ── Admin Users ───────────────────────────────────────────
export const adminUsersAPI = {
  getAll:         ()          => api.get('/admin/users'),
  create:         (data)      => api.post('/admin/users', data),
  updatePassword: (id, data)  => api.patch(`/admin/users/${id}/password`, data),
  delete:         (id)        => api.delete(`/admin/users/${id}`),
};

export default api;