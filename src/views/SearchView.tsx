import { useEffect, useState } from 'react';
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
  X,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { ProductAlternative, ProductAlternativeTier, Recommendation } from '../data/mockProducts';
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

const ALTERNATIVE_TABS: { id: ProductAlternativeTier | 'all'; labelVi: string; labelEn: string }[] = [
  { id: 'all', labelVi: 'Tất cả', labelEn: 'All' },
  { id: 'budget', labelVi: 'Rẻ nhất', labelEn: 'Budget' },
  { id: 'lower', labelVi: 'Rẻ hơn', labelEn: 'Lower' },
  { id: 'mid', labelVi: 'Đáng tiền', labelEn: 'Best value' },
  { id: 'premium', labelVi: 'Cao cấp', labelEn: 'Premium' },
  { id: 'same-vibe', labelVi: 'Cùng vibe', labelEn: 'Same vibe' },
];

const TIER_LABELS: Record<ProductAlternativeTier, { vi: string; en: string }> = {
  budget: { vi: 'Rẻ nhất', en: 'Budget' },
  lower: { vi: 'Rẻ hơn', en: 'Lower' },
  mid: { vi: 'Đáng tiền', en: 'Best value' },
  premium: { vi: 'Cao cấp', en: 'Premium' },
  'same-vibe': { vi: 'Cùng vibe', en: 'Same vibe' },
};

function getRecommendationKey(rec: Pick<Recommendation, 'name' | 'brand'>) {
  return `${rec.name}::${rec.brand}`.toLowerCase();
}

function RecommendationCard({
  rec,
  index,
  onOpenAlternatives,
  language,
}: {
  rec: Recommendation;
  index: number;
  onOpenAlternatives: (rec: Recommendation) => void;
  language: 'en' | 'vi';
}) {
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAlternatives(rec)}
            className="text-[10px] text-[#777] hover:text-[#C9A84C] font-['Space_Grotesk'] transition-colors"
          >
            {language === 'vi' ? 'Lựa chọn khác' : 'Other options'}
          </button>
          <a
            href={rec.productUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[10px] text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] transition-colors"
          >
            {language === 'vi' ? 'Tìm mua' : 'Shop'}
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function AlternativesModal({
  rec,
  alternatives,
  isLoading,
  onClose,
  language,
}: {
  rec: Recommendation;
  alternatives: ProductAlternative[];
  isLoading: boolean;
  onClose: () => void;
  language: 'en' | 'vi';
}) {
  const [activeTab, setActiveTab] = useState<ProductAlternativeTier | 'all'>('all');
  const visibleAlternatives =
    activeTab === 'all' ? alternatives : alternatives.filter((alt) => alt.tier === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="w-full max-w-3xl max-h-[86vh] overflow-hidden rounded-2xl border border-[#222] bg-[#0d0d0d] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-[#222]">
          <div>
            <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.15em] uppercase mb-1">
              {language === 'vi' ? 'Lựa chọn thay thế' : 'Alternative options'}
            </p>
            <h3 className="text-xl text-white font-['Cormorant_Garamond'] font-light">{rec.name}</h3>
            <p className="text-xs text-[#666] font-['Space_Grotesk'] mt-1">
              {rec.brand} · {rec.priceRange}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-[#222] text-[#777] hover:text-white hover:border-[#C9A84C]/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(86vh-96px)]">
          <div className="mb-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs text-[#C9A84C] font-['Space_Grotesk'] uppercase tracking-[0.1em]">
                {language === 'vi' ? 'Món gốc / reference' : 'Original reference'}
              </p>
              <a
                href={rec.productUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[10px] text-[#C9A84C] hover:text-white font-['Space_Grotesk'] transition-colors"
              >
                {language === 'vi' ? 'Tìm món gốc' : 'Find original'}
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-white font-['Space_Grotesk']">{rec.brand} · {rec.name}</p>
            <p className="text-xs text-[#888] font-['Space_Grotesk'] mt-2 leading-relaxed">{rec.reason}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {ALTERNATIVE_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-8 px-3 rounded-lg border text-xs font-['Space_Grotesk'] transition-all ${
                    active
                      ? 'border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]'
                      : 'border-[#222] bg-[#111] text-[#666] hover:border-[#C9A84C]/40 hover:text-[#C9A84C]'
                  }`}
                >
                  {language === 'vi' ? tab.labelVi : tab.labelEn}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin mb-3" />
              <p className="text-sm text-[#777] font-['Space_Grotesk']">
                {language === 'vi' ? 'Đang tìm brand thay thế...' : 'Finding alternative brands...'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAlternatives.map((alt, index) => (
                <div key={`${alt.name}-${index}`} className="rounded-xl border border-[#222] bg-[#111] p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm text-white font-['Space_Grotesk'] font-medium">{alt.name}</p>
                      <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.1em] uppercase mt-1">
                        {alt.brand} · {TIER_LABELS[alt.tier]?.[language] || alt.tier}
                      </p>
                    </div>
                    <p className="text-sm text-white font-['Cormorant_Garamond'] flex-shrink-0">{alt.priceRange}</p>
                  </div>
                  <p className="text-xs text-[#888] font-['Space_Grotesk'] leading-relaxed mb-2">{alt.reason}</p>
                  <p className="text-[11px] text-[#666] font-['Space_Grotesk'] leading-relaxed mb-3">
                    {language === 'vi' ? 'Đánh đổi: ' : 'Trade-off: '}
                    {alt.tradeoff}
                  </p>
                  <a
                    href={alt.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-[#C9A84C] hover:text-white font-['Space_Grotesk'] transition-colors"
                  >
                    {language === 'vi' ? 'Tìm mua lựa chọn này' : 'Find this option'}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              ))}
              {visibleAlternatives.length === 0 && (
                <div className="rounded-xl border border-[#222] bg-[#111] p-6 text-center">
                  <p className="text-sm text-[#666] font-['Space_Grotesk']">
                    {language === 'vi' ? 'Chưa có lựa chọn trong nhóm này.' : 'No options in this group yet.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SearchView() {
  const {
    uploadedImage,
    recommendations,
    isSearching,
    recommendationAlternatives,
    loadingAlternativesFor,
    runVisualSearch,
    loadRecommendationAlternatives,
    setView,
    language,
  } = useAppStore();
  const { t } = useTranslation();
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (uploadedImage && recommendations.length === 0 && !isSearching) {
      runVisualSearch();
    }
  }, [uploadedImage]);

  const openAlternatives = (rec: Recommendation) => {
    setSelectedRecommendation(rec);
    loadRecommendationAlternatives(rec);
  };
  const selectedKey = selectedRecommendation ? getRecommendationKey(selectedRecommendation) : '';
  const selectedAlternatives = selectedKey ? recommendationAlternatives[selectedKey] || [] : [];
  const isLoadingSelected = Boolean(selectedKey && loadingAlternativesFor === selectedKey);

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
              <RecommendationCard
                key={`${rec.name}-${i}`}
                rec={rec}
                index={i}
                onOpenAlternatives={openAlternatives}
                language={language}
              />
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

      <AnimatePresence>
        {selectedRecommendation && (
          <AlternativesModal
            rec={selectedRecommendation}
            alternatives={selectedAlternatives}
            isLoading={isLoadingSelected}
            onClose={() => setSelectedRecommendation(null)}
            language={language}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
