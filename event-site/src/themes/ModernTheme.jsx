import { useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Sparkles, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import RegistrationForm from '../components/RegistrationForm';

export default function ModernTheme({ event }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          {/* Theme badge */}
          {event.theme && (
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">{event.theme}</span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            {event.name}
          </h1>

          <div className="flex items-center justify-center flex-wrap gap-6 text-gray-300 text-lg mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              {event.location}, {event.city}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              {event.audience}+ Expected
            </span>
          </div>

          <a
            href="#register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-2xl hover:shadow-purple-500/30"
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">About This Event</h2>
        <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          {event.description}
        </p>
      </section>

      {/* Timeline Section */}
      {event.timeline && event.timeline.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Event Timeline</h2>
          <div className="space-y-6">
            {event.timeline.map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.label}
                  </div>
                  {i < event.timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-700 mt-2"></div>}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.label}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Registration Section */}
      <section id="register" className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Register Now</h2>
          <p className="text-gray-400 text-center mb-8">Secure your spot at {event.name}</p>
          <RegistrationForm eventId={event._id} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center">
        <p className="text-gray-500 text-sm">Powered by <span className="text-purple-400 font-semibold">EventOS</span> — AI Event Operating System</p>
      </footer>
    </div>
  );
}
