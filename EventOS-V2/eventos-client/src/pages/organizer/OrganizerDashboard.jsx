import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/organizer/EventCard';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/organizer/events');
        setEvents(data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-border">
        <div>
          <h1 className="font-serif text-4xl font-bold text-brand-black mb-2 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Organizer'}!</h1>
          <p className="font-sans text-brand-mid">Here's an overview of your events.</p>
        </div>
        <Link to="/organizer/events/new" className="bg-brand-accent hover:bg-brand-accentHov text-brand-white font-sans font-medium px-6 py-2.5 rounded-full transition-colors">
          + Create New Event
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center my-20">
          <p className="font-sans text-brand-mid animate-pulse">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center bg-brand-white border border-brand-border rounded-xl p-16">
          <h3 className="font-serif text-2xl font-semibold text-brand-dark mb-3">No events yet</h3>
          <p className="font-sans text-brand-mid mb-8">You haven't created any events. Start planning your first one!</p>
          <Link to="/organizer/events/new" className="bg-brand-accent hover:bg-brand-accentHov text-brand-white font-sans font-medium px-6 py-2.5 rounded-full transition-colors">
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
