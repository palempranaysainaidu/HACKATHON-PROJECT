import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import TaskKanban from '../../components/organizer/TaskKanban';
import BudgetTable from '../../components/organizer/BudgetTable';
import VolunteerManager from '../../components/organizer/VolunteerManager';
import OrganizerUpdates from '../../components/organizer/OrganizerUpdates';

export default function EventManagement() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    // Fetch Event logic
    const loadData = async () => {
      try {
        const { data } = await axios.get(`/organizer/events/${id}`);
        setEvent(data.event);
        setNewPrice(data.event.ticketPrice || 0);
      } catch (err) { console.error(err); }
    };
    loadData();
  }, [id]);

  const handleUpdatePrice = async () => {
    try {
      const { data } = await axios.patch(`/organizer/events/${id}`, { ticketPrice: Number(newPrice), isFree: Number(newPrice) === 0 });
      setEvent(data.event);
      alert('Ticket Price Updated Successfully!');
    } catch (err) {
      alert('Failed to update price');
    }
  };

  if (!event) return <div className="text-center mt-20 animate-pulse text-brand-mid">Loading robust event data...</div>;

  const tabs = ['overview', 'tasks', 'budget', 'volunteers', 'updates', 'attendees', 'risks'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-white">{event.name}</h1>
          <p className="font-sans text-brand-mid mt-1">{new Date(event.date).toLocaleDateString()} • {event.city}</p>
        </div>
        <span className="bg-brand-info text-brand-bg text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {event.status}
        </span>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-6 border-b border-brand-border mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-sans text-sm font-medium capitalize whitespace-nowrap ${
              activeTab === tab 
                ? 'text-brand-white border-b-2 border-brand-accent' 
                : 'text-brand-mid hover:text-brand-light'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-8 min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-brand-surface border border-brand-border border border-brand-border shadow-sm">
              <h3 className="text-xs font-bold text-brand-mid uppercase tracking-widest mb-2">Expected Audience</h3>
              <p className="text-3xl font-serif font-black text-brand-white">{event.expectedAudience}</p>
            </div>
            <div className="p-6 bg-brand-surface border border-brand-border border border-brand-border shadow-sm">
              <h3 className="text-xs font-bold text-brand-mid uppercase tracking-widest mb-2">Total Budget</h3>
              <p className="text-3xl font-serif font-black text-brand-white">₹{event.totalBudget?.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-brand-surface border border-brand-border border border-brand-border shadow-sm">
              <h3 className="text-xs font-bold text-brand-mid uppercase tracking-widest mb-2">Volunteers</h3>
              <p className="text-3xl font-serif font-black text-brand-white">{event.volunteersNeeded}</p>
            </div>
            <div className="p-6 bg-brand-surface border border-brand-border shadow-sm flex flex-col justify-between">
              <h3 className="text-xs font-bold text-brand-mid uppercase tracking-widest mb-2">Ticket Price (INR)</h3>
              <div className="flex space-x-2 mt-2">
                <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full bg-brand-surface border border-brand-border border border-brand-border px-3 py-2 text-lg font-bold font-sans outline-none focus:border-brand-accent transition-colors" />
                <button onClick={handleUpdatePrice} className="bg-brand-accent hover:bg-brand-accentHov text-brand-bg px-4 font-bold text-sm  transition-colors">Save</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tasks' && <TaskKanban eventId={event._id} />}
        
        {activeTab === 'budget' && <BudgetTable eventId={event._id} expectedAudience={event.expectedAudience} ticketPrice={event.ticketPrice} />}
        
        {activeTab === 'volunteers' && <VolunteerManager eventId={event._id} />}
        {activeTab === 'updates' && <OrganizerUpdates eventId={event._id} />}

        {/* Simplified placeholders for the rest */}
        {['attendees', 'risks'].includes(activeTab) && (
          <div className="text-center py-32 text-brand-mid font-sans border-2 border-dashed border-brand-border rounded-xl">
            {activeTab} module perfectly ready to build next.
          </div>
        )}
      </div>
    </div>
  );
}
