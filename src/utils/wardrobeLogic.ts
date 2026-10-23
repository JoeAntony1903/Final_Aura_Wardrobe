export interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories' | 'fullbody';
  color: string;
  brand: string;
  retailerUrl?: string;
  imageUrl: string;
  manualMatchIds?: string[];
  laundryStatus?: {
    isWashed: boolean;
    washStartedAt?: string; // ISO date
    washDurationDays?: number;
  };
  createdAt: string;
  isSample?: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  topId?: string;
  bottomId?: string;
  fullbodyId?: string;
  outerwearId?: string;
  shoeId?: string;
  accessoryId?: string;
  isFavorite: boolean;
  createdAt: string;
  notes?: string;
  tags?: string[];
  isSample?: boolean;
}

export interface EventSchedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  outfitId: string;
  eventIcon: 'star' | 'party' | 'work' | 'gala' | 'casual';
  notes?: string;
}

export function isItemInLaundry(item: ClothingItem, currentTimeMs = Date.now()): boolean {
  if (!item.laundryStatus?.isWashed) return false;
  if (!item.laundryStatus.washStartedAt) return true;

  const durationDays = item.laundryStatus.washDurationDays || 3;
  const startedMs = new Date(item.laundryStatus.washStartedAt).getTime();
  const finishMs = startedMs + durationDays * 24 * 60 * 60 * 1000;

  return currentTimeMs < finishMs;
}

export function getRemainingLaundryDays(item: ClothingItem, currentTimeMs = Date.now()): number {
  if (!isItemInLaundry(item, currentTimeMs) || !item.laundryStatus?.washStartedAt) return 0;
  const durationDays = item.laundryStatus.washDurationDays || 3;
  const startedMs = new Date(item.laundryStatus.washStartedAt).getTime();
  const finishMs = startedMs + durationDays * 24 * 60 * 60 * 1000;
  const diffDays = Math.ceil((finishMs - currentTimeMs) / (24 * 60 * 60 * 1000));
  return Math.max(1, diffDays);
}

export function calculateWardrobeStats(clothes: ClothingItem[], outfits: Outfit[]) {
  const stats = {
    totalOutfits: outfits.length,
    tops: 0,
    bottoms: 0,
    outerwear: 0,
    shoes: 0,
    accessories: 0,
    fullbody: 0,
    inLaundry: 0,
  };

  const now = Date.now();
  for (const item of clothes) {
    if (stats[item.category] !== undefined) {
      stats[item.category]++;
    }
    if (isItemInLaundry(item, now)) {
      stats.inLaundry++;
    }
  }

  return stats;
}

export function filterClothes(
  clothes: ClothingItem[],
  options: {
    search?: string;
    category?: string;
    color?: string;
    brand?: string;
    retailer?: string;
    hideLaundry?: boolean;
  }
): ClothingItem[] {
  const now = Date.now();
  return clothes.filter((item) => {
    if (options.category && options.category !== 'all' && item.category !== options.category) {
      return false;
    }
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchColor = item.color.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchColor) return false;
    }
    if (options.color && options.color !== 'all' && item.color.toLowerCase() !== options.color.toLowerCase()) {
      return false;
    }
    if (options.brand && options.brand !== 'all' && item.brand.toLowerCase() !== options.brand.toLowerCase()) {
      return false;
    }
    if (options.retailer && options.retailer !== 'all') {
      if (!item.retailerUrl || !item.retailerUrl.toLowerCase().includes(options.retailer.toLowerCase())) {
        return false;
      }
    }
    if (options.hideLaundry && isItemInLaundry(item, now)) {
      return false;
    }
    return true;
  });
}

