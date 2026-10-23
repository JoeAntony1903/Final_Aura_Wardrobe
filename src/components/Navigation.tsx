import React from 'react';
import { Home, Shirt, Sparkles, User, Layers, LogIn, Palette } from 'lucide-react';
import { StarCalendarIcon } from './StarCalendarIcon';
import { UserProfile } from '../types';
import { useTheme } from '../utils/ThemeContext';
import { APP_THEMES } from '../utils/theme';

export type NavTab = 'home' | 'clothes' | 'outfits' | 'calendar' | 'stylist' | 'profile' | 'auth';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: UserProfile;
  onOpenTechDocs: () => void;
  onOpenAuthScreen: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  user,
  onOpenTechDocs,
  onOpenAuthScreen,
}) => {
  const { theme, themeId, setThemeId, accent } = useTheme();

  const tabs: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'clothes', label: 'Wardrobe', icon: <Shirt className="w-4 h-4" /> },
    { id: 'outfits', label: 'Outfit Hub', icon: <Layers className="w-4 h-4" /> },
    { id: 'calendar', label: 'Schedule', icon: <StarCalendarIcon size={16} variant="star" style={{ color: currentTab === 'calendar' ? theme.accentText : accent }} /> },
    { id: 'stylist', label: 'AI Stylist', icon: <Sparkles className="w-4 h-4" style={{ color: currentTab === 'stylist' ? theme.accentText : accent }} /> },
    { id: 'profile', label: 'Profile & Themes', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <div
            onClick={() => onTabChange('home')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition group-hover:scale-105"
              style={{
                backgroundColor: theme.accent,
                color: theme.accentText,
                boxShadow: `0 4px 14px rgba(${theme.accentRgb}, 0.35)`,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white group-hover:opacity-90 transition">
                AuraWardrobe
              </span>
              <span
                className="hidden sm:inline-block text-[10px] font-mono ml-2 border px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `rgba(${theme.accentRgb}, 0.15)`,
                  borderColor: `rgba(${theme.accentRgb}, 0.35)`,
                  color: theme.accent,
                }}
              >
                {theme.name}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.accent,
                          color: theme.accentText,
                          boxShadow: `0 2px 8px rgba(${theme.accentRgb}, 0.3)`,
                        }
                      : {}
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? 'font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Theme Quick Switcher & Login/Sign Up Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Theme Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl px-2 py-1">
              <Palette className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1 font-medium"
                aria-label="Select color theme"
              >
                {APP_THEMES.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Login / Sign Up Page Link (PRD & User Request) */}
            <button
              onClick={onOpenAuthScreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border"
              style={{
                backgroundColor: currentTab === 'auth' ? theme.accent : `rgba(${theme.accentRgb}, 0.12)`,
                color: currentTab === 'auth' ? theme.accentText : theme.accent,
                borderColor: `rgba(${theme.accentRgb}, 0.35)`,
              }}
              title="Open Login / Sign Up Page"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login / Sign Up</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onTabChange('profile')}
              className="flex items-center gap-1.5 p-1 pl-2 bg-slate-900/80 border border-slate-800 rounded-full hover:border-slate-700 transition"
              title="View Profile & Themes"
            >
              <span className="text-xs font-bold text-slate-200 hidden lg:inline truncate max-w-[80px]">
                {user.name.split(' ')[0]}
              </span>
              <div
                className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs border"
                style={{
                  backgroundColor: `rgba(${theme.accentRgb}, 0.2)`,
                  borderColor: theme.accent,
                  color: theme.accent,
                }}
              >
                {user.name[0]}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition text-slate-400 hover:text-slate-200"
              style={isActive ? { color: theme.accent, fontWeight: 'bold' } : {}}
            >
              <div
                className="p-1 rounded-lg"
                style={isActive ? { backgroundColor: `rgba(${theme.accentRgb}, 0.18)` } : {}}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
        {/* Mobile Auth button */}
        <button
          onClick={onOpenAuthScreen}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition text-slate-400 hover:text-slate-200"
          style={currentTab === 'auth' ? { color: theme.accent, fontWeight: 'bold' } : {}}
        >
          <div
            className="p-1 rounded-lg"
            style={currentTab === 'auth' ? { backgroundColor: `rgba(${theme.accentRgb}, 0.18)` } : {}}
          >
            <LogIn className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight">Login</span>
        </button>
      </nav>
    </>
  );
};
