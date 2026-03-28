import api from './axiosInstance';

export const getBudgetByEvent = (eventId) => api.get(`/budget/event/${eventId}`);
export const updateBudgetItem = (id, data) => api.patch(`/budget/${id}`, data);
