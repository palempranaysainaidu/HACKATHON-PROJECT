import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { Megaphone, AlertCircle } from 'lucide-react';

export default function OrganizerUpdates({ eventId }) {
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      const { data } = await axios.get(`/organizer/events/${eventId}/live-updates`);
      setUpdates(data.updates);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUpdates(); }, [eventId]);

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;
    try {
      const { data } = await axios.post(`/organizer/events/${eventId}/live-updates`, { content: newUpdate, type: 'announcement' });
      setUpdates([data.update, ...updates]);
      setNewUpdate('');
    } catch (err) {
      console.error(err);
      alert('Failed to post update. Ensure your role has permission.');
    }
  };

  if (loading) return <div className="p-8 text-center text-brand-mid animate-pulse">Loading Updates...</div>;

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-8 border-b border-brand-border pb-6">
        <h2 className="font-serif text-3xl font-bold text-brand-black mb-2 flex items-center">
          <Megaphone className="w-8 h-8 mr-3 text-brand-dark" /> Broadcast Center
        </h2>
        <p className="font-sans text-brand-mid">Post real-time updates here. They will instantly appear on the public Attendee pages and the Volunteer Workspaces.</p>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-xl p-6 mb-8">
        <h3 className="font-sans font-bold text-brand-dark mb-4">Post a New Update</h3>
        <form onSubmit={handlePostUpdate} className="flex flex-col space-y-4">
          <textarea 
            rows="3"
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="e.g. Schedule Change: The keynote speaker will now begin at 2:00 PM in Hall B."
            className="w-full bg-white border border-brand-border p-4 font-sans text-sm focus:outline-none focus:border-brand-black resize-none"
            required
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-brand-mid font-sans flex items-center"><AlertCircle className="w-4 h-4 mr-1" /> Publicly visible</span>
            <button type="submit" className="bg-brand-black hover:bg-black text-white px-8 py-2.5 font-bold font-sans transition-colors">
              Broadcast Now
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-sans font-bold text-brand-dark mb-4 border-b border-brand-border pb-2">Recent Broadcasts</h3>
        {updates.length === 0 ? (
          <div className="text-center py-10 bg-white border border-brand-border rounded-lg text-brand-mid font-sans text-sm">
            No updates broadcasted yet.
          </div>
        ) : (
          updates.map(update => (
            <div key={update._id} className="bg-white border text-left border-brand-border p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-brand-tag text-brand-mid text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                  {update.type || 'Announcement'}
                </span>
                <span className="text-xs font-sans text-brand-light font-medium">
                  {new Date(update.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="font-sans text-sm text-brand-black">{update.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
