import { Menu, Bell, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  home: { title: 'AURA', subtitle: 'AI Fashion Intelligence Platform' },
  analyze: { title: 'Analyze Outfit', subtitle: 'Upload & get AI style breakdown' },
  chat: { title: 'AI Stylist Chat', subtitle: 'Powered by Gemini LLM' },
  search: { title: 'Visual Search', subtitle: 'Find similar items via CLIP embeddings' },
  history: { title: 'Style History', subtitle: 'Your recent outfit analyses' },
};

export default function Header() {
  const { currentView, toggleSidebar } = useAppStore();
  const { title, subtitle } = VIEW_TITLES[currentView] || VIEW_TITLES.home;

  return (
    <header className="h-16 border-b border-[#C9A84C]/10 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-[#666] hover:text-white transition-colors p-1"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-medium text-white font-['Space_Grotesk'] tracking-wide">
            {title}
          </h2>
          <p className="text-[11px] text-[#555] font-['Space_Grotesk']">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Status badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#111] border border-[#C9A84C]/20 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-[#888] font-['Space_Grotesk'] tracking-wide">
            AI ONLINE
          </span>
        </div>

        <button className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#C9A84C]/10">
          <Bell className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#C9A84C]/10">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
