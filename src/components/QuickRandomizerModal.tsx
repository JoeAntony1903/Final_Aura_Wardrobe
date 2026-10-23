import React, { useState, useEffect } from 'react';
import { X, Dices, Sparkles, Calendar, Check, Heart } from 'lucide-react';
import { Outfit, ClothingItem } from '../types';
import { getRandomSavedOutfit } from '../utils/wardrobeLogic';
import { useTheme } from '../utils/ThemeContext';

interface QuickRandomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: Outfit[];
  clothes: ClothingItem[];
  onScheduleOutfit: (outfitId: string) => void;
  onWearOutfit: (outfit: Outfit) => void;
}

export const QuickRandomizerModal: React.FC<QuickRandomizerModalProps> = ({
  isOpen,
  onClose,
  savedOutfits,
  clothes,
  onScheduleOutfit,
  onWearOutfit,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [wornToast, setWornToast] = useState(false);

  useEffect(() => {
    if (isOpen && savedOutfits.length > 0) {
      rollRandom();
    }
  }, [isOpen, savedOutfits]);

  if (!isOpen) return null;

  const rollRandom = () => {
    if (savedOutfits.length === 0) return;
    setIsRolling(true);
    setTimeout(() => {
      const picked = getRandomSavedOutfit(savedOutfits, currentOutfit?.id);
      setCurrentOutfit(picked);
      setIsRolling(false);
    }, 300);
  };

  const clothesMap = new Map(clothes.map((c) => [c.id, c]));

  const fullbody = currentOutfit?.fullbodyId ? clothesMap.get(currentOutfit.fullbodyId) : null;
  const top = currentOutfit?.topId ? clothesMap.get(currentOutfit.topId) : null;
  const bottom = currentOutfit?.bottomId ? clothesMap.get(currentOutfit.bottomId) : null;
  const outerwear = currentOutfit?.outerwearId ? clothesMap.get(currentOutfit.outerwearId) : null;
  const shoe = currentOutfit?.shoeId ? clothesMap.get(currentOutfit.shoeId) : null;
  const accessory = currentOutfit?.accessoryId ? clothesMap.get(currentOutfit.accessoryId) : null;

  const handleWear = () => {
    if (!currentOutfit) return;
    onWearOutfit(currentOutfit);
    setWornToast(true);
    setTimeout(() => setWornToast(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Instant Outfit Randomizer</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Strictly Saved Outfits
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pulls exclusively from your {savedOutfits.length} saved outfits in Outfit Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close randomizer modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {savedOutfits.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="text-4xl">🪄</div>
              <h3 className="text-base font-bold text-white">No Saved Outfits in Hub Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create and save at least one outfit in the Outfit Hub to use the Quick Randomizer.
              </p>
            </div>
          ) : currentOutfit ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{currentOutfit.name}</h3>
                    {currentOutfit.isFavorite && (
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    )}
                  </div>
                  {currentOutfit.tags && currentOutfit.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {currentOutfit.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={rollRandom}
                  disabled={isRolling}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-2 transition border border-slate-700"
                >
                  <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>Re-roll Random</span>
                </button>
              </div>

              {/* Items Presentation Cards */}
              {currentOutfit.fullbodyId ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {/* Full-Body */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-fuchsia-500/50 text-center space-y-2 sm:col-span-1 md:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-fuchsia-400">👗 Full-Body One-Piece</span>
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {fullbody ? (
                        <img src={fullbody.imageUrl} alt={fullbody.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {fullbody?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{fullbody?.brand} • {fullbody?.color}</div>
                  </div>

                  {/* Footwear */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Footwear</span>
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {shoe ? (
                        <img src={shoe.imageUrl} alt={shoe.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {shoe?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{shoe?.brand}</div>
                  </div>

                  {/* Accessory */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-rose-400">Accessory</span>
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {accessory ? (
                        <img src={accessory.imageUrl} alt={accessory.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {accessory?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{accessory?.brand}</div>
                  </div>

                  {/* Outerwear (if present) */}
                  {outerwear && (
                    <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                      <span className="text-[10px] uppercase font-bold text-amber-500">Outerwear</span>
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                        <img src={outerwear.imageUrl} alt={outerwear.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[11px] font-semibold text-white truncate">
                        {outerwear.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{outerwear.brand}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {/* Top */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-sky-400">Top</span>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {top ? (
                        <img src={top.imageUrl} alt={top.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {top?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{top?.brand}</div>
                  </div>

                  {/* Bottom */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Bottom</span>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {bottom ? (
                        <img src={bottom.imageUrl} alt={bottom.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {bottom?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{bottom?.brand}</div>
                  </div>

                  {/* Outerwear */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-500">Outerwear</span>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {outerwear ? (
                        <img src={outerwear.imageUrl} alt={outerwear.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {outerwear?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{outerwear?.brand}</div>
                  </div>

                  {/* Shoes */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Footwear</span>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {shoe ? (
                        <img src={shoe.imageUrl} alt={shoe.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {shoe?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{shoe?.brand}</div>
                  </div>

                  {/* Accessory */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-rose-400">Accessory</span>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                      {accessory ? (
                        <img src={accessory.imageUrl} alt={accessory.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate">
                      {accessory?.name || '—'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{accessory?.brand}</div>
                  </div>
                </div>
              )}

              {currentOutfit.notes && (
                <p className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                  "{currentOutfit.notes}"
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {currentOutfit && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            {wornToast ? (
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Outfit logged as worn today!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Ready to style</span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onScheduleOutfit(currentOutfit.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Schedule in Calendar
              </button>

              <button
                type="button"
                onClick={handleWear}
                style={{
                  backgroundColor: accent,
                  color: accentText,
                  boxShadow: `0 4px 14px rgba(${accentRgb}, 0.35)`,
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:scale-105 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Wear Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
