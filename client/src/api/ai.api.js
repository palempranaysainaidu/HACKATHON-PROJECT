import api from './axiosInstance';

export const initializeEvent = (message) => api.post('/ai/initialize', { message });
export const generatePlan = (eventId) => api.post(`/ai/generate-plan/${eventId}`);
export const generateEmails = (eventId) => api.post(`/ai/generate-emails/${eventId}`);
export const estimateBudget = (eventId) => api.post(`/ai/estimate-budget/${eventId}`);
export const predictRisks = (eventId) => api.post(`/ai/predict-risks/${eventId}`);
