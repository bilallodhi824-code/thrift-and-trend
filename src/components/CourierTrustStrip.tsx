import React, { useState } from 'react';
import { Truck, ShieldCheck, RefreshCw, Clock, CheckCircle2, X } from 'lucide-react';

export const CourierTrustStrip: React.FC = () => {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  return (
    <>
      <section className="bg-[#FAF7EE] border-y border-[#E2D9CA] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top 4 Pillars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Pillar 1: Cash on Delivery */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#E2D9CA] shadow-2xs flex items-start space-x-3.5 hover:border-[#C59B6D] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#264E36]/10 text-[#264E36] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1A11]">
                  Cash on Delivery (COD)
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Pay at your doorstep anywhere across Pakistan. No advance required.
                </p>
              </div>
            </div>

            {/* Pillar 2: Delivery Timeline */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#E2D9CA] shadow-2xs flex items-start space-x-3.5 hover:border-[#C59B6D] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C59B6D]/15 text-[#C59B6D] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1A11]">
                  2–4 Days Fast Dispatch
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Orders dispatched within 24 hours with live online SMS tracking.
                </p>
              </div>
            </div>

            {/* Pillar 3: 7-Day Exchange */}
            <div 
              onClick={() => setIsPolicyModalOpen(true)}
              className="bg-white/80 p-4 rounded-2xl border border-[#E2D9CA] shadow-2xs flex items-start space-x-3.5 hover:border-[#C59B6D] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2B1A11]/10 text-[#2B1A11] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5 text-[#C59B6D]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1A11]">
                    7-Day Easy Return
                  </h4>
                  <span className="text-[9px] font-mono text-[#C59B6D] underline">Policy</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Size fit nahi aya? 7 din ke andar asaan replacement ya exchange.
                </p>
              </div>
            </div>

            {/* Pillar 4: Authenticity */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#E2D9CA] shadow-2xs flex items-start space-x-3.5 hover:border-[#C59B6D] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#264E36]/10 text-[#264E36] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1A11]">
                  100% Quality Checked
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  Every shoe physically inspected for sole wear, upper, and factory stitch.
                </p>
              </div>
            </div>

          </div>

          {/* Official Courier Partners Badge Bar */}
          <div className="mt-5 pt-4 border-t border-[#E2D9CA]/70 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-stone-700">
                Official Delivery Logistics Partners:
              </span>
            </div>

            {/* Courier Logos / Badges */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-white rounded-full border border-[#E2D9CA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#E51B24]" />
                <span className="font-display font-black text-xs text-[#E51B24] tracking-wider">TCS</span>
                <span className="text-[10px] text-stone-400 font-mono">Express Air</span>
              </div>

              <div className="flex items-center space-x-1.5 px-3 py-1 bg-white rounded-full border border-[#E2D9CA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#0057B8]" />
                <span className="font-display font-black text-xs text-[#0057B8] tracking-wider">TRAX</span>
                <span className="text-[10px] text-stone-400 font-mono">COD Logistics</span>
              </div>

              <div className="flex items-center space-x-1.5 px-3 py-1 bg-white rounded-full border border-[#E2D9CA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#FFB81C]" />
                <span className="font-display font-black text-xs text-[#2B1A11] tracking-wider">LEOPARDS</span>
                <span className="text-[10px] text-stone-400 font-mono">Courier</span>
              </div>

              <div className="flex items-center space-x-1.5 px-3 py-1 bg-white rounded-full border border-[#E2D9CA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#00875A]" />
                <span className="font-display font-black text-xs text-[#00875A] tracking-wider">CALL COURIER</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7-Day Exchange & Return Policy Modal */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative bg-white max-w-lg w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E2D9CA] animate-slide-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2D9CA]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#264E36]/10 flex items-center justify-center text-[#264E36]">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm uppercase text-[#2B1A11]">
                    7-Day Easy Return & Exchange Policy
                  </h3>
                  <p className="text-[10px] text-stone-500 font-mono">Pakistan Nationwide Guarantee</p>
                </div>
              </div>
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#264E36] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1A11]">Size Replacement:</strong> Agar jootay ka size chota ya bara aye, toh aap hamare WhatsApp helpline par rabta kar ke foran replacement mangwa sakte hain.
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#264E36] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1A11]">Condition Guarantee:</strong> Joota bilkul usi condition mein hona chahiye jese aapko mila (outdoor wear na ho).
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#264E36] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1A11]">Fast Doorstep Exchange:</strong> Hamara rider TCS ya Trax ke zariye naya pair aapke ghar le ayega aur purana pair collect kar lega.
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#264E36] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2B1A11]">WhatsApp Direct Help:</strong> Kisi bhi maslay par aap WhatsApp helpline <strong>+92 300 8241986</strong> par message kar ke 5 minute mein response pa sakte hain.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="w-full py-3 bg-[#2B1A11] text-[#FAF7EE] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#3D2517] transition-colors"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
