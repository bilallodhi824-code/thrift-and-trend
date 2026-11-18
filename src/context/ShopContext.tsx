import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Shoe, CartItem, ShoeColor, ShoeCategory, GenderCategory, SortOption } from '../types/shoe';
import { SHOES } from '../data/products';
import { api, tokenStorage, User, OrderSummary, CreateOrderPayload } from '../services/api';

interface CheckoutInfo {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
}

interface ShopContextType {
  shoes: Shoe[];
  refreshShoes: () => Promise<void>;
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  activeShoeModal: Shoe | null;
  setActiveShoeModal: (shoe: Shoe | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ShoeCategory;
  setSelectedCategory: (cat: ShoeCategory) => void;
  selectedGender: GenderCategory;
  setSelectedGender: (gender: GenderCategory) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  sizeUnit: 'EU' | 'US' | 'UK';
  setSizeUnit: (unit: 'EU' | 'US' | 'UK') => void;
  toastMessage: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  addToCart: (shoe: Shoe, color: ShoeColor, size: number, quantity?: number) => void;
  removeFromCart: (shoeId: string, colorName: string, size: number) => void;
  updateQuantity: (shoeId: string, colorName: string, size: number, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (shoeId: string) => void;
  isInWishlist: (shoeId: string) => boolean;
  cartCount: number;
  subtotal: number;
  totalMarketValue: number;
  totalSavings: number;
  shipping: number;
  total: number;

  // Auth & Cloud database state
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { fullName: string; email: string; password: string; phone?: string; address?: string; city?: string; postalCode?: string }) => Promise<void>;
  logout: () => void;
  orders: OrderSummary[];
  loadOrders: () => Promise<void>;
  checkoutOrder: (shippingInfo: CheckoutInfo) => Promise<OrderSummary>;
  lastCompletedOrder: OrderSummary | null;
  setLastCompletedOrder: (order: OrderSummary | null) => void;
  isPlacingOrder: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoes, setShoes] = useState<Shoe[]>(SHOES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tandt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tandt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState<User | null>(() => tokenStorage.getUser());
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<OrderSummary | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [activeShoeModal, setActiveShoeModal] = useState<Shoe | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoeCategory>('all');
  const [selectedGender, setSelectedGender] = useState<GenderCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [sizeUnit, setSizeUnit] = useState<'EU' | 'US' | 'UK'>('EU');

  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Fetch shoes from cloud database backend if available
  const refreshShoes = useCallback(async () => {
    try {
      const dbShoes = await api.products.getAll();
      if (dbShoes && dbShoes.length > 0) {
        setShoes(dbShoes);
      }
    } catch (err: any) {
      console.warn('Using local fallback shoes:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshShoes();
  }, [refreshShoes]);

  // Sync profile on mount if token exists
  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      api.auth.getProfile()
        .then(u => setUser(u))
        .catch(() => {
          tokenStorage.remove();
          setUser(null);
        });
    }
  }, []);

  const loadOrders = useCallback(async () => {
    if (!tokenStorage.get()) return;
    try {
      const myOrders = await api.orders.getMyOrders();
      setOrders(myOrders);
    } catch (err: any) {
      console.warn('Could not fetch orders:', err.message);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user, loadOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('tandt_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tandt_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    setUser(res.user);
    showToast(`Welcome back, ${res.user.fullName}!`, 'success');
    await loadOrders();
    if (res.user.role === 'admin') {
      setIsAdminDashboardOpen(true);
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  }) => {
    const res = await api.auth.register(payload);
    setUser(res.user);
    showToast(`Account created! Welcome to Thrift & Trend, ${res.user.fullName}.`, 'success');
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setOrders([]);
    setIsAdminDashboardOpen(false);
    showToast('You have been signed out.', 'info');
  };

  const addToCart = (shoe: Shoe, color: ShoeColor, size: number, quantity = 1) => {
    if (!user) {
      showToast('Please sign in or create an account to add items to your bag.', 'info');
      setIsAuthModalOpen(true);
      return;
    }

    setCart(prev => {
      const index = prev.findIndex(
        item => item.shoe.id === shoe.id && item.selectedColor.name === color.name && item.selectedSize === size
      );
      if (index > -1) {
        const next = [...prev];
        next[index].quantity += quantity;
        return next;
      }
      return [...prev, { shoe, selectedColor: color, selectedSize: size, quantity }];
    });
    showToast(`Added ${shoe.name} (${color.name}, ${sizeUnit} ${size}) to your bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (shoeId: string, colorName: string, size: number) => {
    setCart(prev =>
      prev.filter(
        item => !(item.shoe.id === shoeId && item.selectedColor.name === colorName && item.selectedSize === size)
      )
    );
  };

  const updateQuantity = (shoeId: string, colorName: string, size: number, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.shoe.id === shoeId && item.selectedColor.name === colorName && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (shoeId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(shoeId);
      const targetShoe = shoes.find(s => s.id === shoeId);
      if (exists) {
        showToast(`Removed from your saved grails.`, 'info');
        return prev.filter(id => id !== shoeId);
      } else {
        showToast(`Saved ${targetShoe?.name || 'item'} to your wishlist.`, 'success');
        return [...prev, shoeId];
      }
    });
  };

  const isInWishlist = (shoeId: string) => wishlist.includes(shoeId);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.shoe.price * item.quantity, 0);
  const totalMarketValue = cart.reduce((sum, item) => sum + item.shoe.originalPrice * item.quantity, 0);
  const totalSavings = Math.max(0, totalMarketValue - subtotal);
  const shipping = subtotal >= 3500 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const checkoutOrder = async (shippingInfo: CheckoutInfo): Promise<OrderSummary> => {
    if (cart.length === 0) {
      throw new Error('Your shopping bag is empty.');
    }

    setIsPlacingOrder(true);
    try {
      const payload: CreateOrderPayload = {
        customerName: shippingInfo.name,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country || 'Pakistan',
        items: cart.map(item => ({
          shoeId: item.shoe.id,
          name: item.shoe.name,
          colorName: item.selectedColor.name,
          sizeEU: item.selectedSize,
          price: item.shoe.price,
          originalPrice: item.shoe.originalPrice,
          quantity: item.quantity,
        })),
      };

      const res = await api.orders.create(payload);
      const createdOrder = res.order;

      // Update state
      setLastCompletedOrder(createdOrder);
      clearCart();
      await loadOrders();
      showToast(`Order ${createdOrder.id} confirmed! Thank you for your purchase.`, 'success');
      return createdOrder;
    } catch (err: any) {
      showToast(err.message || 'Checkout failed. Please try again.', 'error');
      throw err;
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        shoes,
        refreshShoes,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
        activeShoeModal,
        setActiveShoeModal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedGender,
        setSelectedGender,
        sortBy,
        setSortBy,
        sizeUnit,
        setSizeUnit,
        toastMessage,
        showToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        subtotal,
        totalMarketValue,
        totalSavings,
        shipping,
        total,

        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        orders,
        loadOrders,
        checkoutOrder,
        lastCompletedOrder,
        setLastCompletedOrder,
        isPlacingOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
