import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function EventCatalog() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/attendee/events');
        setEvents(data.events);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-brand-mid">Finding events...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 text-center space-y-4">
        <h1 className="font-serif text-5xl font-bold text-brand-black">Discover Experiences</h1>
        <p className="font-sans text-xl text-brand-mid max-w-2xl mx-auto">Browse the latest cultural, technical, and social events happening near you.</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 text-brand-mid font-sans border border-brand-border rounded-xl bg-brand-surface">No open events right now. Check back later!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <div key={event._id} className="bg-brand-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col">
              <div className="h-48 bg-gradient-to-br from-brand-black to-brand-mid relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-500">
                  <h2 className="font-serif text-5xl font-bold text-white tracking-tight">{event.name.substring(0,2)}</h2>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-brand-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {event.type}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-2xl font-bold text-brand-black mb-2 line-clamp-1">{event.name}</h3>
                <p className="font-sans text-sm text-brand-mid mb-4 flex-1 line-clamp-2">{event.description}</p>
                
                <div className="grid grid-cols-3 gap-2 text-sm font-sans mb-6 border-y border-brand-border py-4">
                  <div>
                    <span className="block text-brand-mid font-medium text-[10px] uppercase tracking-wider mb-1">Date</span>
                    <span className="text-brand-dark font-semibold">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-brand-mid font-medium text-[10px] uppercase tracking-wider mb-1">Location</span>
                    <span className="text-brand-dark font-semibold">{event.city}</span>
                  </div>
                  <div>
                    <span className="block text-brand-mid font-medium text-[10px] uppercase tracking-wider mb-1">Entry</span>
                    <span className="text-brand-black font-bold">{event.isFree ? 'FREE' : `₹${event.ticketPrice}`}</span>
                  </div>
                </div>

                <Link to={`/events/${event.slug}`} className="w-full bg-brand-black hover:bg-black text-brand-white text-center py-3 rounded-full font-sans font-medium transition-colors block">
                   View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
