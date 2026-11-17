import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Shoe } from '../types/shoe';
import { SearchX, LayoutGrid, Columns, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductGrid: React.FC<{ shoes: Shoe[] }> = ({ shoes }) => {
  const { setSelectedCategory, setSearchQuery } = useShop();
  const [columnsMode, setColumnsMode] = useState<4 | 2>(4);

  if (shoes.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[#F3EFE6] flex items-center justify-center mx-auto mb-4 text-[#C59B6D]">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="font-display text-lg font-bold uppercase tracking-wider text-[#2B1A11] mb-2">
          No matching footwear grails found
        </h3>
        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          We could not locate any models matching your active filters. Reset your filters to view all available footwear.
        </p>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          className="bg-[#2B1A11] text-[#FAF7EE] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#3D2517] transition-colors shadow-sm"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E2D9CA] gap-4">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#C59B6D] uppercase flex items-center space-x-1.5 mb-1 font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>Curated Collection • Up to 60% Below Retail</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#2B1A11]">
            Curated Grails & Streetwear Heat
          </h2>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-stone-500 hidden md:inline font-mono">
            {shoes.length} Grails Live
          </span>

          <div className="flex items-center border border-[#E2D9CA] rounded-full p-0.5 bg-[#F3EFE6]">
            <button
              onClick={() => setColumnsMode(4)}
              className={`p-1.5 rounded-full transition-colors ${
                columnsMode === 4 ? 'bg-[#2B1A11] text-[#FAF7EE]' : 'text-stone-500 hover:text-black'
              }`}
              title="4-Column Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setColumnsMode(2)}
              className={`p-1.5 rounded-full transition-colors ${
                columnsMode === 2 ? 'bg-[#2B1A11] text-[#FAF7EE]' : 'text-stone-500 hover:text-black'
              }`}
              title="2-Column Editorial View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Shoe Cards */}
      <div
        className={`grid gap-3 sm:gap-6 lg:gap-8 ${
          columnsMode === 4
            ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {shoes.map(shoe => (
          <ProductCard key={shoe.id} shoe={shoe} />
        ))}
      </div>

    </div>
  );
};
