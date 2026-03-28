const Task = require('../models/Task');

const getTasksByEvent = async (req, res, next) => {
  try {
    const tasks = await Task.find({ eventId: req.params.eventId }).sort({ dueDate: 1 });
    res.json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { eventId, title, category, assignee, dueDate, priority, description } = req.body;
    if (!eventId || !title) {
      return res.status(400).json({ success: false, message: 'eventId and title are required.' });
    }
    const task = await Task.create({ eventId, title, category, assignee, dueDate, priority, description });
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasksByEvent, createTask, updateTask, deleteTask };
