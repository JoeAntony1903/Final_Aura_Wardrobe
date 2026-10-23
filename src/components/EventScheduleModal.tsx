import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Sparkles, Check } from 'lucide-react';
import { Outfit, EventSchedule } from '../types';
import { StarCalendarIcon } from './StarCalendarIcon';

interface EventScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfits: Outfit[];
  selectedDate: string; // YYYY-MM-DD
  initialOutfitId?: string;
  onSaveEvent: (event: EventSchedule) => void;
}

export const EventScheduleModal: React.FC<EventScheduleModalProps> = ({
  isOpen,
  onClose,
  outfits,
  selectedDate,
  initialOutfitId,
  onSaveEvent,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('10:00 AM');
  const [outfitId, setOutfitId] = useState(initialOutfitId || (outfits[0]?.id ?? ''));
  const [eventIcon, setEventIcon] = useState<'star' | 'party' | 'work' | 'gala' | 'casual'>('star');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !outfitId) return;

    onSaveEvent({
      id: 'ev_' + Date.now(),
      title: title.trim(),
      date,
      time,
      outfitId,
      eventIcon,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <StarCalendarIcon size={24} variant={eventIcon} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Schedule Outfit Look</h2>
              <p className="text-xs text-slate-400">Attach a signature ensemble and custom event badge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} id="event-form" className="p-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-slate-300">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gallery Opening, Board Dinner, Date Night"
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 7:30 PM"
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Select Outfit */}
          <div className="space-y-1">
            <label className="font-medium text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Assigned Saved Outfit *
            </label>
            <select
              value={outfitId}
              onChange={(e) => setOutfitId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              {outfits.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} {o.isFavorite ? '★ (Favorite)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Editable Event Logo / Icon (PRD Requirement 5) */}
          <div className="space-y-1.5 pt-1">
            <label className="font-medium text-slate-300">
              Event Logo / Icon Style (Star Calendar Badge)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'star', label: 'Star', desc: 'Featured' },
                { id: 'gala', label: 'Gala', desc: 'Formal' },
                { id: 'work', label: 'Work', desc: 'Business' },
                { id: 'party', label: 'Party', desc: 'Night Out' },
                { id: 'casual', label: 'Casual', desc: 'Weekend' },
              ].map((iconOption) => (
                <button
                  key={iconOption.id}
                  type="button"
                  onClick={() => setEventIcon(iconOption.id as any)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                    eventIcon === iconOption.id
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <StarCalendarIcon size={20} variant={iconOption.id as any} />
                  <span className="text-[10px] font-semibold">{iconOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Soho House, San Francisco"
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Styling Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring cashmere scarf if evening cools down."
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="event-form"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
          >
            Save to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
