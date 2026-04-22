import { Menu, Bell, Settings, Languages, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';

export default function Header() {
  const { currentView, toggleSidebar, toggleLanguage, toggleProfile, userProfile } = useAppStore();
  const { t, language } = useTranslation();

  const hasProfile = Object.values(userProfile).some((v) => v.trim() !== '');

  const getViewTitle = (view: string) => {
    switch (view) {
      case 'home': return { title: t('view_home_title'), subtitle: t('view_home_subtitle') };
      case 'analyze': return { title: t('view_analyze_title'), subtitle: t('view_analyze_subtitle') };
      case 'chat': return { title: t('view_chat_title'), subtitle: t('view_chat_subtitle') };
      case 'search': return { title: t('view_search_title'), subtitle: t('view_search_subtitle') };
      case 'compare': return { title: t('view_compare_title'), subtitle: t('view_compare_subtitle') };
      case 'history': return { title: t('view_history_title'), subtitle: t('view_history_subtitle') };
      default: return { title: t('view_home_title'), subtitle: t('view_home_subtitle') };
    }
  };

  const { title, subtitle } = getViewTitle(currentView);

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
            {t('header_ai_online')}
          </span>
        </div>

        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="w-12 h-8 flex items-center justify-center gap-1.5 text-[#555] hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#C9A84C]/10 font-['Space_Grotesk'] text-xs uppercase"
        >
          <Languages className="w-3.5 h-3.5" />
          {language}
        </button>

        <button className="hidden sm:flex w-8 h-8 items-center justify-center text-[#555] hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#C9A84C]/10">
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile / Settings */}
        <button
          onClick={toggleProfile}
          className="relative hidden sm:flex w-8 h-8 items-center justify-center text-[#555] hover:text-[#C9A84C] transition-colors rounded-lg hover:bg-[#C9A84C]/10"
        >
          <User className="w-4 h-4" />
          {hasProfile && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C9A84C]" />
          )}
        </button>
      </div>
    </header>
  );
}

