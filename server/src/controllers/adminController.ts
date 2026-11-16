import { Response } from 'express';
import { z } from 'zod';
import { query, execute } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * High-level overview statistics for the Thrift & Trend Admin Dashboard
 */
export async function getAdminStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const ordersStats = await query(
      `SELECT 
        COUNT(*) AS totalOrders,
        COALESCE(SUM(TotalAmount), 0) AS totalRevenue,
        COALESCE(SUM(TotalSavings), 0) AS totalSavings
       FROM Orders`
    );

    const productStats = await query(
      `SELECT 
        COUNT(*) AS totalProducts,
        COALESCE(SUM(Stock), 0) AS totalInventoryUnits
       FROM Products`
    );

    const userStats = await query(
      `SELECT COUNT(*) AS totalCustomers FROM Users WHERE Role = 'customer'`
    );

    const statusBreakdown = await query(
      `SELECT Status, COUNT(*) AS count FROM Orders GROUP BY Status`
    );

    const recentOrders = await query(
      `SELECT TOP 6 
        Id, CustomerName, CustomerEmail, TotalAmount, TotalSavings, Status, TrackingNumber, CreatedAt
       FROM Orders 
       ORDER BY CreatedAt DESC`
    );

    const stats = ordersStats[0] || { totalOrders: 0, totalRevenue: 0, totalSavings: 0 };
    const pStats = productStats[0] || { totalProducts: 0, totalInventoryUnits: 0 };
    const uStats = userStats[0] || { totalCustomers: 0 };

    res.json({
      totalRevenue: parseFloat(stats.totalRevenue) || 0,
      totalOrders: parseInt(stats.totalOrders, 10) || 0,
      totalSavings: parseFloat(stats.totalSavings) || 0,
      totalProducts: parseInt(pStats.totalProducts, 10) || 0,
      totalInventoryUnits: parseInt(pStats.totalInventoryUnits, 10) || 0,
      totalCustomers: parseInt(uStats.totalCustomers, 10) || 0,
      statusBreakdown: statusBreakdown.reduce((acc: any, row: any) => {
        acc[row.Status] = parseInt(row.count, 10);
        return acc;
      }, {}),
      recentOrders: recentOrders.map((o: any) => ({
        id: o.Id,
        customerName: o.CustomerName,
        customerEmail: o.CustomerEmail,
        totalAmount: parseFloat(o.TotalAmount),
        totalSavings: parseFloat(o.TotalSavings),
        status: o.Status,
        trackingNumber: o.TrackingNumber,
        createdAt: o.CreatedAt,
      })),
    });
  } catch (err: any) {
    console.error('getAdminStats error:', err);
    res.status(500).json({ message: 'Failed to retrieve admin stats', error: err.message });
  }
}

/**
 * Get all orders in the system with item details for admin inspection
 */
export async function getAllAdminOrders(req: AuthRequest, res: Response): Promise<void> {
  try {
    const orders = await query('SELECT * FROM Orders ORDER BY CreatedAt DESC');
    const allItems = await query('SELECT * FROM OrderItems');

    const result = orders.map((o: any) => ({
      id: o.Id,
      userId: o.UserId,
      customerName: o.CustomerName,
      customerEmail: o.CustomerEmail,
      customerPhone: o.CustomerPhone,
      shippingAddress: o.ShippingAddress,
      city: o.City,
      postalCode: o.PostalCode,
      country: o.Country,
      subtotal: parseFloat(o.Subtotal),
      totalSavings: parseFloat(o.TotalSavings),
      discount: parseFloat(o.Discount),
      shippingFee: parseFloat(o.ShippingFee),
      totalAmount: parseFloat(o.TotalAmount),
      status: o.Status,
      trackingNumber: o.TrackingNumber,
      promoCodeUsed: o.PromoCodeUsed,
      createdAt: o.CreatedAt,
      items: allItems
        .filter((item: any) => item.OrderId === o.Id)
        .map((item: any) => ({
          id: item.Id,
          productId: item.ProductId,
          productName: item.ProductName,
          colorName: item.ColorName,
          sizeEU: item.SizeEU,
          unitPrice: parseFloat(item.UnitPrice),
          quantity: item.Quantity,
          totalPrice: parseFloat(item.TotalPrice),
        })),
    }));

    res.json({ orders: result, count: result.length });
  } catch (err: any) {
    console.error('getAllAdminOrders error:', err);
    res.status(500).json({ message: 'Failed to retrieve orders', error: err.message });
  }
}

/**
 * Update order status and tracking number in MSSQL
 */
export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }

    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    let updateSql = 'UPDATE Orders SET Status = @status';
    const params: Record<string, any> = { id, status };

    if (trackingNumber !== undefined && trackingNumber !== null) {
      updateSql += ', TrackingNumber = @trackingNumber';
      params.trackingNumber = trackingNumber;
    }

    updateSql += ' WHERE Id = @id';

    await execute(updateSql, params);

    res.json({ message: `Order ${id} status updated to '${status}'.`, id, status });
  } catch (err: any) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
}

/**
 * Add a new shoe product directly into MSSQL
 */
const newProductSchema = z.object({
  name: z.string().min(3),
  subtitle: z.string().min(3),
  category: z.enum(['lifestyle', 'running', 'boots', 'formal', 'trail']),
  gender: z.enum(['men', 'women', 'unisex']),
  condition: z.string().min(2),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  badge: z.string().optional(),
  stock: z.number().int().min(0).default(5),
  description: z.string().min(10),
  story: z.string().optional(),
  imageUrl: z.string().min(5),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).optional(),
  sizes: z.array(z.number()).optional(),
});

