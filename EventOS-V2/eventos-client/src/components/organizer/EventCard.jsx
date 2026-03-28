import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Zap } from 'lucide-react';

const STATUS_MAP = {
  draft:     { label: 'Draft',     cls: 'chip-draft' },
  open:      { label: 'Open',      cls: 'chip-open' },
  ongoing:   { label: 'Live',      cls: 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20 chip' },
  completed: { label: 'Completed', cls: 'chip-done' },
  cancelled: { label: 'Cancelled', cls: 'chip bg-brand-error/10 text-brand-error border border-brand-error/20' },
};

const TYPE_COLORS = {
  technical:  'from-blue-500/10 to-indigo-500/5',
  cultural:   'from-purple-500/10 to-pink-500/5',
  sports:     'from-green-500/10 to-emerald-500/5',
  social:     'from-amber-500/10 to-orange-500/5',
  academic:   'from-cyan-500/10 to-teal-500/5',
  fundraiser: 'from-rose-500/10 to-red-500/5',
  other:      'from-brand-accent/10 to-brand-accentHov/5',
};

export default function EventCard({ event }) {
  const status = STATUS_MAP[event.status] || STATUS_MAP.draft;
  const typeGradient = TYPE_COLORS[event.type] || TYPE_COLORS.other;

  return (
    <div className="group relative card hover:border-brand-muted hover:shadow-card-hover transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Top gradient band */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${typeGradient} opacity-80`} />

      {/* Cover placeholder */}
      <div className={`relative h-36 bg-gradient-to-br ${typeGradient} flex items-center justify-center`}>
        <span className="font-serif text-5xl font-black opacity-10 select-none tracking-tighter text-brand-white">
          {event.name?.substring(0, 2)?.toUpperCase()}
        </span>
        <div className="absolute top-3 right-3">
          <span className={status.cls}>{status.label}</span>
        </div>
        {event.planGenerated && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-brand-accentLow border border-brand-accent/20 px-2 py-0.5 rounded-full">
            <Zap className="w-2.5 h-2.5 text-brand-accent" />
            <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">AI Plan</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Type pill */}
        <div className="text-[10px] font-bold text-brand-dim uppercase tracking-widest mb-2">{event.type}</div>

        <h3 className="font-serif text-lg font-bold text-brand-white mb-4 leading-tight line-clamp-2 group-hover:text-brand-accent transition-colors duration-300">
          {event.name}
        </h3>

        <div className="space-y-2.5 flex-1 mb-5">
          <div className="flex items-center space-x-2 text-sm font-sans text-brand-mid">
            <Calendar className="w-3.5 h-3.5 text-brand-dim shrink-0" />
            <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-sans text-brand-mid">
            <MapPin className="w-3.5 h-3.5 text-brand-dim shrink-0" />
            <span>{event.city || 'TBD'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-sans text-brand-mid">
            <Users className="w-3.5 h-3.5 text-brand-dim shrink-0" />
            <span>{event.expectedAudience?.toLocaleString()} expected</span>
          </div>
        </div>

        <div className="border-t border-brand-border pt-4">
          <Link
            to={`/organizer/events/${event._id}`}
            className="flex items-center justify-between w-full group/link"
          >
            <span className="font-sans text-sm font-semibold text-brand-light group-hover/link:text-brand-accent transition-colors">Manage Event</span>
            <ArrowRight className="w-4 h-4 text-brand-dim group-hover/link:text-brand-accent group-hover/link:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
