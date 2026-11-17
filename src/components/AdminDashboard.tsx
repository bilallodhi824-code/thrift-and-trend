import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Truck,
  Plus,
  Trash2,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api, AdminStats, AdminOrder, AdminCustomer, NewProductPayload } from '../services/api';
import { formatPrice } from '../utils/currency';

export const AdminDashboard: React.FC = () => {
  const { isAdminDashboardOpen, setIsAdminDashboardOpen, user, showToast, refreshShoes } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New product form modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productForm, setProductForm] = useState<NewProductPayload>({
    name: '',
    subtitle: '',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '10/10 Deadstock',
    price: 150,
    originalPrice: 250,
    badge: 'NEW DROP',
    stock: 5,
    description: '',
    story: 'Curated premium footwear in authentic condition.',
    imageUrl: '/images/shoes/aero-velocity.jpg',
  });

  // Order status filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, o, c, p] = await Promise.all([
        api.admin.getStats().catch(() => null),
        api.admin.getOrders().catch(() => []),
        api.admin.getCustomers().catch(() => []),
        api.products.getAll().catch(() => []),
      ]);
      setStats(s);
      setOrders(o);
      setCustomers(c);
      setProducts(p);
    } catch (err: any) {
      showToast(err.message || 'Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAdminDashboardOpen) {
      fetchDashboardData();
    }
  }, [isAdminDashboardOpen, fetchDashboardData]);

  if (!isAdminDashboardOpen) return null;

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, newStatus, trackingNumber);
      showToast(`Order ${orderId} marked as ${newStatus}`, 'success');
      await fetchDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createProduct(productForm);
      showToast(`Product "${productForm.name}" created in MSSQL!`, 'success');
      setIsAddProductOpen(false);
      setProductForm({
        name: '',
        subtitle: '',
        category: 'lifestyle',
        gender: 'unisex',
        condition: '10/10 Deadstock',
        price: 150,
        originalPrice: 250,
        badge: 'NEW DROP',
        stock: 5,
        description: '',
        story: 'Curated premium footwear in authentic condition.',
        imageUrl: '/images/shoes/aero-velocity.jpg',
      });
      await fetchDashboardData();
      await refreshShoes();
    } catch (err: any) {
      showToast(err.message || 'Failed to create product in MSSQL', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}" from the MSSQL database?`)) {
      return;
    }
    try {
      await api.admin.deleteProduct(productId);
      showToast(`Product "${productName}" deleted from MSSQL.`, 'info');
      await fetchDashboardData();
      await refreshShoes();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(o => o.status.toLowerCase() === orderStatusFilter.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1F140E]/80 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      
      {/* Top Navigation & Status Bar */}
      <header className="bg-[#1F140E] border-b border-[#C59A6F]/30 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border border-[#C59A6F] overflow-hidden p-0.5 bg-[#FAF7EE]">
            <img src="/images/logo/badge.jpg" alt="Thrift & Trend Emblem" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-bold tracking-wider uppercase text-[#FAF7EE]">
                Thrift & Trend Portal
              </h1>
              <span className="px-2 py-0.5 bg-[#C59A6F]/20 text-[#C59A6F] border border-[#C59A6F]/40 text-[9px] font-bold rounded-full uppercase tracking-wider">
                MSSQL Database
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-[#C59A6F]/80">
              Admin: {user?.fullName || 'Administrator'} ({user?.email})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-stone-200 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C59A6F] ${loading ? 'animate-spin' : ''}`} />
            <span>Sync MSSQL</span>
          </button>

          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="px-4 py-1.5 bg-[#C59A6F] hover:bg-[#d6aa7f] text-[#1F140E] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#FAF7EE]">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-[#E2D9CA] p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto">
          <div className="space-y-1.5 w-full">
            <div className="text-[10px] font-bold tracking-widest uppercase text-stone-400 px-3 py-1">
              Management Suites
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#1F140E] text-[#FAF7EE] shadow-sm'
                  : 'text-stone-700 hover:bg-[#FAF7EE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#C59A6F]' : 'text-stone-400'}`} />
                <span>Overview KPIs</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#1F140E] text-[#FAF7EE] shadow-sm'
                  : 'text-stone-700 hover:bg-[#FAF7EE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#C59A6F]' : 'text-stone-400'}`} />
                <span>Customer Orders</span>
              </div>
              {orders.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeTab === 'orders' ? 'bg-[#C59A6F] text-[#1F140E]' : 'bg-stone-200 text-stone-800'}`}>
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === 'products'
                  ? 'bg-[#1F140E] text-[#FAF7EE] shadow-sm'
                  : 'text-stone-700 hover:bg-[#FAF7EE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-[#C59A6F]' : 'text-stone-400'}`} />
                <span>Catalog Inventory</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeTab === 'products' ? 'bg-[#C59A6F] text-[#1F140E]' : 'bg-stone-200 text-stone-800'}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#1F140E] text-[#FAF7EE] shadow-sm'
                  : 'text-stone-700 hover:bg-[#FAF7EE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${activeTab === 'customers' ? 'text-[#C59A6F]' : 'text-stone-400'}`} />
                <span>Customer Registry</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeTab === 'customers' ? 'bg-[#C59A6F] text-[#1F140E]' : 'bg-stone-200 text-stone-800'}`}>
                {customers.length}
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-500 hidden md:block">
            <p className="font-semibold text-stone-800">Microsoft SQL Server 2025</p>
            <p className="text-[10px] text-stone-400">Database: ThriftAndTrendDB</p>
            <p className="text-[10px] text-stone-400">Auth: JWT + Bcrypt</p>
          </div>
        </aside>

        {/* Right Tab Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2D9CA] pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#1F140E] uppercase tracking-wide">
                    Executive Performance Overview
                  </h2>
                  <p className="text-xs text-stone-500">
                    Live telemetry directly synchronized from Microsoft SQL Server.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 bg-[#1F140E] hover:bg-[#2C1D14] text-[#FAF7EE] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#C59A6F]" />
                  <span>Add Footwear Grail</span>
                </button>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E2D9CA] shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#C59A6F]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1F140E]">
                    {formatPrice(stats?.totalRevenue || 0)}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">Paid customer checkouts</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2D9CA] shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1F140E]">
                    {stats?.totalOrders || orders.length}
                  </div>
                  <p className="text-[10px] text-stone-500 font-semibold mt-1">MSSQL recorded orders</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2D9CA] shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Customer Savings</span>
                    <Tag className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-emerald-800">
                    {formatPrice(stats?.totalSavings || 0)}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">Delivered below retail value</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E2D9CA] shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Catalog Grails</span>
                    <Package className="w-4 h-4 text-[#C59A6F]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1F140E]">
                    {stats?.totalProducts || products.length}
                  </div>
                  <p className="text-[10px] text-stone-500 font-semibold mt-1">{stats?.totalInventoryUnits || 120} total units in stock</p>
                </div>
              </div>

              {/* Recent Orders Live Table */}
              <div className="bg-white rounded-2xl border border-[#E2D9CA] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F140E]">
                    Recent Order Transactions
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#C59A6F] font-bold uppercase hover:underline"
                  >
                    View All ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400">
                    No orders placed yet. Place a test order in the storefront bag!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E2D9CA] text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Tracking</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Savings</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-[#FAF7EE] transition-colors">
                            <td className="py-3 font-mono font-bold text-[#1F140E]">{o.id}</td>
                            <td className="py-3">
                              <p className="font-semibold text-stone-900">{o.customerName}</p>
                              <p className="text-[10px] text-stone-400">{o.customerEmail}</p>
                            </td>
                            <td className="py-3 font-mono text-[11px] text-[#C59A6F]">{o.trackingNumber}</td>
                            <td className="py-3 font-bold">{formatPrice(o.totalAmount)}</td>
                            <td className="py-3 text-emerald-700 font-bold">-{formatPrice(o.totalSavings)}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <select
                                value={o.status}
                                onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="px-2 py-1 text-[11px] bg-white border border-[#E2D9CA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2D9CA] pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#1F140E] uppercase tracking-wide">
                    Customer Orders ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Live orders placed through the customer cart, saved in MSSQL tables.
                  </p>
                </div>

                {/* Filter status */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-stone-500 font-bold">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E2D9CA] rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
                  >
                    <option value="all">All Orders ({orders.length})</option>
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#E2D9CA] space-y-2">
                  <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-sm font-bold text-stone-700 uppercase">No orders found</p>
                  <p className="text-xs text-stone-400">Orders created by shoppers will populate here in real-time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#E2D9CA] p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-black text-[#1F140E]">
                            {order.id}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-stone-500 uppercase">Status:</span>
                          <select
                            value={order.status}
                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 bg-[#FAF7EE] border border-[#C59A6F]/50 rounded-lg text-xs font-bold text-[#1F140E] focus:outline-none focus:ring-1 focus:ring-[#C59A6F]"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer and Logistics Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#FAF7EE] p-3.5 rounded-xl border border-[#E2D9CA]">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            Customer Details
                          </span>
                          <p className="font-bold text-stone-900">{order.customerName}</p>
                          <p className="text-stone-500">{order.customerEmail}</p>
                          {order.customerPhone && <p className="text-stone-500">{order.customerPhone}</p>}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            Shipping Destination
                          </span>
                          <p className="text-stone-800">{order.shippingAddress}</p>
                          <p className="text-stone-500">{order.city}, {order.postalCode} ({order.country})</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                            Courier Tracking Number
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Truck className="w-3.5 h-3.5 text-[#C59A6F]" />
                            <span className="font-mono font-bold text-[#1F140E] bg-white px-2 py-0.5 rounded border border-[#E2D9CA]">
                              {order.trackingNumber}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Itemized Lines */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                          Purchased Footwear Items ({order.items.length})
                        </span>
                        <div className="divide-y divide-stone-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-stone-900">{item.productName}</span>
                                <span className="text-stone-400 ml-2">Color: {item.colorName} • Size: EU {item.sizeEU}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-stone-500">{item.quantity} x {formatPrice(item.unitPrice)} = </span>
                                <span className="font-bold text-stone-900">{formatPrice(item.totalPrice)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial breakdown */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            Thrift Savings: -{formatPrice(order.totalSavings)}
                          </span>
                          <span className="text-stone-500">Shipping: {formatPrice(order.shippingFee)}</span>
                        </div>
                        <div className="text-sm font-bold text-[#1F140E]">
                          Total Paid: {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2D9CA] pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#1F140E] uppercase tracking-wide">
                    Footwear Catalog Inventory ({products.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Live products stored in MSSQL `Products` table. Add, inspect, and remove drops.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2.5 bg-[#1F140E] hover:bg-[#2C1D14] text-[#FAF7EE] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#C59A6F]" />
                  <span>Add New Shoe</span>
                </button>
              </div>

              {/* Product Grid Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-[#E2D9CA] p-4 shadow-sm flex flex-col justify-between space-y-3 hover:border-[#C59A6F] transition-all"
                  >
                    <div>
                      {/* Product Header & Image */}
                      <div className="relative h-44 bg-[#FAF7EE] rounded-xl overflow-hidden p-3 flex items-center justify-center border border-[#E2D9CA] mb-3">
                        <img
                          src={p.images?.[0] || '/images/shoes/aero-velocity.jpg'}
                          alt={p.name}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                        {p.badge && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#1F140E] text-[#FAF7EE] text-[9px] font-extrabold uppercase rounded-md tracking-wider">
                            {p.badge}
                          </span>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#E8F2EC] text-[#264E36] text-[9px] font-bold uppercase rounded-md">
                          {p.condition}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#1F140E] font-serif">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{p.subtitle}</p>

                      <div className="flex items-center justify-between mt-3 text-xs">
                        <div>
                          <span className="text-base font-bold text-[#1F140E] font-serif">{formatPrice(p.price)}</span>
                          <span className="text-xs text-stone-400 line-through ml-1.5">{formatPrice(p.originalPrice)}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          Save {formatPrice(p.originalPrice - p.price)}
                        </span>
                      </div>
                    </div>

                    {/* Stock and Delete */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">
                        Category: <strong className="text-stone-800 uppercase">{p.category}</strong>
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        title="Delete shoe from MSSQL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-[#E2D9CA] pb-4">
                <h2 className="text-xl font-serif font-bold text-[#1F140E] uppercase tracking-wide">
                  Registered Customers ({customers.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Customer profiles registered in MSSQL `Users` table with purchase telemetry.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2D9CA] p-5 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2D9CA] text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3">Customer ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Shipping Location</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Total Orders</th>
                      <th className="pb-3">Total Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-[#FAF7EE] transition-colors">
                        <td className="py-3 font-mono text-stone-400">#{c.id}</td>
                        <td className="py-3 font-bold text-stone-900">{c.fullName}</td>
                        <td className="py-3 text-stone-600">{c.email}</td>
                        <td className="py-3 text-stone-600">
                          {c.address ? `${c.address}, ${c.city || ''} ${c.postalCode || ''}` : 'Not provided yet'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.role === 'admin' ? 'bg-[#C59A6F]/20 text-[#C59A6F]' : 'bg-stone-100 text-stone-700'}`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="py-3 font-mono font-bold">{c.orderCount}</td>
                        <td className="py-3 font-mono font-bold text-stone-900">
                          {formatPrice(c.totalSpent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD NEW PRODUCT TO MSSQL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#C59A6F]/30 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="text-base font-serif font-bold uppercase text-[#1F140E]">
                Add New Shoe to MSSQL
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-stone-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Shoe Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aero Velocity '86 OG"
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Subtitle / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lightweight Running Shoe • Breathable Mesh"
                  value={productForm.subtitle}
                  onChange={e => setProductForm({ ...productForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="lifestyle">Streetwear Heat (lifestyle)</option>
                    <option value="running">Performance Runners</option>
                    <option value="boots">Chelsea Boots</option>
                    <option value="formal">Savile Oxfords</option>
                    <option value="trail">All-Terrain Hiker</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Condition Rating</label>
                  <select
                    value={productForm.condition}
                    onChange={e => setProductForm({ ...productForm, condition: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="10/10 Deadstock">10/10 Deadstock</option>
                    <option value="9.5/10 Like New">9.5/10 Like New</option>
                    <option value="9/10 Excellent">9/10 Excellent</option>
                    <option value="8.5/10 Restored">8.5/10 Restored</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Thrift Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Retail Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={productForm.originalPrice}
                    onChange={e => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/images/shoes/aero-velocity.jpg or direct https:// image"
                  value={productForm.imageUrl}
                  onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the footwear condition, silhouette, and authenticity verification."
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1F140E] hover:bg-[#2C1D14] text-[#FAF7EE] rounded-xl font-bold uppercase tracking-wider"
                >
                  Commit To MSSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
