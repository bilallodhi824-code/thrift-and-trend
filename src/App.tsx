import React, { useMemo } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ConditionGuide } from './components/ConditionGuide';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AuthModal } from './components/AuthModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BrandPhilosophy } from './components/BrandPhilosophy';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const FootwearShopContent: React.FC = () => {
  const {
    shoes,
    selectedCategory,
    selectedGender,
    searchQuery,
    sortBy,
  } = useShop();

  // Filtered and sorted shoes
  const filteredShoes = useMemo(() => {
    return shoes
      .filter(shoe => {
        // Category filter
        if (selectedCategory !== 'all' && shoe.category !== selectedCategory) {
          return false;
        }

        // Gender filter
        if (selectedGender !== 'all') {
          if (shoe.gender !== selectedGender && shoe.gender !== 'unisex') {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchName = shoe.name.toLowerCase().includes(q);
          const matchSub = shoe.subtitle.toLowerCase().includes(q);
          const matchCategory = shoe.category.toLowerCase().includes(q);
          const matchDesc = shoe.description.toLowerCase().includes(q);
          const matchCondition = shoe.condition.toLowerCase().includes(q);
          const matchUpper = shoe.specs?.upper?.toLowerCase().includes(q);
          const matchHighlights = shoe.highlights?.some(h => h.toLowerCase().includes(q));
          if (!matchName && !matchSub && !matchCategory && !matchDesc && !matchCondition && !matchUpper && !matchHighlights) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'savings-desc') {
          const savingsA = a.originalPrice - a.price;
          const savingsB = b.originalPrice - b.price;
          return savingsB - savingsA;
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'condition') {
          const aDs = a.condition.includes('10/10') ? 2 : a.condition.includes('9.5') ? 1 : 0;
          const bDs = b.condition.includes('10/10') ? 2 : b.condition.includes('9.5') ? 1 : 0;
          return bDs - aDs;
        }
        return 0; // featured
      });
  }, [shoes, selectedCategory, selectedGender, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-[#2B1A11] font-sans selection:bg-[#2B1A11] selection:text-[#FAF7EE]">
      {/* 1. Global Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Header Navigation with Official T&T Logo, Auth & Admin Launcher */}
      <Navbar />

      <main className="flex-1">
        {/* 3. Cinematic Hero: "WHERE STYLE MEETS SAVINGS" */}
        <Hero />

        {/* 4. Condition Grading & Quality Standard */}
        <ConditionGuide />

        {/* 5. Filter & Sorter Toolbar */}
        <FilterBar totalCount={filteredShoes.length} />

        {/* 6. Product Grid */}
        <ProductGrid shoes={filteredShoes} />

        {/* 7. Brand Philosophy & Quality Footwear */}
        <BrandPhilosophy />
      </main>

      {/* 8. Comprehensive Footer with T&T Crest & Storefronts */}
      <Footer />

      {/* Drawers & Modals */}
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <SizeGuideModal />
      <AuthModal />
      <OrderHistoryModal />
      <AdminDashboard />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <FootwearShopContent />
    </ShopProvider>
  );
}

export default App;
