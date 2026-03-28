import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useEventStore from '../store/useEventStore';
import { getEventById } from '../api/event.api';
import { getTasksByEvent } from '../api/task.api';
import { getBudgetByEvent } from '../api/budget.api';
import { getEmailsByEvent } from '../api/email.api';
import { Calendar, MapPin, Users, CheckCircle2, DollarSign, Mail, Globe, ListTodo, PieChart, LayoutDashboard, Zap, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';

export default function DashboardPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentEvent, tasks, budgetItems, emails, registrationCount, setEvent, setTasks, setBudgetItems, setEmails, setRegistrationCount } = useEventStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eventRes, tasksRes, budgetRes, emailsRes] = await Promise.all([
          getEventById(eventId),
          getTasksByEvent(eventId),
          getBudgetByEvent(eventId),
          getEmailsByEvent(eventId)
        ]);
        setEvent(eventRes.data.event);
        setTasks(tasksRes.data.tasks);
        setBudgetItems(budgetRes.data.items);
        setEmails(emailsRes.data.emails);

        // Try to get registration count
        try {
          const regRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/registrations/event/${eventId}`, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('eventos-auth') || '{}')?.state?.token}` }
          });
          setRegistrationCount(regRes.data.count || 0);
        } catch { setRegistrationCount(0); }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-400">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!currentEvent) return null;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedAmount, 0);
  const daysToGo = Math.ceil((new Date(currentEvent.date) - new Date()) / (1000 * 60 * 60 * 24));
  const upcomingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard/${eventId}`, active: true },
    { icon: ListTodo, label: 'Tasks', path: `/dashboard/${eventId}/tasks` },
    { icon: PieChart, label: 'Budget', path: `/dashboard/${eventId}/budget` },
    { icon: Mail, label: 'Emails', path: `/dashboard/${eventId}/emails` },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col fixed h-screen">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Event<span className="text-purple-400">OS</span></span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                item.active ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <a
            href={`${import.meta.env.VITE_EVENT_SITE_URL}/e/${currentEvent.slug}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all"
          >
            <Globe className="w-5 h-5" />
            View Event Website
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">{currentEvent.name}</h1>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(currentEvent.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{currentEvent.location}, {currentEvent.city}</span>
            <span className={`flex items-center gap-1.5 font-semibold ${daysToGo > 7 ? 'text-emerald-400' : daysToGo > 0 ? 'text-amber-400' : 'text-red-400'}`}>
              <Clock className="w-4 h-4" />{daysToGo > 0 ? `${daysToGo} days to go` : daysToGo === 0 ? 'Today!' : 'Event passed'}
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">Total Tasks</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><ListTodo className="w-5 h-5 text-purple-400" /></div>
            </div>
            <p className="text-3xl font-bold text-white">{tasks.length}</p>
            <p className="text-sm text-gray-400 mt-1">{completedTasks} completed</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${tasks.length ? (completedTasks / tasks.length * 100) : 0}%` }}></div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">Budget Used</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><DollarSign className="w-5 h-5 text-blue-400" /></div>
            </div>
            <p className="text-3xl font-bold text-white">₹{totalActual.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-400 mt-1">of ₹{currentEvent.budget?.toLocaleString('en-IN')}</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${currentEvent.budget ? (totalActual / currentEvent.budget * 100) : 0}%` }}></div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">Registrations</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Users className="w-5 h-5 text-emerald-400" /></div>
            </div>
            <p className="text-3xl font-bold text-white">{registrationCount}</p>
            <p className="text-sm text-gray-400 mt-1">of ~{currentEvent.audience}</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${currentEvent.audience ? (registrationCount / currentEvent.audience * 100) : 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Upcoming Tasks</h3>
              <Link to={`/dashboard/${eventId}/tasks`} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">View all →</Link>
            </div>
            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">All tasks completed! 🎉</p>
              ) : upcomingTasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.assignee}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate(`/dashboard/${eventId}/emails?type=permission`)} className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-purple-600/20 hover:border-purple-500/20 border border-transparent text-left transition-all group">
                <Mail className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-white">Send Permission Email</p>
                  <p className="text-xs text-gray-500">Review and send the AI-drafted permission request</p>
                </div>
              </button>
              <a href={`${import.meta.env.VITE_EVENT_SITE_URL}/e/${currentEvent.slug}`} target="_blank" rel="noopener" className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-emerald-600/20 hover:border-emerald-500/20 border border-transparent text-left transition-all group">
                <Globe className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-white">View Event Website</p>
                  <p className="text-xs text-gray-500">See your live event page and registration form</p>
                </div>
              </a>
              <button onClick={() => navigate(`/dashboard/${eventId}/budget`)} className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-blue-600/20 hover:border-blue-500/20 border border-transparent text-left transition-all group">
                <PieChart className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-white">Track Budget</p>
                  <p className="text-xs text-gray-500">Update actual spending and track expenses</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