export async function createAdminProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parseResult = newProductSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: 'Invalid product data', errors: parseResult.error.format() });
      return;
    }

    const data = parseResult.data;
    const baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    const slug = id;

    // Insert Product
    await execute(
      `INSERT INTO Products (
        Id, Slug, Name, Subtitle, Category, Gender, Condition,
        Price, OriginalPrice, Rating, ReviewCount, Badge, Stock,
        Description, Story, FitAdvice, CareInstructions, AuthenticationNotes
      ) VALUES (
        @id, @slug, @name, @subtitle, @category, @gender, @condition,
        @price, @originalPrice, 5.0, 1, @badge, @stock,
        @description, @story, @fitAdvice, @careInstructions, @authNotes
      )`,
      {
        id,
        slug,
        name: data.name,
        subtitle: data.subtitle,
        category: data.category,
        gender: data.gender,
        condition: data.condition,
        price: data.price,
        originalPrice: data.originalPrice,
        badge: data.badge || null,
        stock: data.stock,
        description: data.description,
        story: data.story || 'Curated directly from our vault collection for Thrift & Trend.',
        fitAdvice: 'True to size with standard fit.',
        careInstructions: 'Spot clean with mild soapy water.',
        authNotes: '12-Point T&T Sneaker Lab Certified Authentic.',
      }
    );

    // Insert Image
    await execute(
      `INSERT INTO ProductImages (ProductId, ImageUrl, SortOrder) VALUES (@id, @imageUrl, 0)`,
      { id, imageUrl: data.imageUrl }
    );

    // Insert Colors
    const colors = data.colors && data.colors.length > 0
      ? data.colors
      : [{ name: 'Default', hex: '#1C1C1E' }];

    for (const c of colors) {
      await execute(
        `INSERT INTO ProductColors (ProductId, Name, Hex, ImageIndex) VALUES (@id, @name, @hex, 0)`,
        { id, name: c.name, hex: c.hex }
      );
    }

    // Insert Sizes
    const sizes = data.sizes && data.sizes.length > 0 ? data.sizes : [40, 41, 42, 43, 44, 45];
    for (const s of sizes) {
      await execute(
        `INSERT INTO ProductSizes (ProductId, SizeEU, Stock) VALUES (@id, @sizeEU, @stock)`,
        { id, sizeEU: s, stock: Math.max(1, Math.floor(data.stock / sizes.length)) }
      );
    }

    res.status(201).json({ message: 'Product created successfully in MSSQL', id, slug });
  } catch (err: any) {
    console.error('createAdminProduct error:', err);
    res.status(500).json({ message: 'Failed to create product in MSSQL', error: err.message });
  }
}

/**
 * Update an existing product's price, stock, or condition
 */
export async function updateAdminProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, price, originalPrice, stock, condition, badge } = req.body;

    let updateSql = 'UPDATE Products SET Stock = Stock';
    const params: Record<string, any> = { id };

    if (name) {
      updateSql += ', Name = @name';
      params.name = name;
    }
    if (price !== undefined) {
      updateSql += ', Price = @price';
      params.price = price;
    }
    if (originalPrice !== undefined) {
      updateSql += ', OriginalPrice = @originalPrice';
      params.originalPrice = originalPrice;
    }
    if (stock !== undefined) {
      updateSql += ', Stock = @stock';
      params.stock = stock;
    }
    if (condition) {
      updateSql += ', Condition = @condition';
      params.condition = condition;
    }
    if (badge !== undefined) {
      updateSql += ', Badge = @badge';
      params.badge = badge;
    }

    updateSql += ' WHERE Id = @id';
    await execute(updateSql, params);

    res.json({ message: `Product ${id} updated successfully in MSSQL.` });
  } catch (err: any) {
    console.error('updateAdminProduct error:', err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
}

/**
 * Delete a product from MSSQL (cascades to colors, images, sizes)
 */
export async function deleteAdminProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await execute('DELETE FROM Products WHERE Id = @id', { id });
    res.json({ message: `Product ${id} deleted successfully from MSSQL.` });
  } catch (err: any) {
    console.error('deleteAdminProduct error:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
}

/**
 * Get all registered customers and their purchase counts
 */
export async function getAllCustomers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await query(
      `SELECT 
        u.Id, u.FullName, u.Email, u.Role, u.Phone, u.Address, u.City, u.PostalCode, u.CreatedAt,
        COUNT(o.Id) AS OrderCount,
        COALESCE(SUM(o.TotalAmount), 0) AS TotalSpent
       FROM Users u
       LEFT JOIN Orders o ON u.Id = o.UserId
       GROUP BY u.Id, u.FullName, u.Email, u.Role, u.Phone, u.Address, u.City, u.PostalCode, u.CreatedAt
       ORDER BY u.CreatedAt DESC`
    );

    const mapped = users.map((u: any) => ({
      id: u.Id,
      fullName: u.FullName,
      email: u.Email,
      role: u.Role,
      phone: u.Phone,
      address: u.Address,
      city: u.City,
      postalCode: u.PostalCode,
      createdAt: u.CreatedAt,
      orderCount: parseInt(u.OrderCount, 10) || 0,
      totalSpent: parseFloat(u.TotalSpent) || 0,
    }));

    res.json({ customers: mapped, count: mapped.length });
  } catch (err: any) {
    console.error('getAllCustomers error:', err);
    res.status(500).json({ message: 'Failed to retrieve customers', error: err.message });
  }
}
