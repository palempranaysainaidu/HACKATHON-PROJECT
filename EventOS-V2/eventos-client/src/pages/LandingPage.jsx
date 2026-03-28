import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-screen overflow-x-hidden bg-brand-surface font-sans text-brand-dark">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center border-b border-brand-border min-h-[70vh]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-brand-surface to-brand-surface opacity-90"></div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-black text-brand-black max-w-4xl tracking-tight leading-[1.05] mb-6 shrink-0 z-10">
          Orchestrate <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-black italic font-medium pr-2">the unforgettable.</span>
        </h1>
        
        <p className="font-sans text-base md:text-lg text-brand-mid max-w-2xl mx-auto mb-10 leading-relaxed z-10">
          The elegant platform to build dynamic budgets, coordinate volunteer fleets, and drive attendee engagement with Google's Gemini AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 w-full px-4 z-10">
          <button onClick={() => setIsAuthOpen(true)} className="group bg-brand-black hover:bg-black text-white font-sans font-bold px-8 py-3.5 text-sm transition-all duration-300 ease-out shadow-sm hover:shadow-md flex items-center justify-center w-full sm:w-auto hover:-translate-y-0.5">
            Start Planning For Free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* CLEANER FOOTER */}
      <footer className="bg-white border-t border-brand-border py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-brand-mid">
           <div className="font-serif text-lg font-bold mb-4 md:mb-0 text-brand-black">
             EventOS
           </div>
           <div className="font-sans text-xs flex flex-wrap justify-center gap-6 uppercase tracking-wider font-semibold">
              <a href="#" className="hover:text-brand-black transition-colors">Architecture</a>
              <a href="#" className="hover:text-brand-black transition-colors">Security</a>
              <a href="#" className="hover:text-brand-black transition-colors">Terms</a>
              <a href="#" className="hover:text-brand-black transition-colors">Help</a>
           </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        defaultIsLogin={false} 
      />

    </div>
  );
}
