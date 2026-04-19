export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  image: string;
  tags: string[];
  style: string;
  color: string[];
  category: string;
  occasion: string[];
  similarity?: number;
}

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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Oversized Wool Blazer',
    brand: 'Totême',
    price: 890,
    currency: 'USD',
    image: '/images/mock-outfit-4.jpg',
    tags: ['blazer', 'wool', 'oversized', 'tailored', 'minimalist'],
    style: 'Minimalist',
    color: ['navy', 'midnight blue'],
    category: 'Outerwear',
    occasion: ['office', 'business casual', 'smart casual'],
  },
  {
    id: '2',
    name: 'Silk Slip Midi Dress',
    brand: 'The Row',
    price: 1250,
    currency: 'USD',
    image: '/images/mock-outfit-3.jpg',
    tags: ['dress', 'silk', 'midi', 'elegant', 'evening'],
    style: 'Luxury Minimalist',
    color: ['emerald', 'forest green'],
    category: 'Dress',
    occasion: ['dinner', 'date night', 'cocktail', 'gala'],
  },
  {
    id: '3',
    name: 'High-Waist Tailored Trousers',
    brand: 'Cos',
    price: 195,
    currency: 'USD',
    image: '/images/mock-outfit-1.jpg',
    tags: ['trousers', 'tailored', 'high-waist', 'structured'],
    style: 'Contemporary',
    color: ['black', 'onyx'],
    category: 'Bottoms',
    occasion: ['office', 'business formal', 'smart casual'],
  },
  {
    id: '4',
    name: 'Camel Double-Breasted Coat',
    brand: 'Max Mara',
    price: 2150,
    currency: 'USD',
    image: '/images/mock-outfit-2.jpg',
    tags: ['coat', 'camel', 'double-breasted', 'luxury', 'outerwear'],
    style: 'Classic Luxury',
    color: ['camel', 'beige', 'sand'],
    category: 'Outerwear',
    occasion: ['office', 'travel', 'weekend', 'smart casual'],
  },
  {
    id: '5',
    name: 'Linen Wide-Leg Pants',
    brand: 'Arket',
    price: 115,
    currency: 'USD',
    image: '/images/mock-outfit-5.jpg',
    tags: ['linen', 'wide-leg', 'casual', 'summer', 'relaxed'],
    style: 'Resort Casual',
    color: ['ivory', 'white', 'off-white'],
    category: 'Bottoms',
    occasion: ['weekend', 'vacation', 'brunch', 'casual'],
  },
  {
    id: '6',
    name: 'Velvet Evening Gown',
    brand: 'Valentino',
    price: 4800,
    currency: 'USD',
    image: '/images/mock-outfit-6.jpg',
    tags: ['gown', 'velvet', 'evening', 'formal', 'luxury'],
    style: 'Haute Couture',
    color: ['burgundy', 'wine red', 'crimson'],
    category: 'Dress',
    occasion: ['gala', 'black tie', 'opera', 'formal event'],
  },
  {
    id: '7',
    name: 'Structured Leather Tote',
    brand: 'Polène',
    price: 395,
    currency: 'USD',
    image: '/images/mock-outfit-1.jpg',
    tags: ['tote', 'leather', 'structured', 'work bag', 'minimal'],
    style: 'Minimalist',
    color: ['black', 'charcoal'],
    category: 'Accessories',
    occasion: ['office', 'daily', 'smart casual'],
  },
  {
    id: '8',
    name: 'Merino Ribbed Turtleneck',
    brand: 'Everlane',
    price: 130,
    currency: 'USD',
    image: '/images/mock-outfit-2.jpg',
    tags: ['turtleneck', 'merino', 'knitwear', 'classic', 'winter'],
    style: 'Classic',
    color: ['cream', 'ecru', 'off-white'],
    category: 'Tops',
    occasion: ['office', 'weekend', 'casual', 'layering'],
  },
  {
    id: '9',
    name: 'Pointed-Toe Kitten Heels',
    brand: 'By Far',
    price: 475,
    currency: 'USD',
    image: '/images/mock-outfit-3.jpg',
    tags: ['heels', 'kitten heel', 'pointed toe', 'elegant', 'shoes'],
    style: 'Feminine Elegant',
    color: ['nude', 'blush'],
    category: 'Footwear',
    occasion: ['office', 'dinner', 'date night', 'events'],
  },
  {
    id: '10',
    name: 'Asymmetric Silk Blouse',
    brand: 'Jacquemus',
    price: 580,
    currency: 'USD',
    image: '/images/mock-outfit-6.jpg',
    tags: ['blouse', 'silk', 'asymmetric', 'statement', 'feminine'],
    style: 'Contemporary Fashion',
    color: ['white', 'ivory'],
    category: 'Tops',
    occasion: ['dinner', 'date night', 'events', 'smart casual'],
  },
];

