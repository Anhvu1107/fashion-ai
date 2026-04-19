import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Loader2, ShoppingBag, ExternalLink, Star, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Product } from '../data/mockProducts';
import { useTranslation } from '../hooks/useTranslation';

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { t } = useTranslation();
  const images = [
    '/images/mock-outfit-1.jpg',
    '/images/mock-outfit-2.jpg',
    '/images/mock-outfit-3.jpg',
    '/images/mock-outfit-4.jpg',
    '/images/mock-outfit-5.jpg',
    '/images/mock-outfit-6.jpg',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-[#111] border border-[#222] hover:border-[#C9A84C]/30 rounded-2xl overflow-hidden transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d0d]">
        <img
          src={images[index % images.length]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />

        {/* Similarity Badge */}
        {product.similarity && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#C9A84C]/30 rounded-full px-2.5 py-1">
              <Zap className="w-3 h-3 text-[#C9A84C]" fill="#C9A84C" />
              <span className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] font-medium">
                {product.similarity}% {t('search_match')}
              </span>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[9px] text-[#888] bg-black/60 backdrop-blur-sm border border-[#333] rounded-full px-2 py-1 font-['Space_Grotesk'] uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#C9A84C] text-black text-xs py-2 rounded-xl font-['Space_Grotesk'] font-medium">
            <ShoppingBag className="w-3 h-3" />
            Shop Now
          </button>
          <button className="w-9 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white rounded-xl border border-white/10">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.15em] uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="text-sm text-white font-['Space_Grotesk'] font-medium mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Colors */}
        <div className="flex gap-1.5 mb-3">
          {product.color.slice(0, 3).map((c) => (
            <span key={c} className="text-[10px] text-[#555] bg-[#1a1a1a] border border-[#222] px-2 py-0.5 rounded-full font-['Space_Grotesk'] capitalize">
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-base font-light text-white font-['Cormorant_Garamond']">
            ${product.price.toLocaleString()}
            <span className="text-[10px] text-[#444] ml-1 font-['Space_Grotesk']">{product.currency}</span>
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#C9A84C]" fill="#C9A84C" />
            <span className="text-xs text-[#666] font-['Space_Grotesk']">4.{Math.floor(Math.random() * 3) + 7}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SearchView() {
  const { uploadedImage, searchResults, isSearching, runVisualSearch, setView } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (uploadedImage && searchResults.length === 0 && !isSearching) {
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
          <Search className="w-10 h-10 text-[#333]" />
        </div>
        <h3 className="text-xl font-light text-white font-['Cormorant_Garamond'] mb-2">
          {t('search_empty')}
        </h3>
        <p className="text-sm text-[#555] font-['Space_Grotesk'] font-light mb-6 leading-relaxed">
          Upload an outfit first, then AURA will use CLIP embeddings to find visually similar items from our catalog of 50,000+ fashion pieces.
        </p>
        <button
          onClick={() => setView('analyze')}
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8943d] text-black px-6 py-3 rounded-xl font-['Space_Grotesk'] font-medium text-sm transition-all"
        >
          <Upload className="w-4 h-4" />
          Upload Outfit First
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
          <img src={uploadedImage} alt="Query" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            <p className="text-[10px] text-[#C9A84C] font-['Space_Grotesk'] tracking-[0.15em] uppercase">
              Visual Search Active
            </p>
          </div>
          <h2 className="text-2xl font-light text-white font-['Cormorant_Garamond']">
            {t('search_results')}
          </h2>
          <p className="text-xs text-[#555] font-['Space_Grotesk'] mt-1">
            CLIP embeddings · ChromaDB vector search · Cosine similarity ranking
          </p>
        </div>
        {!isSearching && searchResults.length > 0 && (
          <button
            onClick={runVisualSearch}
            className="ml-auto flex items-center gap-2 text-xs text-[#666] hover:text-[#C9A84C] font-['Space_Grotesk'] border border-[#222] hover:border-[#C9A84C]/30 px-4 py-2 rounded-xl transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            Refresh
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
                <Search className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <Loader2 className="absolute inset-0 w-16 h-16 text-[#C9A84C]/40 animate-spin" />
            </div>
            <p className="text-sm text-[#888] font-['Space_Grotesk']">Generating CLIP embeddings...</p>
            <p className="text-xs text-[#444] font-['Space_Grotesk'] mt-1">Searching 50K+ fashion items</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      {!isSearching && searchResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[#666] font-['Space_Grotesk']">
              Found <span className="text-[#C9A84C]">{searchResults.length}</span> similar items
            </p>
            <div className="flex gap-2">
              {['All', 'Tops', 'Bottoms', 'Dress', 'Outerwear'].map((filter) => (
                <button
                  key={filter}
                  className={`text-[10px] px-3 py-1 rounded-full font-['Space_Grotesk'] transition-all ${
                    filter === 'All'
                      ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]'
                      : 'bg-[#111] border border-[#222] text-[#555] hover:border-[#333]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {searchResults.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
