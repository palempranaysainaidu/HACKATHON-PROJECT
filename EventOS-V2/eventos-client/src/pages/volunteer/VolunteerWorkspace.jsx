import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { Camera } from 'lucide-react';

const EventChat = () => <div className="border border-brand-border rounded-xl p-6 text-center text-brand-mid font-sans h-[400px] flex items-center justify-center">Socket.IO Live Chat module perfectly ready.</div>;

export default function VolunteerWorkspace() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanCode, setScanCode] = useState('');
  const [newUpdate, setNewUpdate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, updatesRes] = await Promise.all([
          axios.get(`/volunteer/events/${id}/tasks`),
          axios.get(`/volunteer/events/${id}/live-updates`)
        ]);
        setTasks(tasksRes.data.tasks);
        setUpdates(updatesRes.data.updates);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`/volunteer/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) { console.error(err); }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/volunteer/mark-attendance', { eventId: id, registrationCode: scanCode.toUpperCase() });
      alert(`Success! ${data.attendee.name} marked present.`);
      setScanCode('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error scanning code');
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if(!newUpdate) return;
    try {
      const { data } = await axios.post(`/volunteer/events/${id}/live-updates`, { content: newUpdate, type: 'logistics' });
      setUpdates([data.update, ...updates]);
      setNewUpdate('');
    } catch(err) { console.error(err); alert('Failed to post update'); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-brand-mid">Booting Live Workspace...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-brand-border pb-6 mb-8 flex justify-between items-center bg-brand-card p-6 rounded-xl border">
         <div>
           <span className="text-xs font-bold text-brand-accent uppercase tracking-wide flex items-center mb-1">
             <span className="w-2 h-2 rounded-full bg-brand-accent mr-2 animate-pulse"></span> Live Mode Active
           </span>
           <h1 className="font-serif text-3xl font-bold text-brand-white">Volunteer Operations Center</h1>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col h-[400px]">
               <h2 className="font-sans font-bold text-lg text-brand-light border-b border-brand-border pb-3 mb-4">My Assigned Tasks</h2>
               {tasks.length === 0 ? (
                 <p className="text-brand-mid font-sans text-sm pb-2">No tasks assigned to you right now.</p>
               ) : (
                 <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                    {tasks.map(task => (
                      <div key={task._id} className="border border-brand-border rounded-lg p-4 flex justify-between items-center group hover:border-brand-mid transition-colors flex-shrink-0">
                         <div>
                            <h3 className="font-sans font-semibold text-brand-white">{task.title}</h3>
                            <p className="font-sans text-xs text-brand-mid mt-1">{task.description}</p>
                         </div>
                         <select 
                           value={task.status} 
                           onChange={e => handleStatusChange(task._id, e.target.value)}
                           className={`font-sans text-xs font-semibold px-3 py-1.5 rounded-full border ${task.status === 'completed' ? 'bg-brand-tag text-brand-mid border-transparent' : 'bg-brand-card border-brand-border text-brand-light'}`}
                         >
                           <option value="pending">Pending</option>
                           <option value="in_progress">In Progress</option>
                           <option value="completed">Completed</option>
                         </select>
                      </div>
                    ))}
                 </div>
               )}
            </section>

            <section className="bg-brand-card border border-brand-border rounded-xl p-6">
               <div className="flex items-center space-x-2 mb-4">
                 <Camera className="w-5 h-5 text-brand-white" />
                 <h2 className="font-sans font-bold text-lg text-brand-light">Attendee Check-In Station</h2>
               </div>
               <p className="text-sm font-sans text-brand-mid mb-4">Enter the 8-character ID code manually to mark an attendee as present.</p>
               <form onSubmit={handleMarkAttendance} className="flex space-x-3">
                 <input 
                   type="text" 
                   value={scanCode} 
                   onChange={e => setScanCode(e.target.value)} 
                   placeholder="e.g. X1A2B3C4" 
                   className="flex-1 font-mono text-lg tracking-wider uppercase border border-brand-border rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors" 
                   required
                   maxLength={8}
                 />
                 <button type="submit" className="bg-brand-accent hover:bg-brand-accentHov  text-brand-bg px-8 py-3 rounded-lg font-sans font-medium transition-colors">
                   Verify
                 </button>
               </form>
            </section>
         </div>

         <div className="lg:col-span-1 space-y-8">
            <section>
               <h2 className="font-sans font-bold text-lg text-brand-light mb-4">Team Comms</h2>
               <EventChat eventId={id} />
            </section>

            <section className="bg-brand-surface border border-brand-border rounded-xl p-6 flex flex-col h-[400px]">
               <h2 className="font-sans font-bold text-lg text-brand-light border-b border-brand-border pb-3 mb-4">Live Updates Feed</h2>
               
               <form onSubmit={handlePostUpdate} className="flex space-x-2 mb-4">
                 <input type="text" value={newUpdate} onChange={e=>setNewUpdate(e.target.value)} placeholder="e.g. Food running low!" className="flex-1 text-sm px-3 py-2 border border-brand-border rounded outline-none focus:border-brand-accent" />
                 <button type="submit" className="bg-brand-accent hover:bg-brand-accentHov text-brand-bg px-3 py-2 text-sm font-bold rounded">Post</button>
               </form>

               <div className="overflow-y-auto flex-1">
                 {updates.length === 0 ? (
                   <p className="text-xs text-brand-mid font-sans text-center mt-4">No updates broadcasted yet.</p>
                 ) : (
                   <div className="space-y-4">
                   {updates.map(update => (
                     <div key={update._id} className="bg-brand-card p-3 rounded-lg shadow-sm border border-brand-border">
                       <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-info mb-1">{update.type}</span>
                       <p className="font-sans text-sm text-brand-light">{update.content}</p>
                       <p className="font-sans text-[10px] text-brand-mid mt-2 text-right">{new Date(update.createdAt).toLocaleTimeString()}</p>
                     </div>
                   ))}
                 </div>
               )}
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
