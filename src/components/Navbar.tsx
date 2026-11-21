import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MessageCircle,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { WHATSAPP_PHONE } from '../utils/whatsapp';

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
      setIsScrolled(window.scrollY > 20);
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
    { label: 'Formal', value: 'formal' as const },
    { label: 'Trail', value: 'trail' as const },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7EE]/90 backdrop-blur-xl shadow-xs border-b border-[#E5DDD0] py-2.5 sm:py-3'
          : 'bg-[#FAF7EE] border-b border-[#E5DDD0]/80 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Brand Identity */}
          <div className="flex items-center space-x-3">
            {/* Mobile hamburger button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 -ml-2 text-[#2B1A11] hover:text-[#C59B6D] lg:hidden focus:outline-none transition-colors rounded-full hover:bg-stone-100/50"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>

            <a
              href="#"
              className="flex items-center space-x-3 group"
              onClick={e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {/* Circular Logo Badge */}
              <div className="relative">
                <img
                  src="/images/logo/badge.jpg"
                  alt="Thrift and Trend Seal"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#C59B6D]/80 shadow-xs group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Wordmark and Tagline with Syne Display font */}
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#2B1A11] uppercase leading-none">
                    THRIFT <span className="text-[#C59B6D]">&</span> TREND
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono font-semibold tracking-[0.22em] text-[#A67C52] uppercase mt-0.5">
                  CURATED FOOTWEAR • PAKISTAN
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Center Category Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 text-[12px] font-bold tracking-wider uppercase text-[#2B1A11]">
            {navCategories.map(cat => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleNavCategory(cat.value)}
                  className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#2B1A11] font-extrabold bg-[#EFE8DC] shadow-2xs'
                      : 'text-stone-600 hover:text-[#2B1A11] hover:bg-[#F3EFE6]/70'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full border border-[#C59B6D]/60 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* T&T Authenticity Lab link */}
            <a
              href="#grading-section"
              className="relative px-3.5 py-1.5 rounded-full text-stone-600 hover:text-[#264E36] hover:bg-[#E8F2EC]/60 transition-all duration-200 flex items-center space-x-1.5 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#264E36]" />
              <span>T&T Lab</span>
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Search Input Container */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="flex items-center bg-white rounded-full px-3 py-1.5 border border-[#C59B6D] shadow-md"
                  >
                    <Search className="w-3.5 h-3.5 text-[#C59B6D] mr-2 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search shoes..."
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
                  </motion.div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-[#2B1A11] hover:text-[#C59B6D] rounded-full hover:bg-[#F3EFE6] transition-colors"
                    title="Search footwear"
                  >
                    <Search className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Sizing Unit Switcher (EU / US) */}
            <div className="hidden md:flex items-center border border-[#E5DDD0] rounded-full p-0.5 bg-[#F3EFE6] text-[10px] font-mono font-bold tracking-wider">
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

            {/* WhatsApp Direct Helpline */}
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#1F140E] hover:text-white border border-[#25D366]/40 transition-all text-xs font-bold shadow-2xs group"
              title="Chat with Us on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] group-hover:text-white transition-colors" />
              <span className="hidden md:inline font-sans font-semibold">WhatsApp</span>
            </a>

            {/* Saved Wishlist */}
            <motion.button
              whileTap={{ scale: 0.92 }}
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
            </motion.button>

            {/* Admin Dashboard Quick Launch */}
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
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#1F140E]/10 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-[#1F140E]/10">
                          <p className="text-xs font-bold text-[#1F140E] truncate">{user.fullName}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#C59A6F]/15 text-[#C59A6F] text-[9px] font-mono font-bold rounded uppercase tracking-wider">
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
                            <span className="bg-[#1F140E] text-white text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-[#C59B6D]/60 text-[#2B1A11] hover:bg-[#F3EFE6] transition-all text-xs font-bold tracking-wider uppercase shadow-2xs"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#C59B6D]" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-1.5 bg-[#2B1A11] text-[#FAF7EE] hover:bg-[#3D2517] px-3.5 sm:px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C59B6D]" />
              <span className="text-[11px] font-bold tracking-wider uppercase hidden sm:inline">
                Bag
              </span>
              <span className="bg-[#C59B6D] text-[#2B1A11] text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full ml-0.5">
                {cartCount}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Framer Motion */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden mt-3 pt-3 border-t border-[#E5DDD0] pb-3"
            >
              {/* User status card on mobile */}
              <div className="mb-3 p-3 bg-white rounded-2xl border border-[#E5DDD0] shadow-2xs">
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
                      Sign in to unlock cart sync and save footwear grails
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
                    className="text-left py-2 px-3 text-[#2B1A11] hover:text-[#C59B6D] hover:bg-[#F3EFE6] rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{cat.label}</span>
                    <span className="text-stone-400 text-[10px] font-mono">→</span>
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

                {/* Mobile WhatsApp link */}
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 text-[#1F140E] flex items-center space-x-2 hover:bg-[#25D366]/10 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Helpline (+92 300 8241986)</span>
                </a>

                {/* Mobile Sizing Scale Switcher */}
                <div className="pt-3 pb-1 px-3 flex items-center justify-between border-t border-[#E5DDD0]">
                  <span className="text-stone-500 text-[10px] font-mono">Sizing Scale:</span>
                  <div className="flex space-x-1">
                    {(['EU', 'US'] as const).map(unit => (
                      <button
                        key={unit}
                        onClick={() => setSizeUnit(unit)}
                        className={`px-3 py-1 text-[10px] rounded-full font-mono font-bold transition-all cursor-pointer ${
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
