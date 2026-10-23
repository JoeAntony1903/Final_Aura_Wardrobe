import React, { useState } from 'react';
import { ClothingItem, Outfit, CategoryType } from '../types';
import { Sparkles, Shirt, Layers, ShoppingBag, Eye } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';

interface WardrobeClosetVisualProps {
  clothes: ClothingItem[];
  outfits: Outfit[];
  onSelectCategory: (category: CategoryType) => void;
  onSelectOutfits: () => void;
  onAddItem: () => void;
}

export const WardrobeClosetVisual: React.FC<WardrobeClosetVisualProps> = ({
  clothes,
  outfits,
  onSelectCategory,
  onSelectOutfits,
  onAddItem,
}) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [closetMode, setClosetMode] = useState<'visual' | 'photo_reference'>('visual');

  const tops = clothes.filter((c) => c.category === 'tops');
  const bottoms = clothes.filter((c) => c.category === 'bottoms');
  const fullbody = clothes.filter((c) => c.category === 'fullbody');
  const outerwear = clothes.filter((c) => c.category === 'outerwear');
  const shoes = clothes.filter((c) => c.category === 'shoes');
  const accessories = clothes.filter((c) => c.category === 'accessories');

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
      {/* Wardrobe Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Atelier Wardrobe Overview</h2>
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
              style={{
                backgroundColor: `rgba(${accentRgb}, 0.15)`,
                borderColor: `rgba(${accentRgb}, 0.35)`,
                color: accent,
              }}
            >
              Live Closet
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interactive closet representation curated from your digitized garments & saved looks
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex p-1 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setClosetMode('visual')}
              style={
                closetMode === 'visual'
                  ? { backgroundColor: accent, color: accentText }
                  : {}
              }
              className={`px-3 py-1.5 rounded-lg transition ${
                closetMode === 'visual'
                  ? 'font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Closet
            </button>
            <button
              onClick={() => setClosetMode('photo_reference')}
              style={
                closetMode === 'photo_reference'
                  ? { backgroundColor: accent, color: accentText }
                  : {}
              }
              className={`px-3 py-1.5 rounded-lg transition ${
                closetMode === 'photo_reference'
                  ? 'font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Design Reference
            </button>
          </div>
        </div>
      </div>

      {/* Main Counter Quick Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        <button
          onClick={onSelectOutfits}
          style={{
            backgroundColor: `rgba(${accentRgb}, 0.12)`,
            borderColor: `rgba(${accentRgb}, 0.35)`,
          }}
          className="p-3 rounded-2xl border text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-1" style={{ color: accent }}>
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Hub</span>
          </div>
          <div className="text-2xl font-black text-white transition">
            {outfits.length}
          </div>
          <div className="text-xs text-slate-300 font-medium">Saved Looks</div>
        </button>

        <button
          onClick={() => onSelectCategory('fullbody')}
          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-fuchsia-400 mb-1">
            <span className="text-base">👗</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Full Body</span>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-fuchsia-300 transition">
            {fullbody.length}
          </div>
          <div className="text-xs text-slate-400 font-medium truncate">Dresses & Suits</div>
        </button>

        <button
          onClick={() => onSelectCategory('tops')}
          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-sky-400 mb-1">
            <Shirt className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tops</span>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-sky-300 transition">
            {tops.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Shirts & Knits</div>
        </button>

        <button
          onClick={() => onSelectCategory('bottoms')}
          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Bottoms</span>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-indigo-300 transition">
            {bottoms.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Pants & Denim</div>
        </button>

        <button
          onClick={() => onSelectCategory('outerwear')}
          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-amber-500 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Outer</span>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-amber-300 transition">
            {outerwear.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Coats & Jackets</div>
        </button>

        <button
          onClick={() => onSelectCategory('shoes')}
          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-base">👞</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Footwear</span>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-emerald-300 transition">
            {shoes.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Shoes & Boots</div>
        </button>

        <button
          onClick={() => onSelectCategory('accessories')}
          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition group hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-base">🧣</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Accs</span>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-rose-300 transition">
            {accessories.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Belts & Bags</div>
        </button>
      </div>

      {/* Closet Display Area */}
      {closetMode === 'visual' ? (
        <div className="relative border-4 border-slate-800/80 rounded-3xl bg-[#141217] overflow-hidden shadow-2xl p-4 sm:p-6 min-h-[460px] flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 shadow" />
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-stone-800 shadow" />
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-stone-800 shadow" />

          {/* 1. TOP SHELF: Folded Sweaters & Woven Baskets */}
          <div className="relative border-b-4 border-stone-800/90 pb-4 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: accent }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                Top Shelf & Storage Bins (Accessories: {accessories.length})
              </span>
              <button
                onClick={() => onSelectCategory('accessories')}
                className="text-xs font-semibold hover:underline"
                style={{ color: accent }}
              >
                View Accessories →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Left: Folded Knitwear Stack */}
              <div className="flex items-end gap-3 pl-2">
                <div className="space-y-1.5">
                  <div className="h-4 w-32 sm:w-40 rounded-md bg-[#2b2528] border border-stone-600/50 shadow-sm" />
                  <div className="h-4 w-36 sm:w-44 rounded-md bg-[#dfd7cc] border border-stone-400/50 shadow-sm" />
                  <div className="h-4 w-40 sm:w-48 rounded-md bg-[#1e2a38] border border-stone-700/50 shadow-sm" />
                </div>
                <span className="text-[10px] text-stone-400 italic">Folded Cashmere & Knits</span>
              </div>

              {/* Right: Wicker Baskets labeled SOCKS & ACCESSORIES (referencing user closet image) */}
              <div className="flex items-center justify-end gap-3 pr-2">
                <div
                  onClick={() => onSelectCategory('accessories')}
                  className="cursor-pointer group flex flex-col items-center justify-center w-24 sm:w-28 h-16 rounded-lg bg-gradient-to-b from-[#8c6b45] to-[#6a4f31] border-2 border-[#543d25] shadow-lg relative hover:scale-105 transition"
                >
                  <div className="absolute top-2 w-12 h-3 rounded-full bg-[#3e2c1a]/50" />
                  <div className="px-2 py-0.5 bg-[#f5ede2] text-[#332211] text-[9px] font-black tracking-wider uppercase rounded shadow-sm border border-stone-300">
                    SOCKS
                  </div>
                </div>

                <div
                  onClick={() => onSelectCategory('accessories')}
                  className="cursor-pointer group flex flex-col items-center justify-center w-24 sm:w-28 h-16 rounded-lg bg-gradient-to-b from-[#8c6b45] to-[#6a4f31] border-2 border-[#543d25] shadow-lg relative hover:scale-105 transition"
                >
                  <div className="absolute top-2 w-12 h-3 rounded-full bg-[#3e2c1a]/50" />
                  <div className="px-2 py-0.5 bg-[#f5ede2] text-[#332211] text-[9px] font-black tracking-wider uppercase rounded shadow-sm border border-stone-300">
                    ACCESSORIES
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. UPPER HANGING ROD: Tops & Outerwear */}
          <div className="relative py-4 border-b-4 border-stone-800/90">
            <div className="absolute top-8 left-0 right-0 h-2 bg-gradient-to-b from-[#b88c5d] to-[#8a633c] rounded-full shadow" />

            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-bold text-sky-300/80 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Upper Rail • Full-Body, Tops & Outerwear ({fullbody.length + tops.length + outerwear.length})
              </span>
              <button
                onClick={() => onSelectCategory('tops')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                Explore Tops →
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-2 px-2 no-scrollbar">
              {[...fullbody, ...tops, ...outerwear].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCategory(item.category)}
                  className="flex-shrink-0 group relative cursor-pointer flex flex-col items-center"
                >
                  <div className="w-5 h-4 border-t-2 border-r-2 border-amber-600/90 rounded-tr-full -mb-1 transform -rotate-12" />
                  <div className="w-12 h-1 bg-amber-700/80 rounded-full mb-1" />

                  <div
                    className="w-16 sm:w-20 h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/70 group-hover:scale-105 transition shadow-md relative"
                    style={{ borderColor: undefined }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-medium text-white truncate w-full">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={onAddItem}
                className="flex-shrink-0 w-16 sm:w-20 h-24 sm:h-28 rounded-xl border-2 border-dashed border-slate-700 hover:scale-105 flex flex-col items-center justify-center transition"
                style={{ color: accent, borderColor: `rgba(${accentRgb}, 0.4)` }}
              >
                <span className="text-xl font-bold">+</span>
                <span className="text-[10px] font-semibold mt-1">Hang New</span>
              </button>
            </div>
          </div>

          {/* 3. LOWER HANGING ROD: Bottoms & Trousers */}
          <div className="relative py-4 border-b-4 border-stone-800/90">
            <div className="absolute top-8 left-0 right-0 h-2 bg-gradient-to-b from-[#b88c5d] to-[#8a633c] rounded-full shadow" />

            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-bold text-indigo-300/80 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Lower Rail • Pants, Trousers & Denim ({bottoms.length})
              </span>
              <button
                onClick={() => onSelectCategory('bottoms')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Explore Bottoms →
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-2 px-2 no-scrollbar">
              {bottoms.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCategory('bottoms')}
                  className="flex-shrink-0 group cursor-pointer flex flex-col items-center"
                >
                  <div className="w-5 h-4 border-t-2 border-r-2 border-amber-600/90 rounded-tr-full -mb-1 transform -rotate-12" />
                  <div className="w-12 h-1 bg-amber-700/80 rounded-full mb-1" />
                  <div className="w-16 sm:w-20 h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/70 group-hover:border-indigo-400 group-hover:scale-105 transition shadow-md relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                      <span className="text-[9px] font-medium text-white truncate w-full">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. CLOSET FLOOR: Hardwood Floor & Shoes */}
          <div className="relative pt-4 pb-2 bg-gradient-to-t from-[#261c16] via-[#1a130f] to-transparent rounded-b-2xl">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-[11px] font-bold text-emerald-300/80 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Shoe Deck & Floor Rug (Footwear: {shoes.length})
              </span>
              <button
                onClick={() => onSelectCategory('shoes')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Explore Shoes →
              </button>
            </div>

            <div className="flex items-center gap-4 px-3 overflow-x-auto pb-2">
              {shoes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectCategory('shoes')}
                  className="flex-shrink-0 group cursor-pointer flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400 transition"
                >
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-black/40">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      {item.brand}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {item.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: accent }} /> Attached Inspiration Closet Architecture
            </h3>
            <span className="text-xs text-slate-400">Layout Reference: /public/assets/aistudio/image_421e3c31.png</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl max-h-[380px] flex items-center justify-center bg-black">
              <img
                src="/assets/aistudio/image_421e3c31.png"
                alt="Reference Wardrobe Closet"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div
                className="p-3 rounded-xl border"
                style={{
                  backgroundColor: `rgba(${accentRgb}, 0.12)`,
                  borderColor: `rgba(${accentRgb}, 0.35)`,
                  color: accent,
                }}
              >
                <strong className="block mb-1 text-white">Architecture Mapping:</strong>
                Our digital wardrobe layout translates every element of your reference closet into functional interactive software:
              </div>
              <ul className="space-y-2 list-disc pl-4 text-slate-300">
                <li><strong className="text-white">Top Shelf:</strong> Folded knitwear stacks + labeled wicker baskets ("SOCKS", "ACCESSORIES") storing your accessories count.</li>
                <li><strong className="text-white">Upper Rod:</strong> Natural wooden hanger row hosting curated Tops & Outerwear with smooth horizontal scroll.</li>
                <li><strong className="text-white">Lower Rod:</strong> Dedicated second hanging tier holding your Bottoms, Trousers & Denim.</li>
                <li><strong className="text-white">Base Deck:</strong> Hardwood flooring with designated shoe deck for loafers and sneakers.</li>
              </ul>
              <button
                onClick={() => setClosetMode('visual')}
                style={{
                  backgroundColor: accent,
                  color: accentText,
                }}
                className="px-4 py-2 rounded-xl font-bold transition text-xs"
              >
                Return to Interactive Closet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
