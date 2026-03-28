import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useEventStore from '../store/useEventStore';
import { getTasksByEvent, updateTask } from '../api/task.api';
import { CheckCircle2, Circle, Clock, AlertTriangle, ListTodo, LayoutDashboard, PieChart, Mail, Globe, Zap, ExternalLink, Filter } from 'lucide-react';

const CATEGORY_LABELS = {
  logistics: { label: 'Logistics', color: 'text-blue-400 bg-blue-400/10' },
  marketing: { label: 'Marketing', color: 'text-pink-400 bg-pink-400/10' },
  permissions: { label: 'Permissions', color: 'text-amber-400 bg-amber-400/10' },
  volunteers: { label: 'Volunteers', color: 'text-emerald-400 bg-emerald-400/10' },
  finance: { label: 'Finance', color: 'text-cyan-400 bg-cyan-400/10' },
  technical: { label: 'Technical', color: 'text-violet-400 bg-violet-400/10' },
  general: { label: 'General', color: 'text-gray-400 bg-gray-400/10' },
};

export default function TasksPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { tasks, setTasks, currentEvent } = useEventStore();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasksByEvent(eventId);
        setTasks(res.data.tasks);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTasks();
  }, [eventId]);

  const toggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task._id, { status: newStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    } catch (err) { console.error(err); }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status === 'pending' || t.status === 'in_progress';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'overdue') return t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date();
    return true;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const cat = task.category || 'general';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(task);
    return groups;
  }, {});

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filters = [
    { key: 'all', label: 'All', count: tasks.length },
    { key: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'overdue', label: 'Overdue', count: tasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()).length },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard/${eventId}` },
    { icon: ListTodo, label: 'Tasks', path: `/dashboard/${eventId}/tasks`, active: true },
    { icon: PieChart, label: 'Budget', path: `/dashboard/${eventId}/budget` },
    { icon: Mail, label: 'Emails', path: `/dashboard/${eventId}/emails` },
  ];

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><svg className="animate-spin h-6 w-6 text-purple-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col fixed h-screen">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white">Event<span className="text-purple-400">OS</span></span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, i) => (
            <Link key={i} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Task Manager</h1>
            <p className="text-gray-400 text-sm">{completedCount} of {tasks.length} tasks completed</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">{progressPercent}%</p>
              <p className="text-xs text-gray-500">Progress</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#374151" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#8b47ff" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${progressPercent * 1.76} 176`} />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key ? 'bg-purple-600 text-white' : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              {f.label} <span className="ml-1 opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Grouped Tasks */}
        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${CATEGORY_LABELS[category]?.color || 'text-gray-400 bg-gray-400/10'}`}>
                  {CATEGORY_LABELS[category]?.label || category}
                </span>
                <span className="text-xs text-gray-500">{categoryTasks.length} tasks</span>
              </div>
              <div className="space-y-2">
                {categoryTasks.map(task => {
                  const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date();
                  return (
                    <div key={task._id} className={`glass-card rounded-xl p-4 flex items-start gap-4 hover:border-gray-600 transition-all ${isOverdue ? 'border-red-500/30' : ''}`}>
                      <button onClick={() => toggleTask(task)} className="mt-0.5 flex-shrink-0">
                        {task.status === 'completed'
                          ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                          : <Circle className="w-5 h-5 text-gray-500 hover:text-purple-400 transition-colors" />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</p>
                        {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
                        <div className="flex items-center gap-4 mt-2">
                          {task.assignee && <span className="text-xs text-gray-400">{task.assignee}</span>}
                          {task.dueDate && (
                            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                              {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'text-red-300 bg-red-500/10' :
                            task.priority === 'medium' ? 'text-amber-300 bg-amber-500/10' :
                            'text-green-300 bg-green-500/10'
                          }`}>{task.priority}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(groupedTasks).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No tasks found for this filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
