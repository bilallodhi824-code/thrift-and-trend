import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Shoe } from '../types/shoe';
import { formatPrice } from '../utils/currency';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    shoes,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    setActiveShoeModal,
    addToCart,
  } = useShop();

  if (!isWishlistOpen) return null;

  const savedShoes = shoes.filter(s => wishlist.includes(s.id));

  const handleQuickAddFromWishlist = (shoe: Shoe) => {
    addToCart(shoe, shoe.colors[0], shoe.sizes[2] || shoe.sizes[0], 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/70 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 fill-neutral-950 text-neutral-950" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-950">
                Saved Atelier Silhouettes ({savedShoes.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {savedShoes.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-neutral-900">
                  No saved silhouettes
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Tap the heart icon on any footwear card to save silhouettes for private comparison.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="bg-neutral-950 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Explore Footwear
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {savedShoes.map(shoe => (
                  <div key={shoe.id} className="py-4 flex gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        setActiveShoeModal(shoe);
                        setIsWishlistOpen(false);
                      }}
                      className="w-20 h-20 bg-[#f8f7f4] rounded-xl overflow-hidden flex-shrink-0 border border-stone-200 p-2 cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={shoe.images[0]}
                        alt={shoe.name}
                        className="w-full h-full object-contain object-center hover:scale-105 transition-transform filter drop-shadow-xs"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4
                            onClick={() => {
                              setActiveShoeModal(shoe);
                              setIsWishlistOpen(false);
                            }}
                            className="text-xs font-bold uppercase tracking-wider text-neutral-950 cursor-pointer hover:underline font-display"
                          >
                            {shoe.name}
                          </h4>
                          <span className="text-xs font-bold text-neutral-950 font-display">
                            {formatPrice(shoe.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                          {shoe.subtitle}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => handleQuickAddFromWishlist(shoe)}
                          className="bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(shoe.id)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {savedShoes.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/90">
              <button
                onClick={() => {
                  savedShoes.forEach(s => handleQuickAddFromWishlist(s));
                  setIsWishlistOpen(false);
                }}
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Move All to Shopping Bag</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
