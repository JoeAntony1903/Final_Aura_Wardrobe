import { ClothingItem, Outfit, EventSchedule, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  isGuest: false,
  themeId: 'midnight-chic',
};

// 3 starter sample clothes as requested by user
// Will automatically be purged as soon as the count of clothing or outfit exceeds 3
export const INITIAL_SAMPLE_CLOTHES: ClothingItem[] = [
  {
    id: 'sample-top-1',
    name: 'Classic Oxford Poplin Shirt',
    category: 'tops',
    color: 'Sky Blue',
    brand: 'Ralph Lauren',
    retailerUrl: 'https://www.ralphlauren.com/men-clothing-button-down-shirts/classic-fit-oxford-shirt',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80',
    manualMatchIds: ['sample-bot-1', 'sample-shoe-1'],
    isSample: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-bot-1',
    name: 'High-Waist Pleated Trousers',
    category: 'bottoms',
    color: 'Navy Blue',
    brand: 'COS',
    retailerUrl: 'https://www.cos.com/en_usd/women/womenswear/trousers/wide-leg-pleated.html',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80',
    manualMatchIds: ['sample-top-1', 'sample-shoe-1'],
    isSample: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-shoe-1',
    name: 'Horsebit Leather Loafers',
    category: 'shoes',
    color: 'Espresso Brown',
    brand: 'Gucci',
    retailerUrl: 'https://www.gucci.com/us/en/pr/women/shoes/loafers/jordaan-leather-loafer',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80',
    manualMatchIds: ['sample-top-1', 'sample-bot-1'],
    isSample: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SAMPLE_OUTFITS: Outfit[] = [
  {
    id: 'sample-outfit-1',
    name: 'Atelier Essential Starter',
    topId: 'sample-top-1',
    bottomId: 'sample-bot-1',
    shoeId: 'sample-shoe-1',
    isFavorite: true,
    tags: ['Sample', 'Starter Look'],
    notes: 'Sample starter look. Will automatically vanish once you digitize real clothes or save outfits.',
    isSample: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_EVENTS: EventSchedule[] = [];
