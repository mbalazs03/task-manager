import axios from 'axios';

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    Authorization: token ? `Bearer ${token}` : ''
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await api.get('/admin/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const reassignTask = async (taskId, userId) => {
  try {
    console.log("Task ID:", taskId);
    console.log("User ID:", userId);
    const response = await api.put(`/admin/tasks/${taskId}/reassign`, { userId });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error reassigning task:', error);
    throw error;
  }
};

export default api;
