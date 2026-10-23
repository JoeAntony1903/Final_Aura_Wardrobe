export type CategoryType = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories' | 'fullbody';

export interface LaundryStatus {
  isWashed: boolean;
  washStartedAt?: string; // ISO string
  washDurationDays?: number; // e.g. 3, 5, 7 days
}

export interface ClothingItem {
  id: string;
  name: string;
  category: CategoryType;
  color: string;
  brand: string;
  retailerUrl?: string;
  imageUrl: string;
  originalImageUrl?: string;
  manualMatchIds?: string[];
  laundryStatus?: LaundryStatus;
  isSample?: boolean;
  createdAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  topId?: string;
  bottomId?: string;
  fullbodyId?: string; // For dresses, jumpsuits, rompers, overalls
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
  time?: string;
  outfitId: string;
  eventIcon: 'star' | 'party' | 'work' | 'gala' | 'casual';
  location?: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isGuest: boolean;
  themeId: string;
}

export interface AppTheme {
  id: string;
  name: string;
  tagline: string;
  primary: string; // hex
  primaryLight: string;
  accent: string;
  accentHover?: string;
  accentText?: string;
  accentRgb?: string;
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  border: string;
  ring: string;
}
