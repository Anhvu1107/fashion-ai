import { create } from 'zustand';
import type { AnalysisResult, Recommendation, ChatMessage, ComparisonResult, UserProfile } from '../data/mockProducts';
import { CHATBOT_RESPONSES } from '../data/mockProducts';

type AppView = 'home' | 'analyze' | 'chat' | 'search' | 'history' | 'compare';

const DEFAULT_PROFILE: UserProfile = {
  gender: '', height: '', weight: '',
  bust: '', waist: '', hip: '',
  skinTone: '', bodyType: '', stylePreference: '', notes: '',
};

function loadProfile(): UserProfile {
  try {
    const saved = localStorage.getItem('aura_user_profile');
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
  } catch { return DEFAULT_PROFILE; }
}

function saveProfile(profile: UserProfile) {
  localStorage.setItem('aura_user_profile', JSON.stringify(profile));
}

interface AppStore {
  // Locale
  language: 'en' | 'vi';
  toggleLanguage: () => void;

  // Navigation
  currentView: AppView;
  setView: (view: AppView) => void;

  // Upload & Analysis
  uploadedImage: string | null;
  uploadedFile: File | null;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  setUploadedImage: (image: string | null, file: File | null) => void;
  runAnalysis: () => Promise<void>;
  clearAnalysis: () => void;

  // AI Recommendations (replaces Visual Search)
  recommendations: Recommendation[];
  isSearching: boolean;
  runVisualSearch: () => Promise<void>;

  // Chat
  messages: ChatMessage[];
  isChatLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // History
  history: { image: string; analysis: AnalysisResult; date: Date }[];

  // Compare
  compareImages: { id: string; image: string }[];
  compareOccasion: string;
  comparisonResult: ComparisonResult | null;
  isComparing: boolean;
  addCompareImage: (image: string) => void;
  removeCompareImage: (id: string) => void;
  setCompareOccasion: (occasion: string) => void;
  runComparison: () => Promise<void>;
  clearComparison: () => void;

  // Profile
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  isProfileOpen: boolean;
  toggleProfile: () => void;

  // UI
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// ─── Helpers ───

function getGeminiConfig() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY không được tìm thấy trong file .env");
  const aiModel = import.meta.env.VITE_GEMINI_MODEL;
  if (!aiModel) throw new Error("VITE_GEMINI_MODEL không được tìm thấy trong file .env");
  return { apiKey, aiModel };
}

function extractBase64(imageDataUrl: string) {
  const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Định dạng ảnh không hợp lệ");
  return { mimeType: matches[1], base64Data: matches[2] };
}

async function callGemini(apiKey: string, aiModel: string, body: object) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Lỗi HTTP: ${res.status}`);
  }
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Không nhận được phản hồi từ AI");
  return raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
}

function getProfileContext(profile: UserProfile): string {
  const parts: string[] = [];
  if (profile.gender) parts.push(`Giới tính: ${profile.gender}`);
  if (profile.height) parts.push(`Chiều cao: ${profile.height}cm`);
  if (profile.weight) parts.push(`Cân nặng: ${profile.weight}kg`);
  if (profile.bust || profile.waist || profile.hip) {
    const measures = [
      profile.bust && `Vòng 1: ${profile.bust}cm`,
      profile.waist && `Vòng 2: ${profile.waist}cm`,
      profile.hip && `Vòng 3: ${profile.hip}cm`,
    ].filter(Boolean).join(', ');
    parts.push(`Số đo: ${measures}`);
  }
  if (profile.skinTone) parts.push(`Tông da: ${profile.skinTone}`);
  if (profile.bodyType) parts.push(`Dáng người: ${profile.bodyType}`);
  if (profile.stylePreference) parts.push(`Phong cách yêu thích: ${profile.stylePreference}`);
  if (profile.notes) parts.push(`Ghi chú thêm: ${profile.notes}`);
  if (parts.length === 0) return '';
  return `\n\nTHÔNG TIN NGƯỜI DÙNG (dùng để tư vấn phù hợp với thể trạng và sở thích cá nhân):\n${parts.join('\n')}`;
}

// ─── Outfit Analysis ───

async function analyzeWithGeminiVision(imageDataUrl: string, profile: UserProfile): Promise<AnalysisResult> {
  const { apiKey, aiModel } = getGeminiConfig();
  const { mimeType, base64Data } = extractBase64(imageDataUrl);
  const profileCtx = getProfileContext(profile);

  const prompt = `Bạn là chuyên gia phân tích TRANG PHỤC (quần áo). Hãy phân tích ảnh được cung cấp.${profileCtx}

