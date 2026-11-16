export type ShoeCategory = 'all' | 'lifestyle' | 'running' | 'boots' | 'formal' | 'trail';
export type GenderCategory = 'all' | 'unisex' | 'men' | 'women';
export type ConditionGrade = '10/10 Deadstock' | '9.5/10 Pristine' | '9.0/10 Excellent' | '8.5/10 Archival';

export interface ShoeColor {
  name: string;
  hex: string;
  imageIndex: number;
}

export interface ShoeReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  fitRating: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface ShoeSpecifications {
  upper: string;
  sole: string;
  lining: string;
  insole: string;
  origin: string;
  weight: string;
  drop?: string;
  closure: string;
  sustainability: string;
}

export interface Shoe {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: 'lifestyle' | 'running' | 'boots' | 'formal' | 'trail';
  gender: 'unisex' | 'men' | 'women';
  condition: ConditionGrade;
  price: number;
  originalPrice: number; // Market Value / Retail benchmark
  rating: number;
  reviewCount: number;
  badge?: 'DEADSTOCK' | 'PREMIUM EDITION' | 'STEAL OF THE WEEK' | 'TRENDING HEAT' | 'ARCHIVAL FIND';
  colors: ShoeColor[];
  sizes: number[]; // EU sizes
  images: string[];
  description: string;
  story: string;
  highlights: string[];
  specs: ShoeSpecifications;
  fitAdvice: string;
  careInstructions: string;
  reviews: ShoeReview[];
  authenticationNotes: string;
}

export interface CartItem {
  shoe: Shoe;
  selectedColor: ShoeColor;
  selectedSize: number;
  quantity: number;
}

export type SortOption = 'featured' | 'savings-desc' | 'price-asc' | 'price-desc' | 'rating' | 'condition';
