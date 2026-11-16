import React, { useState } from 'react';
import { ArrowDownRight, ShieldCheck, Tag, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center space-x-2.5 bg-white border border-[#C59B6D]/70 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest text-[#2B1A11] uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#264E36] animate-pulse"></span>
            <span>Vault Release • Drop 044 Active</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-mono tracking-widest text-stone-600 uppercase">
            <span className="hidden sm:inline">100% Legit Check Certified</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#2B1A11] font-bold flex items-center">
              <Star className="w-3.5 h-3.5 fill-[#C59B6D] text-[#C59B6D] mr-1" />
              Over $850k Saved by Community
            </span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Bold Cinematic Typography & Mission */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-ultra text-[#C59B6D] uppercase">
                <Tag className="w-3.5 h-3.5" />
                <span>ARCHIVAL THRIFT • STREETWEAR TRENDS</span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-black tracking-tightest text-[#2B1A11] uppercase leading-[0.92]">
                Where Style
                <span className="block text-[#C59B6D]">
                  Meets Savings.
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-stone-700 max-w-xl font-normal leading-relaxed">
              Why pay inflated secondary market markups? We curate authenticated deadstock grails, archival thrift classics, and trending heat at up to <strong className="text-[#2B1A11] font-bold">60% below retail</strong>. Every pair is 12-point lab inspected, UV-sanitized, and guaranteed 100% legit.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToCatalog()}
                className="inline-flex items-center space-x-2.5 bg-[#2B1A11] text-[#FAF7EE] hover:bg-[#3D2517] px-7 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 group"
              >
                <span>Shop Vault Drops</span>
                <ArrowDownRight className="w-4 h-4 text-[#C59B6D] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => setActiveShoeModal(activeShoe)}
                className="inline-flex items-center space-x-2 bg-white text-[#2B1A11] border border-[#C59B6D] hover:border-[#2B1A11] px-6 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-xs hover:shadow-md"
              >
                <span>Inspect Spotlight Deal</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C59B6D]" />
              </button>
            </div>

            {/* Quick Filter Shortcuts */}
            <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1 font-semibold">
                Hot Grails:
              </span>
              <button
                onClick={() => scrollToCatalog('lifestyle')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E2D9CA] hover:border-[#2B1A11] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#2B1A11] transition-colors"
              >
                Court & Skate Classics (From $85)
              </button>
              <button
                onClick={() => scrollToCatalog('running')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E2D9CA] hover:border-[#2B1A11] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#2B1A11] transition-colors"
              >
                Nitrogen Runners (Save $90+)
              </button>
              <button
                onClick={() => scrollToCatalog('boots')}
                className="bg-white hover:bg-[#F3EFE6] border border-[#E2D9CA] hover:border-[#2B1A11] px-3.5 py-1 rounded-full text-[11px] font-bold text-[#2B1A11] transition-colors"
              >
                Vibram Suede Boots (Save $155)
              </button>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E2D9CA] text-[#2B1A11]">
              <div className="flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-[#264E36] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    12-Pt Lab Check
                  </div>
                  <div className="text-[10px] text-stone-600">Guaranteed 100% Authentic</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Tag className="w-4 h-4 text-[#C59B6D] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    True Savings
                  </div>
                  <div className="text-[10px] text-stone-600">Up to 60% below StockX</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#B8864E] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2B1A11]">
                    UV-Sanitized
                  </div>
                  <div className="text-[10px] text-stone-600">Medical-grade fresh</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#E2D9CA] shadow-2xl overflow-hidden group">
              
              {/* Badge Header on Spotlight Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-[#264E36] text-white px-3 py-1 rounded-full font-extrabold shadow-xs">
                    {activeShoe.condition}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest uppercase bg-[#FAF7EE] text-[#C59B6D] border border-[#C59B6D] px-2 py-0.5 rounded-full font-bold">
                    {activeShoe.badge}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#2B1A11] font-display">
                    ${activeShoe.price}
                  </div>
                  <div className="text-[10px] text-stone-400 line-through">
                    Retail: ${activeShoe.originalPrice}
                  </div>
                </div>
              </div>

              {/* Product Visual Container */}
              <div
                onClick={() => setActiveShoeModal(activeShoe)}
                className="relative aspect-4/3 overflow-hidden rounded-2xl bg-[#F7F4EB] cursor-pointer flex items-center justify-center p-6 border border-[#E8E2D5] shadow-inner"
              >
                <img
                  src={activeShoe.images[0]}
                  alt={activeShoe.name}
                  className="w-full h-full object-contain object-center transition-all duration-700 ease-out group-hover:scale-108 filter drop-shadow-md"
                />

                {/* Savings Pill Overlay */}
                <div className="absolute top-3 right-3 bg-[#C59B6D] text-white text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                  SAVE ${activeShoe.originalPrice - activeShoe.price}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#2B1A11]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/95 text-[#2B1A11] text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-xl backdrop-blur-xs flex items-center space-x-1.5 border border-[#C59B6D]">
                    <span>Inspect Authentication Certificate</span>
                    <span>→</span>
                  </span>
                </div>
              </div>

              {/* Product Summary & Switcher below image */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2B1A11] font-display">
                    {activeShoe.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-normal">
                    {activeShoe.subtitle}
                  </p>
                </div>

                {/* Carousel switcher dots */}
                <div className="flex items-center space-x-1.5 bg-[#FAF7EE] p-1 rounded-full border border-[#E2D9CA]">
                  {spotlightList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setFeaturedIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === featuredIndex
                          ? 'bg-[#2B1A11] w-5'
                          : 'bg-[#C59B6D]/40 hover:bg-[#C59B6D]'
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
