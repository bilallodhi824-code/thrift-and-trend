import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Sparkles,
  Flame,
  Zap,
  Shield,
  Briefcase,
  Compass,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShoeCategory, GenderCategory, SortOption } from '../types/shoe';

interface CategoryOption {
  label: string;
  value: ShoeCategory;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'All Shoes', value: 'all', icon: Sparkles },
  { label: 'Court & Streetwear', value: 'lifestyle', icon: Flame },
  { label: 'Running & Track', value: 'running', icon: Zap },
  { label: 'Chelsea & Boots', value: 'boots', icon: Shield },
  { label: 'Formal Oxfords', value: 'formal', icon: Briefcase },
  { label: 'Trail & Outdoor', value: 'trail', icon: Compass },
];

const GENDERS: { label: string; value: GenderCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Men', value: 'men' },
];

const SORT_OPTIONS: { value: SortOption; label: string; tag: string }[] = [
  { value: 'featured', label: 'Featured Drops', tag: 'Curated Vault Picks' },
  { value: 'savings-desc', label: 'Biggest Savings (Rs.)', tag: 'Highest Thrift Discounts' },
  { value: 'price-asc', label: 'Price: Low to High', tag: 'Most Affordable First' },
  { value: 'price-desc', label: 'Price: High to Low', tag: 'Collector Grails First' },
  { value: 'rating', label: 'Highest Rated', tag: '5.0★ Verified Reviews' },
  { value: 'condition', label: '10/10 Deadstock First', tag: 'Pristine Factory New' },
];

export const FilterBar: React.FC<{ totalCount: number }> = ({ totalCount }) => {
  const {
    shoes,
    selectedCategory,
    setSelectedCategory,
    selectedGender,
    setSelectedGender,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isFiltered =
    selectedCategory !== 'all' || selectedGender !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSearchQuery('');
    setSortBy('featured');
    setIsSortOpen(false);
  };

  const getCategoryCount = (val: ShoeCategory) => {
    if (val === 'all') return shoes.length;
    return shoes.filter(s => s.category === val).length;
  };

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="py-3 sm:py-3.5 border-b border-[#E2D9CA] sticky top-[65px] sm:top-[69px] z-30 bg-[#FAF7EE]/95 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
        
        {/* Tier 1: All 6 Categories - Responsive, fully visible, animated, never cut off */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat.value;
            const count = getCategoryCount(cat.value);
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`group relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                  active
                    ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-md border border-[#2B1A11] scale-[1.02] active-pill-glow'
                    : 'bg-white/90 border border-[#E2D9CA] text-stone-700 hover:text-[#2B1A11] hover:bg-[#F3EFE6] hover:border-[#C59B6D] hover:-translate-y-0.5 hover:shadow-xs active:scale-95'
                }`}
              >
                {active ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D] animate-ping shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 text-[#C59B6D] group-hover:scale-110 transition-transform shrink-0" />
                )}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                    active
                      ? 'bg-white/20 text-[#FAF7EE]'
                      : 'bg-[#F3EFE6] text-stone-500 group-hover:bg-[#EAE3D4]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tier 2: Refinements & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#E2D9CA]/60">
          
          {/* Left: Gender Filter & Reset */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-500 tracking-wider hidden sm:inline">
              Gender:
            </span>
            <div className="flex items-center border border-[#E2D9CA] rounded-full p-0.5 bg-[#F3EFE6] shadow-2xs">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setSelectedGender(g.value)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                    selectedGender === g.value
                      ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-xs'
                      : 'text-stone-700 hover:text-[#2B1A11]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Reset Filters Button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#2B1A11] px-3 py-1.5 rounded-full hover:bg-[#EAE3D4] transition-all duration-150 cursor-pointer border border-[#E2D9CA] bg-white shadow-2xs text-[11px] font-bold uppercase tracking-wider group"
                title="Reset all filters"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C59B6D] group-hover:rotate-180 transition-transform duration-300" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Custom Animated Sort Dropdown & Vault Count */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            
            {/* CUSTOM ANIMATED SORT DROPDOWN */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(prev => !prev)}
                className={`flex items-center gap-2 px-3.5 py-1.5 bg-white border rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs ${
                  isSortOpen
                    ? 'border-[#C59B6D] ring-2 ring-[#C59B6D]/20 bg-[#FBF9F4]'
                    : 'border-[#E2D9CA] hover:border-[#C59B6D] hover:bg-[#FAF7EE]'
                }`}
                title="Sort collection"
                aria-expanded={isSortOpen}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C59B6D]" />
                <span className="text-stone-400 font-mono text-[10px] hidden sm:inline">SORT:</span>
                <span className="text-[#2B1A11] font-semibold text-[11px] max-w-[130px] sm:max-w-none truncate">
                  {currentSort.label}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#C59B6D] transition-transform duration-300 ease-out ${
                    isSortOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Animated Floating Dropdown Panel */}
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#FAF7EE]/98 backdrop-blur-xl border border-[#C59B6D]/50 shadow-2xl rounded-2xl p-1.5 z-50 animate-dropdown">
                  <div className="px-3 py-2 border-b border-[#E2D9CA]/80 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#C59B6D] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#C59B6D]" />
                      <span>Sort Collection</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono font-semibold">
                      {totalCount} Items
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {SORT_OPTIONS.map(opt => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-sm font-bold'
                              : 'text-stone-700 hover:text-[#2B1A11] hover:bg-[#EAE3D4]/70'
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] sm:text-xs">{opt.label}</span>
                            <span
                              className={`text-[9px] font-mono tracking-wider ${
                                isSelected ? 'text-[#C59B6D]' : 'text-stone-400'
                              }`}
                            >
                              {opt.tag}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#C59B6D] shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Silhouette Vault Count Indicator */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-[#E2D9CA] text-[11px] font-mono text-[#2B1A11] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#264E36] animate-pulse" />
              <span>{totalCount} Grails</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
