import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { Check, X, FileText } from 'lucide-react';

export default function VolunteerManager({ eventId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await axios.get(`/organizer/events/${eventId}/applications`);
        setApplications(data.applications);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchApps();
  }, [eventId]);

  const handleAction = async (appId, action) => {
    try {
      await axios.patch(`/organizer/applications/${appId}/${action}`);
      setApplications(applications.map(app => 
         app._id === appId ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } : app
      ));
    } catch (err) { console.error(err); alert('Failed to update status'); }
  };

  if (loading) return <div className="animate-pulse text-brand-mid font-sans py-10">Loading applicant data...</div>;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-brand-black">Volunteer Manifest</h2>
          <span className="bg-brand-surface border border-brand-border text-brand-dark px-3 py-1 font-sans text-sm font-semibold">
             {applications.filter(a => a.status === 'accepted').length} Accepted
          </span>
       </div>

       {applications.length === 0 ? (
         <div className="border border-brand-border bg-brand-surface p-10 text-center text-brand-mid font-sans">
            No volunteers have applied to this event yet.
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map(app => (
               <div key={app._id} className="border border-brand-border bg-white p-5 shadow-sm">
                 <div className="flex justify-between items-start mb-3">
                   <div>
                     <h3 className="font-sans font-bold text-brand-black text-lg">{app.volunteerId?.name || 'Unknown User'}</h3>
                     <p className="text-sm text-brand-mid">{app.volunteerId?.email}</p>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${app.status==='accepted'?'bg-green-100 text-green-800':app.status==='rejected'?'bg-red-100 text-red-800':'bg-yellow-100 text-yellow-800'}`}>
                      {app.status}
                   </span>
                 </div>
                 
                 <div className="mb-4 bg-brand-surface p-3 border border-brand-border text-sm font-sans space-y-2">
                    <p><span className="font-bold text-brand-dark">Skills:</span> {app.skills}</p>
                    <p><span className="font-bold text-brand-dark">Availability:</span> {app.availability}</p>
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-brand-info hover:underline mt-2">
                         <FileText className="w-4 h-4 mr-1"/> View Resume
                      </a>
                    )}
                 </div>

                 {app.status === 'pending' && (
                    <div className="flex space-x-2 border-t border-brand-border pt-4">
                       <button onClick={() => handleAction(app._id, 'accept')} className="flex-1 bg-brand-black hover:bg-black text-white font-sans font-medium py-2 flex items-center justify-center transition-colors">
                          <Check className="w-4 h-4 mr-2" /> Accept
                       </button>
                       <button onClick={() => handleAction(app._id, 'reject')} className="flex-1 border border-brand-border hover:bg-red-50 text-red-600 font-sans font-medium py-2 flex items-center justify-center transition-colors">
                          <X className="w-4 h-4 mr-2" /> Decline
                       </button>
                    </div>
                 )}
               </div>
            ))}
         </div>
       )}
    </div>
  );
}
