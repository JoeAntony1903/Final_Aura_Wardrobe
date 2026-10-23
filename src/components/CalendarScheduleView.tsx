import React, { useState } from 'react';
import { Outfit, ClothingItem, EventSchedule } from '../types';
import { StarCalendarIcon } from './StarCalendarIcon';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface CalendarScheduleViewProps {
  events: EventSchedule[];
  outfits: Outfit[];
  clothes: ClothingItem[];
  onOpenScheduleModal: (dateStr: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  events,
  outfits,
  clothes,
  onOpenScheduleModal,
  onDeleteEvent,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // Generate 30 days grid based on today
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + currentMonthOffset;

  // First day of current view month
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentViewDate = new Date(year, month, 1);
  const currentMonthLabel = `${monthNames[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()}`;

  const outfitsMap = new Map(outfits.map((o) => [o.id, o]));
  const clothesMap = new Map(clothes.map((c) => [c.id, c]));

  // Create dates array
  const calendarCells = [];
  // Empty pad for beginning of week
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${currentViewDate.getFullYear()}-${String(currentViewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: d,
      dateStr: dStr,
      isToday:
        today.getDate() === d &&
        today.getMonth() === currentViewDate.getMonth() &&
        today.getFullYear() === currentViewDate.getFullYear(),
    });
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Wardrobe Schedule</h2>
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.15)`,
                borderColor: `rgba(${accentRgb}, 0.35)`,
                color: accent,
              }}
            >
              <StarCalendarIcon size={14} variant="star" color={accent} /> Star Icon Marker
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Plan your outfits up to a month in advance with customizable event logos
          </p>
        </div>

        {/* Month Navigation & Add Schedule button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setCurrentMonthOffset((p) => p - 1)}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white min-w-[120px] text-center">
              {currentMonthLabel}
            </span>
            <button
              onClick={() => setCurrentMonthOffset((p) => p + 1)}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              onOpenScheduleModal(todayStr);
            }}
            style={{
              backgroundColor: accent,
              color: accentText,
              boxShadow: `0 4px 14px rgba(${accentRgb}, 0.35)`,
            }}
            className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:scale-105 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Schedule Outfit
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[110px] rounded-2xl bg-slate-950/20 border border-slate-800/30 opacity-40"
              />
            );
          }

          const dayEvents = events.filter((e) => e.date === cell.dateStr);

          return (
            <div
              key={cell.dateStr}
              onClick={() => onOpenScheduleModal(cell.dateStr)}
              style={
                cell.isToday
                  ? {
                      backgroundColor: `rgba(${accentRgb}, 0.12)`,
                      borderColor: accent,
                    }
                  : {}
              }
              className={`min-h-[120px] sm:min-h-[140px] p-2 sm:p-2.5 rounded-2xl border transition flex flex-col justify-between cursor-pointer group ${
                cell.isToday
                  ? 'shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  style={
                    cell.isToday
                      ? {
                          backgroundColor: accent,
                          color: accentText,
                        }
                      : {}
                  }
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    cell.isToday
                      ? 'font-black'
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {cell.isToday && (
                  <span
                    className="text-[9px] uppercase font-bold"
                    style={{ color: accent }}
                  >
                    Today
                  </span>
                )}
              </div>

              {/* Day Events Container */}
              <div className="flex-1 my-1.5 space-y-1.5 overflow-hidden">
                {dayEvents.map((ev) => {
                  const outfit = outfitsMap.get(ev.outfitId);
                  const top = outfit?.topId ? clothesMap.get(outfit.topId) : null;
                  const bottom = outfit?.bottomId ? clothesMap.get(outfit.bottomId) : null;

                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1.5 rounded-xl bg-slate-950/90 border text-left space-y-1 relative"
                      style={{ borderColor: `rgba(${accentRgb}, 0.4)` }}
                    >
                      {/* Editable Event Logo / Icon Style (PRD Requirement 5) */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StarCalendarIcon size={14} variant={ev.eventIcon} color={accent} />
                          <span className="text-[10px] font-bold truncate max-w-[80px] text-white">
                            {ev.title}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="text-slate-500 hover:text-rose-400 text-[10px] px-1"
                        >
                          ×
                        </button>
                      </div>

                      {/* Outfit Preview in Day Cell */}
                      {outfit && (
                        <div className="flex items-center gap-1 pt-0.5">
                          <div className="flex -space-x-2">
                            {top && (
                              <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-900 bg-black">
                                <img src={top.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            {bottom && (
                              <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-900 bg-black">
                                <img src={bottom.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-300 truncate font-medium">
                            {outfit.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Look prompt on hover */}
              <div
                className="pt-1 text-[10px] text-slate-500 flex items-center gap-1 transition"
                style={{ color: undefined }}
              >
                <Plus className="w-3 h-3" />
                <span className="hidden sm:inline">Add Look</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
