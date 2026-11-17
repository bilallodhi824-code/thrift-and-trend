import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Instagram, Mail, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setIsSizeGuideOpen } = useShop();

  const handleCategoryClick = (cat: 'all' | 'lifestyle' | 'running' | 'boots' | 'formal') => {
    setSelectedCategory(cat);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2B1A11] text-stone-300 pt-16 pb-12 border-t-2 border-[#C59B6D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D2517]">
          
          {/* Brand Column with Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo/badge.jpg"
                alt="Thrift & Trend Emblem"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C59B6D]"
              />
              <div>
                <span className="font-display text-xl font-black tracking-tight text-[#FAF7EE] uppercase block">
                  THRIFT <span className="text-[#C59B6D]">&</span> TREND
                </span>
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#C59B6D] uppercase block">
                  WHERE STYLE MEETS SAVINGS
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-normal">
              Your destination for authentic sneakers, athletic runners, boots, and classic formal footwear at unmatched everyday savings.
            </p>

            {/* Official Instagram Community Pill */}
            <div className="pt-2">
              <a
                href="https://www.instagram.com/thriftandtread?rpxt=MThkazBjd253NXd4cQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-[#C59B6D]/40 text-[#FAF7EE] text-xs font-semibold hover:border-[#C59B6D] transition-all group shadow-sm"
              >
                <Instagram className="w-4 h-4 text-[#C59B6D] group-hover:scale-110 transition-transform" />
                <span>Follow Our Updates on Instagram</span>
                <span className="text-[#C59B6D] font-mono text-[11px]">@thriftandtread</span>
              </a>
            </div>

            <div className="pt-1 flex items-center space-x-3 text-[11px] text-[#C59B6D] font-mono font-bold">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span>100% Authenticity Guarantee</span>
              </span>
              <span>•</span>
              <span>Direct Customer Support</span>
            </div>
          </div>

          {/* Column 2: Footwear Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono tracking-widest text-white uppercase font-bold">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="hover:text-[#C59B6D] transition-colors"
                >
                  All Footwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('lifestyle')}
                  className="hover:text-[#C59B6D] transition-colors"
                >
                  Court & Streetwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('running')}
                  className="hover:text-[#C59B6D] transition-colors"
                >
                  Running & Athletic
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('boots')}
                  className="hover:text-[#C59B6D] transition-colors"
                >
                  Chelsea & Leather Boots
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('formal')}
                  className="hover:text-[#C59B6D] transition-colors"
                >
                  Formal Oxfords & Derbies
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono tracking-widest text-white uppercase font-bold">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#grading-section" className="hover:text-[#C59B6D] transition-colors">
                  Condition & Grading Guide
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-[#C59B6D] transition-colors"
                >
                  International Size Conversions
                </button>
              </li>
              <li>
                <span className="text-stone-400 cursor-default flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C59B6D]" />
                  <span>Verified Authenticity</span>
                </span>
              </li>
              <li>
                <span className="text-stone-400 cursor-default flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C59B6D]" />
                  <span>Tracked Express Shipping</span>
                </span>
              </li>
              <li>
                <a
                  href="mailto:support@thriftandtrend.com"
                  className="hover:text-[#C59B6D] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C59B6D]" />
                  <span>support@thriftandtrend.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Shipping & Delivery */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono tracking-widest text-white uppercase font-bold">
              Shipping & Returns
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <span className="text-white font-sans font-bold block">Free Express Shipping</span>
                <span>On orders above Rs. 3,500</span>
              </li>
              <li>
                <span className="text-white font-sans font-bold block">Quick Order Processing</span>
                <span>Dispatched within 24-48 business hours</span>
              </li>
              <li>
                <span className="text-white font-sans font-bold block">Secure Tracking</span>
                <span>Full courier tracking on every shipment</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} THRIFT & TREND CO. All Rights Reserved. Where Style Meets Savings.
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://www.instagram.com/thriftandtread?rpxt=MThkazBjd253NXd4cQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C59B6D] transition-colors flex items-center gap-1 text-white"
            >
              <Instagram className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span>@thriftandtread</span>
            </a>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
