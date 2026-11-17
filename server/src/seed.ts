import bcrypt from 'bcryptjs';
import { execute, query } from './db.js';

const SEED_PRODUCTS = [
  {
    id: 'aero-velocity-86',
    slug: 'aero-velocity-86',
    name: "Aero Velocity '86 OG",
    subtitle: 'Lightweight Track Runner • High Rebound Cushioning',
    category: 'running',
    gender: 'unisex',
    condition: '10/10 Deadstock',
    price: 2450,
    originalPrice: 5500,
    rating: 4.9,
    reviewCount: 218,
    badge: 'STEAL OF THE WEEK',
    colors: [
      { name: 'Velocity Crimson', hex: '#D62828', imageIndex: 0 },
      { name: 'Pure Chalk', hex: '#F4F1EA', imageIndex: 0 },
      { name: 'Carbon Black', hex: '#1C1C1E', imageIndex: 0 },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/aero-velocity-86/main.jpg'],
    description: 'The coveted 1986 speed silhouette thrifted in brand new deadstock condition.',
    story: 'Discovered brand-new from a archival collection in Milan.',
    fitAdvice: 'True to size with an athletic racing fit.',
    careInstructions: 'Spot clean with lukewarm water.',
    authenticationNotes: 'Quality Verified: Original Box, Serial Match, Upper & Sole Bond Tested, Full Sole Tread.',
  },
  {
    id: 'atelier-classic-01',
    slug: 'atelier-classic-01',
    name: "Atelier Classic '01 Low",
    subtitle: 'Full-Grain Italian Calfskin Court Sneaker',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '9.5/10 Pristine',
    price: 2850,
    originalPrice: 6800,
    rating: 5.0,
    reviewCount: 342,
    badge: 'PREMIUM EDITION',
    colors: [
      { name: 'Pure Chalk White', hex: '#FAF9F6', imageIndex: 0 },
      { name: 'Cream Bone', hex: '#EDE8DF', imageIndex: 1 },
      { name: 'Raw Sand', hex: '#D6CEBE', imageIndex: 0 },
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    images: [
      '/images/shoes/atelier-classic-01/main.jpg',
      '/images/shoes/atelier-classic-01/angle.jpg',
    ],
    description: 'Handcrafted in Civitanova Marche, Italy from ultra-soft full-grain Nappa calfskin.',
    story: 'Sourced directly from an Italian luxury boutique consignment.',
    fitAdvice: 'Fits true to European sizing.',
    careInstructions: 'Wipe with clean microfiber cloth.',
    authenticationNotes: 'T&T Certified: Supple Calfskin Grain Verified, 100% Insole Foam Integrity.',
  },
  {
    id: 'volt-kinetic-racer',
    slug: 'volt-kinetic-racer',
    name: 'Volt Kinetic Racer Pro',
    subtitle: 'Carbon Propulsion Marathon Road Racer',
    category: 'running',
    gender: 'unisex',
    condition: '10/10 Deadstock',
    price: 2650,
    originalPrice: 6200,
    rating: 4.8,
    reviewCount: 94,
    badge: 'TRENDING HEAT',
    colors: [
      { name: 'Volt Electric Lime', hex: '#A7E92F', imageIndex: 0 },
      { name: 'Obsidian Black', hex: '#111111', imageIndex: 0 },
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/volt-kinetic-racer/main.jpg'],
    description: 'High-heat race day marvel in brand new Deadstock condition.',
    story: 'Consigned from a pro marathon runner archive.',
    fitAdvice: 'Snug performance glove fit.',
    careInstructions: 'Wipe surface with damp cloth.',
    authenticationNotes: 'Quality Verified: Carbon Fiber Plate Rigidity Verified.',
  },
  {
    id: 'deck-street-low',
    slug: 'deck-street-low',
    name: 'Deck Street Low Suede',
    subtitle: 'Reinforced Suede & Heavy Canvas Court Skater',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '9.5/10 Pristine',
    price: 1650,
    originalPrice: 3800,
    rating: 4.9,
    reviewCount: 420,
    badge: 'STEAL OF THE WEEK',
    colors: [
      { name: 'Onyx & Chalk', hex: '#1C1C1E', imageIndex: 0 },
      { name: 'Navy Stone', hex: '#1D2A44', imageIndex: 0 },
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/deck-street-low/main.jpg'],
    description: 'The essential skate and streetwear staple.',
    story: 'An archival thrift gem from Tokyo’s Harajuku district.',
    fitAdvice: 'Standard medium width.',
    careInstructions: 'Dry brush canvas and use suede eraser.',
    authenticationNotes: 'Quality Verified: 100% Sole Flexibility.',
  },
  {
    id: 'palermo-heritage-78',
    slug: 'palermo-heritage-78',
    name: "Palermo Heritage '78 Gum",
    subtitle: 'Tumbled Leather & Suede Terrace Classic',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '10/10 Deadstock',
    price: 2250,
    originalPrice: 5200,
    rating: 4.8,
    reviewCount: 167,
    badge: 'TRENDING HEAT',
    colors: [
      { name: 'Eggshell & Amber Gum', hex: '#FAF7F0', imageIndex: 0 },
      { name: 'Olive Suede', hex: '#4B5320', imageIndex: 0 },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/palermo-heritage-78/main.jpg'],
    description: 'The trending 1970s terrace football trainer in brand new Deadstock condition.',
    story: 'Sourced from a European collector archive in Lisbon.',
    fitAdvice: 'True to size.',
    careInstructions: 'Wipe leather with a damp cloth.',
    authenticationNotes: 'Quality Verified: Pristine Amber Gum Outsole.',
  },
  {
    id: 'obsidian-stealth-pro',
    slug: 'obsidian-stealth-pro',
    name: 'Obsidian Stealth Road Pro',
    subtitle: 'Zero-Gravity Blackout Technical Urban Runner',
    category: 'running',
    gender: 'men',
    condition: '9.5/10 Pristine',
    price: 2550,
    originalPrice: 5800,
    rating: 4.9,
    reviewCount: 154,
    badge: 'ARCHIVAL FIND',
    colors: [
      { name: 'Matte Blackout', hex: '#111111', imageIndex: 0 },
      { name: 'Graphite Shadow', hex: '#2C2C2E', imageIndex: 0 },
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/obsidian-stealth-pro/main.jpg'],
    description: 'All-black matte monochrome running machine graded 9.5/10 Pristine.',
    story: 'Acquired from an urban techwear consignment in Seoul.',
    fitAdvice: 'Fits true to size.',
    careInstructions: 'Wipe with a damp towel.',
    authenticationNotes: 'Quality Verified: 3M Reflective Weave Tested.',
  },
  {
    id: 'savile-cap-oxford',
    slug: 'savile-cap-oxford',
    name: 'Savile Cap-Toe Dress Oxford',
    subtitle: 'Hand-Burnished French Calfskin Formal Shoe',
    category: 'formal',
    gender: 'men',
    condition: '9.0/10 Excellent',
    price: 3750,
    originalPrice: 8500,
    rating: 4.9,
    reviewCount: 88,
    badge: 'PREMIUM EDITION',
    colors: [
      { name: 'Burnished Cognac', hex: '#8B4513', imageIndex: 0 },
      { name: 'Onyx Noir', hex: '#0D0D0D', imageIndex: 0 },
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    images: ['/images/shoes/savile-cap-oxford/main.jpg'],
    description: 'Handcrafted in Montegranaro, Italy from premium French box-calf leather.',
    story: 'Consigned from an executive wardrobe in London.',
    fitAdvice: 'Classical formal dress last.',
    careInstructions: 'Polish with carnauba wax cream.',
    authenticationNotes: 'Quality Verified: Goodyear Welt Stitch Verified.',
  },
  {
    id: 'monolith-suede-chelsea',
    slug: 'monolith-suede-chelsea',
    name: 'Monolith Weatherproof Chelsea',
    subtitle: 'Waxed Suede Commando Lug Chelsea Boot',
    category: 'boots',
    gender: 'men',
    condition: '9.5/10 Pristine',
    price: 3450,
    originalPrice: 7900,
    rating: 5.0,
    reviewCount: 116,
    badge: 'PREMIUM EDITION',
    colors: [
      { name: 'Tobacco Suede', hex: '#6F4E37', imageIndex: 0 },
      { name: 'Shadow Charcoal', hex: '#2A2928', imageIndex: 0 },
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    images: ['/images/shoes/monolith-suede-chelsea/main.jpg'],
    description: 'Crafted in Porto, Portugal from water-repellent waxed Tuscan suede.',
    story: 'Discovered in a boutique showroom consignment in Edinburgh.',
    fitAdvice: 'True to boot size.',
    careInstructions: 'Brush with a crepe suede brush.',
    authenticationNotes: 'Quality Verified: Vibram Sole Verified Authentic.',
  },
  {
    id: 'archival-high-70',
    slug: 'archival-high-70',
    name: "Archival High '70 Canvas",
    subtitle: 'Heavyweight 14oz Vintage Court High-Top',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '10/10 Deadstock',
    price: 1850,
    originalPrice: 4200,
    rating: 4.8,
    reviewCount: 310,
    badge: 'STEAL OF THE WEEK',
    colors: [
      { name: 'Crimson Red', hex: '#C1121F', imageIndex: 0 },
      { name: 'Egret Ivory', hex: '#FDFBF7', imageIndex: 0 },
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/archival-high-70/main.jpg'],
    description: 'The vintage basketball high-top in 100% Deadstock condition.',
    story: 'An authentic warehouse archive deadstock find.',
    fitAdvice: 'Runs half a size large.',
    careInstructions: 'Spot clean with mild soap.',
    authenticationNotes: 'Quality Verified: Original Factory Box Verified.',
  },
  {
    id: 'alpine-ridge-hiker',
    slug: 'alpine-ridge-hiker',
    name: 'Alpine Ridge Leather Hiker',
    subtitle: 'Waterproof Full-Grain Vibram® Mountain Boot',
    category: 'trail',
    gender: 'unisex',
    condition: '9.0/10 Excellent',
    price: 3250,
    originalPrice: 7500,
    rating: 4.9,
    reviewCount: 142,
    badge: 'ARCHIVAL FIND',
    colors: [
      { name: 'Nutmeg Leather & Alpine Red', hex: '#8B4513', imageIndex: 0 },
      { name: 'Onyx Charcoal', hex: '#1C1C1E', imageIndex: 0 },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/alpine-ridge-hiker/main.jpg'],
    description: 'Crafted in Asolo, Italy from 2.4mm thick waterproof full-grain Italian leather.',
    story: 'Thrifted from an outdoor guide in Innsbruck, Austria.',
    fitAdvice: 'Designed for medium to heavy trail socks.',
    careInstructions: 'Apply leather wax every 6 months.',
    authenticationNotes: 'Quality Verified: Hydrophobic Membrane Tested.',
  },
  {
    id: 'grand-slam-vintage-74',
    slug: 'grand-slam-vintage-74',
    name: "Grand Slam Vintage '74 Low",
    subtitle: 'Perforated Calfskin Court Tennis Sneaker',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '9.5/10 Pristine',
    price: 2150,
    originalPrice: 4900,
    rating: 4.8,
    reviewCount: 228,
    badge: 'TRENDING HEAT',
    colors: [
      { name: 'Chalk White', hex: '#FAF9F6', imageIndex: 0 },
      { name: 'Forest Green Accent', hex: '#1B4332', imageIndex: 0 },
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/grand-slam-vintage-74/main.jpg'],
    description: 'Homage to 1974 championship tennis footwear.',
    story: 'Thrifted from a vintage archive in Portugal.',
    fitAdvice: 'Fits true to size.',
    careInstructions: 'Wipe clean with a damp cloth.',
    authenticationNotes: 'Quality Verified: Flawless White Leather Finish.',
  },
  {
    id: 'monochrome-archive-runner',
    slug: 'monochrome-archive-runner',
    name: 'Monochrome Archive Runner',
    subtitle: 'Dual-Texture Suede & Technical Mesh Sneaker',
    category: 'lifestyle',
    gender: 'unisex',
    condition: '10/10 Deadstock',
    price: 2350,
    originalPrice: 5400,
    rating: 4.9,
    reviewCount: 175,
    badge: 'DEADSTOCK',
    colors: [
      { name: 'Off-White Stone', hex: '#EDE8DF', imageIndex: 0 },
      { name: 'Raw Sand', hex: '#D6CEBE', imageIndex: 0 },
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    images: ['/images/shoes/monochrome-archive-runner/main.jpg'],
    description: 'A contemporary masterclass in tonal texture in Deadstock condition.',
    story: 'Deadstock release consigned from Stockholm.',
    fitAdvice: 'True to size.',
    careInstructions: 'Brush suede gently with a soft brush.',
    authenticationNotes: 'Quality Verified: Deadstock Box Condition 10/10.',
  },
];

export async function seedDatabase() {
  console.log('[Seed] Starting MSSQL database seeding for Thrift & Trend...');

  // 1. Seed Demo Customer and Admin
  const existingUsers = await query('SELECT Id FROM Users WHERE Email = @email', { email: 'customer@thriftandtrend.com' });
  if (existingUsers.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);
    await execute(
      `INSERT INTO Users (Email, PasswordHash, FullName, Role, Phone, Address, City, PostalCode, Country)
       VALUES ('customer@thriftandtrend.com', @passwordHash, 'Alex Rivera', 'customer', '+1 555-0192', '742 Evergreen Terrace', 'Portland', '97201', 'US')`,
      { passwordHash }
    );
    console.log('[Seed] Created demo customer: customer@thriftandtrend.com (Password: Password123!)');
  }

  const existingAdmin = await query('SELECT Id FROM Users WHERE Email = @email', { email: 'admin@thriftandtrend.com' });
  if (existingAdmin.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin123!', salt);
    await execute(
      `INSERT INTO Users (Email, PasswordHash, FullName, Role, Phone, Address, City, PostalCode, Country)
       VALUES ('admin@thriftandtrend.com', @passwordHash, 'T&T Lab Director', 'admin', '+1 555-0100', '100 Sneaker Vault Way', 'New York', '10001', 'US')`,
      { passwordHash }
    );
    console.log('[Seed] Created demo admin: admin@thriftandtrend.com (Password: Admin123!)');
  }

  // 2. Seed Products
  for (const p of SEED_PRODUCTS) {
    const existingP = await query('SELECT Id FROM Products WHERE Id = @id', { id: p.id });
    if (existingP.length === 0) {
      await execute(
        `INSERT INTO Products (
          Id, Slug, Name, Subtitle, Category, Gender, Condition, Price, OriginalPrice,
          Rating, ReviewCount, Badge, Stock, Description, Story, FitAdvice, CareInstructions,
          AuthenticationNotes
        ) VALUES (
          @id, @slug, @name, @subtitle, @category, @gender, @condition, @price, @originalPrice,
          @rating, @reviewCount, @badge, 10, @description, @story, @fitAdvice, @careInstructions,
          @authenticationNotes
        )`,
        {
          id: p.id,
          slug: p.slug,
          name: p.name,
          subtitle: p.subtitle,
          category: p.category,
          gender: p.gender,
          condition: p.condition,
          price: p.price,
          originalPrice: p.originalPrice,
          rating: p.rating,
          reviewCount: p.reviewCount,
          badge: p.badge,
          description: p.description,
          story: p.story,
          fitAdvice: p.fitAdvice,
          careInstructions: p.careInstructions,
          authenticationNotes: p.authenticationNotes,
        }
      );

      // Colors
      for (const c of p.colors) {
        await execute(
          `INSERT INTO ProductColors (ProductId, Name, Hex, ImageIndex) VALUES (@productId, @name, @hex, @imageIndex)`,
          { productId: p.id, name: c.name, hex: c.hex, imageIndex: c.imageIndex }
        );
      }

      // Images
      for (let i = 0; i < p.images.length; i++) {
        await execute(
          `INSERT INTO ProductImages (ProductId, ImageUrl, SortOrder) VALUES (@productId, @imageUrl, @sortOrder)`,
          { productId: p.id, imageUrl: p.images[i], sortOrder: i }
        );
      }

      // Sizes
      for (const s of p.sizes) {
        await execute(
          `INSERT INTO ProductSizes (ProductId, SizeEU, Stock) VALUES (@productId, @sizeEU, 5)`,
          { productId: p.id, sizeEU: s }
        );
      }
      console.log(`[Seed] Seeded product: ${p.name}`);
    }
  }

  console.log('[Seed] Seeding completed successfully in MSSQL database!');
}

if (process.argv[1]?.includes('seed')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
