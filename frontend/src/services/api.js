import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('netpulse_jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('netpulse_jwt_token');
      localStorage.removeItem('netpulse_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getDevices = async (params = {}) => {
  const response = await api.get('/devices', { params });
  return response.data;
};

export const getDevice = async (id) => {
  const response = await api.get(`/devices/${id}`);
  return response.data;
};

export const addDevice = async (deviceData) => {
  const response = await api.post('/devices', deviceData);
  return response.data;
};

export const updateDevice = async (id, deviceData) => {
  const response = await api.put(`/devices/${id}`, deviceData);
  return response.data;
};

export const deleteDevice = async (id) => {
  const response = await api.delete(`/devices/${id}`);
  return response.data;
};

export const importDevicesCsv = async (formData) => {
  const response = await api.post('/devices/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const bulkDeleteDevices = async (deviceIds) => {
  const response = await api.post('/devices/bulk-delete', { device_ids: deviceIds });
  return response.data;
};

export const bulkUpdateDeviceStatus = async (deviceIds, status) => {
  const response = await api.post('/devices/bulk-status', { device_ids: deviceIds, status });
  return response.data;
};

export const pingDevice = async (id) => {
  const response = await api.post(`/devices/ping/${id}`);
  return response.data;
};

export const pingAllDevices = async () => {
  const response = await api.post('/devices/ping-all');
  return response.data;
};

export const exportDevices = async () => {
  const response = await api.get('/devices/export', {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `network_device_inventory_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getStatistics = async () => {
  const response = await api.get('/statistics');
  return response.data;
};

export const getActivities = async () => {
  const response = await api.get('/activities');
  return response.data;
};

export const clearActivities = async () => {
  const response = await api.post('/activities/clear');
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const clearNotifications = async () => {
  const response = await api.post('/notifications/clear');
  return response.data;
};

export const resetInventory = async () => {
  const response = await api.post('/reset-inventory');
  return response.data;
};

export default api;
