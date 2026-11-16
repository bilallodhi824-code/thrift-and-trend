import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query, execute } from '../db.js';
import { config } from '../config.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: 'Validation failed', errors: parseResult.error.format() });
      return;
    }

    const { email, password, fullName, phone, address, city, postalCode } = parseResult.data;

    // Check if user already exists
    const existing = await query('SELECT Id FROM Users WHERE Email = @email', { email });
    if (existing.length > 0) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await execute(
      `INSERT INTO Users (Email, PasswordHash, FullName, Role, Phone, Address, City, PostalCode)
       VALUES (@email, @passwordHash, @fullName, 'customer', @phone, @address, @city, @postalCode)`,
      {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
      }
    );

    const createdUsers = await query(
      'SELECT Id, Email, FullName, Role, Phone, Address, City, PostalCode, CreatedAt FROM Users WHERE Email = @email',
      { email }
    );
    const user = createdUsers[0];

    const token = jwt.sign(
      { id: user.Id, email: user.Email, fullName: user.FullName, role: user.Role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user.Id,
        email: user.Email,
        fullName: user.FullName,
        role: user.Role,
        phone: user.Phone,
        address: user.Address,
        city: user.City,
        postalCode: user.PostalCode,
      },
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error during registration', error: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: 'Invalid email or password format.' });
      return;
    }

    const { email, password } = parseResult.data;

    const users = await query('SELECT * FROM Users WHERE Email = @email', { email });
    if (users.length === 0) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user.Id, email: user.Email, fullName: user.FullName, role: user.Role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.Id,
        email: user.Email,
        fullName: user.FullName,
        role: user.Role,
        phone: user.Phone,
        address: user.Address,
        city: user.City,
        postalCode: user.PostalCode,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login', error: err.message });
  }
}

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const users = await query(
      'SELECT Id, Email, FullName, Role, Phone, Address, City, PostalCode, CreatedAt FROM Users WHERE Id = @userId',
      { userId }
    );

    if (users.length === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const user = users[0];
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to retrieve profile', error: err.message });
  }
}
