import React, { useState } from 'react';
import { Outfit, ClothingItem, CategoryType } from '../types';
import { Sparkles, Heart, Share2, Plus, Calendar, Trash2, X } from 'lucide-react';
import { isItemInLaundry } from '../utils/wardrobeLogic';
import { useTheme } from '../utils/ThemeContext';

interface OutfitHubViewProps {
  outfits: Outfit[];
  clothes: ClothingItem[];
  onSaveOutfit: (outfit: Outfit) => void;
  onToggleFavorite: (outfitId: string) => void;
  onDeleteOutfit: (outfitId: string) => void;
  onShareOutfit: (outfit: Outfit) => void;
  onScheduleOutfit: (outfitId: string) => void;
  initialCanvasOutfit?: Outfit | null;
}

export const OutfitHubView: React.FC<OutfitHubViewProps> = ({
  outfits,
  clothes,
  onSaveOutfit,
  onToggleFavorite,
  onDeleteOutfit,
  onShareOutfit,
  onScheduleOutfit,
  initialCanvasOutfit,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  // Canvas State: Toggle between Two-Piece (Top + Bottom) and Full-Body (Dress/Jumpsuit)
  const [lookType, setLookType] = useState<'two-piece' | 'fullbody'>(
    initialCanvasOutfit?.fullbodyId ? 'fullbody' : 'two-piece'
  );

  const [selectedFullbody, setSelectedFullbody] = useState<string | undefined>(initialCanvasOutfit?.fullbodyId);
  const [selectedTop, setSelectedTop] = useState<string | undefined>(initialCanvasOutfit?.topId);
  const [selectedBottom, setSelectedBottom] = useState<string | undefined>(initialCanvasOutfit?.bottomId);
  const [selectedOuterwear, setSelectedOuterwear] = useState<string | undefined>(initialCanvasOutfit?.outerwearId);
  const [selectedShoe, setSelectedShoe] = useState<string | undefined>(initialCanvasOutfit?.shoeId);
  const [selectedAccessory, setSelectedAccessory] = useState<string | undefined>(initialCanvasOutfit?.accessoryId);

  const [outfitName, setOutfitName] = useState('');
  const [outfitNotes, setOutfitNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(true);
  const [activeSlotPicker, setActiveSlotPicker] = useState<CategoryType | null>(null);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);

  const clothesMap = new Map(clothes.map((c) => [c.id, c]));

  const fullbodyItem = selectedFullbody ? clothesMap.get(selectedFullbody) : null;
  const topItem = selectedTop ? clothesMap.get(selectedTop) : null;
  const bottomItem = selectedBottom ? clothesMap.get(selectedBottom) : null;
  const outerwearItem = selectedOuterwear ? clothesMap.get(selectedOuterwear) : null;
  const shoeItem = selectedShoe ? clothesMap.get(selectedShoe) : null;
  const accessoryItem = selectedAccessory ? clothesMap.get(selectedAccessory) : null;

  const totalSelectedCount =
    lookType === 'fullbody'
      ? [selectedFullbody, selectedOuterwear, selectedShoe, selectedAccessory].filter(Boolean).length
      : [selectedTop, selectedBottom, selectedOuterwear, selectedShoe, selectedAccessory].filter(Boolean).length;

  const handleClearCanvas = () => {
    setSelectedFullbody(undefined);
    setSelectedTop(undefined);
    setSelectedBottom(undefined);
    setSelectedOuterwear(undefined);
    setSelectedShoe(undefined);
    setSelectedAccessory(undefined);
    setOutfitName('');
    setOutfitNotes('');
  };

  const handleSaveCanvasOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookType === 'fullbody' && !selectedFullbody) {
      alert('Please select a Full-Body garment (dress, jumpsuit, romper) for this look.');
      return;
    }
    if (totalSelectedCount === 0) {
      alert('Please select at least 1 item to save an outfit.');
      return;
    }

    const newOutfit: Outfit = {
      id: 'outfit_' + Date.now(),
      name:
        outfitName.trim() ||
        (lookType === 'fullbody' && fullbodyItem
          ? `${fullbodyItem.name} Look`
          : `Curated Look #${outfits.length + 1}`),
      fullbodyId: lookType === 'fullbody' ? selectedFullbody : undefined,
      topId: lookType === 'two-piece' ? selectedTop : undefined,
      bottomId: lookType === 'two-piece' ? selectedBottom : undefined,
      outerwearId: selectedOuterwear,
      shoeId: selectedShoe,
      accessoryId: selectedAccessory,
      isFavorite,
      notes: outfitNotes.trim() || undefined,
      tags: lookType === 'fullbody' ? ['Full-Body', 'One-Piece', 'Wardrobe Atelier'] : ['Two-Piece', 'Custom', 'Wardrobe Atelier'],
      createdAt: new Date().toISOString(),
    };

    onSaveOutfit(newOutfit);
    handleClearCanvas();
  };

  const displayOutfits = filterFavoritesOnly ? outfits.filter((o) => o.isFavorite) : outfits;

  return (
    <div className="space-y-8">
      {/* Canvas Section */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Atelier Outfit Canvas</h2>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                style={{
                  backgroundColor: `rgba(${accentRgb}, 0.15)`,
                  borderColor: `rgba(${accentRgb}, 0.35)`,
                  color: accent,
                }}
              >
                Mix & Match Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lookType === 'fullbody'
                ? 'One-piece full body looks pair directly with Shoes, Accessories, and optional Outerwear (no top or bottom required)'
                : 'Combine Tops, Bottoms, Outerwear, Shoes, and Accessories into cohesive two-piece looks'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Look Type Segmented Switcher */}
            <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setLookType('two-piece');
                  setSelectedFullbody(undefined);
                }}
                style={lookType === 'two-piece' ? { backgroundColor: accent, color: accentText } : {}}
                className={`px-3 py-1.5 rounded-lg transition ${
                  lookType === 'two-piece' ? 'font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Two-Piece (Top + Bottom)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLookType('fullbody');
                  setSelectedTop(undefined);
                  setSelectedBottom(undefined);
                }}
                style={lookType === 'fullbody' ? { backgroundColor: accent, color: accentText } : {}}
                className={`px-3 py-1.5 rounded-lg transition ${
                  lookType === 'fullbody' ? 'font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                👗 Full-Body (Dress / Jumpsuit)
              </button>
            </div>

            <button
              onClick={handleClearCanvas}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Outfit Slots: Full-Body Look vs Two-Piece Look */}
        {lookType === 'fullbody' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Full-Body Garment Slot (Dresses, Jumpsuits, Rompers, Overalls) */}
            <div
              onClick={() => setActiveSlotPicker('fullbody')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[185px] sm:col-span-1 md:col-span-1 ${
                fullbodyItem
                  ? 'bg-slate-950/90 border-fuchsia-400/80 shadow-lg shadow-fuchsia-500/10'
                  : 'bg-slate-950/40 border-dashed border-fuchsia-500/40 hover:border-fuchsia-400'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-fuchsia-400 flex items-center gap-1">
                <span>👗 Full-Body Garment</span>
                <span className="text-[9px] font-normal text-slate-400">(Required)</span>
              </span>
              {fullbodyItem ? (
                <>
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={fullbodyItem.imageUrl} alt={fullbodyItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{fullbodyItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{fullbodyItem.brand} • {fullbodyItem.color}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFullbody(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-fuchsia-300">
                  <Plus className="w-7 h-7 mb-1 text-fuchsia-400/70" />
                  <span className="text-xs font-semibold text-fuchsia-300">Select Full-Body Item</span>
                  <span className="text-[10px] text-slate-500">Dress, Jumpsuit, Romper</span>
                </div>
              )}
            </div>

            {/* Footwear Slot */}
            <div
              onClick={() => setActiveSlotPicker('shoes')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[185px] ${
                shoeItem
                  ? 'bg-slate-950/80 border-emerald-400/80 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-emerald-400">Footwear</span>
              {shoeItem ? (
                <>
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={shoeItem.imageUrl} alt={shoeItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{shoeItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{shoeItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShoe(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-emerald-400/60" />
                  <span className="text-[11px] font-semibold">Select Shoes</span>
                </div>
              )}
            </div>

            {/* Accessory Slot */}
            <div
              onClick={() => setActiveSlotPicker('accessories')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[185px] ${
                accessoryItem
                  ? 'bg-slate-950/80 border-rose-400/80 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-rose-400">Accessories</span>
              {accessoryItem ? (
                <>
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={accessoryItem.imageUrl} alt={accessoryItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{accessoryItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{accessoryItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccessory(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-rose-400/60" />
                  <span className="text-[11px] font-semibold">Select Accessory</span>
                </div>
              )}
            </div>

            {/* Optional Layering Outerwear */}
            <div
              onClick={() => setActiveSlotPicker('outerwear')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[185px] ${
                outerwearItem
                  ? 'bg-slate-950/80 border-amber-500/80 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-amber-500">Outerwear (Optional)</span>
              {outerwearItem ? (
                <>
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={outerwearItem.imageUrl} alt={outerwearItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{outerwearItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{outerwearItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOuterwear(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-amber-500/60" />
                  <span className="text-[11px] font-semibold">Layer Jacket / Coat</span>
                  <span className="text-[9px] text-slate-500">Optional</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 5 Two-Piece Outfit Slots */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Top Slot */}
            <div
              onClick={() => setActiveSlotPicker('tops')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[170px] ${
                topItem
                  ? 'bg-slate-950/80 border-sky-400/80 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-sky-400">Top</span>
              {topItem ? (
                <>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={topItem.imageUrl} alt={topItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{topItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{topItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTop(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-sky-400/60" />
                  <span className="text-[11px] font-semibold">Select Top</span>
                </div>
              )}
            </div>

            {/* Bottom Slot */}
            <div
              onClick={() => setActiveSlotPicker('bottoms')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[170px] ${
                bottomItem
                  ? 'bg-slate-950/80 border-indigo-400/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-indigo-400">Bottom</span>
              {bottomItem ? (
                <>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={bottomItem.imageUrl} alt={bottomItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{bottomItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{bottomItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBottom(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-indigo-400/60" />
                  <span className="text-[11px] font-semibold">Select Bottom</span>
                </div>
              )}
            </div>

            {/* Outerwear Slot */}
            <div
              onClick={() => setActiveSlotPicker('outerwear')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[170px] ${
                outerwearItem
                  ? 'bg-slate-950/80 border-amber-500/80 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-amber-500">Outerwear</span>
              {outerwearItem ? (
                <>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={outerwearItem.imageUrl} alt={outerwearItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{outerwearItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{outerwearItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOuterwear(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-amber-500/60" />
                  <span className="text-[11px] font-semibold">Select Outerwear</span>
                </div>
              )}
            </div>

            {/* Shoe Slot */}
            <div
              onClick={() => setActiveSlotPicker('shoes')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[170px] ${
                shoeItem
                  ? 'bg-slate-950/80 border-emerald-400/80 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-emerald-400">Footwear</span>
              {shoeItem ? (
                <>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={shoeItem.imageUrl} alt={shoeItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{shoeItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{shoeItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShoe(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-emerald-400/60" />
                  <span className="text-[11px] font-semibold">Select Shoes</span>
                </div>
              )}
            </div>

            {/* Accessory Slot */}
            <div
              onClick={() => setActiveSlotPicker('accessories')}
              className={`cursor-pointer group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-between min-h-[170px] ${
                accessoryItem
                  ? 'bg-slate-950/80 border-rose-400/80 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-rose-400">Accessory</span>
              {accessoryItem ? (
                <>
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 my-1">
                    <img src={accessoryItem.imageUrl} alt={accessoryItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <div className="text-xs font-bold text-white truncate">{accessoryItem.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{accessoryItem.brand}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccessory(undefined);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-slate-500 group-hover:text-slate-300">
                  <Plus className="w-6 h-6 mb-1 text-rose-400/60" />
                  <span className="text-[11px] font-semibold">Select Accessory</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Form */}
        <form onSubmit={handleSaveCanvasOutfit} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-5 space-y-1">
              <label className="font-medium text-slate-300">Outfit Title *</label>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="e.g. Monaco Yacht Club Luncheon"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="font-medium text-slate-300">Stylist Notes</label>
              <input
                type="text"
                value={outfitNotes}
                onChange={(e) => setOutfitNotes(e.target.value)}
                placeholder="e.g. Pair with dark sunglasses and gold watch"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 pb-2">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3.5 h-3.5 bg-slate-950"
                />
                <span className="text-xs font-semibold">Favorite</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              {totalSelectedCount} of 5 slots populated (min. 1 required)
            </span>
            <button
              type="submit"
              disabled={totalSelectedCount === 0}
              style={{
                backgroundColor: totalSelectedCount > 0 ? accent : undefined,
                color: totalSelectedCount > 0 ? accentText : undefined,
                boxShadow: totalSelectedCount > 0 ? `0 4px 14px rgba(${accentRgb}, 0.35)` : undefined,
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Save Outfit to Hub
            </button>
          </div>
        </form>
      </div>

      {/* Item Picker Drawer / Modal */}
      {activeSlotPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Select {activeSlotPicker}
                </span>
                <span className="text-xs text-slate-400">
                  (Only clean, ready-to-wear items shown)
                </span>
              </div>
              <button
                onClick={() => setActiveSlotPicker(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {clothes
                .filter((c) => c.category === activeSlotPicker)
                .map((item) => {
                  const inLaundry = isItemInLaundry(item);
                  return (
                    <button
                      key={item.id}
                      disabled={inLaundry}
                      onClick={() => {
                        if (activeSlotPicker === 'fullbody') setSelectedFullbody(item.id);
                        if (activeSlotPicker === 'tops') setSelectedTop(item.id);
                        if (activeSlotPicker === 'bottoms') setSelectedBottom(item.id);
                        if (activeSlotPicker === 'outerwear') setSelectedOuterwear(item.id);
                        if (activeSlotPicker === 'shoes') setSelectedShoe(item.id);
                        if (activeSlotPicker === 'accessories') setSelectedAccessory(item.id);
                        setActiveSlotPicker(null);
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                        inLaundry
                          ? 'bg-slate-950/40 border-slate-800/50 opacity-40 cursor-not-allowed'
                          : 'bg-slate-950/80 border-slate-800 hover:border-amber-400 hover:scale-[1.02]'
                      }`}
                    >
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 mb-2">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.brand} • {item.color}</div>
                      </div>
                      {inLaundry && (
                        <span className="mt-1 text-[10px] text-cyan-400 font-bold">In Laundry</span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Saved Outfits Hub Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Saved Outfits Hub</h3>
            <p className="text-xs text-slate-400">
              Browse, share, or schedule your curated wardrobe looks ({outfits.length} total)
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
            <input
              type="checkbox"
              checked={filterFavoritesOnly}
              onChange={(e) => setFilterFavoritesOnly(e.target.checked)}
              className="rounded border-slate-700 text-rose-500 focus:ring-0 w-3.5 h-3.5 bg-slate-950"
            />
            <span>Favorites Only</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayOutfits.map((outfit) => {
            const isFullbodyLook = Boolean(outfit.fullbodyId);
            const fullbody = outfit.fullbodyId ? clothesMap.get(outfit.fullbodyId) : null;
            const top = outfit.topId ? clothesMap.get(outfit.topId) : null;
            const bottom = outfit.bottomId ? clothesMap.get(outfit.bottomId) : null;
            const outerwear = outfit.outerwearId ? clothesMap.get(outfit.outerwearId) : null;
            const shoe = outfit.shoeId ? clothesMap.get(outfit.shoeId) : null;
            const accessory = outfit.accessoryId ? clothesMap.get(outfit.accessoryId) : null;

            return (
              <div
                key={outfit.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 shadow-xl flex flex-col justify-between space-y-4 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white truncate">{outfit.name}</h4>
                        {isFullbodyLook && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                            👗 Full-Body
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFavorite(outfit.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          outfit.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>

                  {outfit.notes && (
                    <p className="text-xs text-slate-400 italic line-clamp-2 mb-3">
                      "{outfit.notes}"
                    </p>
                  )}

                  {/* Assembled thumbnails */}
                  {isFullbodyLook ? (
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-slate-950/60 border border-slate-800">
                      {/* Full-Body garment takes 2 columns */}
                      <div className="col-span-2 h-16 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center relative border border-fuchsia-500/30">
                        {fullbody ? (
                          <>
                            <img
                              src={fullbody.imageUrl}
                              alt={fullbody.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                              <span className="text-[9px] font-medium text-fuchsia-200 truncate w-full">
                                👗 {fullbody.name}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-700">—</span>
                        )}
                      </div>

                      {/* Footwear */}
                      <div className="h-16 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center relative">
                        {shoe ? (
                          <>
                            <img
                              src={shoe.imageUrl}
                              alt={shoe.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-0.5">
                              <span className="text-[8px] font-medium text-emerald-300 truncate w-full">
                                👞 {shoe.name}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-700">—</span>
                        )}
                      </div>

                      {/* Accessory or Outerwear */}
                      <div className="h-16 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center relative">
                        {accessory ? (
                          <>
                            <img
                              src={accessory.imageUrl}
                              alt={accessory.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-0.5">
                              <span className="text-[8px] font-medium text-rose-300 truncate w-full">
                                ✨ {accessory.name}
                              </span>
                            </div>
                          </>
                        ) : outerwear ? (
                          <>
                            <img
                              src={outerwear.imageUrl}
                              alt={outerwear.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-0.5">
                              <span className="text-[8px] font-medium text-amber-300 truncate w-full">
                                🧥 {outerwear.name}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-700">—</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-1.5 p-2 rounded-2xl bg-slate-950/60 border border-slate-800">
                      {[top, bottom, outerwear, shoe, accessory].map((garment, idx) => (
                        <div
                          key={idx}
                          className="w-full h-14 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center"
                        >
                          {garment ? (
                            <img
                              src={garment.imageUrl}
                              alt={garment.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-700">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onScheduleOutfit(outfit.id)}
                      title="Schedule look"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <button
                      onClick={() => onShareOutfit(outfit)}
                      title="Share public link to WhatsApp/Insta"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      <Share2 className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${outfit.name}"?`)) {
                        onDeleteOutfit(outfit.id);
                      }
                    }}
                    title="Delete outfit"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