QUY TẮC QUAN TRỌNG:
1. CHỈ phân tích QUẦN ÁO / TRANG PHỤC trong ảnh. KHÔNG đánh giá background, ánh sáng, chất lượng ảnh, pose dáng, hay bất kỳ thứ gì không phải quần áo.
2. Nếu ảnh KHÔNG có quần áo hoặc trang phục, trả về styleScore: 0, style: "Không phải thời trang", và description giải thích ảnh không chứa trang phục.
3. Tất cả nội dung trả về phải bằng TIẾNG VIỆT.

Khi ảnh CÓ trang phục, hãy phân tích:
- Phong cách trang phục (ví dụ: "Tối giản hiện đại", "Sang trọng thầm lặng", "Streetwear", "Bohemian", "Nữ tính hiện đại", "Cổ điển thanh lịch", "Năng động thể thao", v.v.)
- Cảm giác/mood (ví dụ: "Mạnh mẽ & quyền lực", "Thanh lịch tinh tế", "Lãng mạn & tự tin")
- Màu sắc chủ đạo: CHỈ nhận diện màu của QUẦN ÁO, KHÔNG tính màu da, tóc, background. Cung cấp tên màu tiếng Việt, mã hex chính xác, và phần trăm. Tổng phần trăm phải bằng 100.
- Các món đồ cụ thể nhìn thấy (áo, quần, váy, giày, túi, phụ kiện...)
- Dịp phù hợp để mặc
- Mùa phù hợp
- Điểm phong cách (1-100) dựa trên TRANG PHỤC: phối màu quần áo (25%), form dáng/kiểu dáng (25%), sự hài hòa tổng thể của outfit (25%), độ thời thượng (25%)
- Nhận xét chi tiết về BỘ TRANG PHỤC. Nếu có thông tin người dùng, hãy đánh giá outfit có phù hợp với tông da, dáng người KHÔNG.
- 3 lời khuyên phối đồ cụ thể cho bộ trang phục này. Nếu có thông tin người dùng, hãy cá nhân hóa lời khuyên.

