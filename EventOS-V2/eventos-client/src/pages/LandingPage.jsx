import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Zap, Users, BarChart3, Shield, Star, ChevronRight, Play } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

const STATS = [
  { value: '2,400+', label: 'Events Managed' },
  { value: '98%',    label: 'Satisfaction Rate' },
  { value: '180K+',  label: 'Attendees Served' },
  { value: '12K+',   label: 'Volunteers Placed' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI Genesis Engine',
    description: 'Describe your event vision in plain language. Our Gemini AI instantly produces tasks, budget breakdowns, risk models, and volunteer role definitions — in seconds.',
    tag: 'Gemini Powered',
  },
  {
    icon: Users,
    title: 'Volunteer Intelligence',
    description: 'AI matches volunteer skills against event requirements, enforces minimum headcount before task assignment, and divides work equitably across your team.',
    tag: 'Smart Matching',
  },
  {
    icon: BarChart3,
    title: 'Live Budget Control',
    description: 'Real-time break-even calculator. Edit, verify, and delete any AI-generated expense line. Dynamic ticket pricing synced instantly to every attendee view.',
    tag: 'Real-time',
  },
  {
    icon: Shield,
    title: 'Broadcast Hub',
    description: 'Push live announcements from organizers and volunteers directly to attendee feeds. Every stakeholder stays in sync — no delays, no confusion.',
    tag: 'Live Updates',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Krishnan',
    role: 'Head of Events — TechSummit India',
    quote: 'EventOS cut our planning time by 70%. The AI task distribution alone saved us days of manual coordination before TechSummit 2024.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'Rahul Mehta',
    role: 'Director, Cultural Fest BITS Pilani',
    quote: 'The volunteer skill-matching is extraordinary. Our team was assigned tasks that actually fit their abilities for the first time.',
    rating: 5,
    avatar: 'RM',
  },
  {
    name: 'Sneha Patel',
    role: 'CEO — Emerald Events Co.',
    quote: 'From initial concept to live attendee ticketing in under 3 minutes. That\'s the kind of operational leverage that\'s game-changing.',
    rating: 5,
    avatar: 'SP',
  },
];

