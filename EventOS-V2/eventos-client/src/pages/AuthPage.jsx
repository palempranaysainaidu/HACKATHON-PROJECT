import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await axios.post('/auth/login', { email, password });
        navigate(`/${data.user.role}/dashboard`);
      } else {
        const { data } = await axios.post('/auth/register', { name, email, password, role });
        navigate(`/${data.user.role}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[90vh] px-4 animate-fade-in my-8 font-sans">
      <div className="w-full max-w-5xl bg-white border border-brand-border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand/Marketing */}
        <div className="hidden md:flex w-1/2 bg-brand-dark p-12 text-white flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay group-hover:scale-110 transition-transform duration-[2s]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-0"></div>
          
          <div className="relative z-10 animate-fade-in-up" style={{animationDelay: '100ms'}}>
            <h2 className="font-serif text-4xl font-black tracking-tight mb-2">EventOS</h2>
            <p className="font-sans text-gray-300 text-base tracking-[0.2em] uppercase mt-2 font-semibold">Professional Suite</p>
          </div>
          
          <div className="relative z-10 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <blockquote className="font-serif text-3xl italic leading-relaxed mb-8">
              "The most profoundly engineered operations architecture for massive gatherings."
            </blockquote>
            <div className="space-y-5 font-sans text-gray-200 text-base">
               <p className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-brand-info" /> Fully containerized isolation boundaries</p>
               <p className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-brand-info" /> Socket.IO parallel state channels</p>
               <p className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-brand-info" /> Automated computational logistics</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-10 sm:p-12 bg-white relative flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
             
             <div className="mb-10 text-center md:text-left animate-fade-in-up" style={{animationDelay: '0ms'}}>
               <h2 className="text-3xl lg:text-4xl font-serif font-black text-brand-black mb-3 tracking-tight">
                 {isLogin ? 'Welcome back.' : 'Initialize Instance.'}
               </h2>
               <p className="text-brand-mid font-sans text-base leading-relaxed">
                 {isLogin ? 'Provide your standard credentials to securely access your operations layout.' : 'Create your isolated user boundary and begin deploying events.'}
               </p>
             </div>
             
             {error && <div className="bg-brand-error/10 border border-brand-error/20 text-brand-error p-4 rounded-xl mb-6 text-sm font-sans font-medium flex items-center break-words"><Zap className="w-4 h-4 mr-2 shrink-0" /> {error}</div>}
             
             <form onSubmit={handleSubmit} className="space-y-6">
               {!isLogin && (
                 <div className="animate-fade-in-up" style={{animationDelay: '100ms'}}>
                   <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-mid mb-2.5">Registry Full Name</label>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3.5 font-sans text-base text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md" placeholder="e.g. Director Sarah" />
                 </div>
               )}
               
               <div className="animate-fade-in-up" style={{animationDelay: isLogin ? '100ms' : '200ms'}}>
                 <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-mid mb-2.5">Authorized Email</label>
                 <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3.5 font-sans text-base text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md" placeholder="hello@domain.com" />
               </div>
               
               <div className="animate-fade-in-up" style={{animationDelay: isLogin ? '200ms' : '300ms'}}>
                 <div className="flex justify-between items-center mb-2.5">
                   <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-mid">Passcode Cipher</label>
                   {isLogin && <button type="button" className="text-[11px] font-bold text-brand-dark hover:text-black transition-colors hover:underline tracking-widest uppercase">Recover?</button>}
                 </div>
                 <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3.5 font-sans text-base text-brand-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md" placeholder="••••••••" />
               </div>

               {!isLogin && (
                 <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
                   <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-brand-mid mb-2.5">Platform Domain Role</label>
                   <div className="relative">
                     <select value={role} onChange={e => setRole(e.target.value)} className="w-full appearance-none bg-brand-surface border border-brand-border rounded-xl px-4 py-3.5 font-sans text-base font-medium text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-dark focus:bg-white transition-all duration-300 shadow-sm cursor-pointer">
                       <option value="organizer">Director / Organizer</option>
                       <option value="volunteer">Workforce / Volunteer</option>
                       <option value="attendee">Guest / Attendee</option>
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-mid">
                       <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                     </div>
                   </div>
                 </div>
               )}
               
               <button type="submit" disabled={loading} className="w-full bg-brand-black hover:bg-black text-white font-sans font-bold text-base px-6 py-4 rounded-xl transition-all duration-300 mt-8 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/15 animate-fade-in-up hover:-translate-y-1" style={{animationDelay: isLogin ? '300ms' : '500ms'}}>
                 {loading ? 'Transmitting...' : isLogin ? 'Enter Sector' : 'Generate Keys'}
                 {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />}
               </button>
             </form>
             
             <div className="mt-10 text-center animate-fade-in" style={{animationDelay: isLogin ? '400ms' : '600ms'}}>
               <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-brand-mid hover:text-brand-black transition-colors font-bold font-sans border-b-2 border-transparent hover:border-brand-black pb-1 uppercase tracking-widest">
                 {isLogin ? "Require an account? Switch Mode." : "Already keyed in? Revert."}
               </button>
             </div>
             
          </div>
        </div>
      </div>
    </div>
  );
}