Trả về CHỈ JSON hợp lệ (không markdown, không code fence):
{
  "style": "tên phong cách",
  "vibe": "cảm giác/mood",
  "dominantColors": [
    { "color": "Tên màu tiếng Việt", "hex": "#HEXCODE", "percentage": số }
  ],
  "items": ["món đồ 1", "món đồ 2"],
  "occasion": ["dịp 1", "dịp 2"],
  "season": ["mùa 1"],
  "styleScore": số,
  "description": "nhận xét chi tiết bằng tiếng Việt",
  "tips": ["lời khuyên 1", "lời khuyên 2", "lời khuyên 3"]
}`;

  const cleanedText = await callGemini(apiKey, aiModel, {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: base64Data } },
      ],
    }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
  });

  const parsed = JSON.parse(cleanedText) as AnalysisResult;
  if (!parsed.style || parsed.styleScore === undefined || !parsed.dominantColors) {
    throw new Error("Phản hồi thiếu trường bắt buộc");
  }
  parsed.styleScore = Math.max(0, Math.min(100, Math.round(parsed.styleScore)));
  parsed.dominantColors = parsed.dominantColors || [];
  parsed.items = parsed.items || [];
  parsed.occasion = parsed.occasion || [];
  parsed.season = parsed.season || [];
  parsed.tips = parsed.tips || [];
  return parsed;
}

// ─── AI Outfit Recommendations ───

async function getAIRecommendations(imageDataUrl: string, analysisResult: AnalysisResult | null, profile: UserProfile): Promise<Recommendation[]> {
  const { apiKey, aiModel } = getGeminiConfig();
  const { mimeType, base64Data } = extractBase64(imageDataUrl);
  const profileCtx = getProfileContext(profile);

  const contextFromAnalysis = analysisResult
    ? `\nKết quả phân tích trước đó: Phong cách "${analysisResult.style}", mood "${analysisResult.vibe}", các món đồ hiện có: ${analysisResult.items.join(', ')}, màu chủ đạo: ${analysisResult.dominantColors.map(c => c.color).join(', ')}.`
    : '';

  const prompt = `Bạn là chuyên gia tư vấn thời trang. Nhìn vào bộ trang phục trong ảnh và gợi ý 6 món đồ nên MUA THÊM hoặc THAY THẾ để hoàn thiện phong cách.
${contextFromAnalysis}${profileCtx}

QUY TẮC:
1. CHỈ gợi ý dựa trên TRANG PHỤC trong ảnh, không đánh giá background hay chất lượng ảnh.
2. Nếu ảnh KHÔNG có trang phục, trả về mảng rỗng [].
3. Gợi ý phải thực tế, có thể mua được, với brand và giá tham khảo hợp lý cho thị trường Việt Nam.
4. Mỗi gợi ý phải giải thích TẠI SAO nên phối với outfit hiện tại.
5. Trả lời bằng TIẾNG VIỆT.
6. priority: "high" = rất cần thiết để hoàn thiện outfit, "medium" = nâng cấp tốt, "low" = tùy chọn thêm.

Trả về CHỈ JSON hợp lệ (không markdown, không code fence) — một mảng 6 phần tử:
[
  {
    "name": "Tên món đồ cụ thể",
    "category": "Loại (Áo, Quần, Giày, Túi, Phụ kiện, Ngoài...)",
    "brand": "Brand gợi ý (có thể mua tại VN)",
    "priceRange": "500K - 1.5M",
    "reason": "Giải thích ngắn gọn tại sao nên phối với outfit hiện tại",
    "color": "Màu gợi ý phối",
    "priority": "high|medium|low"
  }
]`;

  const cleanedText = await callGemini(apiKey, aiModel, {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: base64Data } },
      ],
    }],
    generationConfig: { temperature: 0.5, maxOutputTokens: 2048 },
  });

  const parsed = JSON.parse(cleanedText) as Recommendation[];
  if (!Array.isArray(parsed)) throw new Error("Phản hồi không phải mảng");
  return parsed.slice(0, 6);
}

// ─── Outfit Comparison ───

async function compareOutfits(images: { id: string; image: string }[], occasion: string, profile: UserProfile): Promise<ComparisonResult> {
  const { apiKey, aiModel } = getGeminiConfig();

  const imageParts = images.map((img, i) => {
    const { mimeType, base64Data } = extractBase64(img.image);
    return [
      { text: `--- OUTFIT ${i + 1} ---` },
      { inlineData: { mimeType, data: base64Data } },
    ];
  }).flat();

  const profileCtx = getProfileContext(profile);
  const occasionContext = occasion
    ? `\n\nNGỮ CẢNH QUAN TRỌNG: Người dùng muốn chọn trang phục cho dịp "${occasion}". Hãy ƯU TIÊN đánh giá dựa trên mức độ PHÙ HỢP với dịp này. overallWinner phải là bộ PHÙ HỢP NHẤT với dịp "${occasion}", không nhất thiết là bộ đẹp nhất nói chung. Trong verdict, hãy giải thích rõ vì sao bộ thắng phù hợp với dịp "${occasion}" hơn các bộ khác.`
    : '';

  const prompt = `Bạn là chuyên gia thời trang. Hãy SO SÁNH ${images.length} bộ trang phục dưới đây.${occasionContext}${profileCtx}

