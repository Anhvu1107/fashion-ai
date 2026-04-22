import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Plus,
  X,
  Sparkles,
  Loader2,
  Star,
  Trophy,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ImageIcon,
  Palette,
  Briefcase,
  Heart,
  PartyPopper,
  Coffee,
  Users,
  Shirt,
  PenLine,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const OCCASION_PRESETS = [
  { label: 'Hẹn hò', icon: Heart },
  { label: 'Đi làm', icon: Briefcase },
  { label: 'Dự tiệc', icon: PartyPopper },
  { label: 'Đi chơi', icon: Coffee },
  { label: 'Meeting', icon: Users },
  { label: 'Dạo phố', icon: Shirt },
];

export default function CompareView() {
  const {
    compareImages,
    compareOccasion,
    comparisonResult,
    isComparing,
    addCompareImage,
    removeCompareImage,
    setCompareOccasion,
    runComparison,
    clearComparison,
  } = useAppStore();

  const [customOccasion, setCustomOccasion] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (compareImages.length >= 4) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          addCompareImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    },
    [addCompareImage, compareImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 4,
    disabled: isComparing,
  });

  const loadSampleImage = async (src: string) => {
    if (compareImages.length >= 4 || isComparing) return;
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        addCompareImage(e.target?.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample:', err);
    }
  };

  const selectPresetOccasion = (label: string) => {
    if (compareOccasion === label) {
      setCompareOccasion('');
    } else {
      setCompareOccasion(label);
      setShowCustomInput(false);
      setCustomOccasion('');
    }
  };

  const submitCustomOccasion = () => {
    const trimmed = customOccasion.trim();
    if (trimmed) {
      setCompareOccasion(trimmed);
      setShowCustomInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-12"
    >
      {/* Upload Area */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-light text-white font-['Cormorant_Garamond']">
              So sánh trang phục
            </h2>
            <p className="text-xs text-[#555] font-['Space_Grotesk'] mt-1">
              Upload 2-4 bộ trang phục để AI so sánh và gợi ý
            </p>
          </div>
          <div className="flex items-center gap-2">
            {compareImages.length === 0 && (
              <button
                onClick={() => {
                  loadSampleImage('/images/mock-outfit-1.jpg');
                  setTimeout(() => loadSampleImage('/images/mock-outfit-2.jpg'), 300);
                  setTimeout(() => loadSampleImage('/images/mock-outfit-3.jpg'), 600);
                }}
                className="text-[10px] text-[#C9A84C] hover:text-[#b8943d] font-['Space_Grotesk'] border border-[#C9A84C]/30 hover:border-[#C9A84C]/60 px-3 py-1.5 rounded-lg transition-all"
              >
                Dùng ảnh mẫu
              </button>
            )}
            {compareImages.length > 0 && (
              <button
                onClick={clearComparison}
                disabled={isComparing}
                className="text-xs text-[#555] hover:text-red-400 font-['Space_Grotesk'] border border-[#222] hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {compareImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-[#222] group"
            >
              <img
                src={img.image}
                alt={`Outfit ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />

              {/* Outfit label */}
              <div className="absolute top-2 left-2">
                <span className="text-[10px] bg-[#C9A84C] text-black font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full">
                  Outfit {i + 1}
                </span>
              </div>

              {/* Winner badge */}
              {comparisonResult && comparisonResult.overallWinner === i + 1 && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 bg-[#C9A84C] text-black text-[9px] font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full">
                    <Trophy className="w-2.5 h-2.5" />
                    Winner
                  </div>
                </div>
              )}

              {/* Score overlay */}
              {comparisonResult && comparisonResult.outfits[i] && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-white font-['Space_Grotesk']">
                      {comparisonResult.outfits[i].style}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#C9A84C]" fill="#C9A84C" />
                      <span className="text-sm text-[#C9A84C] font-['Cormorant_Garamond'] font-medium">
                        {comparisonResult.outfits[i].styleScore}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeCompareImage(img.id)}
                disabled={isComparing}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                style={{ display: comparisonResult?.overallWinner === i + 1 ? 'none' : undefined }}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}

          {/* Add more slot */}
          {compareImages.length < 4 && (
            <div
              {...getRootProps()}
              className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                  : 'border-[#333] bg-[#111] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center mb-3">
                {isDragActive ? (
                  <ImageIcon className="w-6 h-6 text-[#C9A84C]" />
                ) : (
                  <Plus className="w-6 h-6 text-[#555]" />
                )}
              </div>
              <p className="text-xs text-[#555] font-['Space_Grotesk'] text-center px-2">
                {isDragActive ? 'Thả ảnh vào đây' : `Thêm outfit (${compareImages.length}/4)`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Occasion Selector */}
      {compareImages.length >= 2 && !comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border border-[#222] rounded-2xl p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#C9A84C]" />
            <h3 className="text-sm text-white font-['Space_Grotesk'] font-medium">
              Bạn muốn mặc cho dịp gì?
            </h3>
            <span className="text-[10px] text-[#555] font-['Space_Grotesk']">(không bắt buộc)</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {OCCASION_PRESETS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => selectPresetOccasion(label)}
                disabled={isComparing}
                className={`flex items-center gap-1.5 text-xs font-['Space_Grotesk'] px-3 py-2 rounded-xl border transition-all duration-200 ${
                  compareOccasion === label
                    ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]'
                    : 'bg-[#1a1a1a] border-[#222] text-[#888] hover:border-[#C9A84C]/30 hover:text-white'
                } disabled:opacity-50`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                setShowCustomInput(!showCustomInput);
                if (showCustomInput) setCustomOccasion('');
              }}
              disabled={isComparing}
              className={`flex items-center gap-1.5 text-xs font-['Space_Grotesk'] px-3 py-2 rounded-xl border transition-all duration-200 ${
                showCustomInput || (compareOccasion && !OCCASION_PRESETS.find(p => p.label === compareOccasion))
                  ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]'
                  : 'bg-[#1a1a1a] border-[#222] text-[#888] hover:border-[#C9A84C]/30 hover:text-white'
              } disabled:opacity-50`}
            >
              <PenLine className="w-3.5 h-3.5" />
              Khác...
            </button>
          </div>

          {/* Custom input */}
          <AnimatePresence>
            {showCustomInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customOccasion}
                    onChange={(e) => setCustomOccasion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitCustomOccasion()}
                    placeholder="Ví dụ: Đám cưới bạn thân, Café cuối tuần..."
                    className="flex-1 bg-[#1a1a1a] border border-[#333] focus:border-[#C9A84C]/50 text-white text-xs font-['Space_Grotesk'] px-4 py-2.5 rounded-xl outline-none transition-colors placeholder:text-[#444]"
                  />
                  <button
                    onClick={submitCustomOccasion}
                    disabled={!customOccasion.trim()}
                    className="bg-[#C9A84C] hover:bg-[#b8943d] disabled:opacity-40 text-black text-xs font-['Space_Grotesk'] font-medium px-4 py-2.5 rounded-xl transition-all"
                  >
                    OK
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected occasion display */}
          {compareOccasion && !showCustomInput && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              <p className="text-xs text-[#C9A84C] font-['Space_Grotesk']">
                AI sẽ ưu tiên chọn outfit phù hợp nhất cho: <span className="font-medium">{compareOccasion}</span>
              </p>
              <button onClick={() => setCompareOccasion('')} className="text-[#555] hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Compare Button */}
      {compareImages.length >= 2 && !comparisonResult && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={runComparison}
          disabled={isComparing}
          className="w-full flex items-center justify-center gap-3 bg-[#C9A84C] hover:bg-[#b8943d] disabled:opacity-60 text-black px-6 py-4 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 mb-8"
        >
          {isComparing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang so sánh {compareImages.length} bộ trang phục{compareOccasion ? ` cho "${compareOccasion}"` : ''}...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              So sánh {compareImages.length} bộ trang phục{compareOccasion ? ` cho "${compareOccasion}"` : ''}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      )}

      {/* Results */}
      <AnimatePresence>
        {comparisonResult && comparisonResult.outfits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Per-outfit details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisonResult.outfits.map((outfit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-[#111] border rounded-2xl p-5 ${
                    comparisonResult.overallWinner === outfit.index
                      ? 'border-[#C9A84C]/50 shadow-lg shadow-[#C9A84C]/10'
                      : 'border-[#222]'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full">
                          Outfit {outfit.index}
                        </span>
                        {comparisonResult.overallWinner === outfit.index && (
                          <span className="text-[10px] bg-[#C9A84C] text-black font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Trophy className="w-2.5 h-2.5" /> Chiến thắng
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-light text-white font-['Cormorant_Garamond']">
                        {outfit.style}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#C9A84C]" fill="#C9A84C" />
                      <span className="text-2xl font-light text-[#C9A84C] font-['Cormorant_Garamond']">
                        {outfit.styleScore}
                      </span>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-2 mb-3">
                    {outfit.dominantColors?.slice(0, 4).map((c, ci) => (
                      <div key={ci} className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full border border-white/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[10px] text-[#666] font-['Space_Grotesk']">{c.color}</span>
                      </div>
                    ))}
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {outfit.items?.map((item, ii) => (
                      <span
                        key={ii}
                        className="text-[10px] text-[#888] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-full font-['Space_Grotesk']"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#888] font-['Space_Grotesk'] font-light leading-relaxed">{outfit.strengths}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ThumbsDown className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#888] font-['Space_Grotesk'] font-light leading-relaxed">{outfit.weaknesses}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Best for occasions */}
            {comparisonResult.bestForOccasions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#111] border border-[#222] rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#C9A84C]" />
                  <h3 className="text-xs text-[#888] font-['Space_Grotesk'] tracking-wide uppercase">
                    Nên mặc bộ nào cho dịp nào?
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {comparisonResult.bestForOccasions.map((occ, i) => (
                    <div
                      key={i}
                      className="bg-[#1a1a1a] border border-[#222] rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-['Space_Grotesk'] font-medium">
                          {occ.occasion}
                        </span>
                        <span className="text-[9px] bg-[#C9A84C]/20 text-[#C9A84C] font-['Space_Grotesk'] font-bold px-2 py-0.5 rounded-full">
                          Outfit {occ.outfitIndex}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666] font-['Space_Grotesk'] font-light leading-relaxed">
                        {occ.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Overall Verdict */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#C9A84C]/10 to-[#8B6914]/5 border border-[#C9A84C]/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <h3 className="text-xs text-[#C9A84C] font-['Space_Grotesk'] tracking-wide uppercase">
                  Nhận xét tổng thể từ AI
                </h3>
              </div>
              <p className="text-sm text-[#888] font-['Space_Grotesk'] font-light leading-relaxed mb-3">
                {comparisonResult.verdict}
              </p>
              {comparisonResult.winnerReason && (
                <div className="flex items-start gap-2 pt-3 border-t border-[#C9A84C]/10">
                  <Trophy className="w-4 h-4 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#C9A84C] font-['Space_Grotesk'] font-light leading-relaxed">
                    <span className="font-medium">Bộ thắng: Outfit {comparisonResult.overallWinner}</span> — {comparisonResult.winnerReason}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Compare again */}
            <div className="text-center">
              <button
                onClick={clearComparison}
                className="text-xs text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] border border-[#222] hover:border-[#C9A84C]/30 px-5 py-2.5 rounded-xl transition-all"
              >
                So sánh bộ khác
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verdict error state */}
      {comparisonResult && comparisonResult.outfits.length === 0 && (
        <div className="bg-[#111] border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-sm text-red-400 font-['Space_Grotesk']">{comparisonResult.verdict}</p>
          <button
            onClick={clearComparison}
            className="mt-4 text-xs text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] border border-[#222] px-4 py-2 rounded-lg transition-all"
          >
            Thử lại
          </button>
        </div>
      )}
    </motion.div>
  );
}
