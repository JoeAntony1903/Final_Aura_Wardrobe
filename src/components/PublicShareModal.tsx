import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Sparkles, MessageCircle, Instagram } from 'lucide-react';
import { Outfit, ClothingItem } from '../types';

interface PublicShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit | null;
  clothes: ClothingItem[];
  userName: string;
}

export const PublicShareModal: React.FC<PublicShareModalProps> = ({
  isOpen,
  onClose,
  outfit,
  clothes,
  userName,
}) => {
  if (!isOpen || !outfit) return null;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'webview'>('share');

  const shareUrl = `https://aurawardrobe.app/look/${outfit.id}`;
  const shareMessage = `Check out this styled look "${outfit.name}" curated on AuraWardrobe by ${userName}: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareMessage);
    alert('Look link & caption copied to clipboard! Paste it into your Instagram Story or DM.');
  };

  const clothesMap = new Map(clothes.map((c) => [c.id, c]));
  const items = [
    outfit.fullbodyId ? clothesMap.get(outfit.fullbodyId) : null,
    outfit.topId ? clothesMap.get(outfit.topId) : null,
    outfit.bottomId ? clothesMap.get(outfit.bottomId) : null,
    outfit.outerwearId ? clothesMap.get(outfit.outerwearId) : null,
    outfit.shoeId ? clothesMap.get(outfit.shoeId) : null,
    outfit.accessoryId ? clothesMap.get(outfit.accessoryId) : null,
  ].filter(Boolean) as ClothingItem[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Shareable Public Outfit Link</h2>
              <p className="text-xs text-slate-400">
                Friends can view full outfit details and shop pieces without creating an account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 pt-3">
          <button
            onClick={() => setActiveTab('share')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'share'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Share to Socials
          </button>
          <button
            onClick={() => setActiveTab('webview')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'webview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Friend's Public Web-View Preview
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'share' ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Public Universal Link</span>
                  <span className="text-[10px] text-emerald-400 font-mono">No Login Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-200 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Instant Social Share
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsApp}
                    className="p-3.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleInstagram}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 hover:from-purple-500/30 hover:via-pink-500/30 border border-pink-500/30 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Share on Instagram</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400">
                Shared outfits display high-resolution transparent cutouts, color notes, and retailer URLs so friends can purchase matching items instantly.
              </div>
            </div>
          ) : (
            /* Public Web-View Mockup (Simulating external unauthenticated viewer) */
            <div className="p-5 rounded-2xl bg-black border border-slate-800 space-y-4 max-h-[380px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-extrabold text-sm text-white">AuraWardrobe</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Guest Web-View
                </span>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-lg font-black text-white">{outfit.name}</h4>
                <p className="text-xs text-slate-400">Curated by {userName}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-black/40">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-400">{item.category}</div>
                      <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.brand} • {item.color}</div>
                    </div>
                    {item.retailerUrl && (
                      <a
                        href={item.retailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        Shop Piece <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
