import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Leaf, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BrandPhilosophy: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      showToast('Thank you! You are now subscribed to new footwear arrivals.');
    }
  };

  return (
    <section id="philosophy-section" className="py-16 lg:py-24 bg-[#F3EFE6] border-t border-b border-[#E2D9CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Tag */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#C59B6D] rounded-full px-3.5 py-1 text-[10px] font-mono tracking-widest text-[#2B1A11] uppercase font-bold">
            <Tag className="w-3.5 h-3.5 text-[#C59B6D]" />
            <span>Thrift & Trend • Where Style Meets Savings</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#2B1A11]">
            Quality Footwear. Real Savings.
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            The traditional retail market charges steep prices for quality footwear. At Thrift & Trend, we curate authentic sneakers, casual silhouettes, and formal dress shoes to deliver everyday style without the retail markup.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2D9CA] shadow-xs flex flex-col justify-between hover:border-[#C59B6D] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] border border-[#E2D9CA] flex items-center justify-center mb-6 text-[#264E36]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B6D] block mb-1 font-bold">
                PILLAR 01 // AUTHENTICITY
              </span>
              <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-[#2B1A11] mb-3">
                Quality Inspection
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero compromises on quality. Every pair passes careful inspection: factory label matching, upper condition, and sole integrity checked before listing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-[#264E36]">
              100% Authentic Guarantee
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2D9CA] shadow-xs flex flex-col justify-between hover:border-[#C59B6D] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] border border-[#E2D9CA] flex items-center justify-center mb-6 text-[#C59B6D]">
                <Tag className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B6D] block mb-1 font-bold">
                PILLAR 02 // REAL VALUE
              </span>
              <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-[#2B1A11] mb-3">
                Up to 60% Below Retail
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We benchmark against original brand retail pricing to deliver genuine savings on timeless sneakers, classic athletic shoes, and genuine leather shoes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-[#C59B6D]">
              Average Savings: Rs. 2,500+ Per Pair
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2D9CA] shadow-xs flex flex-col justify-between hover:border-[#C59B6D] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] border border-[#E2D9CA] flex items-center justify-center mb-6 text-[#B8864E]">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B6D] block mb-1 font-bold">
                PILLAR 03 // CIRCULAR FASHION
              </span>
              <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-[#2B1A11] mb-3">
                Mindful Footwear
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                By recirculating deadstock and pristine footwear, we support sustainable fashion and give great footwear a long, well-loved lifespan.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-[#2B1A11]">
              Sustainable Shoe Culture
            </div>
          </div>

        </div>

        {/* Newsletter Invitation Card */}
        <div className="mt-16 bg-[#2B1A11] text-[#FAF7EE] rounded-3xl p-8 sm:p-12 border-2 border-[#C59B6D] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B6D] block mb-2 font-bold">
              EARLY ACCESS // NEW ARRIVALS
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
              Never Miss A Great Footwear Deal
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-normal">
              Subscribe to receive weekly arrival updates, exclusive discount codes, and new seasonal shoe drops directly in your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-[#C59B6D] text-xs font-bold py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed. Welcome to Thrift & Trend!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="bg-[#190E08] border border-[#C59B6D]/60 rounded-full px-5 py-3.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B6D] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#C59B6D] hover:bg-[#B8864E] text-[#2B1A11] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2B1A11]" />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
