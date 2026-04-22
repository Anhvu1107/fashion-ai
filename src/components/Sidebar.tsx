import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Upload,
  MessageSquare,
  Search,
  Clock,
  X,
  Zap,
  GitCompareArrows,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';

const NAV_ITEMS_KEYS = [
  { id: 'home', labelKey: 'nav_overview', icon: Sparkles },
  { id: 'analyze', labelKey: 'nav_analyze', icon: Upload },
  { id: 'compare', labelKey: 'nav_compare', icon: GitCompareArrows },
  { id: 'chat', labelKey: 'nav_chat', icon: MessageSquare },
  { id: 'search', labelKey: 'nav_search', icon: Search },
  { id: 'history', labelKey: 'nav_history', icon: Clock },
] as const;

export default function Sidebar() {
  const { currentView, setView, isSidebarOpen, toggleSidebar } = useAppStore();
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0d0d0d] border-r border-[#C9A84C]/20 flex-shrink-0 h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6 border-b border-[#C9A84C]/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-light tracking-[0.3em] text-[#C9A84C] font-['Cormorant_Garamond']">
                AURA
              </h1>
              <p className="text-[10px] text-[#666] tracking-[0.15em] uppercase">
                {t('sidebar_subtitle')}
              </p>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-[#444] uppercase tracking-[0.2em] px-3 py-2 font-['Space_Grotesk']">
            {t('nav_title_navigation')}
          </p>
          {NAV_ITEMS_KEYS.map(({ id, labelKey, icon: Icon }) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => setView(id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-['Space_Grotesk'] transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30'
                    : 'text-[#888] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#C9A84C]' : 'text-[#555] group-hover:text-white'}`} />
                {t(labelKey as any)}
                {isActive && (
                  <motion.div layoutId="desktopActiveIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                )}
              </button>
            );
          })}
        </nav>
        {/* Footer */}
        <div className="p-4 border-t border-[#C9A84C]/10">
          <div className="bg-[#111] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#888] font-['Space_Grotesk']">{t('sidebar_ai_active')}</span>
            </div>
            <p className="text-[10px] text-[#555] font-['Space_Grotesk']">Gemini AI · Vision API</p>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#555] hover:text-[#C9A84C] transition-colors font-['Space_Grotesk'] px-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            {t('sidebar_view_github')}
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 h-full w-72 bg-[#0d0d0d] border-r border-[#C9A84C]/20 z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#C9A84C]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-light tracking-[0.3em] text-[#C9A84C] font-['Cormorant_Garamond']">
                  AURA
                </h1>
                <p className="text-[10px] text-[#666] tracking-[0.15em] uppercase">
                  {t('sidebar_subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-[#666] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-[#444] uppercase tracking-[0.2em] px-3 py-2 font-['Space_Grotesk']">
            {t('nav_title_navigation')}
          </p>
          {NAV_ITEMS_KEYS.map(({ id, labelKey, icon: Icon }) => {
            const isActive = currentView === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setView(id as any);
                  if (isSidebarOpen) toggleSidebar();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-['Space_Grotesk'] transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30'
                    : 'text-[#888] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#C9A84C]' : 'text-[#555] group-hover:text-white'
                  }`}
                />
                {t(labelKey as any)}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#C9A84C]/10">
          <div className="bg-[#111] rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#888] font-['Space_Grotesk']">{t('sidebar_ai_active')}</span>
            </div>
            <p className="text-[10px] text-[#555] font-['Space_Grotesk']">
              Gemini AI · Vision API
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#555] hover:text-[#C9A84C] transition-colors font-['Space_Grotesk'] px-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            {t('sidebar_view_github')}
          </a>
        </div>
      </motion.aside>
    </>
  );
}
