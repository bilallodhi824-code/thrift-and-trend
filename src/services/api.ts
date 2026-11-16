/**
 * Thrift & Trend API Client
 * Connects frontend to Microsoft SQL Server (MSSQL) Express Backend
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface OrderItemPayload {
  shoeId: string;
  name: string;
  colorName: string;
  sizeEU: number;
  price: number;
  originalPrice?: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country?: string;
  promoCode?: string;
  discount?: number;
  items: OrderItemPayload[];
}

export interface OrderSummary {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  subtotal: number;
  totalSavings: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  trackingNumber: string;
  itemCount: number;
  createdAt: string;
}

export interface OrderDetail extends OrderSummary {
  items: Array<{
    id: number;
    shoeId: string;
    productName: string;
    colorName: string;
    sizeEU: number;
    price: number;
    originalPrice: number;
    quantity: number;
  }>;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalSavings: number;
  totalProducts: number;
  totalInventoryUnits: number;
  totalCustomers: number;
  statusBreakdown: Record<string, number>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    totalSavings: number;
    status: string;
    trackingNumber: string;
    createdAt: string;
  }>;
}

export interface AdminOrder {
  id: string;
  userId: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  subtotal: number;
  totalSavings: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  trackingNumber: string;
  promoCodeUsed?: string;
  createdAt: string;
  items: Array<{
    id: number;
    productId: string;
    productName: string;
    colorName: string;
    sizeEU: number;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
}

export interface AdminCustomer {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface NewProductPayload {
  name: string;
  subtitle: string;
  category: 'lifestyle' | 'running' | 'boots' | 'formal' | 'trail';
  gender: 'men' | 'women' | 'unisex';
  condition: string;
  price: number;
  originalPrice: number;
  badge?: string;
  stock: number;
  description: string;
  story?: string;
  imageUrl: string;
  colors?: Array<{ name: string; hex: string }>;
  sizes?: number[];
}

const TOKEN_KEY = 'tandt_auth_token';
const USER_KEY = 'tandt_user_profile';

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage error
    }
  },
  remove: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // storage error
    }
  },
  getUser: (): User | null => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // storage error
    }
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  auth: {
    async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
      const data = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      tokenStorage.set(data.token);
      tokenStorage.setUser(data.user);
      return data;
    },

    async register(payload: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;
      city?: string;
      postalCode?: string;
    }): Promise<AuthResponse> {
      const data = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      tokenStorage.set(data.token);
      tokenStorage.setUser(data.user);
      return data;
    },

    async getProfile(): Promise<User> {
      const user = await request<User>('/auth/me');
      tokenStorage.setUser(user);
      return user;
    },

    logout() {
      tokenStorage.remove();
    },
  },

  orders: {
    async create(payload: CreateOrderPayload): Promise<{ message: string; order: OrderSummary }> {
      return await request<{ message: string; order: OrderSummary }>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async getMyOrders(): Promise<OrderSummary[]> {
      const data = await request<{ orders: OrderSummary[] }>('/orders');
      return data.orders || [];
    },

    async getById(id: string): Promise<OrderDetail> {
      const data = await request<{ order: OrderDetail }>(`/orders/${id}`);
      return data.order;
    },
  },

  products: {
    async getAll(): Promise<any[]> {
      const data = await request<{ products: any[]; count: number }>('/products');
      return data.products || [];
    },

    async getBySlug(slug: string): Promise<any> {
      const data = await request<{ product: any }>(`/products/${slug}`);
      return data.product;
    },
  },

  admin: {
    async getStats(): Promise<AdminStats> {
      return await request<AdminStats>('/admin/stats');
    },

    async getOrders(): Promise<AdminOrder[]> {
      const data = await request<{ orders: AdminOrder[]; count: number }>('/admin/orders');
      return data.orders || [];
    },

    async updateOrderStatus(id: string, status: string, trackingNumber?: string): Promise<void> {
      await request(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, trackingNumber }),
      });
    },

    async createProduct(payload: NewProductPayload): Promise<{ message: string; id: string; slug: string }> {
      return await request('/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async updateProduct(id: string, payload: Partial<NewProductPayload>): Promise<void> {
      await request(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    async deleteProduct(id: string): Promise<void> {
      await request(`/admin/products/${id}`, {
        method: 'DELETE',
      });
    },

    async getCustomers(): Promise<AdminCustomer[]> {
      const data = await request<{ customers: AdminCustomer[]; count: number }>('/admin/customers');
      return data.customers || [];
    },
  },
};
