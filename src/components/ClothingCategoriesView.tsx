import React, { useState } from 'react';
import { ClothingItem, CategoryType } from '../types';
import { Search, Droplets, Sparkles, Trash2, ExternalLink, X, Link2 } from 'lucide-react';
import { isItemInLaundry, getRemainingLaundryDays } from '../utils/wardrobeLogic';
import { useTheme } from '../utils/ThemeContext';

interface ClothingCategoriesViewProps {
  clothes: ClothingItem[];
  selectedCategory: CategoryType | 'all';
  onCategoryChange: (cat: CategoryType | 'all') => void;
  onDeleteItem: (id: string) => void;
  onWashItem: (id: string, durationDays: number) => void;
  onOpenManualMatch: (item: ClothingItem) => void;
  onAddItem: () => void;
}

export const ClothingCategoriesView: React.FC<ClothingCategoriesViewProps> = ({
  clothes,
  selectedCategory,
  onCategoryChange,
  onDeleteItem,
  onWashItem,
  onOpenManualMatch,
  onAddItem,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [hideLaundry, setHideLaundry] = useState(false);
  const [washingItemIds, setWashingItemIds] = useState<Set<string>>(new Set());

  // Extract unique colors and brands
  const colors = Array.from(new Set(clothes.map((c) => c.color))).filter(Boolean);
  const brands = Array.from(new Set(clothes.map((c) => c.brand))).filter(Boolean);

  const filteredClothes = clothes.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchColor = item.color.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchColor) return false;
    }
    if (colorFilter !== 'all' && item.color !== colorFilter) return false;
    if (brandFilter !== 'all' && item.brand !== brandFilter) return false;
    if (hideLaundry && isItemInLaundry(item)) return false;
    return true;
  });

  const handleWashClick = (item: ClothingItem) => {
    // Trigger bubble animation
    setWashingItemIds((prev) => new Set(prev).add(item.id));
    onWashItem(item.id, 4); // Default 4 days
    setTimeout(() => {
      setWashingItemIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Clothing Collection</h2>
          <p className="text-xs text-slate-400">
            Digitized garment catalog with AI training links and laundry cycle tracking
          </p>
        </div>

        <button
          onClick={onAddItem}
          style={{
            backgroundColor: accent,
            color: accentText,
            boxShadow: `0 4px 14px rgba(${accentRgb}, 0.35)`,
          }}
          className="self-start md:self-auto px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:scale-105 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Add New Garment
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'fullbody', label: 'Full Body' },
          { id: 'tops', label: 'Tops' },
          { id: 'bottoms', label: 'Bottoms' },
          { id: 'outerwear', label: 'Outerwear' },
          { id: 'shoes', label: 'Shoes' },
          { id: 'accessories', label: 'Accessories' },
        ].map((tab) => {
          const count =
            tab.id === 'all'
              ? clothes.length
              : clothes.filter((c) => c.category === tab.id).length;
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id as any)}
              style={
                isActive
                  ? {
                      backgroundColor: accent,
                      color: accentText,
                      borderColor: accent,
                    }
                  : {}
              }
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
                isActive
                  ? 'shadow-md font-bold'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-black/20 text-current' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
        {/* Search Input */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, or color..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Color Filter */}
        <div className="lg:col-span-3">
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Colors ({colors.length})</option>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="lg:col-span-2">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Hide Laundry Toggle */}
        <div className="lg:col-span-2 flex items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={hideLaundry}
              onChange={(e) => setHideLaundry(e.target.checked)}
              className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3.5 h-3.5 bg-slate-950"
            />
            <span className="text-[11px]">Hide Laundry</span>
          </label>
        </div>
      </div>

      {/* Garments Grid */}
      {filteredClothes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-3xl">👗</div>
          <h3 className="text-base font-bold text-white">No Items Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, clearing active filters, or adding a new digitized garment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredClothes.map((item) => {
            const inLaundry = isItemInLaundry(item);
            const remainingDays = getRemainingLaundryDays(item);
            const isCurrentlyBubbling = washingItemIds.has(item.id);
            const isAccessory = item.category === 'accessories';

            return (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between transition-all"
              >
                {/* Bubble Overlay Animation Container (Laundry Mode) */}
                {isCurrentlyBubbling && (
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden bg-sky-950/40 backdrop-blur-xs flex items-center justify-center">
                    <div className="absolute w-8 h-8 rounded-full bg-sky-300/40 border border-white/60 animate-bounce" />
                    <div className="absolute w-5 h-5 rounded-full bg-sky-200/50 border border-white/70 animate-ping" />
                    <div className="absolute bottom-4 left-6 w-10 h-10 rounded-full bg-cyan-300/30 border border-white/80 animate-pulse" />
                    <div className="px-3 py-1.5 rounded-full bg-sky-500 text-slate-950 text-xs font-black shadow-lg">
                      🧼 Sent to Laundry!
                    </div>
                  </div>
                )}

                {/* Laundry Disabled Banner if item in wash */}
                {inLaundry && !isCurrentlyBubbling && (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md">
                    <Droplets className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span>In Laundry ({remainingDays}d left)</span>
                  </div>
                )}

                {/* Top Action Icons (Delete & Link) */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onOpenManualMatch(item)}
                    title="Train AI Match"
                    className="p-1.5 rounded-lg bg-slate-950/80 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition border border-slate-800"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${item.name}" from your wardrobe?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    title="Delete item"
                    className="p-1.5 rounded-lg bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition border border-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Image Display Area */}
                <div className="relative w-full h-48 bg-gradient-to-b from-slate-950/80 to-slate-900/80 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ${
                      inLaundry ? 'opacity-40 grayscale-[40%]' : ''
                    }`}
                  />
                  {inLaundry && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="px-3 py-1 rounded-xl bg-slate-950/90 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold">
                        Cannot Be Worn
                      </span>
                    </div>
                  )}
                </div>

                {/* Garment Details & Metadata */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{item.brand}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate mt-0.5">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400">{item.color}</span>
                      {item.retailerUrl && (
                        <a
                          href={item.retailerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 hover:underline"
                        >
                          Shop <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Manual Match & Laundry Controls */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenManualMatch(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Match ({item.manualMatchIds?.length || 0})</span>
                    </button>

                    {/* Wash button: PRD Requirement 2 states available for all categories except Accessories */}
                    {!isAccessory ? (
                      <button
                        onClick={() => handleWashClick(item)}
                        disabled={inLaundry}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition ${
                          inLaundry
                            ? 'bg-cyan-500/10 text-cyan-400/60 border border-cyan-500/20 cursor-not-allowed'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        <Droplets className="w-3 h-3" />
                        <span>{inLaundry ? 'Washing' : 'Wash'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic pr-1">No Wash Req.</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
