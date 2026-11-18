import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  X,
  Menu,
  ShieldCheck,
  User as UserIcon,
  Package,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSizeGuideOpen,
    setIsAuthModalOpen,
    setIsOrderHistoryOpen,
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    user,
    isAuthenticated,
    isAdmin,
    logout,
    orders,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sizeUnit,
    setSizeUnit,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleNavCategory = (cat: 'all' | 'lifestyle' | 'running' | 'boots' | 'formal' | 'trail') => {
    setSelectedCategory(cat);
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navCategories = [
    { label: 'All Drops', value: 'all' as const },
    { label: 'Streetwear', value: 'lifestyle' as const },
    { label: 'Runners', value: 'running' as const },
    { label: 'Boots', value: 'boots' as const },
    { label: 'Oxfords', value: 'formal' as const },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7EE]/95 backdrop-blur-md shadow-md border-b border-[#E2D9CA] py-2.5 sm:py-3'
          : 'bg-[#FAF7EE] border-b border-[#E2D9CA] py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Brand Identity with Logo Image */}
          <div className="flex items-center space-x-3">
            {/* Mobile hamburger button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 -ml-2 text-[#2B1A11] hover:text-[#C59B6D] lg:hidden focus:outline-none transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a
              href="#"
              className="flex items-center space-x-3 group"
              onClick={e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {/* Circular Crest Badge */}
              <div className="relative">
                <img
                  src="/images/logo/badge.jpg"
                  alt="Thrift and Trend Seal"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#C59B6D] shadow-xs group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Wordmark and Tagline */}
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="font-display text-lg sm:text-xl font-black tracking-tight text-[#2B1A11] uppercase leading-none">
                    THRIFT <span className="text-[#C59B6D]">&</span> TREND
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] text-[#C59B6D] uppercase mt-0.5 font-mono">
                  WHERE STYLE MEETS SAVINGS
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Center Category Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[12px] font-bold tracking-wider uppercase text-[#2B1A11]">
            {navCategories.map(cat => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleNavCategory(cat.value)}
                  className={`relative px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#C59B6D] bg-[#F3EFE6] font-extrabold shadow-2xs'
                      : 'text-stone-700 hover:text-[#2B1A11] hover:bg-[#F3EFE6]/60'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* T&T Authenticity Lab link */}
            <a
              href="#grading-section"
              className="relative px-3 py-1.5 rounded-full text-stone-700 hover:text-[#264E36] hover:bg-[#E8F2EC]/60 transition-all duration-200 flex items-center space-x-1.5 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#264E36]" />
              <span>T&T Lab</span>
            </a>
          </nav>

          {/* Right Action Bar: Search, Sizing, User Auth, Admin Portal, Saved, Bag */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Search Input Container */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-white rounded-full px-3 py-1.5 border border-[#C59B6D] w-48 sm:w-64 transition-all duration-300 shadow-md animate-in fade-in zoom-in-95">
                  <Search className="w-3.5 h-3.5 text-[#C59B6D] mr-2 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search grails, styles..."
                    className="w-full bg-transparent text-xs text-[#2B1A11] placeholder-stone-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-stone-400 hover:text-black ml-1 p-0.5 rounded-full hover:bg-stone-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#2B1A11] hover:text-[#C59B6D] rounded-full hover:bg-[#F3EFE6] transition-colors"
                  title="Search footwear"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sizing Unit Switcher (EU / US) */}
            <div className="hidden md:flex items-center border border-[#E2D9CA] rounded-full p-0.5 bg-[#F3EFE6] text-[10px] font-bold tracking-wider">
              {(['EU', 'US'] as const).map(unit => (
                <button
                  key={unit}
                  onClick={() => setSizeUnit(unit)}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    sizeUnit === unit
                      ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-xs'
                      : 'text-stone-600 hover:text-[#2B1A11]'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>

            {/* Saved Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#2B1A11] hover:text-[#C59B6D] rounded-full hover:bg-[#F3EFE6] transition-colors"
              title="Saved Grails"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C59B6D] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Admin Dashboard Quick Launch (When Master Admin is logged in) */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminDashboardOpen(!isAdminDashboardOpen)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#1F140E] text-[#C59A6F] border border-[#C59A6F] hover:bg-[#2C1D14] transition-all text-xs font-bold tracking-wider uppercase shadow-xs"
                title="Open Admin Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            {/* User Account / Customer Login */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F3EFE6] border border-[#C59B6D]/40 text-[#2B1A11] hover:bg-[#EAE3D4] transition-all text-xs font-semibold"
                    title="Account details"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#C59B6D] text-[#1F140E] flex items-center justify-center text-[10px] font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.fullName.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#C59B6D]" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#1F140E]/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-[#1F140E]/10">
                        <p className="text-xs font-bold text-[#1F140E] truncate">{user.fullName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#C59A6F]/15 text-[#C59A6F] text-[9px] font-bold rounded uppercase tracking-wider">
                          Verified {user.role}
                        </span>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsAdminDashboardOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-[#1F140E] hover:bg-[#FAF7EE] flex items-center gap-2 font-bold transition-colors bg-[#FAF7EE]/50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#C59A6F]" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsOrderHistoryOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#1F140E] hover:bg-[#FAF7EE] flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#C59A6F]" />
                          <span>My Orders</span>
                        </span>
                        {orders.length > 0 && (
                          <span className="bg-[#1F140E] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                            {orders.length}
                          </span>
                        )}
                      </button>

                      <div className="my-1 border-t border-[#1F140E]/10" />

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-[#C59B6D]/60 text-[#2B1A11] hover:bg-[#F3EFE6] transition-all text-xs font-bold tracking-wider uppercase shadow-2xs"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#C59B6D]" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-1.5 bg-[#2B1A11] text-[#FAF7EE] hover:bg-[#3D2517] px-3.5 sm:px-4 py-2 sm:py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.2 cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span className="text-[11px] font-bold tracking-wider uppercase hidden sm:inline">
                Bag
              </span>
              <span className="bg-[#C59B6D] text-[#2B1A11] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#E2D9CA] animate-in slide-in-from-top-2 duration-200 pb-3">
            
            {/* User status card on mobile */}
            <div className="mb-3 p-3 bg-white rounded-2xl border border-[#E2D9CA] shadow-2xs">
              {isAuthenticated && user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#C59B6D] text-[#1F140E] flex items-center justify-center text-xs font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2B1A11] truncate">{user.fullName}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-mono font-bold text-[#264E36] bg-[#E8F2EC] px-2 py-0.5 rounded-full shrink-0">
                      Verified {user.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] font-bold">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsOrderHistoryOpen(true);
                      }}
                      className="py-1.5 px-2 bg-[#FAF7EE] hover:bg-[#EAE3D4] text-[#2B1A11] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-[#C59B6D]" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-stone-600 font-medium text-center">
                    Sign in to unlock your cart and save footwear grails
                  </p>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#C59B6D]" />
                    <span>Sign In or Register</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1 text-xs tracking-wider uppercase font-bold text-[#2B1A11]">
              <span className="text-[10px] font-mono text-stone-400 px-2 pt-1 pb-0.5 tracking-widest uppercase">
                Categories
              </span>
              {navCategories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleNavCategory(cat.value)}
                  className="text-left py-2 px-3 text-[#2B1A11] hover:text-[#C59B6D] hover:bg-[#F3EFE6] rounded-xl transition-colors cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}

              <a
                href="#grading-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 text-[#264E36] flex items-center space-x-2 hover:bg-[#E8F2EC] rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#264E36]" />
                <span>T&T Lab & Legit Check</span>
              </a>

              {/* Mobile Sizing Scale Switcher */}
              <div className="pt-3 pb-1 px-3 flex items-center justify-between border-t border-[#E2D9CA]">
                <span className="text-stone-500 text-[10px] font-mono">Sizing Scale:</span>
                <div className="flex space-x-1">
                  {(['EU', 'US'] as const).map(unit => (
                    <button
                      key={unit}
                      onClick={() => setSizeUnit(unit)}
                      className={`px-3 py-1 text-[10px] rounded-full font-bold transition-all cursor-pointer ${
                        sizeUnit === unit ? 'bg-[#2B1A11] text-[#FAF7EE]' : 'bg-[#ECE5D8] text-[#2B1A11]'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Fit Guide Trigger */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSizeGuideOpen(true);
                }}
                className="text-left py-2 px-3 text-[#C59B6D] flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Size & Fit Guide</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
