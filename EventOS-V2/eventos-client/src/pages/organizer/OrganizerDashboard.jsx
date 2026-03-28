import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/organizer/EventCard';
import { Plus, TrendingUp, Users, Calendar, Zap, ArrowRight } from 'lucide-react';

const MOCK_STATS = [
  { icon: Calendar, label: 'Total Events', value: '--', key: 'total' },
  { icon: TrendingUp, label: 'Active Events', value: '--', key: 'active' },
  { icon: Users, label: 'Vol. Applications', value: '12', key: 'vol' },
  { icon: Zap, label: 'AI Plans Built', value: '--', key: 'ai' },
];

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

  const stats = [
    { icon: Calendar, label: 'Total Events', value: events.length },
    { icon: TrendingUp, label: 'Live / Open', value: events.filter(e => e.status === 'open' || e.status === 'ongoing').length },
    { icon: Zap, label: 'AI Plans Built', value: events.filter(e => e.planGenerated).length },
    { icon: Users, label: 'Volunteers Needed', value: events.reduce((s, e) => s + (e.volunteersNeeded || 0), 0) },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-10 dash-gradient min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-sans text-brand-accent text-sm font-semibold mb-1">{greeting},</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-white">
            {user?.name?.split(' ')[0] || 'Organizer'}
          </h1>
          <p className="font-sans text-brand-mid mt-1.5">Here's a snapshot of your event portfolio.</p>
        </div>
        <Link
          to="/organizer/events/new"
          className="btn-gold flex items-center self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Link>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="card p-5 hover:border-brand-muted transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-brand-accentLow border border-brand-accent/15 flex items-center justify-center group-hover:border-brand-accent/30 transition-colors">
                <s.icon className="w-4 h-4 text-brand-accent" />
              </div>
            </div>
            <div className="font-serif text-2xl font-black text-brand-white">{loading ? '—' : s.value}</div>
            <div className="font-sans text-xs text-brand-mid uppercase tracking-widest font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Events Grid ── */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl font-bold text-brand-white">Your Events</h2>
          <span className="text-brand-dim font-sans text-sm">{events.length} total</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card h-64 animate-pulse">
                <div className="h-36 bg-brand-muted/20" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-brand-muted/20 rounded w-1/3" />
                  <div className="h-4 bg-brand-muted/20 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="card p-16 text-center border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-brand-accentLow border border-brand-accent/20 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-7 h-7 text-brand-accent" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-white mb-3">No events yet</h3>
            <p className="font-sans text-brand-mid mb-8 max-w-sm mx-auto">
              Create your first event using AI to generate a complete plan in seconds.
            </p>
            <Link to="/organizer/events/new" className="btn-gold inline-flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  );
}
