import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock, MapPin, Tag, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/currency';

export const OrderHistoryModal: React.FC = () => {
  const { isOrderHistoryOpen, setIsOrderHistoryOpen, orders, user } = useShop();

  if (!isOrderHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1F140E]/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOrderHistoryOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#C59A6F]/30 overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#1F140E] p-6 text-white relative shrink-0">
          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-[#FAF7F2]/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C59A6F]/20 border border-[#C59A6F]/40 flex items-center justify-center p-1 overflow-hidden">
              <Package className="w-5 h-5 text-[#C59A6F]" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wider font-semibold uppercase text-[#FAF7F2]">
                Order History & Tracking
              </h2>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#C59A6F] font-medium">
                {user ? `${user.fullName}'s MSSQL Verified Orders` : 'Purchases Recorded in Database'}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C59A6F]/10 border border-[#C59A6F]/20 flex items-center justify-center text-[#C59A6F]">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1F140E] uppercase tracking-wider mb-1">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                Your purchased deadstock and authenticated grails will be cataloged here with live tracking numbers.
              </p>
              <button
                onClick={() => {
                  setIsOrderHistoryOpen(false);
                }}
                className="px-6 py-2.5 bg-[#1F140E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#2C1D14] transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Browse Footwear Grails</span>
                <ArrowUpRight className="w-4 h-4 text-[#C59A6F]" />
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-[#1F140E]/10 shadow-sm hover:border-[#C59A6F]/50 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1F140E]/10 pb-3">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold block">
                      Order Reference
                    </span>
                    <span className="font-mono text-sm font-bold text-[#1F140E]">
                      {order.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-[11px] font-semibold tracking-wider uppercase">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{order.status || 'Confirmed'}</span>
                    </span>
                  </div>
                </div>

                {/* Tracking & Logistics Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#C59A6F]/20 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1 mb-1">
                      <Truck className="w-3.5 h-3.5 text-[#C59A6F]" />
                      <span>Tracking Number</span>
                    </span>
                    <span className="font-mono font-semibold text-[#1F140E] bg-white px-2 py-0.5 rounded border border-[#1F140E]/10">
                      {order.trackingNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C59A6F]" />
                      <span>Destination</span>
                    </span>
                    <span className="text-[#1F140E] font-medium truncate block" title={order.shippingAddress}>
                      {order.shippingAddress}
                    </span>
                  </div>
                </div>

                {/* Savings & Financials Summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    {order.totalSavings > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saved {formatPrice(order.totalSavings)} Below Retail</span>
                      </span>
                    )}
                    <span className="text-xs text-gray-500 font-medium">
                      {order.itemCount} {order.itemCount === 1 ? 'pair' : 'pairs'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Paid</span>
                    <span className="text-base font-bold font-serif text-[#1F140E]">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#1F140E]/5 px-6 py-3 border-t border-[#1F140E]/10 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C59A6F]" />
            <span>MSSQL Verified • 12-Point Authentication Authenticated</span>
          </span>
          <span>{orders.length} Total Orders</span>
        </div>

      </div>
    </div>
  );
};
