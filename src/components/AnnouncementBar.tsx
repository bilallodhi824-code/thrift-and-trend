import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Truck, RefreshCw, MessageCircle } from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE } from '../utils/whatsapp';

const MESSAGES = [
  { text: 'CASH ON DELIVERY ACROSS PAKISTAN • 7-DAY EASY RETURN & EXCHANGE GUARANTEE', icon: RefreshCw },
  { text: 'FAST DISPATCH IN 24H • DELIVERY IN 2–4 WORKING DAYS VIA TCS, TRAX & LEOPARDS', icon: Truck },
  { text: '100% AUTHENTIC QUALITY GUARANTEED • OPEN PARCEL BEFORE PAYMENT IN MAJOR CITIES', icon: ShieldCheck },
  { text: 'DIRECT WHATSAPP HELPLINE: +92 300 8241986 • INSTANT COD ORDER CONFIRMATION', icon: MessageCircle },
  { text: 'COMPLIMENTARY EXPRESS DELIVERY ACROSS PAKISTAN ON ORDERS OVER RS. 3,500', icon: Sparkles },
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

        {/* Right Official WhatsApp & Currency */}
        <div className="hidden lg:flex items-center space-x-3 text-[#C59B6D] text-[10px] font-mono">
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center space-x-1 font-semibold"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="text-white font-sans">{WHATSAPP_DISPLAY}</span>
          </a>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors font-semibold">PKR (Rs.)</span>
        </div>
      </div>
    </div>
  );
};
