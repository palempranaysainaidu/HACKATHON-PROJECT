import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import { Zap, LayoutDashboard, LogOut, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border/50 bg-brand-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accentHov flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-gold transition-shadow duration-300">
                <Zap className="w-3.5 h-3.5 text-brand-bg fill-brand-bg" />
              </div>
              <span className="font-serif font-bold text-brand-white text-lg tracking-tight">EventOS</span>
            </Link>

            {/* Center nav links (desktop) */}
            {!user && (
              <div className="hidden md:flex items-center space-x-1">
                {['Features', 'Pricing', 'About'].map(item => (
                  <a key={item} href="#" className="btn-ghost text-brand-mid hover:text-brand-light">{item}</a>
                ))}
              </div>
            )}

            {/* Right */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link
                    to={`/${user.role}/dashboard`}
                    className="hidden sm:flex items-center space-x-2 text-brand-light hover:text-brand-white text-sm font-medium font-sans transition-colors group"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-dim group-hover:text-brand-accent transition-colors" />
                    <span>Dashboard</span>
                  </Link>

                  <div className="hidden sm:flex h-5 w-px bg-brand-border" />

                  <div className="relative group">
                    <button className="flex items-center space-x-2 glass px-3 py-1.5 rounded-lg text-sm font-sans text-brand-light hover:text-brand-white transition-colors">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-accent/30 to-brand-accentHov/20 flex items-center justify-center text-brand-accent font-bold text-xs uppercase">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-medium">{user.name?.split(' ')[0]}</span>
                      <ChevronDown className="w-3 h-3 text-brand-dim" />
                    </button>

                    {/* Dropdown Container (Includes bridge) */}
                    <div className="absolute right-0 top-full pt-2 w-44 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                      {/* Actual Menu */}
                      <div className="glass-card rounded-xl overflow-hidden shadow-modal">
                        <Link to={`/${user.role}/dashboard`} className="flex items-center space-x-2.5 px-4 py-3 text-sm text-brand-light hover:text-brand-white hover:bg-white/5 font-sans transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <div className="h-px bg-brand-border" />
                        <button onClick={handleLogout} className="w-full flex items-center space-x-2.5 px-4 py-3 text-sm text-brand-error hover:bg-brand-error/10 font-sans transition-colors text-left">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAuth(true)}
                    className="btn-ghost hidden sm:block text-brand-mid"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth(false)}
                    className="btn-gold text-sm px-5 py-2"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile menu */}
              <button
                className="sm:hidden text-brand-mid hover:text-brand-white transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-brand-border bg-brand-surface px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} className="block px-3 py-2 text-brand-light hover:text-brand-white font-sans text-sm rounded-lg hover:bg-white/5 transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-brand-error font-sans text-sm rounded-lg hover:bg-brand-error/10 transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => { openAuth(true); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-brand-light hover:text-brand-white font-sans text-sm rounded-lg hover:bg-white/5 transition-colors">Sign In</button>
                <button onClick={() => { openAuth(false); setMenuOpen(false); }} className="btn-gold w-full text-center">Get Started Free</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultIsLogin={authMode}
      />
    </>
  );
}
