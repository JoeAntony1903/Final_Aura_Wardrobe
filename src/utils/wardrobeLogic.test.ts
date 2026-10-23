import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isItemInLaundry,
  getRemainingLaundryDays,
  calculateWardrobeStats,
  filterClothes,
  getRandomSavedOutfit,
  generateOutfitHash,
  generateAiOutfitSuggestion,
  checkAndPurgeSamples,
  ClothingItem,
  Outfit,
} from './wardrobeLogic';

const sampleClothes: ClothingItem[] = [
  {
    id: 'top-1',
    name: 'Oxford Button-Down',
    category: 'tops',
    color: 'Light Blue',
    brand: 'Ralph Lauren',
    imageUrl: '/mock/top1.png',
    manualMatchIds: ['bot-1'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bot-1',
    name: 'Slim Chinos',
    category: 'bottoms',
    color: 'Navy',
    brand: 'J.Crew',
    imageUrl: '/mock/bot1.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'out-1',
    name: 'Wool Overcoat',
    category: 'outerwear',
    color: 'Camel',
    brand: 'Acne Studios',
    imageUrl: '/mock/out1.png',
    laundryStatus: {
      isWashed: true,
      washStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      washDurationDays: 4, // 3 days remaining
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shoe-1',
    name: 'Leather Penny Loafers',
    category: 'shoes',
    color: 'Espresso',
    brand: 'Gucci',
    imageUrl: '/mock/shoe1.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'acc-1',
    name: 'Silk Pocket Square',
    category: 'accessories',
    color: 'Burgundy',
    brand: 'Hermes',
    imageUrl: '/mock/acc1.png',
    createdAt: new Date().toISOString(),
  },
];

const sampleOutfits: Outfit[] = [
  {
    id: 'outfit-1',
    name: 'Business Casual Crisp',
    topId: 'top-1',
    bottomId: 'bot-1',
    shoeId: 'shoe-1',
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'outfit-2',
    name: 'Weekend Minimalist',
    topId: 'top-1',
    bottomId: 'bot-1',
    isFavorite: false,
    createdAt: new Date().toISOString(),
  },
];

test('laundry detection calculates remaining days correctly', () => {
  const coat = sampleClothes.find((c) => c.id === 'out-1')!;
  assert.equal(isItemInLaundry(coat), true);
  assert.equal(getRemainingLaundryDays(coat), 3);

  const cleanTop = sampleClothes.find((c) => c.id === 'top-1')!;
  assert.equal(isItemInLaundry(cleanTop), false);
  assert.equal(getRemainingLaundryDays(cleanTop), 0);
});

test('calculateWardrobeStats tallies each category accurately', () => {
  const stats = calculateWardrobeStats(sampleClothes, sampleOutfits);
  assert.equal(stats.totalOutfits, 2);
  assert.equal(stats.tops, 1);
  assert.equal(stats.bottoms, 1);
  assert.equal(stats.outerwear, 1);
  assert.equal(stats.shoes, 1);
  assert.equal(stats.accessories, 1);
  assert.equal(stats.inLaundry, 1);
});

test('filterClothes filters by query, category, and laundry state', () => {
  const topsOnly = filterClothes(sampleClothes, { category: 'tops' });
  assert.equal(topsOnly.length, 1);
  assert.equal(topsOnly[0].id, 'top-1');

  const brandSearch = filterClothes(sampleClothes, { search: 'crew' });
  assert.equal(brandSearch.length, 1);
  assert.equal(brandSearch[0].id, 'bot-1');

  const noLaundry = filterClothes(sampleClothes, { hideLaundry: true });
  assert.equal(noLaundry.some((c) => c.id === 'out-1'), false);
});

test('getRandomSavedOutfit returns strictly from saved outfits', () => {
  const randomOutfit = getRandomSavedOutfit(sampleOutfits);
  assert.ok(randomOutfit !== null);
  assert.ok(['outfit-1', 'outfit-2'].includes(randomOutfit.id));

  const excluded = getRandomSavedOutfit(sampleOutfits, 'outfit-1');
  assert.equal(excluded?.id, 'outfit-2');
});

test('generateAiOutfitSuggestion prioritizes learned manual matches and respects declined combinations', () => {
  const suggestion = generateAiOutfitSuggestion(sampleClothes);
  assert.ok(suggestion !== null);
  assert.equal(suggestion.top?.id, 'top-1');
  assert.equal(suggestion.bottom?.id, 'bot-1');
  assert.ok(suggestion.matchScore >= 90, 'Score should be boosted due to manualMatchIds');

  const declined = new Set([generateOutfitHash({ topId: 'top-1', bottomId: 'bot-1' })]);
  const fallback = generateAiOutfitSuggestion(sampleClothes, declined);
  assert.ok(fallback !== null);
});

test('checkAndPurgeSamples preserves sample items when count <= 3 and purges when count > 3', () => {
  const initialClothes: ClothingItem[] = [
    { id: 's1', name: 'Sample 1', category: 'tops', color: 'White', brand: 'Demo', imageUrl: '', isSample: true, createdAt: '' },
    { id: 's2', name: 'Sample 2', category: 'bottoms', color: 'Blue', brand: 'Demo', imageUrl: '', isSample: true, createdAt: '' },
    { id: 's3', name: 'Sample 3', category: 'shoes', color: 'Black', brand: 'Demo', imageUrl: '', isSample: true, createdAt: '' },
  ];
  const initialOutfits: Outfit[] = [];

  // Count is 3 -> Should keep samples
  const result1 = checkAndPurgeSamples(initialClothes, initialOutfits);
  assert.equal(result1.purged, false);
  assert.equal(result1.clothes.length, 3);

  // User adds 1 new item -> Count becomes 4 (> 3) -> Purges samples!
  const withUserItem: ClothingItem[] = [
    ...initialClothes,
    { id: 'u1', name: 'My Real Jacket', category: 'outerwear', color: 'Black', brand: 'Mine', imageUrl: '', createdAt: '' },
  ];
  const result2 = checkAndPurgeSamples(withUserItem, initialOutfits);
  assert.equal(result2.purged, true);
  assert.equal(result2.clothes.length, 1);
  assert.equal(result2.clothes[0].id, 'u1');
});

test('calculateWardrobeStats tallies fullbody garments accurately', () => {
  const clothesWithFullbody: ClothingItem[] = [
    ...sampleClothes,
    {
      id: 'dress-1',
      name: 'Emerald Silk Evening Slip Dress',
      category: 'fullbody',
      color: 'Emerald Green',
      brand: 'Reformation',
      imageUrl: '/mock/dress.png',
      createdAt: new Date().toISOString(),
    },
  ];

  const stats = calculateWardrobeStats(clothesWithFullbody, sampleOutfits);
  assert.equal(stats.fullbody, 1);
  assert.equal(stats.tops, 1);
  assert.equal(stats.bottoms, 1);
});

test('generateAiOutfitSuggestion creates fullbody look without requiring top and bottom', () => {
  const onlyDressAndShoes: ClothingItem[] = [
    {
      id: 'dress-1',
      name: 'Black Cocktail Dress',
      category: 'fullbody',
      color: 'Black',
      brand: 'Prada',
      imageUrl: '/mock/dress.png',
      manualMatchIds: ['shoe-1'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'shoe-1',
      name: 'Strappy Stiletto Heels',
      category: 'shoes',
      color: 'Black',
      brand: 'Jimmy Choo',
      imageUrl: '/mock/heels.png',
      manualMatchIds: ['dress-1'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'acc-1',
      name: 'Diamond Drop Earrings',
      category: 'accessories',
      color: 'Silver',
      brand: 'Tiffany',
      imageUrl: '/mock/earrings.png',
      createdAt: new Date().toISOString(),
    },
  ];

  const suggestion = generateAiOutfitSuggestion(onlyDressAndShoes);
  assert.ok(suggestion !== null);
  assert.equal(suggestion.fullbody?.id, 'dress-1');
  assert.equal(suggestion.top, undefined, 'Fullbody outfit does NOT need top');
  assert.equal(suggestion.bottom, undefined, 'Fullbody outfit does NOT need bottom');
  assert.equal(suggestion.shoes?.id, 'shoe-1');
  assert.ok(suggestion.matchScore >= 80);
});
