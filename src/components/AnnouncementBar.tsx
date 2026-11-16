import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Tag, CheckCircle2, Instagram } from 'lucide-react';

const MESSAGES = [
  { text: 'WHERE STYLE MEETS SAVINGS • UP TO 60% OFF RETAIL SNEAKERS & SHOES', icon: Tag },
  { text: '100% AUTHENTIC QUALITY GUARANTEED • FULLY INSPECTED & CERTIFIED', icon: ShieldCheck },
  { text: 'COMPLIMENTARY GLOBAL EXPRESS SHIPPING ON ORDERS OVER $150', icon: Sparkles },
  { text: 'NEW SNEAKERS & CURATED FOOTWEAR ADDED WEEKLY', icon: CheckCircle2 },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeItem = MESSAGES[currentIdx];
  const IconComponent = activeItem.icon;

  return (
    <div className="bg-[#2B1A11] text-[#FAF7EE] text-[11px] font-semibold tracking-widest uppercase py-2 px-4 border-b border-[#3D2517] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left header text */}
        <div className="hidden lg:flex items-center space-x-3 text-[#C59B6D] text-[10px] font-mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D] animate-ping" />
          <span>CURATED FOOTWEAR & SNEAKERS</span>
        </div>

        {/* Center cycling announcement */}
        <div className="w-full lg:w-auto flex items-center justify-center space-x-2 text-center overflow-hidden">
          <IconComponent className="w-3.5 h-3.5 text-[#C59B6D] flex-shrink-0" />
          <span className="truncate text-[10px] sm:text-[11px]">{activeItem.text}</span>
          <ArrowRight className="w-3 h-3 text-[#C59B6D] hidden sm:inline" />
        </div>

        {/* Right Official Instagram & currency */}
        <div className="hidden lg:flex items-center space-x-3 text-[#C59B6D] text-[10px] font-mono">
          <a
            href="https://www.instagram.com/thriftandtread?rpxt=MThkazBjd253NXd4cQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center space-x-1 font-semibold"
            title="Follow us on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-[#C59B6D]" />
            <span className="lowercase">@thriftandtread</span>
          </a>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors font-semibold">USD ($)</span>
        </div>
      </div>
    </div>
  );
};
