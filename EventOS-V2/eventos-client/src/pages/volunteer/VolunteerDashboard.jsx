import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Calendar, MapPin, CheckCircle, Clock, Bell, Plus, X, Upload } from 'lucide-react';

const FAKE_LIVE_EVENTS = [
  { name: 'TechSummit India 2025', city: 'Bangalore', date: '2025-06-14', skills: ['A/V Setup', 'Registration Desk', 'Photography'] },
  { name: 'Harmony Cultural Fest', city: 'Mumbai', date: '2025-07-20', skills: ['Stage Management', 'Crowd Control', 'First Aid'] },
  { name: 'Startup Arena Delhi', city: 'New Delhi', date: '2025-08-05', skills: ['Marketing', 'Logistics', 'Technical Support'] },
];

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [openEvents, setOpenEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [appForm, setAppForm] = useState({ skills: [], availability: 'Full', resumeUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [appsRes, eventsRes] = await Promise.all([
          axios.get('/volunteer/applications'),
          axios.get('/volunteer/events')
        ]);
        setApplications(appsRes.data.applications);
        setOpenEvents(eventsRes.data.events);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  const triggerApply = (event) => {
    setSelectedEvent(event);
    setAppForm({ skills: [], availability: 'Full', resumeUrl: '' });
    setApplyModalOpen(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`/volunteer/events/${selectedEvent._id}/apply`, {
        skills: Array.isArray(appForm.skills) ? appForm.skills.join(', ') : appForm.skills,
        availability: appForm.availability,
        motivation: 'Ready to serve',
        resumeUrl: appForm.resumeUrl
      });
      const appsRes = await axios.get('/volunteer/applications');
      setApplications(appsRes.data.applications);
      setApplyModalOpen(false);
    } catch (err) { alert('Cannot apply again / Error'); } finally { setSubmitting(false); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const STATUS_MAP = {
    accepted: { cls: 'chip chip-open', label: 'Accepted' },
    rejected: { cls: 'chip bg-brand-error/10 text-brand-error border border-brand-error/20', label: 'Declined' },
    pending:  { cls: 'chip chip-draft', label: 'Pending' },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 dash-gradient min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-16">

      {/* Header */}
      <div>
        <p className="font-sans text-brand-accent text-sm font-semibold mb-1">{greeting},</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-white">
          {user?.name?.split(' ')[0] || 'Volunteer'}
        </h1>
        <p className="font-sans text-brand-mid mt-1.5">Manage your volunteer assignments and discover new events.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Applications', value: applications.length },
          { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
          { label: 'Pending', value: applications.filter(a => a.status === 'pending').length },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="font-serif text-3xl font-black text-gradient-gold">{s.value}</div>
            <div className="font-sans text-xs text-brand-mid uppercase tracking-widest font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* My Applications */}
      <div>
        <h2 className="font-serif text-xl font-bold text-brand-white mb-5">My Applications</h2>
        {applications.length === 0 ? (
          <div className="card p-10 text-center border-dashed">
            <p className="font-sans text-brand-mid">You haven't applied to any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {applications.map(app => {
              const s = STATUS_MAP[app.status] || STATUS_MAP.pending;
              return (
                <div key={app._id} className="card p-5 hover:border-brand-muted transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent/10 to-brand-accentHov/5 border border-brand-accent/15 flex items-center justify-center flex-shrink-0">
                      <span className="font-serif font-black text-sm text-brand-accent">{app.eventId?.name?.substring(0,2)?.toUpperCase()}</span>
                    </div>
                    <span className={s.cls}>{s.label}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-brand-white leading-snug mb-2 line-clamp-2">{app.eventId?.name}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-brand-dim font-sans mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(app.eventId?.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                  </div>

                  {app.status === 'accepted' ? (
                    <div className="mt-auto space-y-2 border-t border-brand-border pt-3">
                      {app.assignedRole && (
                        <div className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-brand-accentLow border border-brand-accent/15">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                          <span className="font-sans text-xs font-bold text-brand-accent">{app.assignedRole}</span>
                        </div>
                      )}
                      <Link
                        to={`/volunteer/workspace/${app.eventId?._id}`}
                        className="btn-gold w-full text-center text-sm py-2.5 flex items-center justify-center"
                      >
                        Enter Workspace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-auto pt-3 border-t border-brand-border">
                      <div className="flex items-center space-x-1.5 text-xs text-brand-dim font-sans">
                        <Clock className="w-3 h-3" />
                        <span>Awaiting organizer review</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Browse Events */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-brand-white">Open Opportunities</h2>
          <span className="text-brand-dim font-sans text-sm">{openEvents.length} available</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {openEvents.map(event => {
            const hasApplied = applications.some(a => a.eventId._id === event._id);
            return (
              <div key={event._id} className="card p-5 hover:border-brand-muted transition-all duration-300 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-bold text-brand-white leading-snug mb-1 group-hover:text-brand-accent transition-colors">{event.name}</h3>
                    <div className="flex items-center space-x-1.5 text-xs text-brand-dim font-sans">
                      <MapPin className="w-3 h-3" /><span>{event.city}</span>
                      <span>·</span>
                      <Calendar className="w-3 h-3" /><span>{new Date(event.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                    </div>
                  </div>
                </div>

                {event.requiredSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {event.requiredSkills.slice(0,3).map(s => (
                      <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface border border-brand-border text-brand-mid uppercase tracking-wide">{s}</span>
                    ))}
                    {event.requiredSkills.length > 3 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-surface border border-brand-border text-brand-dim">+{event.requiredSkills.length - 3}</span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => triggerApply(event)}
                  disabled={hasApplied}
                  className={`w-full py-2.5 rounded-lg font-sans font-bold text-sm transition-all duration-200 ${
                    hasApplied
                      ? 'bg-brand-card border border-brand-border text-brand-dim cursor-default'
                      : 'btn-gold'
                  }`}
                >
                  {hasApplied ? '✓ Application Sent' : 'Apply to Volunteer'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setApplyModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl shadow-modal overflow-hidden animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
            <div className="p-7">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="section-label mb-1">Submit Application</div>
                  <h2 className="font-serif text-xl font-bold text-brand-white">{selectedEvent.name}</h2>
                </div>
                <button onClick={() => setApplyModalOpen(false)} className="text-brand-dim hover:text-brand-light transition-colors p-1 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitApplication} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-dim mb-3">
                    Select Your Skills
                  </label>
                  {selectedEvent.requiredSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.requiredSkills.map(skill => {
                        const isSelected = appForm.skills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => {
                              const cur = [...appForm.skills];
                              setAppForm({ ...appForm, skills: isSelected ? cur.filter(s => s !== skill) : [...cur, skill] });
                            }}
                            className={`px-3.5 py-2 rounded-lg border text-xs font-bold transition-all duration-200 ${
                              isSelected
                                ? 'border-brand-success bg-brand-success/10 text-brand-success shadow-sm'
                                : 'border-brand-border bg-brand-card text-brand-mid hover:border-brand-muted hover:text-brand-light'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{skill}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <input type="text" required placeholder="e.g. Graphic design, Crowd control" value={appForm.skills} onChange={e => setAppForm({ ...appForm, skills: e.target.value })} className="input-field" />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-dim mb-2">Availability</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Full', 'Partial'].map(opt => (
                      <button key={opt} type="button" onClick={() => setAppForm({ ...appForm, availability: opt })}
                        className={`py-2.5 rounded-lg border font-sans text-sm font-bold transition-all ${appForm.availability === opt ? 'border-brand-accent bg-brand-accentLow text-brand-accent' : 'border-brand-border bg-brand-card text-brand-mid hover:border-brand-muted'}`}>
                        {opt === 'Full' ? 'Full Duration' : 'Partial (Few hrs)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-dim mb-2">Resume Link</label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim" />
                    <input type="url" placeholder="Google Drive / LinkedIn / Portfolio" value={appForm.resumeUrl} onChange={e => setAppForm({ ...appForm, resumeUrl: e.target.value })} className="input-field pl-10" />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setApplyModalOpen(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-gold flex-1 flex items-center justify-center">
                    {submitting ? <span className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" /> : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
