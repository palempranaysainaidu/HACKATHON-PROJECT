import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Megaphone, Check, ShieldCheck, ChevronRight, Clock } from 'lucide-react';

const FAKE_REVIEWS = [
  { name: 'Arjun Verma', rating: 5, text: 'Seamlessly organized. Everything from entry to food was perfectly managed.' },
  { name: 'Meera Iyer',  rating: 5, text: 'Best event I have attended this year. Will definitely register again!' },
  { name: 'Karan Nair',  rating: 4, text: 'Great experience overall. The volunteer team was incredibly helpful.' },
];

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [wantsFood, setWantsFood] = useState(false);
  const [wantsTransport, setWantsTransport] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/attendee/events/${slug}`);
        setEvent(data.event);
        try {
          const upData = await axios.get(`/attendee/events/${data.event._id}/updates`);
          setUpdates(upData.data.updates || []);
        } catch {}
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchEvent();
  }, [slug]);

  const baseTicketCost = event ? (event.isFree ? 0 : event.ticketPrice) : 0;
  const totalCost = baseTicketCost * numberOfGuests
    + (wantsFood ? (event?.foodCost || 200) * numberOfGuests : 0)
    + (wantsTransport ? (event?.transportCost || 300) * numberOfGuests : 0);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await axios.post(`/attendee/events/${event._id}/register`, { wantsFood, wantsTransport, numberOfGuests, totalCost });
      setRegistered(true);
      setTimeout(() => navigate('/attendee/dashboard'), 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration error');
    } finally { setRegistering(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin" />
        <p className="font-sans text-brand-mid text-sm">Loading event details...</p>
      </div>
    </div>
  );

  if (!event) return <div className="py-20 text-center font-sans text-brand-mid">Event not found.</div>;

  const orgName = event.organizerId?.organization || 'EventOS Partner';

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center space-x-2 text-xs font-sans text-brand-dim">
        <span className="hover:text-brand-mid cursor-pointer transition-colors" onClick={() => navigate('/events')}>Events</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-mid">{event.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Left Col ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Cover */}
          <div className="relative h-64 sm:h-80 card overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/8 to-brand-info/5" />
            <span className="font-serif text-[120px] font-black opacity-[0.06] select-none text-brand-white tracking-tighter leading-none">
              {event.name?.substring(0,2)?.toUpperCase()}
            </span>
            <div className="absolute top-5 left-5 chip chip-open uppercase">{event.status}</div>
            <div className="absolute top-5 right-5 chip border border-brand-border bg-brand-card text-brand-accent uppercase">{event.type}</div>
          </div>

          {/* Title block */}
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-white mb-4 leading-tight">{event.name}</h1>
            <p className="font-sans text-brand-mid text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: 'Date', value: new Date(event.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) },
              { icon: MapPin, label: 'Location', value: event.city || 'TBA' },
              { icon: Users, label: 'Capacity', value: `${event.expectedAudience?.toLocaleString()} guests` },
              { icon: Clock, label: 'Status', value: event.status },
            ].map(m => (
              <div key={m.label} className="card p-4 hover:border-brand-muted transition-colors">
                <m.icon className="w-4 h-4 text-brand-accent mb-2" />
                <div className="text-[10px] font-bold text-brand-dim uppercase tracking-widest mb-1">{m.label}</div>
                <div className="font-sans font-semibold text-brand-white text-sm capitalize">{m.value}</div>
              </div>
            ))}
          </div>

          {/* ── Organizer Business Card ── */}
          <div className="card p-6 hover:border-brand-muted transition-colors">
            <h3 className="font-serif text-lg font-bold text-brand-white mb-5">About the Organizer</h3>
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-brand-accentHov/10 border border-brand-accent/20 flex items-center justify-center">
                <span className="font-serif text-xl font-black text-brand-accent uppercase">{orgName.substring(0,2)}</span>
              </div>
              <div>
                <h4 className="font-sans font-bold text-brand-white">{orgName}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  {Array(5).fill(0).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-brand-accent text-brand-accent' : 'text-brand-muted'}`} />)}
                  <span className="font-sans text-xs text-brand-dim ml-1.5">(4.8 · 124 reviews)</span>
                </div>
              </div>
            </div>

            <p className="font-sans text-brand-mid text-sm leading-relaxed mb-5">
              A premier event management firm known for high-fidelity coordination, rapid logistics deployment, and deep volunteer networks. Over 5 years of delivering extraordinary experiences.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[['15', 'Events Hosted'], ['12K+', 'Attendees'], ['98%', 'Satisfaction']].map(([v, l]) => (
                <div key={l} className="text-center py-3 rounded-lg bg-brand-surface border border-brand-border">
                  <div className="font-serif font-black text-xl text-gradient-gold">{v}</div>
                  <div className="text-[9px] font-bold text-brand-dim uppercase tracking-wider mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            {/* Fake reviews */}
            <div className="space-y-3 border-t border-brand-border pt-4">
              {FAKE_REVIEWS.map(r => (
                <div key={r.name} className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-brand-card border border-brand-border flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-brand-mid">{r.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className="font-sans font-bold text-xs text-brand-light">{r.name}</span>
                      <div className="flex">{Array(r.rating).fill(0).map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-brand-accent text-brand-accent" />)}</div>
                    </div>
                    <p className="font-sans text-xs text-brand-mid leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Updates */}
          {updates.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                <h3 className="font-serif text-lg font-bold text-brand-white">Live Announcements</h3>
              </div>
              <div className="space-y-3">
                {updates.map(u => (
                  <div key={u._id} className="p-4 rounded-lg bg-brand-surface border border-brand-border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="chip bg-brand-info/10 text-brand-info border border-brand-info/20">{u.type || 'Update'}</span>
                      <span className="text-[10px] font-sans text-brand-dim">{new Date(u.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="font-sans text-sm text-brand-light leading-relaxed">{u.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Sidebar — Ticket ── */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-6">
            {/* Price header */}
            <div>
              <div className="text-[10px] font-bold text-brand-dim uppercase tracking-widest mb-1">Entry Price</div>
              <div className="font-serif text-4xl font-black text-gradient-gold">
                {event.isFree ? 'FREE' : `₹${event.ticketPrice}`}
              </div>
              {!event.isFree && <div className="text-xs text-brand-dim font-sans mt-1">per person</div>}
            </div>

            <div className="divider-gold" />

            {/* Ticket count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-dim mb-2">Tickets</label>
              <div className="flex items-center border border-brand-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                  className="px-4 py-3 text-brand-mid hover:text-brand-white hover:bg-white/5 font-bold transition-colors"
                >−</button>
                <div className="flex-1 text-center font-mono font-bold text-brand-white py-3">{numberOfGuests}</div>
                <button
                  onClick={() => setNumberOfGuests(Math.min(5, numberOfGuests + 1))}
                  className="px-4 py-3 text-brand-mid hover:text-brand-white hover:bg-white/5 font-bold transition-colors"
                >+</button>
              </div>
            </div>

            {/* Add-ons */}
            {(event.providesFood || event.providesTransport) && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-dim mb-2">Add-ons</label>
                {event.providesFood && (
                  <button
                    onClick={() => setWantsFood(!wantsFood)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all duration-200 ${wantsFood ? 'border-brand-success/40 bg-brand-success/5 text-brand-success' : 'border-brand-border text-brand-mid hover:border-brand-muted hover:text-brand-light'}`}
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${wantsFood ? 'bg-brand-success border-brand-success' : 'border-brand-muted'}`}>
                        {wantsFood && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-sm">Catering Pass</div>
                        <div className="font-sans text-xs opacity-70">+ ₹{event.foodCost || 200} / person</div>
                      </div>
                    </div>
                  </button>
                )}
                {event.providesTransport && (
                  <button
                    onClick={() => setWantsTransport(!wantsTransport)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all duration-200 ${wantsTransport ? 'border-brand-info/40 bg-brand-info/5 text-brand-info' : 'border-brand-border text-brand-mid hover:border-brand-muted hover:text-brand-light'}`}
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${wantsTransport ? 'bg-brand-info border-brand-info' : 'border-brand-muted'}`}>
                        {wantsTransport && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-sm">Transport Pass</div>
                        <div className="font-sans text-xs opacity-70">+ ₹{event.transportCost || 300} / person</div>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Total */}
            <div className="p-4 rounded-xl bg-brand-surface border border-brand-border">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-dim">Total</span>
                <span className="font-serif text-3xl font-black text-brand-white">₹{totalCost}</span>
              </div>
              {numberOfGuests > 1 && (
                <div className="text-right text-xs text-brand-dim mt-1">for {numberOfGuests} persons</div>
              )}
            </div>

            {/* CTA */}
            {registered ? (
              <div className="w-full py-4 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center space-x-2 text-brand-success font-bold font-sans">
                <ShieldCheck className="w-5 h-5" />
                <span>Registered! Redirecting...</span>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="btn-gold w-full flex items-center justify-center py-4 text-base"
              >
                {registering ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : 'Confirm Registration'}
              </button>
            )}

            <p className="text-center text-[10px] font-sans text-brand-dim leading-relaxed">
              Secure registration · Instant ID card · 24h support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
