import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { Download, Star } from 'lucide-react';
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

  const handleFeedback = async (regId, rating, feedback) => {
    try {
      await axios.post(`/attendee/registrations/${regId}/feedback`, { rating, feedback });
      alert('Feedback submitted!');
      setRegistrations(registrations.map(r => r._id === regId ? { ...r, feedbackSubmitted: true, rating } : r));
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-brand-mid">Loading Tickets...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="border-b border-brand-border pb-6 flex justify-between items-end">
         <div>
           <h1 className="font-serif text-4xl font-bold text-brand-black mb-2 tracking-tight">Welcome, {user?.name?.split(' ')[0] || 'Attendee'}!</h1>
           <p className="font-sans text-brand-mid">Manage your event registrations and digital ID cards.</p>
         </div>
         <Link to="/events" className="bg-brand-black text-white px-6 py-2 rounded-full font-sans text-sm font-medium hover:bg-black transition-colors">
            Find More Events
         </Link>
      </div>

      {registrations.length === 0 ? (
         <div className="text-center bg-brand-surface border border-brand-border rounded-xl p-16">
           <h3 className="font-serif text-xl font-semibold text-brand-dark mb-2">No tickets yet</h3>
           <p className="font-sans text-brand-mid">You haven't registered for any events.</p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map(reg => (
              <div key={reg._id} className="bg-brand-white border border-brand-border rounded-xl shadow-sm flex flex-col h-full overflow-hidden group">
                 <div className="h-32 bg-brand-surface border-b border-brand-border relative overflow-hidden flex items-center justify-center">
                    <span className="font-serif text-3xl text-brand-mid/30 font-bold px-4 text-center leading-tight">{reg.eventId.name.substring(0,25)}</span>
                 </div>
                 
                 <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="font-sans font-bold text-lg text-brand-black">{reg.eventId.name}</h3>
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${reg.eventId.status==='completed'?'bg-brand-mid text-white':'bg-brand-info text-white'}`}>
                          {reg.eventId.status}
                       </span>
                    </div>

                    <div className="space-y-2 mb-6">
                       <p className="text-sm font-sans text-brand-mid flex justify-between">
                         <span className="font-medium text-brand-dark">Date:</span> {new Date(reg.eventId.date).toLocaleDateString()}
                       </p>
                       <p className="text-sm font-sans text-brand-mid flex justify-between">
                         <span className="font-medium text-brand-dark">Ticket Code:</span> <span className="font-mono tracking-wider text-brand-black">{reg.registrationCode}</span>
                       </p>
                       <p className="text-sm font-sans text-brand-mid flex justify-between">
                         <span className="font-medium text-brand-dark">Cost:</span> ₹{reg.totalCost} ({reg.paymentStatus})
                       </p>
                    </div>

                    <div className="mt-auto space-y-3 pt-4 border-t border-brand-border">
                       <a href={reg.idCardUrl} target="_blank" rel="noreferrer" download className="w-full border border-brand-black text-brand-black hover:bg-brand-surface font-sans font-medium py-2 rounded-full flex items-center justify-center transition-colors">
                         <Download className="w-4 h-4 mr-2" /> Download ID Card
                       </a>
                       
                       <Link to={`/events/${reg.eventId.slug}`} className="w-full bg-brand-black text-white hover:bg-black font-sans font-medium py-2 rounded-full flex items-center justify-center transition-colors mt-2">
                         View Event & Live Updates
                       </Link>

                       {reg.eventId.status === 'completed' && reg.attended && !reg.feedbackSubmitted && (
                          <div className="bg-brand-surface border border-brand-border p-3 rounded-lg text-center mt-4">
                             <p className="text-xs font-semibold text-brand-dark uppercase tracking-wide mb-2">Rate this event</p>
                             <div className="flex justify-center space-x-2">
                               {[1,2,3,4,5].map(star => (
                                 <button key={star} onClick={() => handleFeedback(reg._id, star, 'Great event!')} className="text-brand-light hover:text-brand-warn transition-colors">
                                   <Star className="w-5 h-5 fill-current" />
                                 </button>
                               ))}
                             </div>
                          </div>
                       )}
                       
                       {reg.feedbackSubmitted && (
                         <p className="text-xs text-center text-brand-accent font-medium mt-2">✓ Feedback Submitted</p>
                       )}
                    </div>
                 </div>
              </div>
            ))}
         </div>
      )}
    </div>
  );
}
