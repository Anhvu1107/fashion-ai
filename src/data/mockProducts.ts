export interface AnalysisResult {
  style: string;
  vibe: string;
  dominantColors: { color: string; hex: string; percentage: number }[];
  items: string[];
  occasion: string[];
  season: string[];
  styleScore: number;
  description: string;
  tips: string[];
}

export interface UserProfile {
  gender: string;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
  skinTone: string;
  bodyType: string;
  stylePreference: string;
  notes: string;
}

export interface Recommendation {
  name: string;
  category: string;
  brand: string;
  priceRange: string;
  reason: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  shoppingQuery?: string;
  productUrl?: string;
}

export type ProductAlternativeTier = 'budget' | 'lower' | 'mid' | 'premium' | 'same-vibe';

export interface ProductAlternative {
  name: string;
  tier: ProductAlternativeTier;
  brand: string;
  priceRange: string;
  reason: string;
  tradeoff: string;
  shoppingQuery?: string;
  productUrl?: string;
}

export interface ComparisonItem {
  index: number;
  style: string;
  styleScore: number;
  dominantColors: { color: string; hex: string; percentage: number }[];
  items: string[];
  strengths: string;
  weaknesses: string;
}

export interface ComparisonResult {
  outfits: ComparisonItem[];
  verdict: string;
  bestForOccasions: { occasion: string; outfitIndex: number; reason: string }[];
  overallWinner: number;
  winnerReason: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const CHATBOT_RESPONSES: Record<'en' | 'vi', string> = {
  en: "Hi, I'm AURA. I can help with outfit ideas by occasion, body shape, skin tone, budget, or fashion sales scripts. What situation are you dressing for?",
  vi: "Chào bạn, mình là AURA. Mình có thể tư vấn phối đồ theo dịp, dáng người, màu da, ngân sách, hoặc hỗ trợ kịch bản bán hàng thời trang. Bạn đang cần chọn outfit cho tình huống nào?",
};
