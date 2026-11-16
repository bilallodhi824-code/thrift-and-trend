import React, { useState } from 'react';
import { Heart, Star, Eye, Plus, ShieldCheck } from 'lucide-react';
import { Shoe, ShoeColor } from '../types/shoe';
import { useShop } from '../context/ShopContext';

export const ProductCard: React.FC<{ shoe: Shoe }> = ({ shoe }) => {
  const {
    isInWishlist,
    toggleWishlist,
    setActiveShoeModal,
    addToCart,
    sizeUnit,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ShoeColor>(shoe.colors[0]);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(shoe.id);
  const savings = shoe.originalPrice - shoe.price;
  const savingsPercent = Math.round((savings / shoe.originalPrice) * 100);

  const displayImageIndex =
    isHovered && shoe.images.length > 1 && activeImageIndex === 0
      ? 1
      : activeImageIndex;

  const handleColorClick = (color: ShoeColor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColor(color);
    if (color.imageIndex < shoe.images.length) {
      setActiveImageIndex(color.imageIndex);
    }
  };

  const handleQuickAdd = (size: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuickSize(size);
    addToCart(shoe, selectedColor, size, 1);
    setTimeout(() => {
      setIsQuickAddOpen(false);
      setSelectedQuickSize(null);
    }, 600);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-3xl border border-[#E2D9CA] hover:border-[#C59B6D] transition-all duration-300 hover:shadow-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsQuickAddOpen(false);
      }}
    >
      {/* Top Image Showcase Area */}
      <div
        onClick={() => setActiveShoeModal(shoe)}
        className="relative aspect-4/3 w-full bg-[#FAF7EE] p-5 sm:p-6 overflow-hidden cursor-pointer flex items-center justify-center border-b border-[#E8E2D5]"
      >
        {/* Real Clean Studio Shoe Photograph */}
        <img
          src={shoe.images[displayImageIndex] || shoe.images[0]}
          alt={`${shoe.name} - ${shoe.subtitle}`}
          loading="lazy"
          className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-108 filter drop-shadow-sm group-hover:drop-shadow-md"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
          <span className="bg-[#264E36] text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold shadow-xs">
            {shoe.condition}
          </span>
          {shoe.badge && (
            <span className="bg-[#2B1A11] text-[#FAF7EE] text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              {shoe.badge}
            </span>
          )}
        </div>

        {/* Savings Tag on Top Right */}
        <div className="absolute top-3.5 right-12 z-10 bg-[#C59B6D] text-white text-[9px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
          -{savingsPercent}% OFF
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(shoe.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-sm transition-transform active:scale-90 hover:shadow-md"
          title={isFavorited ? 'Remove from saved' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-red-600 text-red-600' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={e => {
              e.stopPropagation();
              setActiveShoeModal(shoe);
            }}
            className="flex-1 mr-2 bg-white/95 hover:bg-white text-[#2B1A11] text-[11px] font-bold tracking-wider uppercase py-2.5 px-3 rounded-full shadow-lg backdrop-blur-xs transition-colors flex items-center justify-center space-x-1.5 border border-[#E2D9CA]"
          >
            <Eye className="w-3.5 h-3.5 text-[#C59B6D]" />
            <span>Inspect Grail</span>
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              setIsQuickAddOpen(prev => !prev);
            }}
            className="bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] p-2.5 rounded-full shadow-lg transition-transform active:scale-90"
            title="Quick Select Size"
          >
            <Plus className="w-4 h-4 text-[#C59B6D]" />
          </button>
        </div>
      </div>

      {/* Quick Add Inline Drawer Overlay */}
      {isQuickAddOpen && (
        <div className="p-3 bg-[#FAF7EE] border-b border-[#E2D9CA] animate-slide-down">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#2B1A11] uppercase font-bold">
              Select Size ({sizeUnit})
            </span>
            <button
              onClick={() => setIsQuickAddOpen(false)}
              className="text-[10px] text-stone-500 hover:text-black font-semibold"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {shoe.sizes.map(size => (
              <button
                key={size}
                onClick={e => handleQuickAdd(size, e)}
                className={`py-1.5 text-center text-xs font-semibold rounded-lg border transition-all ${
                  selectedQuickSize === size
                    ? 'bg-[#264E36] text-white border-[#264E36]'
                    : 'bg-white hover:bg-[#2B1A11] hover:text-white border-[#E2D9CA] text-[#2B1A11]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Quality Check */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-1.5">
            <span className="flex items-center space-x-1 text-[#264E36] font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Authentic</span>
            </span>
            <div className="flex items-center space-x-1 text-[#2B1A11] font-sans">
              <Star className="w-3.5 h-3.5 fill-[#C59B6D] text-[#C59B6D]" />
              <span className="font-bold">{shoe.rating.toFixed(1)}</span>
              <span className="text-stone-400">({shoe.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setActiveShoeModal(shoe)}
            className="font-display text-sm sm:text-base font-extrabold tracking-wide uppercase text-[#2B1A11] hover:text-[#C59B6D] transition-colors cursor-pointer truncate"
          >
            {shoe.name}
          </h3>

          {/* Subtitle / Key Silhouette Description */}
          <p className="text-xs text-stone-600 line-clamp-1 mt-0.5 font-normal">
            {shoe.subtitle}
          </p>

          {/* Colorway Swatches */}
          <div className="flex items-center space-x-2 mt-3.5">
            {shoe.colors.map(color => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={e => handleColorClick(color, e)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    isSelected
                      ? 'ring-2 ring-[#2B1A11] ring-offset-2 scale-110 shadow-xs'
                      : 'hover:scale-105 opacity-85 border border-black/15'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              );
            })}
            <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase ml-1">
              {shoe.colors.length} colorways
            </span>
          </div>
        </div>

        {/* Footer: Price, Savings & Direct Action */}
        <div className="mt-4 pt-3.5 border-t border-[#E8E2D5] flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-black text-[#2B1A11] font-display">
                ${shoe.price}
              </span>
              <span className="text-xs text-stone-400 line-through">
                ${shoe.originalPrice}
              </span>
            </div>
            <div className="text-[10px] font-mono font-bold text-[#264E36] uppercase">
              You Save ${savings}
            </div>
          </div>

          <button
            onClick={() => setActiveShoeModal(shoe)}
            className="text-[11px] font-bold tracking-widest uppercase text-[#C59B6D] hover:text-[#2B1A11] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1"
          >
            <span>Details</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
