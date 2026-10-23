import React, { useState } from 'react';
import { X, Sparkles, Check, Link2, Unlink } from 'lucide-react';
import { ClothingItem } from '../types';

interface ManualMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: ClothingItem | null;
  allItems: ClothingItem[];
  onUpdateManualMatches: (itemId: string, matchedIds: string[]) => void;
}

export const ManualMatchModal: React.FC<ManualMatchModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  allItems,
  onUpdateManualMatches,
}) => {
  if (!isOpen || !targetItem) return null;

  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(
    new Set(targetItem.manualMatchIds || [])
  );

  // Other items (excluding target item)
  const candidateItems = allItems.filter((item) => item.id !== targetItem.id);

  const toggleMatch = (id: string) => {
    setSelectedMatches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    onUpdateManualMatches(targetItem.id, Array.from(selectedMatches));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manual AI Match Trainer</h2>
              <p className="text-xs text-slate-400">
                Link compatible garments across categories to teach the AI Stylist your aesthetic rules
              </p>
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

        {/* Current Active Item Banner */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-amber-400/50 flex-shrink-0">
            <img src={targetItem.imageUrl} alt={targetItem.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {targetItem.category}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{targetItem.brand}</span>
            </div>
            <h3 className="text-sm font-bold text-white truncate">{targetItem.name}</h3>
            <p className="text-[11px] text-slate-400">Color: {targetItem.color}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-amber-400 font-mono">
              {selectedMatches.size} Trained Links
            </div>
            <div className="text-[10px] text-slate-500">Synergy weight +25%</div>
          </div>
        </div>

        {/* Garment Selection Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="text-xs text-slate-400 font-medium">
            Select items that look stunning with this <span className="text-white font-bold">{targetItem.name}</span>:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {candidateItems.map((item) => {
              const isMatched = selectedMatches.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleMatch(item.id)}
                  className={`cursor-pointer rounded-2xl p-2.5 border transition relative flex flex-col justify-between ${
                    isMatched
                      ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Selected Badge */}
                  {isMatched && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-amber-400 text-slate-950 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 mb-2">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-amber-400/90 block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{item.brand} • {item.color}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                    {isMatched ? (
                      <span className="text-amber-300 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Linked to AI
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Unlink className="w-3 h-3" /> Tap to link
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {selectedMatches.size} manual pairings will guide the AI Stylist generator
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
            >
              Save AI Training Links
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
