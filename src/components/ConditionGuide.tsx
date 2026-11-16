import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const TIERS = [
  {
    grade: '10/10 DEADSTOCK',
    title: 'Brand New In Box',
    desc: 'Unworn, unlaced condition. Includes original box, factory tags, and original accessories.',
    badgeColor: 'bg-[#264E36] text-white',
  },
  {
    grade: '9.5/10 PRISTINE',
    title: 'Like New Condition',
    desc: 'Tried on indoors or worn once. Flawless uppers, zero heel wear, pristine insoles.',
    badgeColor: 'bg-[#2B1A11] text-[#FAF7EE]',
  },
  {
    grade: '9.0/10 EXCELLENT',
    title: 'Gently Pre-Owned',
    desc: 'Light casual wear. Clean uppers with zero tears, full sole tread, thoroughly cleaned and inspected.',
    badgeColor: 'bg-[#C59B6D] text-white',
  },
  {
    grade: '8.5/10 CLASSIC',
    title: 'Archival & Vintage',
    desc: 'Vintage classics with authentic character. Hand-cleaned, conditioned, and verified for durable wear.',
    badgeColor: 'bg-stone-600 text-white',
  },
];

export const ConditionGuide: React.FC = () => {
  return (
    <section id="grading-section" className="py-12 bg-[#F3EFE6] border-b border-[#E2D9CA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#C59B6D] uppercase flex items-center space-x-1.5 mb-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#264E36]" />
              <span>Transparent Quality Standards</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#2B1A11]">
              Every Pair Inspected. Graded. Verified.
            </h2>
          </div>
          <p className="text-xs text-stone-600 max-w-md leading-relaxed">
            We physically inspect every pair of footwear before listing to guarantee authentic condition, accurate grading, and zero surprises when your package arrives.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map(tier => (
            <div
              key={tier.grade}
              className="bg-white rounded-2xl p-5 border border-[#E2D9CA] shadow-xs flex flex-col justify-between hover:border-[#C59B6D] transition-colors"
            >
              <div>
                <span className={`inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 ${tier.badgeColor}`}>
                  {tier.grade}
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#2B1A11] mb-1.5">
                  {tier.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {tier.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center space-x-1.5 text-[10px] text-[#264E36] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Quality Inspected</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
