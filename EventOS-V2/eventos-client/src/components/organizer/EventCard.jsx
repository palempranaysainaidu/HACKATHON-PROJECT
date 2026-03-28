import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const statusColor = {
    draft: 'bg-brand-tag text-brand-tagText',
    open: 'bg-brand-info text-brand-white',
    ongoing: 'bg-brand-accent text-brand-white',
    completed: 'bg-brand-mid text-brand-white',
    cancelled: 'bg-brand-error text-brand-white'
  };

  return (
    <div className="bg-brand-white border border-brand-border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-serif text-xl font-semibold text-brand-black truncate">{event.name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${statusColor[event.status]}`}>
          {event.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-6 flex-1">
        <p className="font-sans text-sm text-brand-mid">
          <span className="font-medium text-brand-dark">Date:</span> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="font-sans text-sm text-brand-mid">
          <span className="font-medium text-brand-dark">Location:</span> {event.city}
        </p>
        <p className="font-sans text-sm text-brand-mid">
          <span className="font-medium text-brand-dark">Audience:</span> {event.expectedAudience} expected
        </p>
      </div>
      
      <div className="flex space-x-3 pt-4 border-t border-brand-border">
        <Link to={`/organizer/events/${event._id}`} className="flex-1 bg-brand-white border border-brand-black text-brand-black hover:bg-brand-surface font-sans text-sm font-medium px-4 py-2 rounded-full transition-colors text-center">
          Manage Event
        </Link>
      </div>
    </div>
  );
}
