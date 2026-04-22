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

export type RecommendationBudgetId =
  | 'any'
  | 'under-300k'
  | '300k-700k'
  | '700k-1500k'
  | '1500k-3000k';

export interface RecommendationBudget {
  id: RecommendationBudgetId;
  labelVi: string;
  labelEn: string;
  prompt: string;
}

export const RECOMMENDATION_BUDGETS: RecommendationBudget[] = [
  {
    id: 'any',
    labelVi: 'Linh hoạt',
    labelEn: 'Flexible',
    prompt: 'Không giới hạn ngân sách, nhưng vẫn ưu tiên món đáng tiền và dễ mua tại Việt Nam.',
  },
  {
    id: 'under-300k',
    labelVi: 'Dưới 300K',
    labelEn: 'Under 300K',
    prompt: 'Mỗi món nên dưới 300K VND. Ưu tiên lựa chọn bình dân, dễ tìm trên sàn thương mại điện tử hoặc local shop.',
  },
  {
    id: '300k-700k',
    labelVi: '300K-700K',
    labelEn: '300K-700K',
    prompt: 'Mỗi món nên nằm trong khoảng 300K-700K VND. Ưu tiên lựa chọn chất lượng ổn, dễ mua tại Việt Nam.',
  },
  {
    id: '700k-1500k',
    labelVi: '700K-1.5M',
    labelEn: '700K-1.5M',
    prompt: 'Mỗi món nên nằm trong khoảng 700K-1.5M VND. Ưu tiên lựa chọn tầm trung, bền và có tính ứng dụng cao.',
  },
  {
    id: '1500k-3000k',
    labelVi: '1.5M-3M',
    labelEn: '1.5M-3M',
    prompt: 'Mỗi món nên nằm trong khoảng 1.5M-3M VND. Ưu tiên lựa chọn cao cấp vừa phải, không gợi ý xa xỉ quá mức.',
  },
];

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
