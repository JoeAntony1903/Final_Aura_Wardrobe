import React, { useState, useEffect } from 'react';
import { Outfit, ClothingItem } from '../types';
import { Sparkles, Check, X, Heart } from 'lucide-react';
import { generateAiOutfitSuggestion, generateOutfitHash } from '../utils/wardrobeLogic';
import { useTheme } from '../utils/ThemeContext';

interface AiStylistViewProps {
  clothes: ClothingItem[];
  onAcceptOutfit: (outfit: Outfit) => void;
  onOpenManualMatch: (item: ClothingItem) => void;
}

export const AiStylistView: React.FC<AiStylistViewProps> = ({
  clothes,
  onAcceptOutfit,
  onOpenManualMatch,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [declinedHashes, setDeclinedHashes] = useState<Set<string>>(new Set());
  const [currentProposal, setCurrentProposal] = useState<ReturnType<typeof generateAiOutfitSuggestion>>(null);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);

  const loadNextSuggestion = () => {
    const next = generateAiOutfitSuggestion(clothes, declinedHashes);
    setCurrentProposal(next);
  };

  useEffect(() => {
    loadNextSuggestion();
  }, [clothes]);

  const handleAccept = () => {
    if (!currentProposal) return;

    const outfitName = currentProposal.fullbody
      ? `AI Curated: ${currentProposal.fullbody.name}`
      : `AI Curated: ${currentProposal.top?.name || 'Look'} & ${currentProposal.bottom?.name || 'Ensemble'}`;

    const newOutfit: Outfit = {
      id: 'outfit_ai_' + Date.now(),
      name: outfitName,
      fullbodyId: currentProposal.fullbody?.id,
      topId: currentProposal.top?.id,
      bottomId: currentProposal.bottom?.id,
      outerwearId: currentProposal.outerwear?.id,
      shoeId: currentProposal.shoes?.id,
      accessoryId: currentProposal.accessories?.id,
      isFavorite: true,
      tags: currentProposal.fullbody ? ['AI Stylist', 'Full-Body Look'] : ['AI Stylist', 'Synergy Match'],
      notes: currentProposal.explanation,
      createdAt: new Date().toISOString(),
    };

    onAcceptOutfit(newOutfit);
    setAcceptedToast(newOutfit.name);
    setTimeout(() => setAcceptedToast(null), 3000);

    // Also add to declined/seen to move to the next combination
    const hash = generateOutfitHash({
      fullbodyId: currentProposal.fullbody?.id,
      topId: currentProposal.top?.id,
      bottomId: currentProposal.bottom?.id,
      outerwearId: currentProposal.outerwear?.id,
      shoeId: currentProposal.shoes?.id,
      accessoryId: currentProposal.accessories?.id,
    });
    setDeclinedHashes((prev) => new Set(prev).add(hash));

    // Load next
    const updatedDeclined = new Set(declinedHashes).add(hash);
    const next = generateAiOutfitSuggestion(clothes, updatedDeclined);
    setCurrentProposal(next);
  };

  const handleDecline = () => {
    if (!currentProposal) return;

    const hash = generateOutfitHash({
      fullbodyId: currentProposal.fullbody?.id,
      topId: currentProposal.top?.id,
      bottomId: currentProposal.bottom?.id,
      outerwearId: currentProposal.outerwear?.id,
      shoeId: currentProposal.shoes?.id,
      accessoryId: currentProposal.accessories?.id,
    });

    const nextDeclined = new Set(declinedHashes).add(hash);
    setDeclinedHashes(nextDeclined);

    const next = generateAiOutfitSuggestion(clothes, nextDeclined);
    setCurrentProposal(next);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border"
          style={{
            backgroundColor: `rgba(${accentRgb}, 0.15)`,
            borderColor: `rgba(${accentRgb}, 0.35)`,
            color: accent,
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: accent }} /> Powered by Your Manual Match Training
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">AI Stylist Atelier</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Review personalized outfit combinations tailored to your style. Swipe or tap Accept to save to Outfit Hub, or Decline to ensure it is never repeated.
        </p>
      </div>

      {acceptedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Saved to Outfit Hub: "{acceptedToast}"</span>
          </div>
          <span className="text-[10px] text-emerald-300">Ready in Canvas & Calendar</span>
        </div>
      )}

      {/* Tinder-Style UI Card */}
      {currentProposal ? (
        <div className="relative rounded-3xl bg-slate-900/95 border-2 border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Match Score Badge */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-black font-mono"
                style={{ color: accent }}
              >
                {currentProposal.matchScore}%
              </span>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Style Harmony Score
                </div>
                <div className="text-[11px] text-slate-400">{currentProposal.explanation}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500">
                {declinedHashes.size} evaluated
              </span>
            </div>
          </div>

          {/* Proposal Garments Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Full-Body */}
            {currentProposal.fullbody && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-fuchsia-500/50 text-center space-y-2 col-span-2 sm:col-span-2">
                <span className="text-[10px] uppercase font-bold text-fuchsia-400">👗 Full-Body One-Piece</span>
                <div className="w-full h-32 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={currentProposal.fullbody.imageUrl}
                    alt={currentProposal.fullbody.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentProposal.fullbody.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentProposal.fullbody.brand} • {currentProposal.fullbody.color}</div>
              </div>
            )}

            {/* Top */}
            {currentProposal.top && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-sky-400">Top</span>
                <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={currentProposal.top.imageUrl}
                    alt={currentProposal.top.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentProposal.top.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentProposal.top.brand}</div>
              </div>
            )}

            {/* Bottom */}
            {currentProposal.bottom && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400">Bottom</span>
                <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={currentProposal.bottom.imageUrl}
                    alt={currentProposal.bottom.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentProposal.bottom.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentProposal.bottom.brand}</div>
              </div>
            )}

            {/* Outerwear */}
            {currentProposal.outerwear && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-500">Outerwear</span>
                <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={currentProposal.outerwear.imageUrl}
                    alt={currentProposal.outerwear.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentProposal.outerwear.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentProposal.outerwear.brand}</div>
              </div>
            )}

            {/* Shoes */}
            {currentProposal.shoes && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Shoes</span>
                <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={currentProposal.shoes.imageUrl}
                    alt={currentProposal.shoes.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentProposal.shoes.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentProposal.shoes.brand}</div>
              </div>
            )}

            {/* Accessories */}
            {currentProposal.accessories && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-400">Accessories</span>
                <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={currentProposal.accessories.imageUrl}
                    alt={currentProposal.accessories.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentProposal.accessories.name}
                </div>
                <div className="text-[10px] text-slate-400">{currentProposal.accessories.brand}</div>
              </div>
            )}
          </div>

          {/* Tinder-Style Action Buttons: Decline (X) vs Accept (Heart/Check) */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-800">
            {/* Decline Button */}
            <button
              onClick={handleDecline}
              aria-label="Decline outfit combination"
              className="group flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-rose-500/50 group-hover:bg-rose-500 group-hover:border-rose-400 text-rose-400 group-hover:text-white flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                <X className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-rose-400">
                Decline (Never Repeat)
              </span>
            </button>

            {/* Accept Button */}
            <button
              onClick={handleAccept}
              aria-label="Accept and save outfit"
              className="group flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div
                style={{
                  backgroundColor: accent,
                  color: accentText,
                  boxShadow: `0 8px 24px rgba(${accentRgb}, 0.35)`,
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all group-hover:scale-110"
              >
                <Heart className="w-7 h-7 fill-current stroke-current" />
              </div>
              <span
                className="text-xs font-bold"
                style={{ color: accent }}
              >
                Accept & Save to Hub
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <Sparkles className="w-8 h-8 mx-auto" style={{ color: accent }} />
          <h3 className="text-lg font-bold text-white">All Current Combinations Explored!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You've trained or evaluated all clean combinations for your current wardrobe. Add more items or reset declined looks to explore fresh suggestions.
          </p>
          <button
            onClick={() => setDeclinedHashes(new Set())}
            style={{
              backgroundColor: accent,
              color: accentText,
            }}
            className="px-4 py-2 rounded-xl font-bold text-xs uppercase"
          >
            Reset Declined Looks
          </button>
        </div>
      )}
    </div>
  );
};
