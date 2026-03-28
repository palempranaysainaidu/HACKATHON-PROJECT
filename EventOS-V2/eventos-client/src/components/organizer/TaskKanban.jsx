import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { Trash2, Plus, Calendar, User, Edit3, CheckCircle2, Circle } from 'lucide-react';

export default function TaskKanban({ eventId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  const [taskForm, setTaskForm] = useState({ 
    title: '', description: '', category: 'general', priority: 'medium', dueDate: '', status: 'pending' 
  });

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`/organizer/events/${eventId}/tasks`);
      setTasks(data.tasks);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [eventId]);

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      await axios.post(`/ai/generate-plan/${eventId}`);
      await fetchTasks();
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleAssignAI = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/ai/assign-tasks/${eventId}`);
      alert(`Successfully assigned ${data.count} tasks to volunteers!`);
      await fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to auto-assign tasks. Make sure you have unassigned tasks and accepted volunteers.');
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.patch(`/organizer/tasks/${editingTaskId}`, taskForm);
      } else {
        await axios.post(`/organizer/events/${eventId}/tasks`, taskForm);
      }
      setIsModalOpen(false);
      setTaskForm({ title: '', description: '', category: 'general', priority: 'medium', dueDate: '', status: 'pending' });
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`/organizer/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) { console.error(err); }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await axios.patch(`/organizer/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (err) { console.error(err); }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  if (loading) return <div className="p-8 text-center text-brand-mid animate-pulse">Loading Tasks...</div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div className="w-1/2">
          <h2 className="font-serif text-3xl font-bold text-brand-black mb-1">Task Manager</h2>
          <div className="flex items-center space-x-4 mb-2">
            <p className="font-sans text-sm text-brand-mid">{completedCount} of {tasks.length} tasks completed</p>
            <span className="text-xs font-bold text-brand-dark bg-brand-surface px-2 py-0.5 rounded-full">{progressPercent}% Done</span>
          </div>
          <div className="w-full bg-brand-surface rounded-full h-2 mt-2">
            <div className="bg-brand-black h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="space-x-3">
          <button onClick={handleGenerateAI} className="border border-brand-accent text-brand-accent hover:bg-brand-surface font-sans font-medium px-4 py-2 text-sm transition-colors shadow-sm bg-white">
            ✨ Gen AI
          </button>
          <button onClick={handleAssignAI} className="border border-brand-info text-brand-info hover:bg-brand-surface font-sans font-medium px-4 py-2 text-sm transition-colors shadow-sm bg-white">
            ✨ Auto-Assign Volunteers
          </button>
          <button onClick={() => { setEditingTaskId(null); setTaskForm({ title: '', description: '', category: 'general', priority: 'medium', dueDate: '', status: 'pending' }); setIsModalOpen(true); }} className="bg-brand-black hover:bg-black text-brand-white font-sans font-medium px-4 py-2 transition-colors text-sm inline-flex items-center shadow-sm">
            <Plus className="w-4 h-4 mr-1" /> Add Task
          </button>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-brand-mid font-sans text-sm">No tasks assigned yet. Click Add Task or let AI generate them!</div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {tasks.map(task => (
              <div key={task._id} className={`flex items-start justify-between p-4 border rounded-lg transition-all ${task.status === 'completed' ? 'border-brand-border bg-brand-surface/50 opacity-70' : 'border-brand-dark bg-white shadow-sm'}`}>
                <div className="flex items-start space-x-4">
                  <button onClick={() => handleToggleStatus(task)} className="mt-1 text-brand-dark hover:text-brand-black transition-colors">
                    {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-brand-black" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <div>
                    <h4 className={`font-sans font-bold text-lg mb-1 ${task.status === 'completed' ? 'line-through text-brand-mid' : 'text-brand-black'}`}>{task.title}</h4>
                    <p className="font-sans text-sm text-brand-mid mb-3 line-clamp-2 max-w-2xl">{task.description}</p>
                    <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider mb-2">
                       <div className="flex items-center bg-brand-surface px-2 py-1 rounded text-brand-dark">
                          <User className="w-3 h-3 mr-1" />
                          <span className="normal-case tracking-normal">{task.assignedTo?.name || 'Unassigned'}</span>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider">
                      <span className={`px-2 py-1 ${task.priority==='high'?'bg-red-100 text-red-700': task.priority==='medium'?'bg-yellow-100 text-yellow-700':'bg-blue-100 text-blue-700'}`}>{task.priority}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1">{task.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-4">
                  <div className="flex space-x-2 opacity-0 hover:opacity-100" style={{opacity: 1}}>
                    <button onClick={() => handleEditClick(task)} className="p-2 text-brand-mid hover:text-brand-black bg-brand-surface rounded-full transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(task._id)} className="p-2 text-brand-mid hover:text-red-600 bg-brand-surface rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center text-xs font-sans text-brand-mid">
                    <Calendar className="w-3 h-3 mr-1" /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-brand-white border border-brand-border shadow-2xl p-10 w-full max-w-lg relative animate-fade-in-up">
            <h2 className="font-serif text-3xl font-black mb-8">{editingTaskId ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Task Title</label>
                <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm outline-none focus:border-brand-black" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Description</label>
                <textarea rows="3" value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm outline-none focus:border-brand-black resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm outline-none focus:border-brand-black">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Status</label>
                  <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm outline-none focus:border-brand-black">
                    <option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-brand-border mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold font-sans text-brand-mid hover:text-brand-black transition-colors uppercase tracking-widest">Cancel</button>
                <button type="submit" className="bg-brand-black text-white px-8 py-3 font-bold font-sans text-sm hover:bg-black transition-colors shadow-sm">{editingTaskId ? 'Save Changes' : 'Add Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
