import { create } from 'zustand';

const useEventStore = create((set) => ({
  currentEvent: null,
  tasks: [],
  budgetItems: [],
  emails: [],
  registrationCount: 0,
  setEvent: (event) => set({ currentEvent: event }),
  setTasks: (tasks) => set({ tasks }),
  setBudgetItems: (items) => set({ budgetItems: items }),
  setEmails: (emails) => set({ emails }),
  setRegistrationCount: (count) => set({ registrationCount: count }),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => t._id === taskId ? { ...t, status } : t)
    })),
  updateEmailStatus: (emailId, status) =>
    set((state) => ({
      emails: state.emails.map((e) => e._id === emailId ? { ...e, status } : e)
    }))
}));

export default useEventStore;
