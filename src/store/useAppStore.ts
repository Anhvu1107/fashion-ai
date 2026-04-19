import { create } from 'zustand';
import type { Product, AnalysisResult, ChatMessage } from '../data/mockProducts';
import {
  MOCK_PRODUCTS,
  STYLE_ANALYSES,
  CHATBOT_RESPONSES,
} from '../data/mockProducts';

type AppView = 'home' | 'analyze' | 'chat' | 'search' | 'history';

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

  // Visual Search
  searchResults: Product[];
  isSearching: boolean;
  runVisualSearch: () => Promise<void>;

  // Chat
  messages: ChatMessage[];
  isChatLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // History
  history: { image: string; analysis: AnalysisResult; date: Date }[];

  // UI
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

function getRandomAnalysis(): AnalysisResult {
  return STYLE_ANALYSES[Math.floor(Math.random() * STYLE_ANALYSES.length)];
}

function getRandomProducts(count = 6): Product[] {
  const shuffled = [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((p) => ({
    ...p,
    similarity: Math.floor(Math.random() * 20 + 78),
  }));
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
    set({ uploadedImage: image, uploadedFile: file, analysisResult: null, searchResults: [] }),

  runAnalysis: async () => {
    const { uploadedImage } = get();
    if (!uploadedImage) return;
    set({ isAnalyzing: true });
    await new Promise((resolve) => setTimeout(resolve, 2800));
    const result = getRandomAnalysis();
    const { history } = get();
    set({
      isAnalyzing: false,
      analysisResult: result,
      history: [
        { image: uploadedImage, analysis: result, date: new Date() },
        ...history.slice(0, 9),
      ],
    });
  },

  clearAnalysis: () =>
    set({ uploadedImage: null, uploadedFile: null, analysisResult: null, searchResults: [] }),

  // Visual Search
  searchResults: [],
  isSearching: false,

  runVisualSearch: async () => {
    set({ isSearching: true });
    await new Promise((resolve) => setTimeout(resolve, 1800));
    set({ isSearching: false, searchResults: getRandomProducts(6) });
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
    
    // Add user message to state immediately
    set((state) => ({
      messages: [...state.messages, userMsg],
      isChatLoading: true,
    }));

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY không được tìm thấy trong file .env");
      }

      // Lấy toàn bộ lịch sử chat hiện tại (trừ những tin nhắn báo lỗi hệ thống/nội bộ)
      const currentMessages = get().messages.filter(m => !m.content.startsWith('Lỗi kết nối'));
      
      // Chuyển đổi định dạng cho Gemini API
      const chatContents = currentMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Nếu không có biến môi trường sẽ báo lỗi
      const aiModel = import.meta.env.VITE_GEMINI_MODEL;
      if (!aiModel) {
        throw new Error("VITE_GEMINI_MODEL không được tìm thấy trong file .env");
      }

      // Ép AI nhớ tên model đang chạy để tránh việc nó tự nhận vơ phiên bản khác do hallucination
      const systemInstruction = `Bạn là AURA, một AI Fashion Stylist chuyên nghiệp và tinh tế. Bạn đang được vận hành bằng mô hình ${aiModel}. Bạn trả lời ngắn gọn, hiện đại và mang tính ứng dụng cao về thời trang. Nếu người dùng hỏi bằng Tiếng Việt, hãy trả lời bằng Tiếng Việt thân thiện. Hạn chế sử dụng icon.`;

      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
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

  // UI
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
