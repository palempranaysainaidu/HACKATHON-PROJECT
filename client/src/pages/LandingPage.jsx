import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Sparkles, Mail, Globe, ArrowRight, Zap, Calendar } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleCTA = () => {
    navigate(token ? '/builder' : '/auth');
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Event<span className="text-purple-400">OS</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/auth')} className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors">
            Login
          </button>
          <button onClick={() => navigate('/auth')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/25">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20 pb-32">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">AI-Powered Event Planning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Describe your event in
            <br />
            <span className="gradient-text">one sentence.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            EventOS builds everything else — tasks, timelines, budgets, email drafts,
            and a live event website. All in under 30 seconds.
          </p>

          <button
            onClick={handleCTA}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
          >
            Start Planning — It's Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles className="w-7 h-7" />,
              title: 'AI Planning Engine',
              desc: 'Generate complete task checklists, role assignments, and timelines from a single description.',
              color: 'from-purple-500 to-violet-600'
            },
            {
              icon: <Mail className="w-7 h-7" />,
              title: 'Auto Email Drafts',
              desc: 'Permission requests, sponsorship proposals, and volunteer recruitment — all written by AI.',
              color: 'from-blue-500 to-indigo-600'
            },
            {
              icon: <Globe className="w-7 h-7" />,
              title: 'Live Site Generator',
              desc: 'Instantly create a beautiful public event page with registration form. Share in one click.',
              color: 'from-emerald-500 to-teal-600'
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card rounded-2xl p-8 hover:border-purple-500/30 transition-all hover:-translate-y-1 group">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Describe', desc: 'Tell us about your event in natural language' },
            { step: '02', title: 'Generate', desc: 'AI creates tasks, budget, emails, and website' },
            { step: '03', title: 'Execute', desc: 'Manage everything from a single dashboard' }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-black text-purple-500/20 mb-3">{item.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-400">EventOS — AI Event Operating System</span>
        </div>
        <p className="text-xs text-gray-600">Built for hackathons, made for organizers everywhere.</p>
      </footer>
    </div>
  );
}
