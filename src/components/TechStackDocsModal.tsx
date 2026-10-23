import React, { useState } from 'react';
import { X, Copy, Check, Server, Database, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

interface TechStackDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechStackDocsModal: React.FC<TechStackDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'segmentation' | 'schema'>('stack');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const firestoreSchemaText = `// FIRESTORE DATABASE SCHEMA (Collections & Documents)

// 1. users/{userId}
{
  "uid": "usr_948194",
  "displayName": "Elena Vance",
  "email": "elena.vance@aurawardrobe.app",
  "avatarUrl": "https://...",
  "isGuest": false,
  "themeId": "midnight-chic",
  "preferences": {
    "defaultWashDurationDays": 3,
    "allowAiStylistLearning": true,
    "notifyLaundryReady": true
  },
  "stats": {
    "totalClothes": 24,
    "totalOutfits": 8,
    "totalWorn": 31
  },
  "createdAt": "2026-10-10T10:00:00Z",
  "updatedAt": "2026-10-23T03:55:00Z"
}

// 2. users/{userId}/clothes/{clothingId}
{
  "id": "item_top_401",
  "userId": "usr_948194",
  "name": "Classic Oxford Poplin Shirt",
  "category": "tops", // "tops" | "bottoms" | "outerwear" | "shoes" | "accessories"
  "color": "Sky Blue",
  "colorHex": "#87CEEB",
  "brand": "Ralph Lauren",
  "retailerUrl": "https://www.ralphlauren.com/...",
  "originalImageUrl": "gs://aura-wardrobe.appspot.com/users/usr_948194/raw/top_401.jpg",
  "segmentedImageUrl": "gs://aura-wardrobe.appspot.com/users/usr_948194/cutouts/top_401.png",
  "manualMatchIds": ["item_bot_102", "item_out_301"], // AI training links
  "laundryStatus": {
    "isWashed": false,
    "washStartedAt": null,
    "washDurationDays": 3
  },
  "wearCount": 7,
  "lastWornAt": "2026-10-18T09:00:00Z",
  "createdAt": "2026-10-10T10:00:00Z"
}

// 3. users/{userId}/outfits/{outfitId}
{
  "id": "outfit_801",
  "userId": "usr_948194",
  "name": "The Parisian Executive",
  "items": {
    "topId": "item_top_401",
    "bottomId": "item_bot_102",
    "outerwearId": "item_out_301",
    "shoeId": "item_shoe_201",
    "accessoryId": "item_acc_501"
  },
  "isFavorite": true,
  "tags": ["Work", "Sophisticated", "Autumn"],
  "notes": "Flawless for board meetings and dinners.",
  "combinationHash": "item_top_401|item_bot_102|item_out_301|item_shoe_201|item_acc_501",
  "shareId": "sh_9f81a7b",
  "wearCount": 3,
  "createdAt": "2026-10-18T09:00:00Z"
}

// 4. users/{userId}/events/{eventId}
{
  "id": "event_301",
  "userId": "usr_948194",
  "title": "Venture Keynote Presentation",
  "date": "2026-10-24", // YYYY-MM-DD
  "time": "10:00 AM",
  "outfitId": "outfit_801",
  "eventIcon": "star", // Reference star calendar icon
  "location": "Design Center Stage A",
  "notes": "Keynote delivery on AI in digital commerce.",
  "createdAt": "2026-10-20T12:00:00Z"
}

// 5. users/{userId}/ai_feedback/{feedbackId}
{
  "id": "fb_0921",
  "userId": "usr_948194",
  "combinationHash": "item_top_401|item_bot_102|none|item_shoe_201|none",
  "action": "declined", // "accepted" | "declined"
  "timestamp": "2026-10-23T01:14:00Z"
}

// 6. public_outfits/{shareId} (Unauthenticated Read for WhatsApp/Instagram web-view)
{
  "shareId": "sh_9f81a7b",
  "outfitName": "The Parisian Executive",
  "creatorName": "Elena Vance",
  "items": [
    { "category": "tops", "name": "Classic Oxford Poplin Shirt", "brand": "Ralph Lauren", "imageUrl": "...", "retailerUrl": "..." },
    { "category": "bottoms", "name": "High-Waist Pleated Trousers", "brand": "COS", "imageUrl": "...", "retailerUrl": "..." },
    { "category": "outerwear", "name": "Double-Breasted Wool Overcoat", "brand": "Acne Studios", "imageUrl": "...", "retailerUrl": "..." },
    { "category": "shoes", "name": "Horsebit Leather Loafers", "brand": "Gucci", "imageUrl": "...", "retailerUrl": "..." }
  ],
  "createdAt": "2026-10-18T09:00:00Z"
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AuraWardrobe Tech Stack & Firestore Architecture</h2>
              <p className="text-xs text-slate-400">Production Specification & Engineering Recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close architecture modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 gap-2 pt-3">
          <button
            onClick={() => setActiveTab('stack')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'stack'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Full-Stack Architecture
          </button>
          <button
            onClick={() => setActiveTab('segmentation')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'segmentation'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Image Segmentation Engine
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'schema'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" /> Firestore Schema
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {activeTab === 'stack' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <Smartphone className="w-4 h-4" /> Mobile Client (Frontend)
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li><strong className="text-white">React Native with Expo (SDK 52+)</strong>: Universal iOS & Android single-codebase velocity with instant OTA updates.</li>
                    <li><strong className="text-white">Expo Router (v4)</strong>: Modern file-based navigation with native tabs, stacks, and modal routing.</li>
                    <li><strong className="text-white">NativeWind (Tailwind CSS v4)</strong>: Consistent styling tokens across mobile and responsive web preview.</li>
                    <li><strong className="text-white">React Native Reanimated 3 & Gesture Handler</strong>: 60fps Tinder-style card swipes and smooth wardrobe carousel animations on the UI thread.</li>
                    <li><strong className="text-white">Zustand & MMKV / AsyncStorage</strong>: Ultra-fast local state hydration for Guest/Offline mode.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Database className="w-4 h-4" /> Backend & Cloud Infrastructure
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li><strong className="text-white">Firebase Authentication</strong>: Email/Password, Apple Sign-In, Google OAuth, and Anonymous Guest accounts.</li>
                    <li><strong className="text-white">Cloud Firestore</strong>: NoSQL document store with real-time offline caching, snapshot listeners, and subcollections.</li>
                    <li><strong className="text-white">Firebase Cloud Storage</strong>: High-resolution raw photography and transparent PNG garment cutouts with CDN caching.</li>
                    <li><strong className="text-white">Cloud Functions for Firebase (v2)</strong>: Serverless webhooks, laundry scheduler cron jobs, and public link resolution for WhatsApp/Instagram sharing.</li>
                    <li><strong className="text-white">Firebase App Check</strong>: Protects Firestore and Storage from unauthorized scrapers and abuse.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 text-amber-200 text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                  <ShieldCheck className="w-4 h-4" /> Offline Mode & Cloud Sync Strategy
                </div>
                In Guest Mode, all digitized clothing, outfits, and schedules are stored in encrypted local device storage (MMKV). When the user creates or signs into their Firebase account, a seamless reconciliation migration batch copies all local documents into their authenticated Firestore tree under <code className="text-amber-100 bg-amber-900/40 px-1 py-0.5 rounded">users/{'{userId}'}</code> without data loss.
              </div>
            </div>
          )}

          {activeTab === 'segmentation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h3 className="text-base font-bold text-white mb-2">Image Segmentation API Recommendation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For an AI-powered wardrobe app like <strong className="text-white">AuraWardrobe</strong>, apparel segmentation requires fine edge detection around fabrics, collars, hems, and shoe contours. We evaluate the top three production approaches:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-amber-500/40 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Recommended Primary Cloud API</div>
                  <h4 className="font-bold text-white text-base">Photoroom API</h4>
                  <p className="text-xs text-slate-300">
                    Industry gold-standard for fashion & e-commerce. Automatically removes background in under 250ms, adds natural soft shadows, corrects garment contrast, and handles transparent lace/mesh.
                  </p>
                  <div className="text-[11px] text-amber-300/80 font-mono">Cost: ~$0.02 / image • Latency: 200ms</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zero-Cost Offline Option</div>
                  <h4 className="font-bold text-white text-base">Apple Vision + ML Kit</h4>
                  <p className="text-xs text-slate-300">
                    iOS 17+ <code className="text-emerald-300">VNGenerateForegroundInstanceMaskRequest</code> and Android Google ML Kit Subject Segmentation run 100% on-device on the NPU with zero API cost.
                  </p>
                  <div className="text-[11px] text-emerald-300/80 font-mono">Cost: $0.00 • Latency: ~80ms on-device</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Enterprise Fallback</div>
                  <h4 className="font-bold text-white text-base">Remove.bg API / SAM 2</h4>
                  <p className="text-xs text-slate-300">
                    High-volume REST API with battle-tested edge detection or Meta SAM 2 running on a serverless GPU endpoint (e.g. RunPod / Modal).
                  </p>
                  <div className="text-[11px] text-sky-300/80 font-mono">Cost: ~$0.05 / image • High fidelity</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-slate-400 font-sans font-semibold mb-2">Example Cloud Function Calling Photoroom API:</div>
                <pre className="overflow-x-auto text-[11px] text-amber-200">
{`const axios = require('axios');
const FormData = require('form-data');

exports.removeApparelBackground = async (imageBuffer) => {
  const form = new FormData();
  form.append('image_file', imageBuffer, 'apparel.jpg');
  form.append('format', 'png');
  form.append('crop', 'true'); // Auto-crop tight to clothing boundaries

  const response = await axios.post('https://image-api.photoroom.com/v2/edit', form, {
    headers: {
      ...form.getHeaders(),
      'x-api-key': process.env.PHOTOROOM_API_KEY,
    },
    responseType: 'arraybuffer',
  });
  return response.data; // Transparent PNG buffer
};`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Full schema specification with collections, subcollections, relations, and indexes:
                </p>
                <button
                  onClick={() => copyToClipboard(firestoreSchemaText, 'schema')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'schema' ? 'Copied' : 'Copy Schema'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-100 overflow-x-auto max-h-[400px]">
                {firestoreSchemaText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
