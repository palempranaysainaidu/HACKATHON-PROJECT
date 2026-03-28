import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openAuth = (isLogin) => {
    setAuthMode(isLogin);
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="bg-white/40 backdrop-blur-lg border-b border-brand-border sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-brand-black font-serif text-xl font-bold tracking-tight flex items-center cursor-pointer">
            <span className="bg-brand-black text-white px-2 py-0.5 text-sm mr-2 shadow-sm">E</span>
            EventOS
          </Link>
          
          {/* Right: User / Auth */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center justify-end w-full">
                <Link to={`/${user.role}/dashboard`} className="text-brand-black font-sans text-sm font-black tracking-wide mr-6 hover:opacity-70 transition-opacity">
                  Dashboard &rarr;
                </Link>
                <div className="flex items-center items-center space-x-4 border-l border-brand-border pl-6">
                  <span className="text-brand-dark font-sans text-sm font-medium">{user.name}</span>
                  <button onClick={handleLogout} className="text-sm font-medium text-brand-error hover:text-red-700 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => openAuth(true)} className="text-brand-black font-sans text-sm font-bold hover:text-brand-mid transition-colors hidden sm:block p-2">
                  Sign In
                </button>
                <button onClick={() => openAuth(false)} className="bg-brand-black hover:bg-black text-white font-sans text-sm font-bold px-6 py-2 transition-all shadow-sm hover:shadow-md inline-block">
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
          
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        defaultIsLogin={authMode} 
      />
    </>
  );
}
