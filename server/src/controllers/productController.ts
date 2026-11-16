import { Request, Response } from 'express';
import { query } from '../db.js';

export async function getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const { category, condition, search } = req.query;

    let sql = 'SELECT * FROM Products WHERE 1=1';
    const params: Record<string, any> = {};

    if (category && category !== 'all') {
      sql += ' AND Category = @category';
      params.category = category;
    }

    if (condition && condition !== 'all') {
      sql += ' AND Condition = @condition';
      params.condition = condition;
    }

    if (search) {
      sql += ' AND (Name LIKE @search OR Subtitle LIKE @search OR Description LIKE @search)';
      params.search = `%${search}%`;
    }

    sql += ' ORDER BY Price ASC';

    const products = await query(sql, params);

    // Fetch related colors, images, and sizes for each product
    const allColors = await query('SELECT * FROM ProductColors');
    const allImages = await query('SELECT * FROM ProductImages ORDER BY SortOrder ASC');
    const allSizes = await query('SELECT * FROM ProductSizes ORDER BY SizeEU ASC');

    const mapped = products.map((p: any) => {
      const colors = allColors
        .filter((c: any) => c.ProductId === p.Id)
        .map((c: any) => ({ name: c.Name, hex: c.Hex, imageIndex: c.ImageIndex }));

      const images = allImages
        .filter((img: any) => img.ProductId === p.Id)
        .map((img: any) => img.ImageUrl);

      const sizes = allSizes
        .filter((s: any) => s.ProductId === p.Id)
        .map((s: any) => s.SizeEU);

      return {
        id: p.Id,
        slug: p.Slug,
        name: p.Name,
        subtitle: p.Subtitle,
        category: p.Category,
        gender: p.Gender,
        condition: p.Condition,
        price: parseFloat(p.Price),
        originalPrice: parseFloat(p.OriginalPrice),
        rating: parseFloat(p.Rating),
        reviewCount: p.ReviewCount,
        badge: p.Badge,
        colors: colors.length > 0 ? colors : [{ name: 'Default', hex: '#1C1C1E', imageIndex: 0 }],
        sizes: sizes.length > 0 ? sizes : [40, 41, 42, 43, 44, 45],
        images: images.length > 0 ? images : [`/images/shoes/${p.Id}/main.jpg`],
        description: p.Description,
        story: p.Story,
        highlights: [
          `Condition: ${p.Condition}`,
          `Save $${p.OriginalPrice - p.Price} below market value`,
          '100% Legit Check Verified by T&T Sneaker Lab',
          'UV-Sanitized & Ready to Wear',
        ],
        specs: {
          upper: 'Engineered Full-Grain Leather & Mesh',
          sole: 'Vulcanized Rubber Tread',
          lining: 'Breathable Cushioning',
          insole: 'Dual-Density OrthoLite®',
          origin: 'Europe / Vietnam',
          weight: '360g (EU 42)',
          closure: 'Lace-Up Closure',
          sustainability: 'Circular Thrift Fashion Economy',
        },
        fitAdvice: p.FitAdvice || 'True to size.',
        careInstructions: p.CareInstructions || 'Wipe with a damp cloth.',
        reviews: [],
        authenticationNotes: p.AuthenticationNotes || '12-Point T&T Lab Verified.',
      };
    });

    res.json({ products: mapped, count: mapped.length });
  } catch (err: any) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ message: 'Failed to retrieve products from MSSQL', error: err.message });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const products = await query('SELECT * FROM Products WHERE Id = @id', { id });

    if (products.length === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const p = products[0];
    const colors = await query('SELECT * FROM ProductColors WHERE ProductId = @id', { id });
    const images = await query('SELECT * FROM ProductImages WHERE ProductId = @id ORDER BY SortOrder ASC', { id });
    const sizes = await query('SELECT * FROM ProductSizes WHERE ProductId = @id ORDER BY SizeEU ASC', { id });

    const formatted = {
      id: p.Id,
      slug: p.Slug,
      name: p.Name,
      subtitle: p.Subtitle,
      category: p.Category,
      gender: p.Gender,
      condition: p.Condition,
      price: parseFloat(p.Price),
      originalPrice: parseFloat(p.OriginalPrice),
      rating: parseFloat(p.Rating),
      reviewCount: p.ReviewCount,
      badge: p.Badge,
      colors: colors.map((c: any) => ({ name: c.Name, hex: c.Hex, imageIndex: c.ImageIndex })),
      sizes: sizes.map((s: any) => s.SizeEU),
      images: images.map((img: any) => img.ImageUrl),
      description: p.Description,
      story: p.Story,
      fitAdvice: p.FitAdvice,
      careInstructions: p.CareInstructions,
      authenticationNotes: p.AuthenticationNotes,
    };

    res.json({ product: formatted });
  } catch (err: any) {
    res.status(500).json({ message: 'Error retrieving product', error: err.message });
  }
}
