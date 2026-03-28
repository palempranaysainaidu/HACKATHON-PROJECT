import api from './axiosInstance';

export const getEmailsByEvent = (eventId) => api.get(`/emails/event/${eventId}`);
export const updateEmail = (id, data) => api.patch(`/emails/${id}`, data);
export const sendEmail = (id, recipientEmail) => api.post(`/emails/${id}/send`, { recipientEmail });
