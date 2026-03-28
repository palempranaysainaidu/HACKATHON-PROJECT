import api from './axiosInstance';

export const getTasksByEvent = (eventId) => api.get(`/tasks/event/${eventId}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
