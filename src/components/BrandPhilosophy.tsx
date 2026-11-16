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
      showToast('You have been granted VIP Early Access to Monday Drops.');
    }
  };

  return (
    <section id="philosophy-section" className="py-16 lg:py-24 bg-[#F3EFE6] border-t border-b border-[#E2D9CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Tag */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#C59B6D] rounded-full px-3.5 py-1 text-[10px] font-mono tracking-widest text-[#2B1A11] uppercase font-bold">
            <Tag className="w-3.5 h-3.5 text-[#C59B6D]" />
            <span>The T&T Manifesto • Where Style Meets Savings</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#2B1A11]">
            Circular Footwear. Real Savings.
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            The traditional sneaker secondary market is broken by artificial scarcity and astronomical reseller markups. At Thrift & Trend, we intercept authentic deadstock grails and gently thrifted icons to deliver coveted style without the markup.
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
                PILLAR 01 // AUTHENTICATION
              </span>
              <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-[#2B1A11] mb-3">
                12-Point Lab Verification
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero fakes allowed. Every shoe passes physical inspection by veteran authenticators: blacklight UV adhesive tests, factory SKU matching, insole foam density, and stitching pitch verification.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-[#264E36]">
              100% Legit Check or 200% Money Back
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
                We benchmark against StockX and original brand retail to ensure our prices are unbeatable. Premium streetwear, classic skate, and Italian calfskin accessible to real sneakerheads.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-[#C59B6D]">
              Average Savings: $95 Per Pair
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E2D9CA] shadow-xs flex flex-col justify-between hover:border-[#C59B6D] transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] border border-[#E2D9CA] flex items-center justify-center mb-6 text-[#B8864E]">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B6D] block mb-1 font-bold">
                PILLAR 03 // CIRCULAR SNEAKERS
              </span>
              <h3 className="font-display text-base font-extrabold uppercase tracking-wide text-[#2B1A11] mb-3">
                Zero Footwear Waste
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                By recirculating deadstock and pristine archival footwear, we keep vulcanized rubbers and leather hides out of global landfills while providing a sustainable alternative to fast-fashion waste.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-[#2B1A11]">
              Eco-Conscious Sneaker Culture
            </div>
          </div>

        </div>

        {/* VIP Vault Drop Invitation Card */}
        <div className="mt-16 bg-[#2B1A11] text-[#FAF7EE] rounded-3xl p-8 sm:p-12 border-2 border-[#C59B6D] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B6D] block mb-2 font-bold">
              VIP DROPS // 24-HOUR ADVANCE ACCESS
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
              Never Miss A 10/10 Deadstock Steal
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-normal">
              Our rarest vault grails and biggest savings sell out within minutes of drop time. Join 25,000+ sneakerheads who receive private 24-hour advance SMS and email alerts.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-[#C59B6D] text-xs font-bold py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are on the VIP Vault list. Welcome to Thrift & Trend.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email for drop alerts..."
                  required
                  className="bg-[#190E08] border border-[#C59B6D]/60 rounded-full px-5 py-3.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B6D] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#C59B6D] hover:bg-[#B8864E] text-[#2B1A11] px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>Join The Vault</span>
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
