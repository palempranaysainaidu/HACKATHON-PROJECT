import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter, Tag, ArrowRight } from 'lucide-react';

const TYPE_ACCENT = {
  technical:  'text-blue-400  bg-blue-400/10  border-blue-400/20',
  cultural:   'text-purple-400 bg-purple-400/10 border-purple-400/20',
  sports:     'text-green-400  bg-green-400/10  border-green-400/20',
  social:     'text-amber-400  bg-amber-400/10  border-amber-400/20',
  academic:   'text-cyan-400   bg-cyan-400/10   border-cyan-400/20',
  fundraiser: 'text-rose-400   bg-rose-400/10   border-rose-400/20',
  other:      'text-brand-accent bg-brand-accentLow border-brand-accent/20',
};

const TYPE_GRAD = {
  technical:  'from-blue-500/8 to-indigo-500/4',
  cultural:   'from-purple-500/8 to-pink-500/4',
  sports:     'from-green-500/8 to-emerald-500/4',
  social:     'from-amber-500/8 to-orange-500/4',
  academic:   'from-cyan-500/8 to-teal-500/4',
  fundraiser: 'from-rose-500/8 to-red-500/4',
  other:      'from-brand-accent/8 to-brand-accentHov/4',
};

export default function EventCatalog() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/attendee/events');
        setEvents(data.events);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const TYPES = ['all', ...new Set(events.map(e => e.type).filter(Boolean))];

  const filtered = events.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.city?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || e.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="text-center pt-4">
        <p className="section-label mb-3">Discover Experiences</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-white mb-4 leading-tight">Find your next event.</h1>
        <p className="font-sans text-brand-mid text-lg max-w-xl mx-auto">
          Browse cultural, technical, and social events happening near you — powered by an AI-managed team.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events by name or city..."
            className="input-field pl-11 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.slice(0, 5).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2.5 rounded-lg border font-sans text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                filter === t
                  ? 'bg-brand-accent text-brand-bg border-brand-accent'
                  : 'border-brand-border text-brand-mid hover:border-brand-muted hover:text-brand-light bg-brand-card'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-44 bg-brand-muted/20" />
              <div className="p-6 space-y-3">
                <div className="h-3 bg-brand-muted/20 rounded w-1/4" />
                <div className="h-5 bg-brand-muted/20 rounded w-3/4" />
                <div className="h-3 bg-brand-muted/20 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center mx-auto mb-4">
            <Filter className="w-6 h-6 text-brand-dim" />
          </div>
          <h3 className="font-serif text-xl font-bold text-brand-white mb-2">No events found</h3>
          <p className="font-sans text-brand-mid text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event, i) => {
            const typeAccent = TYPE_ACCENT[event.type] || TYPE_ACCENT.other;
            const typeGrad   = TYPE_GRAD[event.type] || TYPE_GRAD.other;
            return (
              <div
                key={event._id}
                className="group card hover:border-brand-muted hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Cover */}
                <div className={`relative h-44 bg-gradient-to-br ${typeGrad} flex items-center justify-center overflow-hidden`}>
                  <span className="font-serif text-7xl font-black opacity-[0.07] select-none text-brand-white tracking-tighter">
                    {event.name?.substring(0,2)?.toUpperCase()}
                  </span>
                  <div className={`absolute top-3 left-3 chip border ${typeAccent}`}>{event.type}</div>
                  <div className="absolute top-3 right-3 glass px-2.5 py-1 rounded-lg">
                    <span className="font-mono font-bold text-xs text-brand-white">
                      {event.isFree ? 'FREE' : `₹${event.ticketPrice}`}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg font-bold text-brand-white mb-3 line-clamp-2 leading-snug group-hover:text-brand-accent transition-colors duration-300">
                    {event.name}
                  </h3>
                  <p className="font-sans text-brand-mid text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs font-sans text-brand-mid">
                      <Calendar className="w-3.5 h-3.5 text-brand-dim shrink-0" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-sans text-brand-mid">
                      <MapPin className="w-3.5 h-3.5 text-brand-dim shrink-0" />
                      <span>{event.city || 'Location TBA'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-sans text-brand-mid">
                      <Users className="w-3.5 h-3.5 text-brand-dim shrink-0" />
                      <span>{event.expectedAudience?.toLocaleString()} expected attendees</span>
                    </div>
                  </div>

                  <div className="border-t border-brand-border pt-4">
                    <Link to={`/events/${event.slug}`} className="flex items-center justify-between group/link">
                      <span className="font-sans text-sm font-semibold text-brand-light group-hover/link:text-brand-accent transition-colors">View Details</span>
                      <ArrowRight className="w-4 h-4 text-brand-dim group-hover/link:text-brand-accent group-hover/link:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
