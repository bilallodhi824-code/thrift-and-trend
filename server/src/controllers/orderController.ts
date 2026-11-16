import { Request, Response } from 'express';
import { z } from 'zod';
import { query, execute } from '../db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const orderItemSchema = z.object({
  shoeId: z.string(),
  name: z.string(),
  colorName: z.string(),
  sizeEU: z.number(),
  price: z.number(),
  originalPrice: z.number().optional(),
  quantity: z.number().min(1),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().default('US'),
  promoCode: z.string().optional(),
  discount: z.number().default(0),
  items: z.array(orderItemSchema).min(1),
});

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parseResult = createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: 'Invalid order data', errors: parseResult.error.format() });
      return;
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      country,
      promoCode,
      discount,
      items,
    } = parseResult.data;

    const userId = req.user?.id || null;
    const orderId = `TT-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingNumber = `TRK-TT-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalMarketValue = items.reduce((sum, item) => sum + (item.originalPrice || item.price * 1.5) * item.quantity, 0);
    const totalSavings = Math.max(0, totalMarketValue - subtotal);
    const shippingFee = subtotal > 150 ? 0 : 20;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    // Insert into Orders table in MSSQL
    await execute(
      `INSERT INTO Orders (
        Id, UserId, CustomerName, CustomerEmail, CustomerPhone, ShippingAddress,
        City, PostalCode, Country, Subtotal, TotalSavings, Discount, ShippingFee,
        TotalAmount, Status, TrackingNumber, PromoCodeUsed
      ) VALUES (
        @orderId, @userId, @customerName, @customerEmail, @customerPhone, @shippingAddress,
        @city, @postalCode, @country, @subtotal, @totalSavings, @discount, @shippingFee,
        @totalAmount, 'Processing', @trackingNumber, @promoCode
      )`,
      {
        orderId,
        userId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        shippingAddress,
        city,
        postalCode,
        country,
        subtotal,
        totalSavings,
        discount,
        shippingFee,
        totalAmount,
        trackingNumber,
        promoCode: promoCode || null,
      }
    );

    // Insert each item into OrderItems in MSSQL
    for (const item of items) {
      const totalPrice = item.price * item.quantity;
      await execute(
        `INSERT INTO OrderItems (
          OrderId, ProductId, ProductName, ColorName, SizeEU, UnitPrice, Quantity, TotalPrice
        ) VALUES (
          @orderId, @productId, @productName, @colorName, @sizeEU, @unitPrice, @quantity, @totalPrice
        )`,
        {
          orderId,
          productId: item.shoeId,
          productName: item.name,
          colorName: item.colorName,
          sizeEU: item.sizeEU,
          unitPrice: item.price,
          quantity: item.quantity,
          totalPrice,
        }
      );
    }

    res.status(201).json({
      message: 'Order created successfully in MSSQL database.',
      order: {
        id: orderId,
        customerName,
        customerEmail,
        shippingAddress: `${shippingAddress}, ${city} ${postalCode}, ${country}`,
        subtotal,
        totalSavings,
        discount,
        shippingFee,
        totalAmount,
        status: 'Processing',
        trackingNumber,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Failed to create order in MSSQL', error: err.message });
  }
}

export async function getUserOrders(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const email = req.query.email as string;

    let ordersSql = 'SELECT * FROM Orders WHERE ';
    const params: Record<string, any> = {};

    if (userId) {
      ordersSql += 'UserId = @userId';
      params.userId = userId;
    } else if (email) {
      ordersSql += 'CustomerEmail = @email';
      params.email = email;
    } else {
      res.status(400).json({ message: 'UserId or CustomerEmail query parameter required.' });
      return;
    }

    ordersSql += ' ORDER BY CreatedAt DESC';

    const orders = await query(ordersSql, params);
    const allItems = await query('SELECT * FROM OrderItems');

    const result = orders.map((o: any) => ({
      id: o.Id,
      customerName: o.CustomerName,
      customerEmail: o.CustomerEmail,
      shippingAddress: o.ShippingAddress,
      city: o.City,
      postalCode: o.PostalCode,
      subtotal: parseFloat(o.Subtotal),
      totalSavings: parseFloat(o.TotalSavings),
      discount: parseFloat(o.Discount),
      shippingFee: parseFloat(o.ShippingFee),
      totalAmount: parseFloat(o.TotalAmount),
      status: o.Status,
      trackingNumber: o.TrackingNumber,
      createdAt: o.CreatedAt,
      items: allItems
        .filter((item: any) => item.OrderId === o.Id)
        .map((item: any) => ({
          productId: item.ProductId,
          productName: item.ProductName,
          colorName: item.ColorName,
          sizeEU: item.SizeEU,
          unitPrice: parseFloat(item.UnitPrice),
          quantity: item.Quantity,
          totalPrice: parseFloat(item.TotalPrice),
        })),
    }));

    res.json({ orders: result });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: err.message });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const orders = await query('SELECT * FROM Orders WHERE Id = @id', { id });
    if (orders.length === 0) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const o = orders[0];
    const items = await query('SELECT * FROM OrderItems WHERE OrderId = @id', { id });

    res.json({
      order: {
        id: o.Id,
        customerName: o.CustomerName,
        customerEmail: o.CustomerEmail,
        shippingAddress: o.ShippingAddress,
        city: o.City,
        postalCode: o.PostalCode,
        subtotal: parseFloat(o.Subtotal),
        totalSavings: parseFloat(o.TotalSavings),
        discount: parseFloat(o.Discount),
        shippingFee: parseFloat(o.ShippingFee),
        totalAmount: parseFloat(o.TotalAmount),
        status: o.Status,
        trackingNumber: o.TrackingNumber,
        createdAt: o.CreatedAt,
        items,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Error retrieving order', error: err.message });
  }
}
