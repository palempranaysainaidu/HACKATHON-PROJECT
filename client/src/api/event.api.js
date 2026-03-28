import api from './axiosInstance';

export const createEvent = (data) => api.post('/events/create', data);
export const getEventById = (id) => api.get(`/events/${id}`);
export const getUserEvents = () => api.get('/events');
export const getEventBySlug = (slug) => api.get(`/events/slug/${slug}`);
