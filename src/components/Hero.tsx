import React, { useState } from 'react';
import { ArrowDownRight, ShieldCheck, Tag, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/currency';

export const Hero: React.FC = () => {
  const { shoes, setActiveShoeModal, setSelectedCategory } = useShop();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const spotlightList = [
    shoes.find(s => s.id === 'aero-velocity-86') || shoes[0],
    shoes.find(s => s.id === 'atelier-classic-01') || shoes[1],
    shoes.find(s => s.id === 'palermo-heritage-78') || shoes[2],
  ].filter(Boolean);

  const activeShoe = spotlightList[featuredIndex] || shoes[0];

  const scrollToCatalog = (cat?: 'lifestyle' | 'running' | 'boots' | 'formal') => {
    if (cat) setSelectedCategory(cat);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4EFE6] via-[#FAF7EE] to-[#FAF7EE] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E2D9CA]">
      
      {/* Warm Ambient Golden Lighting Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C59B6D]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#2B1A11]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#C59B6D]/70 rounded-full px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest text-[#2B1A11] uppercase shadow-xs w-fit">
            <span className="w-2 h-2 rounded-full bg-[#264E36] animate-pulse"></span>
            <span>Premium Footwear Collection • Verified Authenticity</span>
          </div>

          <div className="flex items-center space-x-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-stone-600 uppercase">
            <span className="hidden md:inline">100% Quality Checked</span>
            <span className="hidden md:inline">•</span>
            <span className="text-[#2B1A11] font-bold flex items-center">
              <Star className="w-3.5 h-3.5 fill-[#C59B6D] text-[#C59B6D] mr-1 flex-shrink-0" />
              Trusted Footwear Lovers in Pakistan
            </span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Bold Typography & Mission */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#C59B6D] uppercase">
                <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                <span>CURATED SNEAKERS • CASUALS • FORMALS</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tightest text-[#2B1A11] uppercase leading-[0.95] sm:leading-[0.92]">
                Where Style
                <span className="block text-[#C59B6D]">
                  Meets Savings.
                </span>
              </h1>
            </div>

            <p className="text-xs sm:text-base text-stone-700 max-w-xl font-normal leading-relaxed">
              Why pay inflated retail prices? We curate authentic sneakers, timeless classics, and premium formal footwear at up to <strong className="text-[#2B1A11] font-bold">60% below retail</strong>. Every pair is thoroughly inspected for condition, quality, and craftsmanship.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 sm:pt-2">
              <button
                onClick={() => scrollToCatalog()}
                className="inline-flex items-center justify-center space-x-2.5 bg-[#2B1A11] text-[#FAF7EE] hover:bg-[#3D2517] px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 group"
              >
                <span>Explore Footwear</span>
                <ArrowDownRight className="w-4 h-4 text-[#C59B6D] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveShoeModal(activeShoe)}
                className="inline-flex items-center justify-center space-x-2 bg-white text-[#2B1A11] border border-[#C59B6D] hover:border-[#2B1A11] px-5 sm:px-6 py-3.5 sm:py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-xs hover:shadow-md"
              >
                <span>View Featured Pair</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C59B6D]" />
              </button>
            </div>

            {/* Quick Filter Shortcuts */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1 font-semibold">
                Categories:
              </span>
              <button
                onClick={() => scrollToCatalog('lifestyle')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E2D9CA] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors"
              >
                Court & Streetwear (From Rs. 1,650)
              </button>
              <button
                onClick={() => scrollToCatalog('running')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E2D9CA] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors"
              >
                Performance Runners (Save Rs. 3,000+)
              </button>
              <button
                onClick={() => scrollToCatalog('boots')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E2D9CA] hover:border-[#2B1A11] px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#2B1A11] transition-colors"
              >
                Suede Chelsea Boots (Save Rs. 4,400+)
              </button>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-5 sm:pt-6 border-t border-[#E2D9CA] text-[#2B1A11]">
              <div className="flex items-center sm:items-start space-x-2.5 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-[#E2D9CA] sm:border-0">
                <ShieldCheck className="w-4 h-4 text-[#264E36] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    Quality Checked
                  </div>
                  <div className="text-[10px] text-stone-600">Guaranteed 100% Authentic</div>
                </div>
              </div>

              <div className="flex items-center sm:items-start space-x-2.5 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-[#E2D9CA] sm:border-0">
                <Tag className="w-4 h-4 text-[#C59B6D] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    Direct Savings
                  </div>
                  <div className="text-[10px] text-stone-600">Up to 60% below retail</div>
                </div>
              </div>

              <div className="flex items-center sm:items-start space-x-2.5 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-[#E2D9CA] sm:border-0">
                <Sparkles className="w-4 h-4 text-[#B8864E] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    Fast Dispatch
                  </div>
                  <div className="text-[10px] text-stone-600">Free delivery on Rs. 3,500+</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-4 sm:p-7 border-2 border-[#E2D9CA] shadow-2xl overflow-hidden group">
              
              {/* Badge Header on Spotlight Card */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#264E36] text-white px-2.5 sm:px-3 py-1 rounded-full font-extrabold shadow-xs">
                    {activeShoe.condition}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase bg-[#FAF7EE] text-[#C59B6D] border border-[#C59B6D] px-2 py-0.5 rounded-full font-bold">
                    {activeShoe.badge}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-black text-[#2B1A11] font-display">
                    {formatPrice(activeShoe.price)}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-stone-400 line-through">
                    Retail: {formatPrice(activeShoe.originalPrice)}
                  </div>
                </div>
              </div>

              {/* Product Visual Container */}
              <div
                onClick={() => setActiveShoeModal(activeShoe)}
                className="relative aspect-4/3 overflow-hidden rounded-2xl bg-[#F7F4EB] cursor-pointer flex items-center justify-center p-4 sm:p-6 border border-[#E8E2D5] shadow-inner"
              >
                <img
                  src={activeShoe.images[0]}
                  alt={activeShoe.name}
                  className="w-full h-full object-contain object-center transition-all duration-700 ease-out group-hover:scale-108 filter drop-shadow-md"
                />

                {/* Savings Pill Overlay */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#C59B6D] text-white text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                  SAVE {formatPrice(activeShoe.originalPrice - activeShoe.price)}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#2B1A11]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/95 text-[#2B1A11] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3.5 sm:px-4 py-2 rounded-full shadow-xl backdrop-blur-xs flex items-center space-x-1.5 border border-[#C59B6D]">
                    <span>View Product Details</span>
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

                {/* Carousel switcher dots */}
                <div className="flex items-center space-x-1.5 bg-[#FAF7EE] p-1 rounded-full border border-[#E2D9CA] flex-shrink-0">
                  {spotlightList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setFeaturedIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === featuredIndex
                          ? 'bg-[#2B1A11] w-5'
                          : 'bg-[#C59B6D]/40 hover:bg-[#C59B6D] w-2.5'
                      }`}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
