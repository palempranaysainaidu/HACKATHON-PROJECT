import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultIsLogin = true }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) setIsLogin(defaultIsLogin);
  }, [isOpen, defaultIsLogin]);
  
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(email, password);
        navigate(`/${user.user.role}/dashboard`);
        onClose();
      } else {
        const user = await register({ name, email, password, role });
        navigate(`/${user.user.role}/dashboard`);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white border border-brand-border shadow-2xl relative flex flex-col justify-center animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-10 sm:p-12 w-full">
           <div className="mb-10 text-center md:text-left">
             <h2 className="text-3xl font-serif font-black text-brand-black mb-2 tracking-tight">
               {isLogin ? 'Sign In.' : 'Sign Up.'}
             </h2>
             <p className="text-brand-mid font-sans text-sm leading-relaxed">
               {isLogin ? 'Provide your credentials to access your dashboard.' : 'Create an account to begin managing events.'}
             </p>
           </div>
           
           {error && <div className="bg-brand-error/10 border border-brand-error/20 text-brand-error p-4 mb-6 text-sm font-sans font-medium flex items-center break-words"><Zap className="w-4 h-4 mr-2 shrink-0" /> {error}</div>}
           
           <form onSubmit={handleSubmit} className="space-y-6">
             {!isLogin && (
               <div>
                 <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Full Name</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-dark focus:bg-white transition-all shadow-sm" placeholder="e.g. Director Sarah" />
               </div>
             )}
             
             <div>
               <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Email Address</label>
               <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-dark focus:bg-white transition-all shadow-sm" placeholder="hello@domain.com" />
             </div>
             
             <div>
               <div className="flex justify-between items-center mb-2">
                 <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid">Password</label>
                 {isLogin && <button type="button" className="text-[10px] font-bold text-brand-dark hover:text-black transition-colors hover:underline tracking-wider uppercase">Forgot?</button>}
               </div>
               <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm text-brand-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-dark focus:bg-white transition-all shadow-sm" placeholder="••••••••" />
             </div>

             {!isLogin && (
               <div>
                 <label className="block text-xs font-bold uppercase tracking-[0.1em] text-brand-mid mb-2">Account Role</label>
                 <div className="relative">
                   <select value={role} onChange={e => setRole(e.target.value)} className="w-full appearance-none bg-brand-surface border border-brand-border px-4 py-3 font-sans text-sm font-medium text-brand-black focus:outline-none focus:ring-1 focus:ring-brand-dark focus:bg-white transition-all shadow-sm cursor-pointer">
                     <option value="organizer">Organizer</option>
                     <option value="volunteer">Volunteer</option>
                     <option value="attendee">Attendee</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-mid">
                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                   </div>
                 </div>
               </div>
             )}
             
             <button type="submit" disabled={loading} className="w-full bg-brand-black hover:bg-black text-white font-sans font-bold text-sm px-6 py-4 transition-all mt-8 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed shadow-md">
               {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
               {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
             </button>
           </form>
           
           <div className="mt-8 text-center border-t border-brand-border pt-6">
             <button onClick={() => setIsLogin(!isLogin)} className="text-xs text-brand-mid hover:text-brand-black transition-colors font-bold font-sans uppercase tracking-[0.1em]">
               {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
             </button>
           </div>
           
        </div>
      </div>
    </div>
  );
}
