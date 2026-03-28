import RegistrationForm from '../components/RegistrationForm';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';

export default function ClassicTheme({ event }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Hero */}
      <section className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          {event.theme && (
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">{event.theme}</p>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{event.name}</h1>
          <div className="flex items-center justify-center flex-wrap gap-6 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}, {event.city}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" />{event.audience}+ Attendees</span>
          </div>
          <a href="#register" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Register Now
          </a>
        </div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white mb-4">About the Event</h2>
        <p className="text-gray-300 leading-relaxed">{event.description}</p>
      </section>

      {/* Timeline */}
      {event.timeline && event.timeline.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Timeline</h2>
          <div className="grid gap-4">
            {event.timeline.map((item, i) => (
              <div key={i} className="flex gap-4 bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-lg h-fit">{item.label}</div>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Registration */}
      <section id="register" className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Register Now</h2>
          <RegistrationForm eventId={event._id} />
        </div>
      </section>

      <footer className="border-t border-gray-800 py-6 text-center">
        <p className="text-gray-500 text-sm">Powered by <span className="text-purple-400">EventOS</span></p>
      </footer>
    </div>
  );
}
