import { useState, useEffect } from 'react';
import { ArrowRight, Zap, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, defaultIsLogin = true }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('organizer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultIsLogin);
      setError('');
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen, defaultIsLogin]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(email, password);
        handleClose();
        setTimeout(() => navigate(`/${user.user.role}/dashboard`), 260);
      } else {
        const user = await register({ name, email, password, role });
        handleClose();
        setTimeout(() => navigate(`/${user.user.role}/dashboard`), 260);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ROLES = [
    { value: 'organizer', label: 'Event Organizer', desc: 'Create & manage events' },
    { value: 'volunteer', label: 'Volunteer', desc: 'Join & assist events' },
    { value: 'attendee', label: 'Attendee', desc: 'Discover & attend events' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-250 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <div
        className={`relative w-full max-w-md z-10 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ring */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-accent/20 to-transparent pointer-events-none" />

        <div className="relative bg-brand-surface border border-brand-border rounded-2xl shadow-modal overflow-hidden">
          {/* Top accent bar */}
          <div className="h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="section-label mb-2">EventOS Platform</div>
                <h2 className="font-serif text-2xl font-bold text-brand-white">
                  {isLogin ? 'Welcome back.' : 'Create account.'}
                </h2>
                <p className="text-brand-mid font-sans text-sm mt-1.5 leading-relaxed">
                  {isLogin
                    ? 'Sign in to access your dashboard and events.'
                    : 'Join the platform used by 500+ event teams.'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-brand-dim hover:text-brand-light transition-colors p-1 -mt-1 -mr-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-lg bg-brand-error/10 border border-brand-error/20 flex items-center space-x-2 text-brand-error text-sm font-sans">
                <Zap className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-mid mb-2">Full Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="input-field" placeholder="e.g. Priya Sharma"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-mid mb-2">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="input-field" placeholder="hello@company.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-mid">Password</label>
                  {isLogin && <button type="button" className="text-[10px] text-brand-accent hover:text-brand-accentHov font-bold uppercase tracking-wider transition-colors">Forgot?</button>}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    className="input-field pr-12" placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dim hover:text-brand-light transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-mid mb-3">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`p-3 rounded-lg border text-left transition-all duration-200 ${role === r.value
                          ? 'border-brand-accent bg-brand-accentLow text-brand-accent'
                          : 'border-brand-border bg-brand-card text-brand-mid hover:border-brand-muted hover:text-brand-light'
                        }`}
                      >
                        <div className="font-sans font-bold text-xs leading-tight">{r.label}</div>
                        <div className="font-sans text-[10px] opacity-70 mt-0.5 leading-tight">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold mt-2 flex items-center justify-center group"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-brand-border text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-xs text-brand-mid hover:text-brand-light font-sans font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already a member? "}
                <span className="text-brand-accent hover:text-brand-accentHov font-bold">{isLogin ? 'Sign Up' : 'Sign In'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