const ORGS = ['TechSummit', 'BITS Pilani', 'IIT Bombay', 'Emerald Events', 'CivicPulse NGO', 'Stellar Conferences'];

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefault, setAuthDefault] = useState(false);

  const openAuth = (isLogin = false) => {
    setAuthDefault(isLogin);
    setIsAuthOpen(true);
  };

  return (
    <div className="w-full flex flex-col min-h-screen overflow-x-hidden font-sans text-brand-white">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center overflow-hidden hero-gradient">

        {/* Decorative grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(42,42,58,0.3) 1px, transparent 1px), linear-gradient(to right, rgba(42,42,58,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }} />

        {/* Top glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-accent/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Eyebrow pill */}
        <div className="animate-fade-in flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8 border border-brand-accent/20">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
          <span className="text-brand-accent text-xs font-bold uppercase tracking-widest">Gemini AI-Powered Event Platform</span>
        </div>

        <h1 className="animate-fade-in-up font-serif font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl max-w-5xl leading-[1.02] mb-6 tracking-tight">
          Orchestrate<br />
          <span className="text-gradient-gold italic font-bold">the unforgettable.</span>
        </h1>

        <p className="animate-fade-in font-sans text-brand-light text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
          The complete AI-native platform for event teams. Build dynamic budgets, co-ordinate volunteer fleets, and drive real-time attendee engagement — in minutes, not days.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in-up">
          <button
            onClick={() => openAuth(false)}
            className="btn-gold text-base px-8 py-4 flex items-center group shadow-glow-gold animate-glow-pulse"
          >
            Start Planning Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => openAuth(true)}
            className="btn-outline text-base px-8 py-4"
          >
            Sign In
          </button>
        </div>

        {/* Ticker of trust */}
        <div className="mt-16 animate-fade-in">
          <p className="text-brand-dim text-xs uppercase tracking-widest mb-4 font-bold">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {ORGS.map(org => (
              <span key={org} className="text-brand-mid font-sans text-sm font-medium">{org}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-brand-border bg-brand-surface">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80} className="text-center">
              <div className="font-serif text-4xl font-black text-gradient-gold mb-1">{s.value}</div>
              <div className="font-sans text-brand-mid text-sm uppercase tracking-widest font-bold">{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-bg">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="section-label mb-3">Platform Capabilities</div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-brand-white max-w-2xl mx-auto leading-tight">
              Everything your team needs. Nothing it doesn't.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 100}>
                <div className="relative card p-8 group hover:border-brand-accent/30 transition-all duration-300 hover:shadow-glow-sm h-full">
                  {/* corner glow on hover */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-brand-accent/0 via-brand-accent/0 to-brand-accent/0 group-hover:via-brand-accent/40 transition-all duration-500" />
                  
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-brand-accentLow border border-brand-accent/20 flex items-center justify-center group-hover:border-brand-accent/40 transition-colors">
                      <f.icon className="w-5 h-5 text-brand-accent" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent/70 bg-brand-accentLow border border-brand-accent/15 px-2.5 py-1 rounded-full">{f.tag}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brand-white mb-3">{f.title}</h3>
                  <p className="font-sans text-brand-mid text-sm leading-relaxed">{f.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-brand-surface border-y border-brand-border">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="section-label mb-3">How It Works</div>
            <h2 className="font-serif text-4xl font-bold text-brand-white">From idea to live event in 4 steps.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Describe', desc: 'Type your event vision in natural language.' },
              { step: '02', title: 'Generate', desc: 'AI creates tasks, budgets, and risk plans instantly.' },
              { step: '03', title: 'Coordinate', desc: 'Accept volunteers, auto-assign tasks by skill.' },
              { step: '04', title: 'Broadcast', desc: 'Push live updates to attendees and volunteers.' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 100}>
                <div className="relative card p-6 hover:border-brand-muted transition-colors h-full">
                  <div className="font-mono text-4xl font-black text-brand-border mb-4">{item.step}</div>
                  <h3 className="font-serif text-lg font-bold text-brand-white mb-2">{item.title}</h3>
                  <p className="font-sans text-brand-mid text-sm">{item.desc}</p>
                  {i < 3 && (
                    <ChevronRight className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 text-brand-border hidden lg:block" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-brand-bg">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="section-label mb-3">Real Results</div>
            <h2 className="font-serif text-4xl font-bold text-brand-white">Trusted by event professionals.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 120}>
                <div className="card p-7 hover:border-brand-muted transition-all duration-300 flex flex-col h-full">
                  <div className="flex text-brand-accent mb-5 space-x-0.5">
                    {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-brand-accent" />)}
                  </div>
                  <p className="font-sans text-brand-light text-sm leading-relaxed flex-1 italic mb-6">"{t.quote}"</p>
                  <div className="flex items-center space-x-3 border-t border-brand-border pt-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-accent/20 to-brand-accentHov/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-sans font-bold text-sm text-brand-white">{t.name}</div>
                      <div className="font-sans text-xs text-brand-dim">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-brand-surface border-t border-brand-border">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-label mb-4">Limited Beta Access</div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-brand-white mb-6 leading-tight">
              Ready to run your<br />
              <span className="text-gradient-gold italic">best event yet?</span>
            </h2>
            <p className="font-sans text-brand-mid text-lg mb-10">
              Join 500+ event professionals using EventOS to eliminate planning chaos and deliver unforgettable experiences.
            </p>
            <button
              onClick={() => openAuth(false)}
              className="btn-gold text-base px-10 py-4 mx-auto flex items-center group shadow-glow-gold"
            >
              Start For Free Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-brand-border py-10 px-4 sm:px-6 bg-brand-bg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-accent to-brand-accentHov flex items-center justify-center">
              <Zap className="w-3 h-3 text-brand-bg fill-brand-bg" />
            </div>
            <span className="font-serif font-bold text-brand-white">EventOS</span>
            <span className="text-brand-dim text-xs ml-2">© 2025</span>
          </div>
          <div className="flex space-x-8 text-xs uppercase tracking-widest font-bold text-brand-dim">
            {['Features', 'Security', 'Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" className="hover:text-brand-light transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultIsLogin={authDefault} />
    </div>
  );
}
