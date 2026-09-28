export type MarketplacePlatform =
  | 'Amazon'
  | 'Flipkart'
  | 'Meesho'
  | 'Myntra'
  | 'Ajio'
  | 'Shopsy'
  | 'Nykaa'
  | 'Zara'
  | 'AliExpress'
  | 'Other';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  platform: MarketplacePlatform | string;
  affiliateLink: string;
  imageBase64: string; // High-quality base64 string
  additionalImages?: string[]; // Optional extra angles (base64)
  category: string;
  featured?: boolean;
  tags?: string[];
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
  creatorEmail?: string;
}

export interface PlatformConfig {
  name: MarketplacePlatform;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  iconName: string;
}

export const PLATFORMS: Record<string, { label: string; bg: string; text: string; border: string; badge: string }> = {
  Amazon: {
    label: 'Amazon',
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
    badge: 'bg-amber-500 text-white'
  },
  Flipkart: {
    label: 'Flipkart',
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
    badge: 'bg-blue-600 text-white'
  },
  Meesho: {
    label: 'Meesho',
    bg: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/20',
    badge: 'bg-pink-600 text-white'
  },
  Myntra: {
    label: 'Myntra',
    bg: 'bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/20',
    badge: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
  },
  Ajio: {
    label: 'Ajio',
    bg: 'bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/20',
    badge: 'bg-teal-700 text-white'
  },
  Shopsy: {
    label: 'Shopsy',
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
    badge: 'bg-purple-600 text-white'
  },
  Nykaa: {
    label: 'Nykaa',
    bg: 'bg-fuchsia-500/10',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    border: 'border-fuchsia-500/20',
    badge: 'bg-fuchsia-600 text-white'
  },
  Zara: {
    label: 'Zara',
    bg: 'bg-zinc-800/10',
    text: 'text-zinc-800 dark:text-zinc-200',
    border: 'border-zinc-400/20',
    badge: 'bg-zinc-900 text-white'
  },
  AliExpress: {
    label: 'AliExpress',
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
    badge: 'bg-orange-600 text-white'
  },
  Other: {
    label: 'Direct Marketplace',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-600 text-white'
  }
};

export const DEFAULT_CATEGORIES = [
  'All',
  'Fashion & Apparel',
  'Electronics & Tech',
  'Home & Decor',
  'Beauty & Skincare',
  'Kitchen & Dining',
  'Fitness & Sports',
  'Gadgets & Accessories',
  'Footwear'
];
