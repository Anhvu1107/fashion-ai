import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Upload,
  Loader2,
  Sparkles,
  ArrowUpRight,
  ShoppingBag,
  Tag,
  Palette,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Recommendation } from '../data/mockProducts';
import { useTranslation } from '../hooks/useTranslation';

const PRIORITY_STYLES = {
  high: {
    border: 'border-[#C9A84C]/40',
    bg: 'bg-gradient-to-br from-[#C9A84C]/10 to-[#8B6914]/5',
    badge: 'bg-[#C9A84C]/20 text-[#C9A84C]',
    label: 'Rất cần',
  },
  medium: {
    border: 'border-[#555]/30',
    bg: 'bg-[#111]',
    badge: 'bg-blue-500/15 text-blue-400',
    label: 'Nên có',
  },
  low: {
    border: 'border-[#333]/30',
    bg: 'bg-[#111]',
    badge: 'bg-[#333]/30 text-[#777]',
    label: 'Tùy chọn',
  },
};

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const pStyle = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group ${pStyle.bg} border ${pStyle.border} hover:border-[#C9A84C]/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/5`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="text-sm text-white font-['Space_Grotesk'] font-medium leading-tight">
              {rec.name}
            </h3>
            <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.1em] uppercase">
              {rec.brand}
            </p>
          </div>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-['Space_Grotesk'] font-medium ${pStyle.badge}`}>
          {pStyle.label}
        </span>
      </div>

      {/* Reason */}
      <p className="text-xs text-[#888] font-['Space_Grotesk'] font-light leading-relaxed mb-3">
        {rec.reason}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1 text-[10px] text-[#666] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-full font-['Space_Grotesk']">
          <Tag className="w-2.5 h-2.5" />
          {rec.category}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-[#666] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-full font-['Space_Grotesk']">
          <Palette className="w-2.5 h-2.5" />
          {rec.color}
        </span>
      </div>

      {/* Price + Action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#222]">
        <p className="text-sm font-light text-white font-['Cormorant_Garamond']">
          {rec.priceRange}
          <span className="text-[10px] text-[#444] ml-1 font-['Space_Grotesk']">VNĐ</span>
        </p>
        <button className="flex items-center gap-1 text-[10px] text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] transition-colors">
          Tìm mua
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

export default function SearchView() {
  const { uploadedImage, recommendations, isSearching, runVisualSearch, setView } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (uploadedImage && recommendations.length === 0 && !isSearching) {
      runVisualSearch();
    }
  }, [uploadedImage]);

  if (!uploadedImage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-xl mx-auto flex flex-col items-center justify-center h-full text-center py-24"
      >
        <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-[#333]" />
        </div>
        <h3 className="text-xl font-light text-white font-['Cormorant_Garamond'] mb-2">
          {t('search_empty')}
        </h3>
        <p className="text-sm text-[#555] font-['Space_Grotesk'] font-light mb-6 leading-relaxed">
          Upload trang phục trước, AI sẽ phân tích và gợi ý các món đồ nên phối kèm.
        </p>
        <button
          onClick={() => setView('analyze')}
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-black px-6 py-3 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all"
        >
          <Upload className="w-4 h-4" />
          Upload trang phục
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-12"
    >
      {/* Query Image + Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#C9A84C]/30">
          <img src={uploadedImage} alt="Outfit" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.15em] uppercase">
              AI Gợi ý phối đồ
            </p>
          </div>
          <h2 className="text-2xl font-light text-white font-['Cormorant_Garamond']">
            Gợi ý từ AI
          </h2>
          <p className="text-xs text-[#555] font-['Space_Grotesk'] mt-1">
            Phân tích bởi Gemini AI · Dựa trên trang phục đã upload
          </p>
        </div>
        {!isSearching && recommendations.length > 0 && (
          <button
            onClick={runVisualSearch}
            className="ml-auto flex items-center gap-2 text-xs text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] border border-[#222] hover:border-[#C9A84C]/30 px-4 py-2 rounded-xl transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            Gợi ý lại
          </button>
        )}
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border border-[#C9A84C]/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <Loader2 className="absolute inset-0 w-16 h-16 text-[#C9A84C]/40 animate-spin" />
            </div>
            <p className="text-sm text-[#888] font-['Space_Grotesk']">Đang phân tích phong cách...</p>
            <p className="text-xs text-[#444] font-['Space_Grotesk'] mt-1">AI đang gợi ý món đồ phối kèm</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {!isSearching && recommendations.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#666] font-['Space_Grotesk']">
              <span className="text-[#C9A84C]">{recommendations.length}</span> gợi ý phối đồ từ AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={`${rec.name}-${i}`} rec={rec} index={i} />
            ))}
          </div>

          {/* CTA: Go back to analysis */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setView('analyze')}
              className="flex items-center gap-2 mx-auto text-xs text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] border border-[#222] hover:border-[#C9A84C]/30 px-5 py-2.5 rounded-xl transition-all"
            >
              Phân tích outfit khác
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </>
      )}

      {/* Empty state after search */}
      {!isSearching && recommendations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles className="w-12 h-12 text-[#333] mb-4" />
          <p className="text-sm text-[#555] font-['Space_Grotesk'] mb-1">Chưa có gợi ý</p>
          <p className="text-xs text-[#444] font-['Space_Grotesk']">
            Hãy phân tích trang phục trước để nhận gợi ý phối đồ
          </p>
        </div>
      )}
    </motion.div>
  );
}