export const STYLE_ANALYSES: AnalysisResult[] = [
  {
    style: 'Dark Minimalist',
    vibe: 'Sophisticated & Powerful',
    dominantColors: [
      { color: 'Onyx Black', hex: '#1a1a1a', percentage: 65 },
      { color: 'Charcoal', hex: '#36454F', percentage: 25 },
      { color: 'Pearl White', hex: '#F8F6F0', percentage: 10 },
    ],
    items: ['Structured blazer', 'Slim trousers', 'Minimalist accessories'],
    occasion: ['Business meetings', 'Evening events', 'Art galleries'],
    season: ['Fall', 'Winter'],
    styleScore: 92,
    description: 'Your outfit radiates a powerful, editorial energy. The monochromatic palette creates a cohesive, high-fashion look that commands attention without trying too hard.',
    tips: [
      'Add a gold accent piece to elevate the look',
      'A structured tote in cognac leather would create beautiful contrast',
      'Consider matte textures over shiny fabrics to maintain the sophisticated tone',
    ],
  },
  {
    style: 'Quiet Luxury',
    vibe: 'Understated Elegance',
    dominantColors: [
      { color: 'Camel', hex: '#C19A6B', percentage: 55 },
      { color: 'Ivory', hex: '#FFFFF0', percentage: 30 },
      { color: 'Tan', hex: '#D2B48C', percentage: 15 },
    ],
    items: ['Camel coat', 'Fitted turtleneck', 'Tailored trousers'],
    occasion: ['Business casual', 'Luxury travel', 'Weekend brunches'],
    season: ['Fall', 'Winter', 'Spring'],
    styleScore: 96,
    description: 'This is textbook "old money" aesthetic — understated, refined, and effortlessly luxurious. The neutral palette speaks volumes through quality and cut rather than logos.',
    tips: [
      'A leather belt in cognac would define the silhouette beautifully',
      'Swap accessories for gold tone only — no mixed metals',
      'Ankle boots in a warm tan will complete the monochromatic story',
    ],
  },
  {
    style: 'Modern Femme',
    vibe: 'Romantic & Confident',
    dominantColors: [
      { color: 'Emerald', hex: '#50C878', percentage: 70 },
      { color: 'Gold', hex: '#FFD700', percentage: 20 },
      { color: 'Cream', hex: '#FFFDD0', percentage: 10 },
    ],
    items: ['Silk midi dress', 'Delicate jewelry', 'Heeled sandals'],
    occasion: ['Date nights', 'Cocktail parties', 'Garden events'],
    season: ['Spring', 'Summer'],
    styleScore: 89,
    description: 'The jewel-toned silk creates an instantly luxurious impression. This color sits beautifully against most skin tones and reads as both feminine and powerful.',
    tips: [
      'Gold jewelry only — earrings or a cuff, not both',
      'A nude or blush heel will elongate the leg without competing with the dress',
      'Keep the bag small and architectural for maximum elegance',
    ],
  },
];

export const CHATBOT_RESPONSES: Record<string, string> = {
  default: "I'm AURA, your AI fashion stylist. Upload an outfit photo and I'll analyze your style, or ask me anything about fashion, styling, and outfit planning!",
  greeting: "Welcome to AURA ✨ I'm here to help you look your absolute best. You can upload an outfit for analysis, ask about styling specific occasions, or get personalized recommendations. What would you like to explore today?",
  office: "For a professional setting, I recommend anchoring your look with well-tailored pieces in a neutral palette — navy, charcoal, camel, or ivory. A blazer instantly elevates any outfit by 3 levels. Layer a silk blouse underneath for texture contrast, and choose closed-toe heels or polished flats. Keep jewelry minimal — one statement piece maximum. The goal is 'effortlessly put-together.'",
  date: "Date night dressing is all about intention and a touch of unexpectedness. Consider a silk slip dress or tailored wide-leg pants with an interesting top. Choose fabrics that photograph beautifully — silk, satin, velvet. A monochromatic look in a jewel tone (emerald, burgundy, sapphire) reads as deeply sophisticated. Add one sensory element — a perfume-worthy texture or a subtle shimmer.",
  casual: "Elevated casual is the hardest look to master, and the most rewarding. Start with great-fitting basics — straight-leg denim, a quality white shirt, clean sneakers. Then add one intentional piece: an architectural bag, a cashmere sweater, an interesting layering piece. The rule: 3 items maximum, each one considered.",
  color: "Color theory in fashion: Neutrals (black, white, beige, navy) are your foundation and pair with everything. Jewel tones (emerald, sapphire, ruby) are universally flattering and read as luxurious. Earth tones (terracotta, camel, olive) create that coveted 'quiet luxury' aesthetic. Pro tip: when in doubt, go monochromatic — one color head-to-toe is always chic.",
  minimalist: "Minimalism is not boring — it's deliberate. Invest in: one perfect black blazer, one great pair of wide-leg trousers, one silk top in white or cream, one quality leather bag, one pair of clean leather shoes. These five pieces can create 20+ distinct outfits. The secret is quality over quantity — one $500 piece beats five $100 pieces every time.",
};
