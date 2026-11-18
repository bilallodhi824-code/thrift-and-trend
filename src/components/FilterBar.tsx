import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, SlidersHorizontal, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShoeCategory, GenderCategory, SortOption } from '../types/shoe';

interface CategoryOption {
  label: string;
  value: ShoeCategory;
  count?: number;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'All Shoes', value: 'all' },
  { label: 'Court & Streetwear', value: 'lifestyle' },
  { label: 'Running & Track', value: 'running' },
  { label: 'Chelsea & Boots', value: 'boots' },
  { label: 'Formal Oxfords', value: 'formal' },
  { label: 'Trail & Outdoor', value: 'trail' },
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

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="py-3 sm:py-4 border-b border-[#E2D9CA] sticky top-[65px] sm:top-[69px] z-30 bg-[#FAF7EE]/95 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Container: flex on desktop, structured wrap */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
          
          {/* Left: Category Navigation Pills with smooth horizontal scrolling */}
          <div className="relative flex items-center min-w-0">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 w-full scroll-smooth">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-md border border-[#2B1A11] scale-[1.02]'
                        : 'bg-white/80 border border-[#E2D9CA] text-stone-700 hover:text-[#2B1A11] hover:bg-[#EAE3D4] hover:border-[#C59B6D]/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D] animate-pulse" />}
                      <span>{cat.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Section: Gender Controls, Custom Animated Sort Dropdown & Vault Count */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5 sm:gap-3 flex-shrink-0 pt-1 lg:pt-0">
            
            {/* Gender filter segmented control */}
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
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#FAF7EE]/98 backdrop-blur-xl border border-[#C59B6D]/40 shadow-2xl rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
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

            {/* Reset Filters Button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-stone-600 hover:text-black p-2 rounded-full hover:bg-[#EAE3D4] transition-all duration-150 cursor-pointer border border-[#E2D9CA] bg-white shadow-2xs"
                title="Reset all filters"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C59B6D] hover:rotate-180 transition-transform duration-300" />
                <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Silhouette Vault Count Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-[#E2D9CA] text-[11px] font-mono text-[#2B1A11] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#264E36] animate-pulse" />
              <span>{totalCount} Grails</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
