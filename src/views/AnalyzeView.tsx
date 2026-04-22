import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  ImageIcon,
  Sparkles,
  X,
  ChevronRight,
  Loader2,
  Star,
  Palette,
  Tag,
  Calendar,
  Sun,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';

function ColorSwatch({ color, hex, percentage }: { color: string; hex: string; percentage: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#222]"
    >
      <div
        className="w-10 h-10 rounded-lg flex-shrink-0 shadow-lg"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white font-['Space_Grotesk'] font-medium truncate">{color}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-full rounded-full"
              style={{ backgroundColor: hex }}
            />
          </div>
          <span className="text-[10px] text-[#555] flex-shrink-0">{percentage}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyzingOverlay() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border-2 border-[#C9A84C]/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#C9A84C]" />
        </div>
        <svg className="absolute inset-0 w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r="38" fill="none" stroke="#C9A84C" strokeWidth="2"
            strokeDasharray="239" strokeDashoffset="60"
            className="animate-spin"
            style={{ animationDuration: '2s' }}
          />
        </svg>
      </div>
      <p className="text-white font-['Space_Grotesk'] text-sm mb-1">{t('analyze_analyzing')}</p>
      <p className="text-[#555] font-['Space_Grotesk'] text-xs">Gemini AI đang phân tích trang phục...</p>
      <div className="flex gap-1.5 mt-4">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AnalyzeView() {
  const {
    uploadedImage,
    isAnalyzing,
    analysisResult,
    setUploadedImage,
    runAnalysis,
    runVisualSearch,
    clearAnalysis,
    setView,
  } = useAppStore();
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string, file);
      };
      reader.readAsDataURL(file);
    },
    [setUploadedImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  const handleAnalyze = async () => {
    await runAnalysis();
    await runVisualSearch();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto pb-12"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Upload Panel */}
        <div className="space-y-4">
          <div className="relative">
            {/* Dropzone */}
            {!uploadedImage ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[400px] ${
                  isDragActive
                    ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                    : 'border-[#333] bg-[#111] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mb-4">
                  {isDragActive ? (
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                      <ImageIcon className="w-8 h-8 text-[#C9A84C]" />
                    </motion.div>
                  ) : (
                    <Upload className="w-8 h-8 text-[#555]" />
                  )}
                </div>
                <p className="text-white font-['Space_Grotesk'] text-sm mb-1">
                  {isDragActive ? t('analyze_drag_drop') : t('analyze_upload_title')}
                </p>
                <p className="text-[#555] font-['Space_Grotesk'] text-xs text-center">
                  {t('analyze_formats')}
                </p>
                <div className="mt-6 flex gap-2">
                  {['/images/mock-outfit-1.jpg', '/images/mock-outfit-2.jpg', '/images/mock-outfit-3.jpg'].map((src, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        fetch(src)
                          .then(r => r.blob())
                          .then(blob => {
                            const file = new File([blob], `sample-${i}.jpg`, { type: 'image/jpeg' });
                            const reader = new FileReader();
                            reader.onload = (ev) => setUploadedImage(ev.target?.result as string, file);
                            reader.readAsDataURL(file);
                          });
                      }}
                      className="text-[10px] text-[#555] hover:text-[#C9A84C] font-['Space_Grotesk'] underline underline-offset-2 transition-colors"
                    >
                      Sample {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-[#111] min-h-[400px]">
                <img
                  src={uploadedImage}
                  alt="Uploaded outfit"
                  className="w-full h-full object-cover max-h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
                <button
                  onClick={clearAnalysis}
                  disabled={isAnalyzing}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <AnimatePresence>{isAnalyzing && <AnalyzingOverlay />}</AnimatePresence>
              </div>
            )}
          </div>

          {/* Action Button */}
          {uploadedImage && !analysisResult && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-3 bg-[#C9A84C] hover:bg-[#b8943d] disabled:opacity-60 text-black px-6 py-4 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('analyze_analyzing')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('analyze_btn_start')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Right: Analysis Results */}
        <div className="space-y-4">
          <AnimatePresence>
            {analysisResult ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Style Header */}
                <div className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.2em] uppercase mb-1">
                        {t('analyze_title')}
                      </p>
                      <h3 className="text-2xl font-light text-white font-['Cormorant_Garamond']">
                        {analysisResult.style}
                      </h3>
                      <p className="text-sm text-[#888] font-['Space_Grotesk'] mt-1">
                        {analysisResult.vibe}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="w-3.5 h-3.5 text-[#C9A84C]" fill="#C9A84C" />
                        <span className="text-2xl font-light text-[#C9A84C] font-['Cormorant_Garamond']">
                          {analysisResult.styleScore}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#555] font-['Space_Grotesk']">{t('analyze_score')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#777] font-['Space_Grotesk'] font-light leading-relaxed">
                    {analysisResult.description}
                  </p>
                </div>

                {/* Color Palette */}
                <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-[#C9A84C]" />
                    <p className="text-xs text-[#888] font-['Space_Grotesk'] tracking-wide uppercase">
                      {t('analyze_color_palette')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {analysisResult.dominantColors.map((c) => (
                      <ColorSwatch key={c.hex} {...c} />
                    ))}
                  </div>
                </div>

                {/* Items & Tags */}
                <div className="bg-[#111] border border-[#222] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-[#C9A84C]" />
                    <p className="text-xs text-[#888] font-['Space_Grotesk'] tracking-wide uppercase">
                      {t('analyze_key_items')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs bg-[#1a1a1a] border border-[#333] text-[#aaa] px-3 py-1 rounded-full font-['Space_Grotesk']"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Occasions & Seasons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#C9A84C]" />
                      <p className="text-[10px] text-[#888] font-['Space_Grotesk'] tracking-wide uppercase">
                        {t('analyze_occasions')}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {analysisResult.occasion.map((occ) => (
                        <div key={occ} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                          <span className="text-xs text-[#777] font-['Space_Grotesk'] capitalize">{occ}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#111] border border-[#222] rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-4 h-4 text-[#C9A84C]" />
                      <p className="text-[10px] text-[#888] font-['Space_Grotesk'] tracking-wide uppercase">
                        Seasons
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {analysisResult.season.map((s) => (
                        <div key={s} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                          <span className="text-xs text-[#777] font-['Space_Grotesk']">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Styling Tips */}
                <div className="bg-gradient-to-br from-[#C9A84C]/10 to-[#8B6914]/5 border border-[#C9A84C]/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-[#C9A84C]" />
                    <p className="text-xs text-[#C9A84C] font-['Space_Grotesk'] tracking-wide uppercase">
                      {t('analyze_style_tips')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {analysisResult.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] font-medium mt-0.5 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-xs text-[#888] font-['Space_Grotesk'] font-light leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Find Similar CTA */}
                <button
                  onClick={() => setView('search')}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#C9A84C]/20 text-[#C9A84C] px-6 py-3.5 rounded-xl font-['Space_Grotesk'] text-sm transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Similar Products
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] bg-[#111] border border-dashed border-[#222] rounded-2xl flex flex-col items-center justify-center p-8 text-center"
              >
                <Sparkles className="w-12 h-12 text-[#333] mb-4" />
                <p className="text-[#555] font-['Space_Grotesk'] text-sm">
                  Upload an outfit to see
                </p>
                <p className="text-[#333] font-['Space_Grotesk'] text-sm">
                  AI style analysis results
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
