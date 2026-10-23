import React from 'react';
import { UserProfile, ClothingItem, Outfit, CategoryType } from '../types';
import { WardrobeClosetVisual } from './WardrobeClosetVisual';
import { FavoritesCarousel } from './FavoritesCarousel';
import { Sparkles, Dices, Plus, ArrowRight, ShieldAlert, LogIn } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface HomeScreenProps {
  user: UserProfile;
  clothes: ClothingItem[];
  outfits: Outfit[];
  onOpenAddItem: () => void;
  onOpenRandomizer: () => void;
  onSelectCategory: (category: CategoryType) => void;
  onSelectOutfits: () => void;
  onScheduleOutfit: (outfitId: string) => void;
  onOpenAiStylist: () => void;
  onOpenTechDocs: () => void;
  onOpenAuthScreen: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  clothes,
  outfits,
  onOpenAddItem,
  onOpenRandomizer,
  onSelectCategory,
  onSelectOutfits,
  onScheduleOutfit,
  onOpenAiStylist,
  onOpenTechDocs,
  onOpenAuthScreen,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle dynamic ambient glow in banner */}
        <div
          className="absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: accent }}
        />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className="text-xs uppercase font-bold tracking-wider"
              style={{ color: accent }}
            >
              Haute Numérique Atelier
            </span>
            {user.isGuest ? (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1"
                style={{
                  backgroundColor: `rgba(${accentRgb}, 0.15)`,
                  borderColor: `rgba(${accentRgb}, 0.35)`,
                  color: accent,
                }}
              >
                <ShieldAlert className="w-3 h-3" /> Offline Guest Mode
              </span>
            ) : (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1"
                style={{
                  backgroundColor: `rgba(${accentRgb}, 0.15)`,
                  borderColor: `rgba(${accentRgb}, 0.35)`,
                  color: accent,
                }}
              >
                <Sparkles className="w-3 h-3" /> Cloud Synced
              </span>
            )}
          </div>
          {/* Welcome message with the user's name */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span style={{ color: accent }}>{user.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Your real-world closet digitized into an intelligent wardrobe ecosystem with AI matching and laundry tracking.
          </p>
        </div>

        {/* Primary Action Buttons: Add Item, Quick Randomizer, and Switch to Login/Signup */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          {/* Add Item Upload Button */}
          <button
            onClick={onOpenAddItem}
            style={{
              backgroundColor: accent,
              color: accentText,
              boxShadow: `0 6px 20px rgba(${accentRgb}, 0.35)`,
            }}
            className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition hover:scale-105 flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Item</span>
          </button>

          {/* Quick Randomizer Button */}
          <button
            onClick={onOpenRandomizer}
            style={{
              color: accent,
              borderColor: `rgba(${accentRgb}, 0.35)`,
            }}
            className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 font-bold text-xs uppercase tracking-wider border transition flex items-center gap-2 shadow-md hover:scale-105"
          >
            <Dices className="w-4 h-4" style={{ color: accent }} />
            <span>Quick Randomizer</span>
          </button>

          {/* Login / Sign Up Page Shortcut Button */}
          <button
            onClick={onOpenAuthScreen}
            className="px-3.5 py-2.5 sm:py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 font-semibold text-xs transition flex items-center gap-1.5"
            title="Open Login / Sign Up Screen"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auth Page</span>
          </button>
        </div>
      </div>

      {/* Wardrobe Overview: A visual layout referencing the closet image */}
      <WardrobeClosetVisual
        clothes={clothes}
        outfits={outfits}
        onSelectCategory={onSelectCategory}
        onSelectOutfits={onSelectOutfits}
        onAddItem={onOpenAddItem}
      />

      {/* Favorites Slideshow: Carousel of favorited outfits */}
      <FavoritesCarousel
        outfits={outfits}
        clothes={clothes}
        onSelectOutfit={onSelectOutfits}
        onScheduleOutfit={onScheduleOutfit}
      />

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Stylist Card */}
        <div
          onClick={onOpenAiStylist}
          className="cursor-pointer group p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <div
              className="p-3 rounded-2xl border"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.15)`,
                borderColor: `rgba(${accentRgb}, 0.35)`,
                color: accent,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <ArrowRight
              className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition"
              style={{ color: accent }}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white transition">
              AI Stylist Studio (Tinder Swipe)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Discover fresh combinations trained on your manual pairings. Swipe right to accept or left to decline.
            </p>
          </div>
        </div>

        {/* Architecture & Engineering Specs */}
        <div
          onClick={onOpenTechDocs}
          className="cursor-pointer group p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <div
              className="p-3 rounded-2xl border"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.15)`,
                borderColor: `rgba(${accentRgb}, 0.35)`,
                color: accent,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <ArrowRight
              className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition"
              style={{ color: accent }}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white transition">
              Tech Stack & Firestore Schema
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Inspect the React Native / Expo architecture, Photoroom background segmentation pipeline, and Firestore NoSQL schema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
