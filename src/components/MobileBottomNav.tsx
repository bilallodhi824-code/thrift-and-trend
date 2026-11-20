import React from 'react';
import { Home, Footprints, Search, Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setSelectedCategory,
  } = useShop();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    setSelectedCategory('all');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchClick = () => {
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    // trigger focus on search if available
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF7EE]/95 backdrop-blur-xl border-t border-[#E2D9CA] shadow-2xl py-2 px-3 md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#2B1A11] hover:text-[#C59B6D] transition-colors group cursor-pointer"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1 font-mono">
            Home
          </span>
        </button>

        {/* 2. Shop / Drops */}
        <button
          onClick={handleShopClick}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#2B1A11] hover:text-[#C59B6D] transition-colors group cursor-pointer"
        >
          <Footprints className="w-5 h-5 group-hover:scale-110 transition-transform text-[#C59B6D]" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1 font-mono text-[#C59B6D]">
            Drops
          </span>
        </button>

        {/* 3. Search */}
        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#2B1A11] hover:text-[#C59B6D] transition-colors group cursor-pointer"
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1 font-mono">
            Search
          </span>
        </button>

        {/* 4. Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-[#2B1A11] hover:text-[#C59B6D] transition-colors group cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1 font-mono">
            Saved
          </span>
        </button>

        {/* 5. Bag / Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-[#2B1A11] hover:text-[#C59B6D] transition-colors group cursor-pointer"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#2B1A11] text-[#FAF7EE] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 text-[#C59B6D]" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C59B6D] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 font-mono">
            Bag
          </span>
        </button>

      </div>
    </nav>
  );
};
