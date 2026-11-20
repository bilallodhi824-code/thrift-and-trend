import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, ShoppingBag, Tag, Package, UserCheck, MessageCircle, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/currency';
import { getWhatsAppCartOrderUrl, getWhatsAppOrderConfirmationUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalMarketValue,
    totalSavings,
    shipping,
    total,
    sizeUnit,
    showToast,
    user,
    isAuthenticated,
    setIsAuthModalOpen,
    setIsOrderHistoryOpen,
    checkoutOrder,
    lastCompletedOrder,
    setLastCompletedOrder,
    isPlacingOrder,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Guest checkout inputs if not logged in
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [guestPostalCode, setGuestPostalCode] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleCloseCart = () => {
    setLastCompletedOrder(null);
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  const freeShippingThreshold = 3500;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'TREND10' || code === 'THRIFT10') {
      setDiscountPercent(10);
      showToast('Promo code applied: Extra 10% Savings!');
    } else if (code === 'SAVINGS15' || code === 'VIP15') {
      setDiscountPercent(15);
      showToast('VIP Promo code applied: Extra 15% Savings!');
    } else {
      showToast('Invalid code. Try TREND10 or SAVINGS15', 'info');
    }
  };

  const handleCheckoutClick = async () => {
    if (!isAuthenticated) {
      if (!showGuestForm) {
        setShowGuestForm(true);
        showToast('Complete your shipping details below or sign in to save orders.', 'info');
        return;
      }

      // Validate guest fields
      if (!guestName || !guestEmail || !guestAddress || !guestCity || !guestPostalCode) {
        showToast('Please fill in your shipping details for checkout.', 'error');
        return;
      }

      try {
        await checkoutOrder({
          name: guestName,
          email: guestEmail,
          address: guestAddress,
          city: guestCity,
          postalCode: guestPostalCode,
        });
      } catch {
        // error already toasted
      }
      return;
    }

    // Authenticated checkout
    if (user) {
      try {
        await checkoutOrder({
          name: user.fullName,
          email: user.email,
          address: user.address || 'Commercial Area, Phase 5, DHA',
          city: user.city || 'Karachi',
          postalCode: user.postalCode || '75500',
          country: 'Pakistan',
        });
      } catch {
        // error handled in shop context
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/75 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={handleCloseCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E2D9CA]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2D9CA] flex items-center justify-between bg-[#FAF7EE]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#2B1A11]" />
              <h2 className="font-display text-sm font-black uppercase tracking-wider text-[#2B1A11]">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={handleCloseCart}
              className="p-1.5 text-stone-400 hover:text-black rounded-full hover:bg-[#E8E2D5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            
            {lastCompletedOrder && (!user || user.role !== 'admin') ? (
              <div className="py-8 text-center space-y-4 animate-slide-up">
                <div className="w-16 h-16 rounded-full bg-[#E8F2EC] text-[#264E36] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#264E36] bg-[#E8F2EC] px-3 py-1 rounded-full">
                    Verified & Encrypted Order
                  </span>
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-[#2B1A11] mt-2">
                    Grail Order Confirmed!
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto mt-1">
                    Your authenticated footwear order has been securely placed and cataloged.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF7EE] rounded-2xl border border-[#E2D9CA] text-left text-xs space-y-2.5">
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="font-medium">Order Reference:</span>
                    <span className="font-mono font-bold text-[#2B1A11] bg-white px-2 py-0.5 rounded border border-[#E2D9CA]">
                      {lastCompletedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="font-medium">Tracking Number:</span>
                    <span className="font-mono font-bold text-[#C59B6D] bg-white px-2 py-0.5 rounded border border-[#E2D9CA]">
                      {lastCompletedOrder.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Total Paid:</span>
                    <span className="font-bold text-[#2B1A11]">Rs. {lastCompletedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#264E36]">
                    <span>Total Thrift Savings:</span>
                    <span className="font-bold">-Rs. {lastCompletedOrder.totalSavings.toLocaleString()} Below Retail</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={getWhatsAppOrderConfirmationUrl(lastCompletedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Fast-Track & Confirm on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setLastCompletedOrder(null);
                      setIsCartOpen(false);
                      setIsOrderHistoryOpen(true);
                    }}
                    className="w-full bg-[#2B1A11] text-[#FAF7EE] py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3D2517] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-[#C59B6D]" />
                    <span>View In My Orders</span>
                  </button>

                  <button
                    onClick={() => {
                      setLastCompletedOrder(null);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-2 text-xs text-stone-600 hover:text-black uppercase tracking-wider font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F3EFE6] flex items-center justify-center mx-auto text-[#C59B6D]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#2B1A11]">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our curated collection of sneakers, runners, and timeless footwear.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#2B1A11] text-[#FAF7EE] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#3D2517] transition-colors shadow-sm"
                >
                  Explore Shoes
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Total Savings Hero Callout in Bag */}
                <div className="bg-[#264E36] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-[#C59B6D]" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Total Thrift Savings
                    </span>
                  </div>
                  <span className="text-sm font-black font-mono">
                    -{formatPrice(totalSavings + discountAmount)}
                  </span>
                </div>

                {/* Free Shipping Progress Indicator */}
                <div className="bg-[#FAF7EE] p-3.5 rounded-2xl border border-[#E2D9CA] text-xs">
                  {amountToFreeShipping === 0 ? (
                    <div className="flex items-center space-x-1.5 text-[#264E36] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Complimentary Nationwide Express Delivery Unlocked!</span>
                    </div>
                  ) : (
                    <div className="text-stone-700">
                      Add <span className="font-bold text-[#2B1A11]">{formatPrice(amountToFreeShipping)}</span> more for free delivery across Pakistan.
                    </div>
                  )}
                  <div className="w-full bg-[#E2D9CA] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#2B1A11] h-full rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Auth status banner */}
                {!isAuthenticated && (
                  <div className="p-3 bg-[#FAF7EE] rounded-2xl border border-[#C59B6D]/40 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2B1A11]">Have an account?</p>
                      <p className="text-[10px] text-stone-500">Sign in for 1-click checkout and order tracking</p>
                    </div>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-3 py-1.5 bg-[#2B1A11] text-[#FAF7EE] rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[#3D2517] transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-stone-100">
                  {cart.map((item, index) => (
                    <div key={`${item.shoe.id}-${item.selectedColor.name}-${item.selectedSize}-${index}`} className="py-4 flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-[#FAF7EE] rounded-xl overflow-hidden flex-shrink-0 border border-[#E2D9CA] p-2 flex items-center justify-center">
                        <img
                          src={item.shoe.images[0]}
                          alt={item.shoe.name}
                          className="w-full h-full object-contain object-center filter drop-shadow-xs"
                        />
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1A11] font-display">
                              {item.shoe.name}
                            </h4>
                            <span className="text-xs font-black text-[#2B1A11] font-display">
                              {formatPrice(item.shoe.price * item.quantity)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-0.5">
                            <span className="text-[10px] text-[#264E36] font-bold">
                              {item.shoe.condition}
                            </span>
                            <span>•</span>
                            <span>{sizeUnit} {item.selectedSize}</span>
                          </div>

                          <div className="text-[10px] text-[#264E36] font-mono font-bold mt-0.5">
                            Saved {formatPrice((item.shoe.originalPrice - item.shoe.price) * item.quantity)}
                          </div>
                        </div>

                        {/* Quantity controls & remove */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#E2D9CA] rounded-full bg-[#FAF7EE] px-2 py-0.5 text-xs">
                            <button
                              onClick={() =>
                                updateQuantity(item.shoe.id, item.selectedColor.name, item.selectedSize, -1)
                              }
                              className="text-stone-600 hover:text-black p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-bold text-[#2B1A11]">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.shoe.id, item.selectedColor.name, item.selectedSize, 1)
                              }
                              className="text-stone-600 hover:text-black p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(item.shoe.id, item.selectedColor.name, item.selectedSize)
                            }
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Guest Shipping Address Form if triggered */}
                {!isAuthenticated && showGuestForm && (
                  <div className="p-4 bg-[#FAF7EE] rounded-2xl border border-[#C59B6D]/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2B1A11]">
                        Delivery Information
                      </span>
                      <button
                        onClick={() => setShowGuestForm(false)}
                        className="text-[10px] text-stone-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Full Name"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2D9CA] focus:outline-none focus:ring-1 focus:ring-[#C59B6D]"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2D9CA] focus:outline-none focus:ring-1 focus:ring-[#C59B6D]"
                    />
                    <input
                      type="text"
                      placeholder="Street Shipping Address"
                      value={guestAddress}
                      onChange={e => setGuestAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2D9CA] focus:outline-none focus:ring-1 focus:ring-[#C59B6D]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={guestCity}
                        onChange={e => setGuestCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2D9CA] focus:outline-none focus:ring-1 focus:ring-[#C59B6D]"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={guestPostalCode}
                        onChange={e => setGuestPostalCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2D9CA] focus:outline-none focus:ring-1 focus:ring-[#C59B6D]"
                      />
                    </div>
                  </div>
                )}

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. TREND10)"
                      className="flex-1 bg-[#F3EFE6] border border-[#E2D9CA] rounded-xl px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#C59B6D]"
                    />
                    <button
                      type="submit"
                      className="bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      Apply
                    </button>
                  </div>
                </form>

              </div>
            )}

          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && !lastCompletedOrder && (
            <div className="p-6 border-t border-[#E2D9CA] bg-[#FAF7EE] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span>Market Value Benchmark</span>
                  <span className="line-through text-stone-400 font-display">{formatPrice(totalMarketValue)}</span>
                </div>

                <div className="flex justify-between text-[#264E36] font-bold">
                  <span>Thrift Savings Discount</span>
                  <span>-{formatPrice(totalSavings)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#C59B6D] font-bold">
                    <span>VIP Code Discount ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Express Delivery</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#E2D9CA] text-sm font-black text-[#2B1A11]">
                  <span>Total Due</span>
                  <span className="font-display">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Verified account indicator */}
              {isAuthenticated && user && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#264E36] font-medium bg-[#E8F2EC] px-3 py-1.5 rounded-xl border border-[#264E36]/20">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Ordering as <strong>{user.fullName}</strong> ({user.email})</span>
                </div>
              )}

              {/* Standard Web Checkout */}
              <button
                onClick={handleCheckoutClick}
                disabled={isPlacingOrder}
                className="w-full bg-[#2B1A11] hover:bg-[#3D2517] text-[#FAF7EE] py-3.5 sm:py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Your Order...</span>
                  </span>
                ) : (
                  <>
                    <span>Checkout & Save {formatPrice(totalSavings + discountAmount)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B6D]" />
                  </>
                )}
              </button>

              {/* Direct WhatsApp Cart Order (Game Changer for Pakistan) */}
              <a
                href={getWhatsAppCartOrderUrl(cart, finalTotal, totalSavings + discountAmount, user?.fullName, user?.city)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order via WhatsApp (COD)</span>
              </a>

              {/* Courier Partners & Trust Badges */}
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-stone-500 border-t border-[#E2D9CA]/70">
                <div className="flex items-center space-x-1 text-[#264E36] font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>TCS / Trax COD</span>
                </div>
                <div className="flex items-center space-x-1.5 font-bold">
                  <span className="text-[#E51B24]">TCS</span>
                  <span>•</span>
                  <span className="text-[#0057B8]">TRAX</span>
                  <span>•</span>
                  <span className="text-[#2B1A11]">LEOPARDS</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-stone-500 uppercase tracking-widest pt-0.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#264E36]" />
                <span>7-Day Return Guarantee • 100% Authentic</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
