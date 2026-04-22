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

export const CHATBOT_RESPONSES: Record<string, string> = {
  default: "I'm AURA, your AI fashion stylist. Upload an outfit photo and I'll analyze your style, or ask me anything about fashion, styling, and outfit planning!",
};
