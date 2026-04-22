import { motion } from 'framer-motion';
import { Upload, MessageSquare, Search, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomeView() {
  const { setView } = useAppStore();
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: Upload,
      titleKey: 'feat_vision_title',
      descriptionKey: 'feat_vision_desc',
      action: 'analyze' as const,
      gradient: 'from-[#C9A84C]/20 to-[#8B6914]/10',
      border: 'border-[#C9A84C]/30',
      badge: 'GEMINI AI',
    },
    {
      icon: MessageSquare,
      titleKey: 'feat_llm_title',
      descriptionKey: 'feat_llm_desc',
      action: 'chat' as const,
      gradient: 'from-purple-900/20 to-purple-900/5',
      border: 'border-purple-500/20',
      badge: 'GEMINI LLM',
    },
    {
      icon: Search,
      titleKey: 'feat_search_title',
      descriptionKey: 'feat_search_desc',
      action: 'search' as const,
      gradient: 'from-blue-900/20 to-blue-900/5',
      border: 'border-blue-500/20',
      badge: 'GEMINI AI',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-12 pb-12"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
        <div className="relative px-10 py-16 lg:py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span className="text-[11px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.15em] uppercase">
                AI-Powered Fashion Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-light text-white mb-4 font-['Cormorant_Garamond'] leading-tight"
            >
              {t('home_hero_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#999] text-base font-['Space_Grotesk'] font-light leading-relaxed mb-8 max-w-lg"
            >
              {t('home_hero_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => setView('analyze')}
                className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-black px-6 py-3 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#C9A84C]/20"
              >
                <Upload className="w-4 h-4" />
                {t('home_btn_analyze')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('chat')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                {t('home_btn_chat')}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-white font-['Cormorant_Garamond']">
            Core Features
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/20 to-transparent ml-6" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, titleKey, descriptionKey, action, gradient, border, badge }) => (
            <motion.button
              key={action}
              onClick={() => setView(action)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-6 rounded-2xl bg-gradient-to-br ${gradient} border ${border} group transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <span className="text-[9px] text-[#666] font-['Space_Grotesk'] tracking-[0.2em] border border-[#333] rounded-full px-2 py-1">
                  {badge}
                </span>
              </div>
              <h3 className="text-lg font-light text-white mb-2 font-['Cormorant_Garamond']">
                {t(titleKey as any)}
              </h3>
              <p className="text-sm text-[#666] font-['Space_Grotesk'] font-light leading-relaxed mb-4">
                {t(descriptionKey as any)}
              </p>
              <div className="flex items-center gap-2 text-[#C9A84C] text-xs font-['Space_Grotesk'] group-hover:gap-3 transition-all">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={itemVariants} className="bg-[#111] border border-[#C9A84C]/10 rounded-2xl p-6">
        <h3 className="text-sm text-[#666] font-['Space_Grotesk'] tracking-[0.15em] uppercase mb-4">
          Architecture & Tech Stack
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { layer: 'Frontend', tech: 'React · TypeScript · Vite · Framer Motion' },
            { layer: 'AI Engine', tech: 'Gemini API · Vision Analysis · LLM Chat' },
            { layer: 'Styling', tech: 'Tailwind CSS · Responsive Design' },
            { layer: 'Tooling', tech: 'Zustand · React Dropzone · Lucide Icons' },
          ].map(({ layer, tech }) => (
            <div key={layer} className="space-y-1">
              <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.15em] uppercase">
                {layer}
              </p>
              <p className="text-xs text-[#666] font-['Space_Grotesk']">{tech}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
