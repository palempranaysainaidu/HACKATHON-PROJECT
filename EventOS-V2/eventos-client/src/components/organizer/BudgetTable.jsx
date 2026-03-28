import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { Trash2, Plus, CheckCircle } from 'lucide-react';

export default function BudgetTable({ eventId, expectedAudience, ticketPrice = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItem, setNewItem] = useState({ category: 'venue', description: '', estimatedAmount: 0 });

  const fetchBudget = async () => {
    try {
      const { data } = await axios.get(`/organizer/events/${eventId}/budget`);
      setItems(data.items);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBudget(); }, [eventId]);

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      await axios.post(`/ai/estimate-budget/${eventId}`);
      await fetchBudget();
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await axios.patch(`/organizer/budget/${editingItemId}`, newItem);
      } else {
        await axios.post(`/organizer/events/${eventId}/budget`, newItem);
      }
      setIsModalOpen(false);
      setEditingItemId(null);
      setNewItem({ category: 'venue', description: '', estimatedAmount: 0 });
      fetchBudget();
    } catch (err) { console.error(err); }
  };

  const handleToggleVerify = async (item) => {
    try {
      const newStatus = !item.isVerified;
      await axios.patch(`/organizer/budget/${item._id}`, { isVerified: newStatus, verifiedAt: newStatus ? new Date() : null });
      setItems(items.map(i => i._id === item._id ? { ...i, isVerified: newStatus } : i));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete?')) return;
    try {
      await axios.delete(`/organizer/budget/${itemId}`);
      setItems(items.filter(i => i._id !== itemId));
    } catch (err) { console.error(err); }
  };

  const totalCalculated = items.reduce((acc, curr) => acc + curr.estimatedAmount, 0);
  const minTicketPrice = expectedAudience ? Math.ceil(totalCalculated / expectedAudience) : 0;
  const projectedProfit = (ticketPrice * expectedAudience) - totalCalculated;

  if (loading) return <div className="p-8 text-center text-brand-mid animate-pulse">Loading Budget...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-brand-white">Budget Planner</h2>
          <div className="space-x-3">
             <button onClick={handleGenerateAI} className="border border-brand-accent text-brand-accent hover:bg-brand-surface font-sans font-medium px-4 py-2 rounded-full transition-colors text-sm">
                ✨ Auto-Estimate
             </button>
             <button onClick={() => { setEditingItemId(null); setNewItem({ category: 'venue', description: '', estimatedAmount: 0 }); setIsModalOpen(true); }} className="bg-brand-accent hover:bg-brand-accentHov  text-brand-white font-sans font-medium px-4 py-2 rounded-full transition-colors text-sm inline-flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Line
             </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-brand-border rounded-xl">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-brand-surface text-brand-mid text-xs uppercase tracking-wide border-b border-brand-border">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Est. Cost</th>
                <th className="px-6 py-4 font-medium text-center">Verified</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {items.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-brand-mid">No budget items added.</td></tr>}
              {items.map(item => (
                <tr key={item._id} className="hover:bg-brand-surface/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-light capitalize">{item.category.replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-brand-mid">{item.description}</td>
                  <td className="px-6 py-4 text-brand-light font-medium text-right">₹{item.estimatedAmount}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleToggleVerify(item)} className="transition-colors group">
                      {item.isVerified ? (
                        <CheckCircle className="w-5 h-5 text-brand-accent mx-auto group-hover:text-brand-mid" />
                      ) : (
                        <div className="text-xs border border-brand-border px-2 py-1 rounded group-hover:border-brand-accent">Verify</div>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {!item.isVerified && (
                      <>
                        <button onClick={() => { setEditingItemId(item._id); setNewItem({ category: item.category, description: item.description, estimatedAmount: item.estimatedAmount }); setIsModalOpen(true); }} className="text-brand-mid hover:text-brand-white font-sans text-xs underline uppercase tracking-widest font-bold">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-brand-light hover:text-brand-error"><Trash2 className="w-4 h-4" /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-brand-card border border-brand-border rounded-xl p-6 sticky top-24 shadow-sm">
           <h3 className="font-serif text-xl font-bold text-brand-white mb-6 pb-4 border-b border-brand-border">Break-Even Calculator</h3>
           
           <div className="space-y-4 mb-8">
             <div className="flex justify-between">
                <span className="font-sans text-brand-mid">Total Expenses</span>
                <span className="font-sans font-bold text-brand-white">₹{totalCalculated}</span>
             </div>
             <div className="flex justify-between">
                <span className="font-sans text-brand-mid">Expected Audience</span>
                <span className="font-sans font-bold text-brand-white">{expectedAudience}</span>
             </div>
           </div>

           <div className="bg-brand-surface rounded-lg p-5 border border-brand-border mb-6">
              <span className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-2">Min. Ticket Price to break even</span>
              <span className="font-serif text-3xl font-bold text-brand-white">₹{minTicketPrice}</span>
           </div>

           <div className={`rounded-lg p-5 border ${projectedProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <span className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-2">Projected Profit</span>
              <span className={`font-serif text-2xl font-bold ${projectedProfit >= 0 ? 'text-brand-accentHov' : 'text-brand-error'}`}>
                 {projectedProfit >= 0 ? '+' : '-'}₹{Math.abs(projectedProfit)}
              </span>
              <span className="block mt-2 text-xs text-brand-mid">Based on ₹{ticketPrice} ticket price</span>
           </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-accent hover:bg-brand-accentHov/50 flex items-center justify-center z-50">
          <div className="bg-brand-card rounded-xl p-8 w-full max-w-md">
            <h2 className="font-serif text-2xl font-bold mb-6">{editingItemId ? 'Edit Expense' : 'Add Expense'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-1">Category</label>
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full border border-brand-border rounded-lg px-4 py-2 font-sans bg-brand-surface border border-brand-border">
                   <option value="venue">Venue</option><option value="catering">Catering</option><option value="marketing">Marketing</option><option value="sound_av">Sound & AV</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-1">Description</label>
                <input required type="text" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full border border-brand-border rounded-lg px-4 py-2 font-sans" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-1">Est. Amount (₹)</label>
                <input required type="number" value={newItem.estimatedAmount} onChange={e => setNewItem({...newItem, estimatedAmount: Number(e.target.value)})} className="w-full border border-brand-border rounded-lg px-4 py-2 font-sans" />
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingItemId(null); }} className="px-4 py-2 text-brand-light font-sans font-medium">Cancel</button>
                <button type="submit" className="bg-brand-accent hover:bg-brand-accentHov text-brand-white px-6 py-2 rounded-full font-sans font-medium">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
