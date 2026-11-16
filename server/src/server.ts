import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import { register, login, getProfile } from './controllers/authController.js';
import { getAllProducts, getProductById } from './controllers/productController.js';
import { createOrder, getUserOrders, getOrderById } from './controllers/orderController.js';
import {
  getAdminStats,
  getAllAdminOrders,
  updateOrderStatus,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAllCustomers,
} from './controllers/adminController.js';
import { authMiddleware, adminOnly } from './middleware/authMiddleware.js';
import { seedDatabase } from './seed.js';

const app = express();

// Middleware
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173', '*'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    brand: 'THRIFT & TREND',
    tagline: 'WHERE STYLE MEETS SAVINGS',
    database: 'Microsoft SQL Server 2025 Express (MSSQL)',
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes (MSSQL)
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authMiddleware, getProfile);

// Product Routes (MSSQL)
app.get('/api/products', getAllProducts);
app.get('/api/products/:id', getProductById);

// Order Routes (MSSQL)
app.post('/api/orders', createOrder);
app.get('/api/orders', getUserOrders);
app.get('/api/orders/:id', getOrderById);

// Admin Dashboard Routes (MSSQL Protected)
app.get('/api/admin/stats', authMiddleware, adminOnly, getAdminStats);
app.get('/api/admin/orders', authMiddleware, adminOnly, getAllAdminOrders);
app.patch('/api/admin/orders/:id/status', authMiddleware, adminOnly, updateOrderStatus);
app.post('/api/admin/products', authMiddleware, adminOnly, createAdminProduct);
app.put('/api/admin/products/:id', authMiddleware, adminOnly, updateAdminProduct);
app.delete('/api/admin/products/:id', authMiddleware, adminOnly, deleteAdminProduct);
app.get('/api/admin/customers', authMiddleware, adminOnly, getAllCustomers);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
});

// Start Server & Auto-seed MSSQL
app.listen(config.port, async () => {
  console.log(`=======================================================`);
  console.log(`⚡ THRIFT & TREND BACKEND ACTIVE`);
  console.log(`🚀 Port: ${config.port}`);
  console.log(`🗄️  Database: Microsoft SQL Server (MSSQL / SQLEXPRESS)`);
  console.log(`🌐 API Endpoint: http://localhost:${config.port}/api`);
  console.log(`=======================================================`);

  // Seed MSSQL database
  try {
    await seedDatabase();
  } catch (err: any) {
    console.warn(`[Auto-Seed Warning]:`, err.message);
  }
});
