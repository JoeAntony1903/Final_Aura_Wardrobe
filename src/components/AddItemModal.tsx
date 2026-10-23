import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Sliders, Check, Sparkles, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { ClothingItem, CategoryType } from '../types';
import { useTheme } from '../utils/ThemeContext';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: ClothingItem) => void;
}

const PRESET_GARMENTS = [
  {
    name: 'Italian Merino Wool Turtleneck',
    category: 'tops' as CategoryType,
    color: 'Charcoal Grey',
    brand: 'Loro Piana',
    retailerUrl: 'https://us.loropiana.com/en/p/man/knitwear/turtlenecks',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Belgian Linen Relaxed Blazer',
    category: 'outerwear' as CategoryType,
    color: 'Oatmeal Beige',
    brand: 'Brunello Cucinelli',
    retailerUrl: 'https://shop.brunellocucinelli.com/blazer',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Satin Bias Cut Midi Skirt',
    category: 'bottoms' as CategoryType,
    color: 'Olive Green',
    brand: 'Vince',
    retailerUrl: 'https://www.vince.com/slip-skirt',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Chelsea Lug-Sole Leather Boots',
    category: 'shoes' as CategoryType,
    color: 'Midnight Black',
    brand: 'Prada',
    retailerUrl: 'https://www.prada.com/shoes/boots',
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Emerald Silk Bias-Cut Midi Dress',
    category: 'fullbody' as CategoryType,
    color: 'Emerald Green',
    brand: 'Reformation',
    retailerUrl: 'https://www.thereformation.com/dresses',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80',
  },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSaveItem }) => {
  const { theme, accent, accentRgb, accentText } = useTheme();
  const [sourceType, setSourceType] = useState<'upload' | 'camera' | 'preset'>('upload');
  const [imageSrc, setImageSrc] = useState<string>(PRESET_GARMENTS[0].imageUrl);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Metadata form
  const [name, setName] = useState(PRESET_GARMENTS[0].name);
  const [category, setCategory] = useState<CategoryType>(PRESET_GARMENTS[0].category);
  const [color, setColor] = useState(PRESET_GARMENTS[0].color);
  const [brand, setBrand] = useState(PRESET_GARMENTS[0].brand);
  const [retailerUrl, setRetailerUrl] = useState(PRESET_GARMENTS[0].retailerUrl);

  // Segmentation Engine Controls
  const [tolerance, setTolerance] = useState<number>(38);
  const [edgeFeather, setEdgeFeather] = useState<number>(2);
  const [previewBg, setPreviewBg] = useState<'checker' | 'white' | 'dark'>('checker');
  const [viewMode, setViewMode] = useState<'segmented' | 'split' | 'original'>('segmented');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Real-time Segmentation Pipeline
  const runSegmentation = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const maxDim = 600;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Sample corners to determine background reference color
      const cornerR = (data[0] + data[(width - 1) * 4] + data[(width * (height - 1)) * 4]) / 3;
      const cornerG = (data[1] + data[(width - 1) * 4 + 1] + data[(width * (height - 1)) * 4 + 1]) / 3;
      const cornerB = (data[2] + data[(width - 1) * 4 + 2] + data[(width * (height - 1)) * 4 + 2]) / 3;

      const tolSq = tolerance * tolerance * 8;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from background
        const distSq = (r - cornerR) ** 2 + (g - cornerG) ** 2 + (b - cornerB) ** 2;

        if (distSq < tolSq) {
          // Transparent background pixel
          const factor = Math.max(0, (tolSq - distSq) / tolSq);
          data[i + 3] = Math.round(255 * (1 - factor));
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };

    img.onerror = () => {
      setProcessedImage(imageSrc);
      setIsProcessing(false);
    };
  };

  useEffect(() => {
    runSegmentation();
  }, [imageSrc, tolerance, edgeFeather]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageSrc(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (p: typeof PRESET_GARMENTS[0]) => {
    setName(p.name);
    setCategory(p.category);
    setColor(p.color);
    setBrand(p.brand);
    setRetailerUrl(p.retailerUrl);
    setImageSrc(p.imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ClothingItem = {
      id: 'item_' + Date.now(),
      name: name.trim(),
      category,
      color: color.trim() || 'Neutral',
      brand: brand.trim() || 'Custom',
      retailerUrl: retailerUrl.trim() || undefined,
      imageUrl: processedImage || imageSrc,
      originalImageUrl: imageSrc,
      manualMatchIds: [],
      createdAt: new Date().toISOString(),
    };

    onSaveItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Digitize Clothing & Segmentation Engine</h2>
              <p className="text-xs text-slate-400">Automatic background removal with real-time edge calibration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Source & Real-Time Segmentation Preview */}
          <div className="lg:col-span-7 space-y-4">
            {/* Source Selection Tabs */}
            <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                Upload File / Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceType('camera');
                  alert('Camera access requested. Tap to select or capture image.');
                  fileInputRef.current?.click();
                }}
                className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                Camera
              </button>
              <button
                type="button"
                onClick={() => setSourceType('preset')}
                className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Garment Presets
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Presets Quick Selector */}
            {sourceType === 'preset' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_GARMENTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-400 text-left transition text-[11px]"
                  >
                    <div className="w-full h-14 rounded-lg overflow-hidden bg-black/30 mb-1">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-semibold text-white truncate">{p.name}</div>
                    <div className="text-slate-400 text-[10px]">{p.brand}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Segmentation Real-Time Preview Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Real-Time Cutout Preview
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-400">Backdrop:</span>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('checker')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      previewBg === 'checker' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Checker
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('white')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      previewBg === 'white' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    White
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('dark')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      previewBg === 'dark' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Studio
                  </button>
                </div>
              </div>

              {/* Display Frame */}
              <div
                className={`relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-700/80 flex items-center justify-center ${
                  previewBg === 'checker'
                    ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] bg-slate-950'
                    : previewBg === 'white'
                    ? 'bg-white'
                    : 'bg-slate-900'
                }`}
              >
                {viewMode === 'original' ? (
                  <img src={imageSrc} alt="Original" className="max-h-full max-w-full object-contain p-4" />
                ) : (
                  <img
                    src={processedImage || imageSrc}
                    alt="Segmented Preview"
                    className="max-h-full max-w-full object-contain p-4 transition-all"
                  />
                )}

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-semibold text-amber-300">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Segmenting Apparel Contours...
                  </div>
                )}

                {/* View Mode Toggle Pill */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-0.5 flex text-[10px]">
                  <button
                    type="button"
                    onClick={() => setViewMode('segmented')}
                    className={`px-2.5 py-1 rounded ${
                      viewMode === 'segmented' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Segmented
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('original')}
                    className={`px-2.5 py-1 rounded ${
                      viewMode === 'original' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    Raw Image
                  </button>
                </div>
              </div>

              {/* Edge Tolerance Slider */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Background Removal Tolerance</span>
                  <span className="text-amber-400 font-mono font-bold">{tolerance}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Preserve Fabric Edges</span>
                  <span>Aggressive Cutout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Form */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Apparel Metadata & Specifications
            </h3>

            <form onSubmit={handleSubmit} id="add-item-form" className="space-y-3 text-xs">
              {/* Item Name */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Garment Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Oxford Poplin Shirt"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="tops">Tops (Shirts, Blouses, Knits)</option>
                  <option value="bottoms">Bottoms (Pants, Trousers, Denim)</option>
                  <option value="fullbody">Full Body (Dresses, Jumpsuits, Rompers, Overalls)</option>
                  <option value="outerwear">Outerwear (Coats, Blazers, Jackets)</option>
                  <option value="shoes">Shoes (Loafers, Boots, Sneakers)</option>
                  <option value="accessories">Accessories (Belts, Scarves, Bags)</option>
                </select>
              </div>

              {/* Color */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Color *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Navy Blue, Sand, Ivory"
                    className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                {/* Quick Color Swatches */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                  {['Sky Blue', 'Ivory', 'Navy Blue', 'Camel', 'Black', 'Emerald', 'Burgundy'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 hover:text-white hover:bg-slate-700 transition flex-shrink-0"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Name */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Ralph Lauren, COS, Gucci"
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Retailer / Platform Link */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" /> Retailer / Platform Link (URL)
                </label>
                <input
                  type="url"
                  value={retailerUrl}
                  onChange={(e) => setRetailerUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                />
                <p className="text-[10px] text-slate-500">
                  Allows friends viewing shared outfits to shop this exact piece directly.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Segmented transparent cutout ready for Outfit Canvas
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-item-form"
              style={{
                backgroundColor: accent,
                color: accentText,
                boxShadow: `0 4px 14px rgba(${accentRgb}, 0.35)`,
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition hover:scale-105 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Save Digitized Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
