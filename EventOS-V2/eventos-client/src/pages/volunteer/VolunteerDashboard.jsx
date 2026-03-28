import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [openEvents, setOpenEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [appForm, setAppForm] = useState({ skills: [], availability: 'Full', resumeUrl: '' });

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

  const triggerApply = (eventId) => {
    setSelectedEventId(eventId);
    setApplyModalOpen(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/volunteer/events/${selectedEventId}/apply`, {
        skills: Array.isArray(appForm.skills) ? appForm.skills.join(', ') : appForm.skills, 
        availability: appForm.availability, 
        motivation: 'Ready to serve', 
        resumeUrl: appForm.resumeUrl
      });
      const appsRes = await axios.get('/volunteer/applications');
      setApplications(appsRes.data.applications);
      setApplyModalOpen(false);
      setAppForm({ skills: [], availability: 'Full', resumeUrl: '' });
    } catch (err) { console.error(err); alert('Cannot apply again/Error'); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-brand-mid">Loading Volunteer Hub...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="border-b border-brand-border pb-6">
         <h1 className="font-serif text-4xl font-bold text-brand-black mb-2 tracking-tight">Welcome, {user?.name?.split(' ')[0] || 'Volunteer'}!</h1>
         <p className="font-sans text-brand-mid">Manage your shifts or find new events to join.</p>
      </div>

      <section>
        <h2 className="font-serif text-xl font-bold text-brand-dark mb-4">My Events & Roles</h2>
        {applications.length === 0 ? (
           <div className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center">
             <p className="text-brand-mid font-sans">You haven't applied to any events yet.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map(app => (
                <div key={app._id} className="bg-brand-white border border-brand-border rounded-xl p-6 shadow-sm flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-sans font-bold text-lg text-brand-black">{app.eventId.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${app.status==='accepted'?'bg-brand-accent text-white':app.status==='rejected'?'bg-brand-error text-white':'bg-brand-tag text-brand-mid'}`}>
                       {app.status}
                    </span>
                  </div>
                  <p className="text-sm font-sans text-brand-mid mb-2">Date: {new Date(app.eventId.date).toLocaleDateString()}</p>
                  
                  {app.status === 'accepted' ? (
                     <div className="mt-auto pt-4 border-t border-brand-border space-y-3">
                       <p className="text-xs font-semibold text-brand-dark uppercase tracking-wide">Assigned Role: <span className="text-brand-accent">{app.assignedRole || 'Pending Assignment'}</span></p>
                       <Link to={`/volunteer/workspace/${app.eventId._id}`} className="block w-full bg-brand-black hover:bg-black text-white text-center font-sans font-medium py-2 rounded-full transition-colors">
                         Enter Workspace
                       </Link>
                     </div>
                  ) : (
                     <div className="mt-auto pt-4 border-t border-brand-border">
                        <p className="text-xs text-brand-mid">Waiting for organizer approval...</p>
                     </div>
                  )}
                </div>
              ))}
           </div>
        )}
      </section>

      <section>
         <h2 className="font-serif text-xl font-bold text-brand-dark mb-4">Browse Open Events</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openEvents.map(event => {
               const hasApplied = applications.some(a => a.eventId._id === event._id);
               return (
                  <div key={event._id} className="bg-brand-white border border-brand-border hover:border-brand-mid rounded-xl p-6 transition-colors">
                    <h3 className="font-sans font-bold text-lg text-brand-black mb-1">{event.name}</h3>
                    <p className="text-sm text-brand-mid font-sans mb-4">{new Date(event.date).toLocaleDateString()} • {event.city}</p>
                    <button 
                      onClick={() => triggerApply(event._id)}
                      disabled={hasApplied}
                      className={`w-full py-2 rounded-full font-sans font-medium text-sm transition-colors ${hasApplied ? 'bg-brand-surface text-brand-light cursor-not-allowed border border-brand-border' : 'border border-brand-accent text-brand-accent hover:bg-brand-surface'}`}
                    >
                      {hasApplied ? 'Applied' : 'Apply to Volunteer'}
                    </button>
                  </div>
               )
            })}
         </div>
      </section>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setApplyModalOpen(false)}>
          <div className="bg-white border border-brand-border p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
             <h2 className="font-serif text-2xl font-bold text-brand-black mb-4">Submit Application</h2>
             <form onSubmit={submitApplication} className="space-y-4 font-sans text-sm">
                <div>
                  <label className="block text-brand-dark font-bold mb-2">Core Competencies</label>
                  {(() => {
                    const evt = openEvents.find(e => e._id === selectedEventId);
                    if (evt && evt.requiredSkills && evt.requiredSkills.length > 0) {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {evt.requiredSkills.map(skill => {
                            const isSelected = Array.isArray(appForm.skills) && appForm.skills.includes(skill);
                            return (
                              <button
                                type="button"
                                key={skill}
                                onClick={() => {
                                  let currentSkills = Array.isArray(appForm.skills) ? appForm.skills : [];
                                  if (isSelected) {
                                    setAppForm({...appForm, skills: currentSkills.filter(s => s !== skill)});
                                  } else {
                                    setAppForm({...appForm, skills: [...currentSkills, skill]});
                                  }
                                }}
                                className={`px-4 py-2 text-xs font-bold rounded-full border-2 transition-all ${isSelected ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-brand-border bg-brand-surface text-brand-mid hover:border-brand-mid hover:text-brand-dark'}`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <input type="text" required placeholder="e.g. Graphic design, Crowd control" value={appForm.skills} onChange={e => setAppForm({...appForm, skills: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-3 py-2 outline-none focus:border-brand-black" />
                      );
                    }
                  })()}
                </div>
                <div>
                  <label className="block text-brand-dark font-bold mb-1">Availability</label>
                  <select value={appForm.availability} onChange={e => setAppForm({...appForm, availability: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-3 py-2 outline-none">
                     <option value="Full">Full Event</option>
                     <option value="Partial">Partial (Few hours)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-brand-dark font-bold mb-1">Resume Link (GDrive/LinkedIn)</label>
                  <input type="url" placeholder="https://" value={appForm.resumeUrl} onChange={e => setAppForm({...appForm, resumeUrl: e.target.value})} className="w-full bg-brand-surface border border-brand-border px-3 py-2 focus:ring-1 focus:ring-brand-black outline-none" />
                </div>
                <div className="pt-4 flex space-x-3">
                  <button type="button" onClick={() => setApplyModalOpen(false)} className="flex-1 border border-brand-border text-brand-dark font-bold py-2 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 bg-brand-black text-white font-bold py-2 hover:bg-black">Submit</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
