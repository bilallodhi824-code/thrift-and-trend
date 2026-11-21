import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ShieldCheck, Tag, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/currency';

export const Hero: React.FC = () => {
  const { shoes, setActiveShoeModal, setSelectedCategory } = useShop();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const spotlightList = [
    shoes.find(s => s.id === 'atelier-classic-01') || shoes[1],
    shoes.find(s => s.id === 'apex-derby') || shoes[0],
    shoes.find(s => s.id === 'monolith-chelsea') || shoes[2],
    shoes.find(s => s.id === 'aero-velocity-86') || shoes[3],
  ].filter(Boolean);

  const activeShoe = spotlightList[featuredIndex] || shoes[0];

  const scrollToCatalog = (cat?: 'lifestyle' | 'running' | 'boots' | 'formal' | 'trail') => {
    if (cat) setSelectedCategory(cat);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F0E6] via-[#FAF7EE] to-[#FAF7EE] pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-[#E5DDD0]">
      
      {/* Ambient Lighting Glows */}
      <motion.div
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-[#C59B6D]/20 rounded-full blur-[100px] pointer-events-none"
      />
      <div className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-[#2B1A11]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-xs border border-[#C59B6D]/60 rounded-full px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#2B1A11] uppercase shadow-2xs w-fit">
            <span className="w-2 h-2 rounded-full bg-[#264E36] animate-pulse"></span>
            <span>Hand-Inspected Footwear • Verified Condition</span>
          </div>

          <div className="flex items-center space-x-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-stone-600 uppercase">
            <span className="hidden md:inline">100% Quality Inspected</span>
            <span className="hidden md:inline">•</span>
            <span className="text-[#2B1A11] font-bold flex items-center">
              <Star className="w-3.5 h-3.5 fill-[#C59B6D] text-[#C59B6D] mr-1 flex-shrink-0" />
              Over 2,400+ Footwear Lovers Across Pakistan
            </span>
          </div>
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Bold Typography & Mission */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#A67C52] uppercase">
                <Tag className="w-3.5 h-3.5 flex-shrink-0 text-[#C59B6D]" />
                <span>CURATED SNEAKERS • CASUALS • FORMALS</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#2B1A11] uppercase leading-[0.95] sm:leading-[0.92]">
                Where Style
                <span className="block text-[#A67C52] mt-1">
                  Meets Savings.
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-base text-stone-700 max-w-xl font-normal leading-relaxed"
            >
              Why pay inflated boutique retail prices? We curate authentic sneakers, timeless formal classics, and all-weather boots at up to <strong className="text-[#2B1A11] font-bold">60% below market value</strong>. Every pair is thoroughly checked for upper condition, sole wear, and stitch integrity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToCatalog()}
                className="inline-flex items-center justify-center space-x-2.5 bg-[#2B1A11] text-[#FAF7EE] hover:bg-[#3D2517] px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer group"
              >
                <span>Explore Collection</span>
                <ArrowDownRight className="w-4 h-4 text-[#C59B6D] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveShoeModal(activeShoe)}
                className="inline-flex items-center justify-center space-x-2 bg-white text-[#2B1A11] border border-[#C59B6D]/80 hover:border-[#2B1A11] px-5 sm:px-6 py-3.5 sm:py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>View Featured Grail</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C59B6D]" />
              </motion.button>
            </motion.div>

            {/* Quick Filter Shortcuts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 sm:pt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs"
            >
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1 font-semibold">
                Jump To:
              </span>
              <button
                onClick={() => scrollToCatalog('formal')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E5DDD0] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors cursor-pointer"
              >
                Formal & Loafers
              </button>
              <button
                onClick={() => scrollToCatalog('lifestyle')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E5DDD0] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors cursor-pointer"
              >
                Streetwear (From Rs. 1,650)
              </button>
              <button
                onClick={() => scrollToCatalog('running')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E5DDD0] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors cursor-pointer"
              >
                Performance Runners
              </button>
              <button
                onClick={() => scrollToCatalog('boots')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E5DDD0] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors cursor-pointer"
              >
                Chelsea & Boots
              </button>
            </motion.div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-5 sm:pt-6 border-t border-[#E5DDD0] text-[#2B1A11]">
              <div className="flex items-center sm:items-start space-x-2.5 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-[#E5DDD0] sm:border-0">
                <ShieldCheck className="w-4 h-4 text-[#264E36] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    Legit Quality
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono">100% Condition Inspected</div>
                </div>
              </div>

              <div className="flex items-center sm:items-start space-x-2.5 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-[#E5DDD0] sm:border-0">
                <Tag className="w-4 h-4 text-[#C59B6D] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    Direct Savings
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono">Up to 60% below retail</div>
                </div>
              </div>

              <div className="flex items-center sm:items-start space-x-2.5 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-[#E5DDD0] sm:border-0">
                <Sparkles className="w-4 h-4 text-[#B8864E] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    Fast COD Dispatch
                  </div>
                  <div className="text-[10px] text-stone-600 font-mono">Free delivery on Rs. 3,500+</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Spotlight Card with Framer Motion */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white rounded-3xl p-4 sm:p-7 border border-[#E5DDD0] shadow-xl overflow-hidden group"
            >
              {/* Badge Header on Spotlight Card */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#264E36] text-white px-2.5 sm:px-3 py-1 rounded-full font-bold shadow-xs">
                    {activeShoe.condition}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase bg-[#FAF7EE] text-[#A67C52] border border-[#C59B6D]/60 px-2 py-0.5 rounded-full font-bold">
                    {activeShoe.badge}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-base sm:text-lg font-bold text-[#2B1A11] font-display">
                    {formatPrice(activeShoe.price)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-stone-400 font-mono line-through">
                    Retail: {formatPrice(activeShoe.originalPrice)}
                  </div>
                </div>
              </div>

              {/* Product Visual Container with AnimatePresence */}
              <div
                onClick={() => setActiveShoeModal(activeShoe)}
                className="relative aspect-4/3 overflow-hidden rounded-2xl bg-[#F8F5EC] cursor-pointer flex items-center justify-center p-4 sm:p-6 border border-[#E8E2D5] shadow-inner"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeShoe.id}
                    src={activeShoe.images[0]}
                    alt={activeShoe.name}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-contain object-center transition-all duration-500 ease-out group-hover:scale-106 filter drop-shadow-sm"
                  />
                </AnimatePresence>

                {/* Savings Pill Overlay */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#A67C52] text-white text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                  SAVE {formatPrice(activeShoe.originalPrice - activeShoe.price)}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#2B1A11]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/95 text-[#2B1A11] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3.5 sm:px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center space-x-1.5 border border-[#C59B6D]">
                    <span>Inspect Pair Details</span>
                    <span>→</span>
                  </span>
                </div>
              </div>

              {/* Product Summary & Switcher below image */}
              <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2B1A11] font-display">
                    {activeShoe.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-600 font-normal line-clamp-1">
                    {activeShoe.subtitle}
                  </p>
                </div>

                {/* Carousel switcher dots with Framer Motion layout */}
                <div className="flex items-center space-x-1.5 bg-[#FAF7EE] p-1 rounded-full border border-[#E5DDD0] flex-shrink-0">
                  {spotlightList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setFeaturedIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                        idx === featuredIndex
                          ? 'bg-[#2B1A11] w-5'
                          : 'bg-[#C59B6D]/40 hover:bg-[#C59B6D] w-2'
                      }`}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
