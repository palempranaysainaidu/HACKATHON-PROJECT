import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { Download, Star, Calendar, MapPin, Ticket, ArrowRight, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AttendeeDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const { data } = await axios.get('/attendee/registrations');
        setRegistrations(data.registrations);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchRegs();
  }, []);

  const handleFeedback = async (regId, rating) => {
    try {
      await axios.post(`/attendee/registrations/${regId}/feedback`, { rating, feedback: 'Great event!' });
      setRegistrations(registrations.map(r => r._id === regId ? { ...r, feedbackSubmitted: true, rating } : r));
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const upcoming = registrations.filter(r => r.eventId.status !== 'completed');
  const past = registrations.filter(r => r.eventId.status === 'completed');

  const STATUS_COLOR = {
    open:      'chip-open',
    ongoing:   'chip bg-brand-accent/10 text-brand-accent border border-brand-accent/20',
    completed: 'chip-done',
    draft:     'chip-draft',
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 dash-gradient min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-sans text-brand-accent text-sm font-semibold mb-1">{greeting},</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-white">
            {user?.name?.split(' ')[0] || 'Attendee'}
          </h1>
          <p className="font-sans text-brand-mid mt-1.5">Your event portfolio and digital ID cards.</p>
        </div>
        <Link to="/events" className="btn-gold flex items-center self-start sm:self-auto">
          <Ticket className="w-4 h-4 mr-2" />
          Find Events
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Registered', value: registrations.length },
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Past Events', value: past.length },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="font-serif text-3xl font-black text-gradient-gold">{s.value}</div>
            <div className="font-sans text-xs text-brand-mid uppercase tracking-widest font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Registrations */}
      {registrations.length === 0 ? (
        <div className="card p-16 text-center border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-brand-accentLow border border-brand-accent/20 flex items-center justify-center mx-auto mb-5">
            <Ticket className="w-7 h-7 text-brand-accent" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-brand-white mb-3">No tickets yet</h3>
          <p className="font-sans text-brand-mid mb-8 max-w-sm mx-auto">Explore available events and register for an unforgettable experience.</p>
          <Link to="/events" className="btn-gold inline-flex items-center">Browse Events<ArrowRight className="w-4 h-4 ml-2" /></Link>
        </div>
      ) : (
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-white mb-5">My Tickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map(reg => (
              <div key={reg._id} className="card flex flex-col overflow-hidden hover:border-brand-muted transition-all duration-300 group">
                {/* Gradient top */}
                <div className="h-28 bg-gradient-to-br from-brand-accent/8 to-brand-info/5 relative flex items-center justify-center border-b border-brand-border">
                  <span className="font-serif text-5xl font-black text-brand-white opacity-[0.07] select-none">
                    {reg.eventId.name?.substring(0,2)?.toUpperCase()}
                  </span>
                  <div className="absolute top-3 right-3">
                    <span className={STATUS_COLOR[reg.eventId.status] || 'chip-draft'}>
                      {reg.eventId.status}
                    </span>
                  </div>
                  {/* Ticket perforation line */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center">
                    {Array(24).fill(0).map((_, i) => <div key={i} className="flex-1 h-px border-t border-dashed border-brand-border/50" />)}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-base font-bold text-brand-white mb-3 leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">
                    {reg.eventId.name}
                  </h3>

                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-brand-dim flex items-center space-x-1.5"><Calendar className="w-3 h-3" /><span>Date</span></span>
                      <span className="text-brand-light font-medium">{new Date(reg.eventId.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-brand-dim flex items-center space-x-1.5"><Ticket className="w-3 h-3" /><span>Code</span></span>
                      <span className="font-mono text-brand-accent font-bold tracking-widest">{reg.registrationCode}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-brand-dim">Amount Paid</span>
                      <span className="text-brand-white font-bold">₹{reg.totalCost} · {reg.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-brand-border pt-4">
                    <a
                      href={reg.idCardUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="btn-outline w-full flex items-center justify-center text-sm py-2.5"
                    >
                      <Download className="w-3.5 h-3.5 mr-2" />Download ID Card
                    </a>
                    <Link
                      to={`/events/${reg.eventId.slug}`}
                      className="btn-ghost w-full flex items-center justify-center text-sm py-2.5 border border-transparent hover:border-brand-border"
                    >
                      <Megaphone className="w-3.5 h-3.5 mr-2" />View Live Updates
                    </Link>
                  </div>

                  {/* Feedback */}
                  {reg.eventId.status === 'completed' && reg.attended && !reg.feedbackSubmitted && (
                    <div className="mt-3 p-3 rounded-lg bg-brand-surface border border-brand-border">
                      <p className="text-[10px] font-bold text-brand-dim uppercase tracking-widest mb-2 text-center">Rate this event</p>
                      <div className="flex justify-center space-x-2">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => handleFeedback(reg._id, star)} className="text-brand-muted hover:text-brand-accent transition-colors hover:scale-125 transform duration-150">
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {reg.feedbackSubmitted && (
                    <div className="mt-3 text-center">
                      <span className="text-xs font-sans text-brand-success font-bold">✓ Feedback Submitted</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