export function getRandomSavedOutfit(outfits: Outfit[], excludeId?: string): Outfit | null {
  if (!outfits || outfits.length === 0) return null;
  if (outfits.length === 1) return outfits[0];

  const pool = excludeId ? outfits.filter((o) => o.id !== excludeId) : outfits;
  if (pool.length === 0) return outfits[0];

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function generateOutfitHash(outfit: {
  topId?: string;
  bottomId?: string;
  fullbodyId?: string;
  outerwearId?: string;
  shoeId?: string;
  accessoryId?: string;
}): string {
  return [
    outfit.fullbodyId || 'none',
    outfit.topId || 'none',
    outfit.bottomId || 'none',
    outfit.outerwearId || 'none',
    outfit.shoeId || 'none',
    outfit.accessoryId || 'none',
  ].join('|');
}

export function generateAiOutfitSuggestion(
  clothes: ClothingItem[],
  declinedHashes: Set<string> = new Set()
): {
  top?: ClothingItem;
  bottom?: ClothingItem;
  fullbody?: ClothingItem;
  outerwear?: ClothingItem;
  shoes?: ClothingItem;
  accessories?: ClothingItem;
  matchScore: number;
  explanation: string;
} | null {
  const availableFullbody = clothes.filter((c) => c.category === 'fullbody' && !isItemInLaundry(c));
  const availableTops = clothes.filter((c) => c.category === 'tops' && !isItemInLaundry(c));
  const availableBottoms = clothes.filter((c) => c.category === 'bottoms' && !isItemInLaundry(c));
  const availableOuterwear = clothes.filter((c) => c.category === 'outerwear' && !isItemInLaundry(c));
  const availableShoes = clothes.filter((c) => c.category === 'shoes' && !isItemInLaundry(c));
  const availableAccessories = clothes.filter((c) => c.category === 'accessories' && !isItemInLaundry(c));

  if (availableFullbody.length === 0 && availableTops.length === 0 && availableBottoms.length === 0) {
    return null;
  }

  // Find candidate combinations
  const candidates: Array<{
    top?: ClothingItem;
    bottom?: ClothingItem;
    fullbody?: ClothingItem;
    outerwear?: ClothingItem;
    shoes?: ClothingItem;
    accessories?: ClothingItem;
    score: number;
    explanation: string;
  }> = [];

  // 1. Fullbody Candidate Looks (Dress, Jumpsuit + Footwear + Accessories + optional Outerwear)
  for (const fb of availableFullbody) {
    const hash = generateOutfitHash({ fullbodyId: fb.id });
    if (declinedHashes.has(hash)) continue;

    let score = 78; // baseline
    const reasons: string[] = ['Effortless one-piece full-body silhouette'];

    const shoe = availableShoes.find((s) => s.manualMatchIds?.includes(fb.id) || fb.manualMatchIds?.includes(s.id)) || availableShoes[0];
    if (shoe && (shoe.manualMatchIds?.includes(fb.id) || fb.manualMatchIds?.includes(shoe.id))) {
      score += 15;
      reasons.push('Paired with matched footwear');
    }

    const accessory = availableAccessories.find((a) => a.manualMatchIds?.includes(fb.id) || fb.manualMatchIds?.includes(a.id)) || availableAccessories[0];
    if (accessory) {
      score += 5;
    }

    const outerwear = availableOuterwear[0];

    candidates.push({
      fullbody: fb,
      shoes: shoe,
      accessories: accessory,
      outerwear,
      score: Math.min(99, score),
      explanation: reasons.join(' • '),
    });
  }

  // 2. Two-Piece Candidate Looks (Top + Bottom + Footwear + Accessories + optional Outerwear)
  for (const top of availableTops) {
    for (const bottom of availableBottoms) {
      const hash = generateOutfitHash({ topId: top.id, bottomId: bottom.id });
      if (declinedHashes.has(hash)) continue;

      let score = 70; // baseline
      const reasons: string[] = [];

      // Check manual links
      if (top.manualMatchIds?.includes(bottom.id) || bottom.manualMatchIds?.includes(top.id)) {
        score += 25;
        reasons.push('Prior user manual match synergy');
      }

      // Check color harmonies
      const topColor = top.color.toLowerCase();
      const bottomColor = bottom.color.toLowerCase();
      if (
        (topColor.includes('white') || topColor.includes('black') || topColor.includes('grey') || topColor.includes('navy')) ||
        (bottomColor.includes('white') || bottomColor.includes('black') || bottomColor.includes('grey') || bottomColor.includes('navy'))
      ) {
        score += 5;
        reasons.push('Neutral versatile palette');
      }

      // Pick matching shoes if available
      const shoe = availableShoes.find((s) => s.manualMatchIds?.includes(bottom.id) || s.manualMatchIds?.includes(top.id)) || availableShoes[0];
      const outerwear = availableOuterwear[0];
      const accessory = availableAccessories[0];

      candidates.push({
        top,
        bottom,
        shoes: shoe,
        outerwear,
        accessories: accessory,
        score: Math.min(99, score),
        explanation: reasons.length > 0 ? reasons.join(' • ') : 'Balanced silhouette & style coordination',
      });
    }
  }

  if (candidates.length === 0) {
    if (availableFullbody.length > 0) {
      const fb = availableFullbody[0];
      return {
        fullbody: fb,
        shoes: availableShoes[0],
        outerwear: availableOuterwear[0],
        accessories: availableAccessories[0],
        matchScore: 85,
        explanation: 'Full-body one-piece ensemble with footwear pairing',
      };
    }
    const top = availableTops[0];
    const bottom = availableBottoms[0];
    if (!top && !bottom) return null;
    return {
      top,
      bottom,
      shoes: availableShoes[0],
      outerwear: availableOuterwear[0],
      accessories: availableAccessories[0],
      matchScore: 82,
      explanation: 'Curated staple combination',
    };
  }

  // Sort by highest score with slight jitter for variety
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return {
    ...best,
    matchScore: best.score,
  };
}

/**
 * Checks if sample items should be removed:
 * PRD: "do keep some sample clothes but remove them as soon as the count of clothing or outfit go above 3"
 */
export function checkAndPurgeSamples(
  clothes: ClothingItem[],
  outfits: Outfit[]
): {
  clothes: ClothingItem[];
  outfits: Outfit[];
  purged: boolean;
} {
  const hasSampleClothes = clothes.some((c) => c.isSample);
  const hasSampleOutfits = outfits.some((o) => o.isSample);

  if (!hasSampleClothes && !hasSampleOutfits) {
    return { clothes, outfits, purged: false };
  }

  // Count condition: "as soon as the count of clothing or outfit go above 3"
  if (clothes.length > 3 || outfits.length > 3) {
    const userClothes = clothes.filter((c) => !c.isSample);
    const userOutfits = outfits.filter((o) => !o.isSample);
    return {
      clothes: userClothes,
      outfits: userOutfits,
      purged: true,
    };
  }

  return { clothes, outfits, purged: false };
}

