import { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/attendee/events/${slug}`);
        setEvent(data.event);
        const upData = await axios.get(`/attendee/events/${data.event._id}/updates`);
        setUpdates(upData.data.updates);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchEvent();
  }, [slug]);

  const baseTicketCost = event ? (event.isFree ? 0 : event.ticketPrice) : 0;
  const totalCost = baseTicketCost * numberOfGuests + (wantsFood ? (event?.foodCost || 200) * numberOfGuests : 0) + (wantsTransport ? (event?.transportCost || 300) * numberOfGuests : 0);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await axios.post(`/attendee/events/${event._id}/register`, {
         wantsFood, wantsTransport, numberOfGuests, totalCost
      });
      alert('Registration successful!');
      navigate('/attendee/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-brand-mid">Loading Event Details...</div>;
  if (!event) return <div className="p-20 text-center text-brand-mid">Event not found.</div>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
         <div className="aspect-[21/9] bg-brand-surface border border-brand-border rounded-2xl flex items-center justify-center">
            <span className="font-serif text-3xl font-bold text-brand-mid opacity-30">Cover Hub</span>
         </div>
         
         <div>
            <div className="inline-block bg-brand-tag text-brand-tagText text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {event.type}
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-black mb-6 leading-tight">{event.name}</h1>
            <p className="font-sans text-lg text-brand-mid leading-relaxed mb-8">{event.description}</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-brand-border">
            <div>
               <span className="block text-brand-mid font-medium text-xs uppercase tracking-wider mb-2">Date</span>
               <span className="text-brand-dark font-bold font-sans">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div>
               <span className="block text-brand-mid font-medium text-xs uppercase tracking-wider mb-2">Location</span>
               <span className="text-brand-dark font-bold font-sans">{event.city}</span>
            </div>
            <div>
               <span className="block text-brand-mid font-medium text-xs uppercase tracking-wider mb-2">Host</span>
               <span className="text-brand-dark font-bold font-sans">{event.organizerId?.organization || 'EventOS'}</span>
            </div>
            <div>
               <span className="block text-brand-mid font-medium text-xs uppercase tracking-wider mb-2">Status</span>
               <span className="text-brand-info font-bold font-sans capitalize">{event.status}</span>
            </div>
         </div>

         {/* MOCKED BUSINESS PROFILE */}
         <div className="mt-12 bg-brand-surface border border-brand-border rounded-xl p-8">
            <h3 className="font-serif text-2xl font-bold text-brand-black mb-4">About the Organizer</h3>
            <div className="flex items-center space-x-4 mb-4">
               <div className="w-16 h-16 bg-brand-black rounded-full flex justify-center items-center text-white font-serif text-2xl font-bold uppercase tracking-wider shadow-md">
                  {(event.organizerId?.organization || 'EV').substring(0,2)}
               </div>
               <div>
                  <h4 className="font-sans font-bold text-lg text-brand-black">{event.organizerId?.organization || 'EventOS Partner Network'}</h4>
                  <div className="flex items-center space-x-1 text-yellow-500 mb-1 text-sm tracking-widest">
                     ★★★★☆ <span className="text-brand-mid text-xs font-sans tracking-normal ml-2">(4.8 / 5 from 124 recorded reviews)</span>
                  </div>
               </div>
            </div>
            <p className="font-sans text-brand-dark text-sm leading-relaxed mb-6">
              A premier event execution agency specializing in high-fidelity engagements. Renowned for mastering rapid logistics, deploying highly-skilled volunteer networks, and fostering vibrant communities.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center border-t border-brand-border pt-4">
               <div><span className="block font-bold text-brand-black text-xl">15</span><span className="text-[10px] font-bold uppercase tracking-wide text-brand-mid">Events Hosted</span></div>
               <div><span className="block font-bold text-brand-black text-xl">12k+</span><span className="text-[10px] font-bold uppercase tracking-wide text-brand-mid">Total Attendees</span></div>
               <div><span className="block font-bold text-brand-black text-xl">98%</span><span className="text-[10px] font-bold uppercase tracking-wide text-brand-mid">Satisfaction Rate</span></div>
            </div>
         </div>

         {updates.length > 0 && (
           <div className="pt-8">
              <h2 className="font-serif text-2xl font-bold text-brand-black mb-6">Live Announcements</h2>
              <div className="space-y-4">
                 {updates.map(u => (
                   <div key={u._id} className="bg-brand-surface border border-brand-border p-5 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-white border border-brand-border text-brand-black text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                          {u.type || 'Update'}
                        </span>
                        <span className="text-xs font-sans text-brand-mid">
                          {new Date(u.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-brand-black leading-relaxed">{u.content}</p>
                   </div>
                 ))}
              </div>
           </div>
         )}
      </div>

      <div className="lg:col-span-1">
         <div className="bg-brand-white border border-brand-border rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-serif text-2xl font-bold text-brand-black mb-6 pb-4 border-b border-brand-border">Get Tickets</h3>
            
            <div className="space-y-6 mb-8">
               <div>
                 <label className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-2">Number of Tickets</label>
                 <select value={numberOfGuests} onChange={e => setNumberOfGuests(Number(e.target.value))} className="w-full border border-brand-border rounded-lg px-4 py-3 font-sans bg-white">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                 </select>
               </div>

               <div className="space-y-3">
                 {(event.providesFood || event.providesTransport) && (
                   <label className="block text-xs font-medium uppercase tracking-wide text-brand-mid mb-2">Optional Add-ons</label>
                 )}
                 
                 {event.providesFood && (
                   <div className="flex items-center space-x-3 p-3 border border-brand-border rounded-lg hover:bg-brand-surface cursor-pointer" onClick={() => setWantsFood(!wantsFood)}>
                     <input type="checkbox" checked={wantsFood} readOnly className="w-5 h-5 accent-brand-accent flex-shrink-0" />
                     <div className="flex-1">
                       <span className="block font-sans font-medium text-sm text-brand-dark">Catering Pass</span>
                       <span className="block font-sans text-xs text-brand-mid">+ ₹{event.foodCost || 200} / person</span>
                     </div>
                   </div>
                 )}
                 
                 {event.providesTransport && (
                   <div className="flex items-center space-x-3 p-3 border border-brand-border rounded-lg hover:bg-brand-surface cursor-pointer" onClick={() => setWantsTransport(!wantsTransport)}>
                     <input type="checkbox" checked={wantsTransport} readOnly className="w-5 h-5 accent-brand-accent flex-shrink-0" />
                     <div className="flex-1">
                       <span className="block font-sans font-medium text-sm text-brand-dark">Transport Pass</span>
                       <span className="block font-sans text-xs text-brand-mid">+ ₹{event.transportCost || 300} / person</span>
                     </div>
                   </div>
                 )}
               </div>
            </div>

            <div className="border-t border-brand-border pt-6 mb-6">
               <div className="flex justify-between items-end">
                  <span className="font-sans font-medium text-brand-mid uppercase tracking-wide text-xs">Total Due</span>
                  <span className="font-serif text-3xl font-bold text-brand-black">₹{totalCost}</span>
               </div>
            </div>

            <button onClick={handleRegister} disabled={registering} className="w-full bg-brand-accent hover:bg-brand-accentHov text-white py-4 rounded-xl font-sans font-bold text-lg transition-colors flex justify-center items-center">
               {registering ? 'Processing...' : 'Confirm Registration'}
            </button>
         </div>
      </div>
    </div>
  );
}
