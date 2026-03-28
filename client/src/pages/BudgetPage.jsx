import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useEventStore from '../store/useEventStore';
import { getBudgetByEvent, updateBudgetItem } from '../api/budget.api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutDashboard, ListTodo, PieChart, Mail, Zap, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';

const CATEGORY_LABELS = {
  venue: 'Venue', catering: 'Catering', decoration: 'Decoration',
  sound_av: 'Sound/AV', marketing: 'Marketing', transportation: 'Transport',
  prizes: 'Prizes', miscellaneous: 'Misc'
};

export default function BudgetPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { budgetItems, setBudgetItems, currentEvent } = useEventStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBudgetByEvent(eventId);
        setBudgetItems(res.data.items);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [eventId]);

  const handleEditSave = async (id) => {
    const val = parseInt(editValue) || 0;
    try {
      await updateBudgetItem(id, { actualAmount: val });
      setBudgetItems(budgetItems.map(item => item._id === id ? { ...item, actualAmount: val } : item));
    } catch (err) { console.error(err); }
    setEditingId(null);
  };

  const totalEstimated = budgetItems.reduce((s, i) => s + i.estimatedAmount, 0);
  const totalActual = budgetItems.reduce((s, i) => s + i.actualAmount, 0);
  const totalBudget = currentEvent?.budget || totalEstimated;

  const chartData = budgetItems.map(item => ({
    name: CATEGORY_LABELS[item.category] || item.category,
    Estimated: item.estimatedAmount,
    Actual: item.actualAmount
  }));

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `/dashboard/${eventId}` },
    { icon: ListTodo, label: 'Tasks', path: `/dashboard/${eventId}/tasks` },
    { icon: PieChart, label: 'Budget', path: `/dashboard/${eventId}/budget`, active: true },
    { icon: Mail, label: 'Emails', path: `/dashboard/${eventId}/emails` },
  ];

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><svg className="animate-spin h-6 w-6 text-purple-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;

  return (
    <div className="min-h-screen bg-gray-950 flex">
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

      <main className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Budget Tracker</h1>
        <p className="text-gray-400 text-sm mb-8">Track estimated vs actual spending</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><DollarSign className="w-4 h-4" />Total Budget</div>
            <p className="text-2xl font-bold text-white">₹{totalBudget.toLocaleString('en-IN')}</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><TrendingUp className="w-4 h-4" />Spent</div>
            <p className="text-2xl font-bold text-white">₹{totalActual.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-1">{totalBudget ? Math.round((totalActual / totalBudget) * 100) : 0}% used</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><CheckCircle2 className="w-4 h-4" />Remaining</div>
            <p className={`text-2xl font-bold ${totalBudget - totalActual >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>₹{(totalBudget - totalActual).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Estimated vs Actual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Legend />
                <Bar dataKey="Estimated" fill="#8b47ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estimated</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actual</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Diff</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {budgetItems.map(item => {
                const diff = item.estimatedAmount - item.actualAmount;
                return (
                  <tr key={item._id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${item.actualAmount > item.estimatedAmount ? 'bg-red-500/5' : ''}`}>
                    <td className="px-6 py-4 text-sm font-medium text-white">{CATEGORY_LABELS[item.category] || item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 text-right">₹{item.estimatedAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                      {editingId === item._id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleEditSave(item._id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEditSave(item._id)}
                          className="w-28 px-2 py-1 bg-gray-700 text-white rounded text-sm text-right outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => { setEditingId(item._id); setEditValue(item.actualAmount.toString()); }}
                          className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          ₹{item.actualAmount.toLocaleString('en-IN')}
                        </button>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-sm text-right font-medium ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {diff >= 0 ? '+' : ''}₹{diff.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${item.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        {item.isPaid ? '✓ Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
