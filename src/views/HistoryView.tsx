import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Upload, Star, ChevronRight, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function HistoryView() {
  const { history, setView, setUploadedImage } = useAppStore();

  const handleReanalyze = (image: string) => {
    fetch(image)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], 'reanalyze.jpg', { type: 'image/jpeg' });
        setUploadedImage(image, file);
        setView('analyze');
      })
      .catch(() => {
        // For data URLs (from file reader), set directly
        setUploadedImage(image, new File([], 'reanalyze.jpg'));
        setView('analyze');
      });
  };

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-xl mx-auto flex flex-col items-center justify-center text-center py-24"
      >
        <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-[#333]" />
        </div>
        <h3 className="text-xl font-light text-white font-['Cormorant_Garamond'] mb-2">
          No analyses yet
        </h3>
        <p className="text-sm text-[#555] font-['Space_Grotesk'] font-light mb-6 leading-relaxed">
          Your outfit analysis history will appear here. Start by uploading your first outfit!
        </p>
        <button
          onClick={() => setView('analyze')}
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-black px-6 py-3 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all"
        >
          <Upload className="w-4 h-4" />
          Analyze First Outfit
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-white font-['Cormorant_Garamond']">
            Style History
          </h2>
          <p className="text-xs text-[#555] font-['Space_Grotesk'] mt-1">
            {history.length} outfit{history.length !== 1 ? 's' : ''} analyzed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={`${item.date.getTime()}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-[#111] border border-[#222] hover:border-[#C9A84C]/20 rounded-2xl overflow-hidden transition-all duration-300 group"
            >
              <div className="flex gap-5 p-5">
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#0d0d0d]">
                  <img
                    src={item.image}
                    alt="Outfit"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-light text-white font-['Cormorant_Garamond']">
                        {item.analysis.style}
                      </h3>
                      <p className="text-xs text-[#666] font-['Space_Grotesk']">
                        {item.analysis.vibe}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-[#C9A84C]" fill="#C9A84C" />
                      <span className="text-sm text-[#C9A84C] font-['Cormorant_Garamond']">
                        {item.analysis.styleScore}
                      </span>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-1.5 mb-3">
                    {item.analysis.dominantColors.map((c) => (
                      <div
                        key={c.hex}
                        className="w-5 h-5 rounded-full border border-white/10"
                        style={{ backgroundColor: c.hex }}
                        title={c.color}
                      />
                    ))}
                  </div>

                  {/* Occasions */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.analysis.occasion.slice(0, 3).map((occ) => (
                      <span
                        key={occ}
                        className="text-[10px] text-[#555] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-full font-['Space_Grotesk'] capitalize"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>

                  {/* Date & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#444]">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-['Space_Grotesk']">
                        {item.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReanalyze(item.image)}
                      className="flex items-center gap-1.5 text-[10px] text-[#555] hover:text-[#C9A84C] font-['Space_Grotesk'] transition-colors group/btn"
                    >
                      Re-analyze
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-[#1a1a1a] px-5 py-3">
                <p className="text-xs text-[#555] font-['Space_Grotesk'] font-light leading-relaxed line-clamp-2">
                  {item.analysis.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
