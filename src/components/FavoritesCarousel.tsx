import React, { useState } from 'react';
import { Outfit, ClothingItem } from '../types';
import { Heart, ChevronLeft, ChevronRight, Sparkles, Calendar, Tag } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface FavoritesCarouselProps {
  outfits: Outfit[];
  clothes: ClothingItem[];
  onSelectOutfit: (outfit: Outfit) => void;
  onScheduleOutfit: (outfitId: string) => void;
}

export const FavoritesCarousel: React.FC<FavoritesCarouselProps> = ({
  outfits,
  clothes,
  onSelectOutfit,
  onScheduleOutfit,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const favoriteOutfits = outfits.filter((o) => o.isFavorite);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (favoriteOutfits.length === 0) {
    return (
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
        <Heart className="w-6 h-6 text-slate-600 mx-auto" />
        <h3 className="text-sm font-bold text-slate-300">No Favorited Outfits Yet</h3>
        <p className="text-xs text-slate-500">
          Tap the heart on any look in the Outfit Hub to feature it in this signature showcase carousel.
        </p>
      </div>
    );
  }

  const activeOutfit = favoriteOutfits[currentIndex] || favoriteOutfits[0];
  const clothesMap = new Map(clothes.map((c) => [c.id, c]));

  const fullbody = activeOutfit.fullbodyId ? clothesMap.get(activeOutfit.fullbodyId) : null;
  const top = activeOutfit.topId ? clothesMap.get(activeOutfit.topId) : null;
  const bottom = activeOutfit.bottomId ? clothesMap.get(activeOutfit.bottomId) : null;
  const outerwear = activeOutfit.outerwearId ? clothesMap.get(activeOutfit.outerwearId) : null;
  const shoe = activeOutfit.shoeId ? clothesMap.get(activeOutfit.shoeId) : null;
  const accessory = activeOutfit.accessoryId ? clothesMap.get(activeOutfit.accessoryId) : null;

  const items = [fullbody, top, bottom, outerwear, shoe, accessory].filter(Boolean) as ClothingItem[];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? favoriteOutfits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === favoriteOutfits.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Favorites Slideshow</h3>
            <p className="text-xs text-slate-400">
              Curated showcase of your most loved signature combinations ({currentIndex + 1} of {favoriteOutfits.length})
            </p>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous favorited look"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next favorited look"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="relative rounded-2xl bg-slate-950/80 border border-slate-800/80 p-5 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Details & Tags */}
          <div className="space-y-3 w-full md:w-1/2">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `rgba(${accentRgb}, 0.15)`,
                  borderColor: `rgba(${accentRgb}, 0.35)`,
                  color: accent,
                }}
              >
                Signature Look
              </span>
              <span className="text-xs text-slate-400">{items.length} garments assembled</span>
            </div>

            <h4 className="text-2xl font-black text-white">{activeOutfit.name}</h4>

            {activeOutfit.notes && (
              <p className="text-xs text-slate-300 italic line-clamp-2">
                "{activeOutfit.notes}"
              </p>
            )}

            {activeOutfit.tags && activeOutfit.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeOutfit.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 font-medium flex items-center gap-1 border border-slate-700/60"
                  >
                    <Tag className="w-3 h-3" style={{ color: accent }} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onScheduleOutfit(activeOutfit.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
              >
                <Calendar className="w-3.5 h-3.5" style={{ color: accent }} /> Schedule
              </button>
              <button
                onClick={() => onSelectOutfit(activeOutfit)}
                style={{
                  backgroundColor: accent,
                  color: accentText,
                }}
                className="px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" /> Open in Canvas
              </button>
            </div>
          </div>

          {/* Garments Visual Stack */}
          <div className="w-full md:w-1/2 flex items-center justify-center gap-3 overflow-x-auto py-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-24 sm:w-28 rounded-2xl bg-slate-900 border border-slate-800 p-2 text-center space-y-1.5 group hover:border-slate-600 transition"
              >
                <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div
                  className="text-[10px] uppercase font-bold tracking-wider"
                  style={{ color: accent }}
                >
                  {item.category}
                </div>
                <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.brand}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {favoriteOutfits.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={i === currentIndex ? { backgroundColor: accent, width: '1.5rem' } : {}}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-6' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