QUY TẮC:
1. CHỈ phân tích QUẦN ÁO, không đánh giá background, ánh sáng, chất lượng ảnh.
2. Chấm điểm từng bộ (1-100) dựa trên: phối màu (25%), form dáng (25%), tổng thể (25%), mức phù hợp với dịp (25%).
3. So sánh trực tiếp: bộ nào đẹp hơn, bộ nào hợp dịp gì hơn.
4. Đưa ra nhận xét điểm mạnh và điểm yếu từng bộ.
5. Gợi ý bộ nào nên mặc cho từng dịp cụ thể (đi làm, hẹn hò, dự tiệc, đi chơi, meeting...).
6. Tất cả bằng TIẾNG VIỆT.

Trả về CHỈ JSON hợp lệ (không markdown, không code fence):
{
  "outfits": [
    {
      "index": 1,
      "style": "tên phong cách",
      "styleScore": số_điểm,
      "dominantColors": [{ "color": "tên màu", "hex": "#hex", "percentage": số }],
      "items": ["món đồ 1", "món đồ 2"],
      "strengths": "điểm mạnh ngắn gọn",
      "weaknesses": "điểm yếu ngắn gọn"
    }
  ],
  "verdict": "nhận xét tổng thể so sánh chi tiết",
  "bestForOccasions": [
    { "occasion": "tên dịp", "outfitIndex": số (1-based), "reason": "lý do" }
  ],
  "overallWinner": số (1-based index của bộ thắng),
  "winnerReason": "lý do bộ này thắng"
}`;

  const cleanedText = await callGemini(apiKey, aiModel, {
    contents: [{
      parts: [
        { text: prompt },
        ...imageParts,
      ],
    }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
  });

  const parsed = JSON.parse(cleanedText) as ComparisonResult;
  if (!parsed.outfits || !parsed.verdict) throw new Error("Phản hồi thiếu trường bắt buộc");
  return parsed;
}


export const useAppStore = create<AppStore>((set, get) => ({
  // Locale
  language: 'en',
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'vi' : 'en' })),

  // Navigation
  currentView: 'home',
  setView: (view) => set({ currentView: view }),

  // Upload & Analysis
  uploadedImage: null,
  uploadedFile: null,
  isAnalyzing: false,
  analysisResult: null,

  setUploadedImage: (image, file) =>
    set({ uploadedImage: image, uploadedFile: file, analysisResult: null, recommendations: [] }),

  runAnalysis: async () => {
    const { uploadedImage } = get();
    if (!uploadedImage) return;
    set({ isAnalyzing: true });

    try {
      const result = await analyzeWithGeminiVision(uploadedImage, get().userProfile);
      const { history } = get();
      set({
        isAnalyzing: false,
        analysisResult: result,
        history: [
          { image: uploadedImage, analysis: result, date: new Date() },
          ...history.slice(0, 9),
        ],
      });
    } catch (error) {
      console.error("Analysis Error:", error);
      const errorResult: AnalysisResult = {
        style: 'Phân tích thất bại',
        vibe: 'Lỗi',
        dominantColors: [],
        items: [],
        occasion: [],
        season: [],
        styleScore: 0,
        description: `Không thể phân tích ảnh: ${error instanceof Error ? error.message : 'Lỗi không xác định'}. Vui lòng thử lại.`,
        tips: [
          'Kiểm tra kết nối mạng và API key',
          'Thử upload ảnh có kích thước nhỏ hơn',
          'Đảm bảo ảnh có chứa trang phục rõ ràng',
        ],
      };
      set({ isAnalyzing: false, analysisResult: errorResult });
    }
  },

  clearAnalysis: () =>
    set({ uploadedImage: null, uploadedFile: null, analysisResult: null, recommendations: [] }),

  // AI Recommendations
  recommendations: [],
  isSearching: false,

  runVisualSearch: async () => {
    const { uploadedImage, analysisResult } = get();
    if (!uploadedImage) return;
    set({ isSearching: true });

    try {
      const recs = await getAIRecommendations(uploadedImage, analysisResult, get().userProfile);
      set({ isSearching: false, recommendations: recs });
    } catch (error) {
      console.error("Recommendation Error:", error);
      set({ isSearching: false, recommendations: [] });
    }
  },

  // Chat
  messages: [
    {
      id: '0',
      role: 'assistant',
      content: CHATBOT_RESPONSES.default,
      timestamp: new Date(),
    },
  ],
  isChatLoading: false,

  sendMessage: async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isChatLoading: true,
    }));

    try {
      const { apiKey, aiModel } = getGeminiConfig();

      const currentMessages = get().messages.filter(m => !m.content.startsWith('Lỗi kết nối'));
      const chatContents = currentMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const profileCtx = getProfileContext(get().userProfile);
      const systemInstruction = `Bạn là AURA, một AI Fashion Stylist chuyên nghiệp và tinh tế. Bạn đang được vận hành bằng mô hình ${aiModel}. Bạn trả lời ngắn gọn, hiện đại và mang tính ứng dụng cao về thời trang. Nếu người dùng hỏi bằng Tiếng Việt, hãy trả lời bằng Tiếng Việt thân thiện. Hạn chế sử dụng icon.${profileCtx}`;

      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: chatContents
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Lỗi HTTP: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, hiện tại hệ thống không thể xử lý yêu cầu.";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botResponse,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isChatLoading: false,
      }));
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Lỗi kết nối: ${error instanceof Error ? error.message : "Hãy kiểm tra lại config API key."}`,
        timestamp: new Date(),
      };
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isChatLoading: false,
      }));
    }
  },

  clearChat: () =>
    set({
      messages: [
        {
          id: '0',
          role: 'assistant',
          content: CHATBOT_RESPONSES.default,
          timestamp: new Date(),
        },
      ],
    }),

  // History
  history: [],

  // Compare
  compareImages: [],
  compareOccasion: '',
  comparisonResult: null,
  isComparing: false,

  addCompareImage: (image) => {
    const { compareImages } = get();
    if (compareImages.length >= 4) return;
    set({
      compareImages: [...compareImages, { id: Date.now().toString(), image }],
      comparisonResult: null,
    });
  },

  removeCompareImage: (id) => {
    set((state) => ({
      compareImages: state.compareImages.filter((img) => img.id !== id),
      comparisonResult: null,
    }));
  },

  setCompareOccasion: (occasion) => set({ compareOccasion: occasion }),

  runComparison: async () => {
    const { compareImages, compareOccasion } = get();
    if (compareImages.length < 2) return;
    set({ isComparing: true });

    try {
      const result = await compareOutfits(compareImages, compareOccasion, get().userProfile);
      set({ isComparing: false, comparisonResult: result });
    } catch (error) {
      console.error("Comparison Error:", error);
      set({
        isComparing: false,
        comparisonResult: {
          outfits: [],
          verdict: `Không thể so sánh: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
          bestForOccasions: [],
          overallWinner: 0,
          winnerReason: '',
        },
      });
    }
  },

  clearComparison: () => set({ compareImages: [], compareOccasion: '', comparisonResult: null }),

  // Profile
  userProfile: loadProfile(),
  isProfileOpen: false,
  setUserProfile: (profile) => { saveProfile(profile); set({ userProfile: profile }); },
  toggleProfile: () => set((state) => ({ isProfileOpen: !state.isProfileOpen })),

  // UI
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
