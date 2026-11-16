import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShoeCategory, GenderCategory, SortOption } from '../types/shoe';

const CATEGORIES: { label: string; value: ShoeCategory }[] = [
  { label: 'All Vault Drops', value: 'all' },
  { label: 'Streetwear Heat', value: 'lifestyle' },
  { label: 'Running & Track', value: 'running' },
  { label: 'Suede Boots', value: 'boots' },
  { label: 'Savile Oxfords', value: 'formal' },
  { label: 'Trail & Alpine', value: 'trail' },
];

const GENDERS: { label: string; value: GenderCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Men', value: 'men' },
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

  const isFiltered =
    selectedCategory !== 'all' || selectedGender !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="py-4 border-b border-[#E2D9CA] sticky top-[69px] z-30 bg-[#FAF7EE]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-sm'
                      : 'text-stone-700 hover:text-black hover:bg-[#E8E2D5]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right Section: Gender filter, Sort Dropdown & Count */}
          <div className="flex items-center justify-between md:justify-end space-x-3 text-xs">
            
            {/* Gender filter pills */}
            <div className="flex items-center border border-[#E2D9CA] rounded-full p-0.5 bg-[#F3EFE6]">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setSelectedGender(g.value)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors ${
                    selectedGender === g.value
                      ? 'bg-[#2B1A11] text-[#FAF7EE] shadow-xs'
                      : 'text-stone-700 hover:text-black'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5">
              <span className="text-stone-500 text-[11px] uppercase tracking-wider hidden sm:inline font-mono font-bold">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                aria-label="Sort Drops"
                className="bg-white border border-[#E2D9CA] text-[#2B1A11] text-[11px] font-bold uppercase tracking-wider rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C59B6D] cursor-pointer shadow-xs"
              >
                <option value="featured">Featured Drops</option>
                <option value="savings-desc">Biggest Savings ($$$)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="condition">10/10 Deadstock First</option>
              </select>
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center space-x-1 text-stone-500 hover:text-black p-2 rounded-full hover:bg-[#E8E2D5] transition-colors"
                title="Reset all filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Silhouette Count */}
            <span className="text-[11px] font-mono text-[#C59B6D] uppercase tracking-widest pl-2 border-l border-[#E2D9CA] hidden lg:inline font-bold">
              {totalCount} Grails
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};
