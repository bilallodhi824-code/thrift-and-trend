import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Minus,
  Plus,
  Check,
  Info,
  Share2,
  Sparkles,
  Lock,
  MessageCircle,
  Camera,
} from 'lucide-react';
import { Shoe, ShoeColor } from '../types/shoe';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/currency';
import { getWhatsAppShoeOrderUrl } from '../utils/whatsapp';

export const ProductModal: React.FC = () => {
  const {
    activeShoeModal,
    setActiveShoeModal,
    addToCart,
    toggleWishlist,
    isInWishlist,
    sizeUnit,
    setIsSizeGuideOpen,
    showToast,
    user,
    setIsAuthModalOpen,
  } = useShop();

  if (!activeShoeModal) return null;

  const shoe: Shoe = activeShoeModal;
  const isFavorited = isInWishlist(shoe.id);
  const savings = shoe.originalPrice - shoe.price;
  const savingsPercent = Math.round((savings / shoe.originalPrice) * 100);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ShoeColor>(shoe.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number>(shoe.sizes[2] || shoe.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'real-photos' | 'specs' | 'authentication' | 'reviews'>('overview');

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor(shoe.colors[0]);
    setSelectedSize(shoe.sizes[2] || shoe.sizes[0]);
    setQuantity(1);
    setActiveTab('overview');
  }, [shoe.id]);

  const handleColorChange = (color: ShoeColor) => {
    setSelectedColor(color);
    if (color.imageIndex < shoe.images.length) {
      setActiveImageIndex(color.imageIndex);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please sign in or create an account to add items to your bag.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    addToCart(shoe, selectedColor, selectedSize, quantity);
    setActiveShoeModal(null);
  };

  const handleShare = () => {
    const directUrl = `https://thriftandtrend.vercel.app/product/${shoe.slug || shoe.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(directUrl);
      showToast(`Link for ${shoe.name} copied! Perfect for WhatsApp or Instagram story.`);
    }
  };

  const getConvertedSizeText = (euSize: number) => {
    if (sizeUnit === 'US') {
      const usSize = (euSize - 33).toFixed(0);
      return `US ${usSize} (EU ${euSize})`;
    }
    if (sizeUnit === 'UK') {
      const ukSize = (euSize - 33.5).toFixed(1);
      return `UK ${ukSize} (EU ${euSize})`;
    }
    return `EU ${euSize}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 animate-fade-in"
      onClick={() => setActiveShoeModal(null)}
    >
      <div
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-[#E2D9CA] animate-slide-up max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2D9CA] bg-[#FAF7EE]">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono tracking-widest text-[#2B1A11] uppercase font-bold">
              GRAIL REF: #{shoe.id.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase bg-[#264E36] text-white px-2.5 py-0.5 rounded-full font-bold">
              {shoe.condition}
            </span>
            {shoe.badge && (
              <span className="text-[9px] font-mono tracking-widest uppercase bg-[#2B1A11] text-[#FAF7EE] px-2.5 py-0.5 rounded-full font-bold">
                {shoe.badge}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-stone-500 hover:text-black rounded-full hover:bg-[#E8E2D5] transition-colors"
              title="Share grail"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveShoeModal(null)}
              className="p-2 text-stone-500 hover:text-black rounded-full hover:bg-[#E8E2D5] transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Lightbox Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Studio Photo Showcase */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Shoe Showcase Box */}
              <div className="relative aspect-4/3 w-full bg-[#FAF7EE] rounded-2xl overflow-hidden border border-[#E2D9CA] shadow-inner flex items-center justify-center p-6 sm:p-8 group">
                <img
                  src={shoe.images[activeImageIndex] || shoe.images[0]}
                  alt={`${shoe.name} - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md"
                />

                {/* Savings Callout Pill */}
                <div className="absolute top-4 left-4 bg-[#C59B6D] text-white text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                  SAVE {formatPrice(savings)} ({savingsPercent}% OFF)
                </div>

                <div className="absolute bottom-3 left-3 bg-[#2B1A11]/85 text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold">
                  Studio Product View
                </div>
              </div>

              {/* Thumbnails Row if multiple */}
              {shoe.images.length > 1 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-1 no-scrollbar">
                  {shoe.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all p-2 bg-[#FAF7EE] ${
                        idx === activeImageIndex
                          ? 'border-[#2B1A11] ring-2 ring-[#C59B6D]/40 shadow-sm'
                          : 'border-[#E2D9CA] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-contain object-center"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* T&T Guarantees Box */}
              <div className="p-4 bg-[#F3EFE6] rounded-2xl border border-[#E2D9CA] space-y-2.5 text-[#2B1A11] text-xs">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#264E36] flex-shrink-0" />
                  <span className="font-medium">100% Authentic Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-[#C59B6D] flex-shrink-0" />
                  <span className="font-medium">Professionally inspected and cleaned before dispatch</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-4 h-4 text-[#2B1A11] flex-shrink-0" />
                  <span className="font-medium">Free express delivery in Pakistan on orders over Rs. 3,500</span>
                </div>
              </div>

            </div>

            {/* Right Column: Details, Condition, Savings & Selection */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-stone-600 mb-1.5">
                  <span className="font-bold text-[#264E36] flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{shoe.condition}</span>
                  </span>
                  <div className="flex items-center space-x-1.5 text-[#2B1A11]">
                    <Star className="w-3.5 h-3.5 fill-[#C59B6D] text-[#C59B6D]" />
                    <span className="font-bold">{shoe.rating.toFixed(1)}</span>
                    <span className="text-stone-400">({shoe.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Product Title & Subtitle */}
                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#2B1A11]">
                  {shoe.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
                  {shoe.subtitle}
                </p>

                {/* Price & Savings Comparison Box */}
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF7EE] border border-[#E2D9CA] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                      Thrift & Trend Price
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl sm:text-3xl font-black font-display text-[#2B1A11]">
                        {formatPrice(shoe.price)}
                      </span>
                      <span className="text-xs sm:text-sm text-stone-400 line-through">
                        Retail: {formatPrice(shoe.originalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-[#264E36] text-white text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full uppercase shadow-xs">
                      SAVE {formatPrice(savings)}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1 font-mono">
                      {savingsPercent}% below market
                    </div>
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mt-5 pt-4 border-t border-[#E2D9CA]">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-bold uppercase tracking-wider text-[#2B1A11]">
                      Colorway: <span className="font-extrabold text-[#C59B6D]">{selectedColor.name}</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {shoe.colors.length} Available
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {shoe.colors.map(color => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => handleColorChange(color)}
                          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs transition-all ${
                            isSelected
                              ? 'border-[#2B1A11] bg-[#FAF7EE] font-bold shadow-xs'
                              : 'border-stone-300 hover:border-stone-500 text-stone-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-bold uppercase tracking-wider text-[#2B1A11]">
                      Size: <span className="font-black text-[#C59B6D]">{getConvertedSizeText(selectedSize)}</span>
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[11px] uppercase tracking-wider text-[#C59B6D] hover:text-[#2B1A11] underline underline-offset-2 transition-colors font-bold"
                    >
                      Conversion Chart
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {shoe.sizes.map(size => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-center rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            isSelected
                              ? 'bg-[#2B1A11] text-[#FAF7EE] border-[#2B1A11] shadow-sm'
                              : 'bg-white hover:bg-[#F3EFE6] border-[#E2D9CA] text-[#2B1A11]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fit Advice Notice */}
                  <div className="mt-2.5 flex items-center space-x-2 text-[11px] text-stone-600 bg-[#F3EFE6] p-2.5 rounded-xl">
                    <Info className="w-3.5 h-3.5 text-[#C59B6D] flex-shrink-0" />
                    <span>{shoe.fitAdvice}</span>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="mt-6 pt-5 border-t border-[#E2D9CA] flex flex-col sm:flex-row items-center gap-3">
                  
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#E2D9CA] rounded-full bg-[#FAF7EE] p-1 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-stone-600 hover:text-black disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#2B1A11]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="p-2 text-stone-600 hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 w-full bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] py-3.5 sm:py-4 px-5 sm:px-6 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-xl flex items-center justify-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
                  >
                    {!user ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-[#C59B6D]" />
                        <span>Sign In to Add to Bag</span>
                        <span>•</span>
                        <span>{formatPrice(shoe.price * quantity)}</span>
                      </>
                    ) : (
                      <>
                        <span>Secure This Pair</span>
                        <span>•</span>
                        <span>{formatPrice(shoe.price * quantity)}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(shoe.id)}
                    className="p-3.5 rounded-full border border-[#E2D9CA] hover:border-[#2B1A11] text-[#2B1A11] transition-colors shadow-xs"
                    title={isFavorited ? 'Remove from saved' : 'Save to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorited ? 'fill-red-600 text-red-600' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                </div>

                {/* Direct WhatsApp One-Click Order Button */}
                <div className="pt-2">
                  <a
                    href={getWhatsAppShoeOrderUrl(shoe, selectedColor, selectedSize)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 sm:py-4 px-6 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-xl flex items-center justify-center space-x-2.5 cursor-pointer hover:-translate-y-0.5 group"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Order via WhatsApp (COD)</span>
                    <span className="text-[10px] font-mono opacity-90 hidden sm:inline">• Instant Confirmation</span>
                  </a>
                </div>

                {/* Pakistani Courier Logistics & Delivery Banner */}
                <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-600 bg-[#FAF7EE] p-3 rounded-2xl border border-[#E2D9CA] gap-2">
                  <div className="flex items-center space-x-1.5 text-[#264E36] font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivery: 2–4 Working Days</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2D9CA] font-bold text-[#E51B24]">TCS</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2D9CA] font-bold text-[#0057B8]">TRAX</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#E2D9CA] font-bold text-[#2B1A11]">LEOPARDS</span>
                    <span className="text-stone-400 font-sans">• Open Parcel COD</span>
                  </div>
                </div>

              </div>

              {/* Navigation Tabs */}
              <div className="mt-8 pt-6 border-t border-[#E2D9CA]">
                <div className="flex border-b border-[#E2D9CA] text-xs font-bold uppercase tracking-wider overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'border-[#2B1A11] text-[#2B1A11]'
                        : 'border-transparent text-stone-400 hover:text-[#2B1A11]'
                    }`}
                  >
                    Story &amp; Condition
                  </button>
                  <button
                    onClick={() => setActiveTab('real-photos')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                      activeTab === 'real-photos'
                        ? 'border-[#264E36] text-[#264E36]'
                        : 'border-transparent text-stone-400 hover:text-[#264E36]'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>In-Hand &amp; Real Photos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('authentication')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'authentication'
                        ? 'border-[#2B1A11] text-[#2B1A11]'
                        : 'border-transparent text-stone-400 hover:text-[#2B1A11]'
                    }`}
                  >
                    Authenticity
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'specs'
                        ? 'border-[#2B1A11] text-[#2B1A11]'
                        : 'border-transparent text-stone-400 hover:text-[#2B1A11]'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === 'reviews'
                        ? 'border-[#2B1A11] text-[#2B1A11]'
                        : 'border-transparent text-stone-400 hover:text-[#2B1A11]'
                    }`}
                  >
                    Buyer Reviews ({shoe.reviews.length})
                  </button>
                </div>

                {/* Tab 1: Overview & Story */}
                {activeTab === 'overview' && (
                  <div className="pt-4 space-y-4 text-xs text-stone-700 leading-relaxed animate-fade-in">
                    <p>{shoe.description}</p>
                    <p className="italic text-[#2B1A11] bg-[#FAF7EE] p-3.5 rounded-xl border-l-2 border-[#C59B6D]">
                      "{shoe.story}"
                    </p>

                    <div>
                      <h4 className="font-bold text-[#2B1A11] uppercase tracking-wider text-[11px] mb-2 font-display">
                        Thrift & Trend Verification Highlights
                      </h4>
                      <ul className="space-y-2">
                        {shoe.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-[#264E36] mt-0.5 flex-shrink-0 font-bold" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab 2: Real In-Hand Photos & Unboxing */}
                {activeTab === 'real-photos' && (
                  <div className="pt-4 space-y-4 animate-fade-in text-xs">
                    <div className="bg-[#FAF7EE] p-3.5 rounded-2xl border border-[#E2D9CA] flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#264E36]">
                        <Camera className="w-4 h-4" />
                        <span className="font-bold uppercase tracking-wider text-[11px]">Physical Warehouse Inspection Photos</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-[#E2D9CA]">
                        100% Asal Joote Verified
                      </span>
                    </div>

                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      Yeh tasaveer hamare warehouse mein inspection ke dauran shoot ki gayi hain taake aapko deliver hone se pehle jootay ki real texture, sole tread, stitching aur packaging ka 100% aetimad ho sake.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {shoe.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-[#FAF7EE] rounded-2xl border border-[#E2D9CA] overflow-hidden p-2 group shadow-2xs">
                          <img
                            src={img}
                            alt={`${shoe.name} In Hand View ${idx + 1}`}
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                          />
                          <div className="absolute bottom-1.5 left-1.5 bg-[#2B1A11]/80 text-white text-[8px] font-mono px-2 py-0.5 rounded-full backdrop-blur-xs">
                            Angle {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-[#E8F2EC] rounded-2xl border border-[#264E36]/20 flex items-center space-x-2.5 text-[#264E36] text-[11px]">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span><strong>Open Parcel Guarantee:</strong> Rider ke aane par aap parcel khol kar joota check kar sakte hain, phir Cash on Delivery dain!</span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Authenticity & Inspection */}
                {activeTab === 'authentication' && (
                  <div className="pt-4 space-y-3 text-xs animate-fade-in">
                    <div className="p-4 bg-[#F3EFE6] rounded-2xl border border-[#E2D9CA] space-y-2">
                      <div className="flex items-center space-x-2 text-[#264E36] font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verified Quality & Authenticity Details</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {shoe.authenticationNotes}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                        <span className="bg-white px-2.5 py-1 rounded-full border border-stone-200">✓ Factory SKU Matched</span>
                        <span className="bg-white px-2.5 py-1 rounded-full border border-stone-200">✓ Quality Checked</span>
                        <span className="bg-white px-2.5 py-1 rounded-full border border-stone-200">✓ Genuine Condition</span>
                        <span className="bg-white px-2.5 py-1 rounded-full border border-stone-200">✓ Original Sole Grip</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Specs Table */}
                {activeTab === 'specs' && (
                  <div className="pt-4 animate-fade-in">
                    <table className="w-full text-left text-xs border-collapse">
                      <tbody>
                        <tr className="border-b border-stone-200">
                          <td className="py-2.5 text-stone-500 uppercase font-mono text-[10px] w-1/3">Condition Grade</td>
                          <td className="py-2.5 text-[#2B1A11] font-bold">{shoe.condition}</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="py-2.5 text-stone-500 uppercase font-mono text-[10px]">Upper Material</td>
                          <td className="py-2.5 text-[#2B1A11] font-medium">{shoe.specs.upper}</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="py-2.5 text-stone-500 uppercase font-mono text-[10px]">Outsole Compound</td>
                          <td className="py-2.5 text-[#2B1A11] font-medium">{shoe.specs.sole}</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="py-2.5 text-stone-500 uppercase font-mono text-[10px]">Insole Cushioning</td>
                          <td className="py-2.5 text-[#2B1A11] font-medium">{shoe.specs.insole}</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="py-2.5 text-stone-500 uppercase font-mono text-[10px]">Weight</td>
                          <td className="py-2.5 text-[#2B1A11] font-medium">{shoe.specs.weight}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 text-stone-500 uppercase font-mono text-[10px]">Sustainability</td>
                          <td className="py-2.5 text-[#2B1A11] font-medium">{shoe.specs.sustainability}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 4: Reviews */}
                {activeTab === 'reviews' && (
                  <div className="pt-4 space-y-4 animate-fade-in">
                    {shoe.reviews.map(review => (
                      <div key={review.id} className="p-4 bg-[#F3EFE6] rounded-2xl border border-[#E2D9CA] space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#2B1A11]">{review.author}</span>
                            {review.verified && (
                              <span className="text-[10px] bg-[#264E36] text-white font-mono px-2 py-0.5 rounded-full font-bold">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono">{review.date}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'fill-[#C59B6D] text-[#C59B6D]' : 'text-stone-300'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] text-stone-500 font-mono ml-2">
                            Fit: {review.fitRating}
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-[#2B1A11] pt-0.5">{review.title}</h5>
                        <p className="text-xs text-stone-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
