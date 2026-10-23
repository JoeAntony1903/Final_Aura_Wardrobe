/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, ClothingItem, Outfit, EventSchedule, CategoryType } from './types';
import { INITIAL_USER, INITIAL_SAMPLE_CLOTHES, INITIAL_SAMPLE_OUTFITS, INITIAL_EVENTS } from './data/mockData';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import { checkAndPurgeSamples } from './utils/wardrobeLogic';
import { AuthScreen } from './components/AuthScreen';
import { Navigation, NavTab } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { ClothingCategoriesView } from './components/ClothingCategoriesView';
import { OutfitHubView } from './components/OutfitHubView';
import { CalendarScheduleView } from './components/CalendarScheduleView';
import { AiStylistView } from './components/AiStylistView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { AddItemModal } from './components/AddItemModal';
import { QuickRandomizerModal } from './components/QuickRandomizerModal';
import { ManualMatchModal } from './components/ManualMatchModal';
import { PublicShareModal } from './components/PublicShareModal';
import { EventScheduleModal } from './components/EventScheduleModal';
import { TechStackDocsModal } from './components/TechStackDocsModal';
import { Sparkles } from 'lucide-react';

function AuraWardrobeApp() {
  const { theme, themeId, setThemeId, accent, accentRgb, accentText } = useTheme();

  // Fresh authentication state: starts unauthenticated for full new experience
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aura_is_authed') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Core Wardrobe Data State: Keep initial sample clothes (count = 3)
  const [clothes, setClothes] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem('aura_clothes');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_CLOTHES;
  });

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem('aura_outfits');
    return saved ? JSON.parse(saved) : INITIAL_SAMPLE_OUTFITS;
  });

  const [events, setEvents] = useState<EventSchedule[]>(() => {
    const saved = localStorage.getItem('aura_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  // Purge Toast Notification
  const [purgeToast, setPurgeToast] = useState<boolean>(false);

  // Modals State
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState(false);
  const [manualMatchItem, setManualMatchItem] = useState<ClothingItem | null>(null);
  const [shareOutfit, setShareOutfit] = useState<Outfit | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTargetDate, setScheduleTargetDate] = useState<string>('2026-10-24');
  const [scheduleInitialOutfitId, setScheduleInitialOutfitId] = useState<string | undefined>();
  const [isTechDocsOpen, setIsTechDocsOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_is_authed', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('aura_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aura_clothes', JSON.stringify(clothes));
  }, [clothes]);

  useEffect(() => {
    localStorage.setItem('aura_outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem('aura_events', JSON.stringify(events));
  }, [events]);

  // Handle adding an item with the requested rule:
  // "keep some sample clothes but remove them as soon as the count of clothing or outfit go above 3"
  const handleSaveItem = (newItem: ClothingItem) => {
    const nextClothes = [newItem, ...clothes];
    const { clothes: purgedClothes, outfits: purgedOutfits, purged } = checkAndPurgeSamples(
      nextClothes,
      outfits
    );

    setClothes(purgedClothes);
    if (purged) {
      setOutfits(purgedOutfits);
      setPurgeToast(true);
      setTimeout(() => setPurgeToast(false), 4000);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setClothes((prev) => prev.filter((c) => c.id !== itemId));
    setOutfits((prev) =>
      prev.map((o) => ({
        ...o,
        fullbodyId: o.fullbodyId === itemId ? undefined : o.fullbodyId,
        topId: o.topId === itemId ? undefined : o.topId,
        bottomId: o.bottomId === itemId ? undefined : o.bottomId,
        outerwearId: o.outerwearId === itemId ? undefined : o.outerwearId,
        shoeId: o.shoeId === itemId ? undefined : o.shoeId,
        accessoryId: o.accessoryId === itemId ? undefined : o.accessoryId,
      }))
    );
  };

  const handleWashItem = (itemId: string, durationDays: number) => {
    setClothes((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            laundryStatus: {
              isWashed: true,
              washStartedAt: new Date().toISOString(),
              washDurationDays: durationDays,
            },
          };
        }
        return item;
      })
    );
  };

  const handleUpdateManualMatches = (itemId: string, matchedIds: string[]) => {
    setClothes((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, manualMatchIds: matchedIds };
        }
        if (matchedIds.includes(item.id)) {
          const existing = item.manualMatchIds || [];
          if (!existing.includes(itemId)) {
            return { ...item, manualMatchIds: [...existing, itemId] };
          }
        }
        return item;
      })
    );
  };

  // Handle saving an outfit with the requested rule:
  // "remove them as soon as the count of clothing or outfit go above 3"
  const handleSaveOutfit = (newOutfit: Outfit) => {
    const nextOutfits = [newOutfit, ...outfits];
    const { clothes: purgedClothes, outfits: purgedOutfits, purged } = checkAndPurgeSamples(
      clothes,
      nextOutfits
    );

    setOutfits(purgedOutfits);
    if (purged) {
      setClothes(purgedClothes);
      setPurgeToast(true);
      setTimeout(() => setPurgeToast(false), 4000);
    }
  };

  const handleToggleFavorite = (outfitId: string) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === outfitId ? { ...o, isFavorite: !o.isFavorite } : o))
    );
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== outfitId));
    setEvents((prev) => prev.filter((e) => e.outfitId !== outfitId));
  };

  // Event Schedule Handlers
  const handleOpenScheduleModal = (dateStr: string, outfitId?: string) => {
    setScheduleTargetDate(dateStr);
    setScheduleInitialOutfitId(outfitId);
    setIsScheduleModalOpen(true);
  };

  const handleSaveEvent = (newEvent: EventSchedule) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // If user is not authenticated or explicitly viewing 'auth'
  if (!isAuthenticated || currentTab === 'auth') {
    return (
      <AuthScreen
        onLoginSuccess={(authedUser) => {
          setUser(authedUser);
          setIsAuthenticated(true);
          setCurrentTab('home');
        }}
        onEnterGuestMode={(customName) => {
          setUser({
            id: 'guest_' + Math.floor(Math.random() * 9000),
            name: customName || 'My Wardrobe',
            email: 'guest@aurawardrobe.local',
            isGuest: true,
            themeId: themeId,
          });
          setIsAuthenticated(true);
          setCurrentTab('home');
        }}
        onBackToApp={isAuthenticated ? () => setCurrentTab('home') : undefined}
      />
    );
  }

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${theme.bgGradient} text-slate-100 flex flex-col font-sans selection:text-slate-950`}
      style={{
        accentColor: accent,
      }}
    >
      {/* Navigation Header & Mobile Bottom Bar */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenTechDocs={() => setIsTechDocsOpen(true)}
        onOpenAuthScreen={() => setCurrentTab('auth')}
      />

      {/* Sample Items Transition Notification */}
      {purgeToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div
            className="p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in duration-300"
            style={{
              backgroundColor: `rgba(${accentRgb}, 0.15)`,
              borderColor: accent,
              color: accent,
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Sample starter items automatically removed! Your wardrobe is now 100% your own digitized collection.</span>
            </div>
            <button
              onClick={() => setPurgeToast(false)}
              className="text-white hover:opacity-80 px-2 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {currentTab === 'home' && (
          <HomeScreen
            user={user}
            clothes={clothes}
            outfits={outfits}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onOpenRandomizer={() => setIsRandomizerOpen(true)}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setCurrentTab('clothes');
            }}
            onSelectOutfits={() => setCurrentTab('outfits')}
            onScheduleOutfit={(outfitId) => {
              const todayStr = '2026-10-24';
              handleOpenScheduleModal(todayStr, outfitId);
            }}
            onOpenAiStylist={() => setCurrentTab('stylist')}
            onOpenTechDocs={() => setIsTechDocsOpen(true)}
            onOpenAuthScreen={() => setCurrentTab('auth')}
          />
        )}

        {currentTab === 'clothes' && (
          <ClothingCategoriesView
            clothes={clothes}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onDeleteItem={handleDeleteItem}
            onWashItem={handleWashItem}
            onOpenManualMatch={(item) => setManualMatchItem(item)}
            onAddItem={() => setIsAddItemOpen(true)}
          />
        )}

        {currentTab === 'outfits' && (
          <OutfitHubView
            outfits={outfits}
            clothes={clothes}
            onSaveOutfit={handleSaveOutfit}
            onToggleFavorite={handleToggleFavorite}
            onDeleteOutfit={handleDeleteOutfit}
            onShareOutfit={(outfit) => setShareOutfit(outfit)}
            onScheduleOutfit={(outfitId) => {
              const todayStr = '2026-10-24';
              handleOpenScheduleModal(todayStr, outfitId);
            }}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarScheduleView
            events={events}
            outfits={outfits}
            clothes={clothes}
            onOpenScheduleModal={(dateStr) => handleOpenScheduleModal(dateStr)}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {currentTab === 'stylist' && (
          <AiStylistView
            clothes={clothes}
            onAcceptOutfit={handleSaveOutfit}
            onOpenManualMatch={(item) => setManualMatchItem(item)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSettingsView
            user={user}
            currentThemeId={themeId}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onSelectTheme={(tId) => setThemeId(tId)}
            onOpenTechDocs={() => setIsTechDocsOpen(true)}
            onOpenAuthScreen={() => setCurrentTab('auth')}
            onSignOut={() => {
              localStorage.removeItem('aura_is_authed');
              localStorage.removeItem('aura_user');
              setIsAuthenticated(false);
              setCurrentTab('auth');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onSaveItem={handleSaveItem}
      />

      <QuickRandomizerModal
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
        savedOutfits={outfits}
        clothes={clothes}
        onScheduleOutfit={(outfitId) => {
          setIsRandomizerOpen(false);
          handleOpenScheduleModal('2026-10-24', outfitId);
        }}
        onWearOutfit={() => {}}
      />

      <ManualMatchModal
        isOpen={!!manualMatchItem}
        onClose={() => setManualMatchItem(null)}
        targetItem={manualMatchItem}
        allItems={clothes}
        onUpdateManualMatches={handleUpdateManualMatches}
      />

      <PublicShareModal
        isOpen={!!shareOutfit}
        onClose={() => setShareOutfit(null)}
        outfit={shareOutfit}
        clothes={clothes}
        userName={user.name || 'AuraWardrobe'}
      />

      <EventScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        outfits={outfits}
        selectedDate={scheduleTargetDate}
        initialOutfitId={scheduleInitialOutfitId}
        onSaveEvent={handleSaveEvent}
      />

      <TechStackDocsModal
        isOpen={isTechDocsOpen}
        onClose={() => setIsTechDocsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuraWardrobeApp />
    </ThemeProvider>
  );
}
