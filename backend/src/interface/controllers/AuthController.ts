import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { container } from '../../infrastructure/di/container';
import { env } from '../../config/env';

const { userRepo, riderRepo } = container;

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['client', 'rider', 'merchant']).default('client'),
  phoneNumber: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const { name, email, password, role, phoneNumber } = parsed.data;

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ name, email, passwordHash, role, phoneNumber });

    // Auto-create rider profile for rider role
    if (role === 'rider') {
      await riderRepo.create({
        userId: user.id,
        name: user.name,
        phoneNumber: phoneNumber || '',
        isOnline: false,
        rating: 5.0,
        tripsCompleted: 0,
      });
    }

    const token = signToken(user.id, user.role);
    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phoneNumber: user.phoneNumber },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const { email, password } = parsed.data;

    const user = await userRepo.findByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken(user.id, user.role);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phoneNumber: user.phoneNumber },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userRepo.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phoneNumber: user.phoneNumber, createdAt: user.createdAt },
    });
  } catch (err) {
    next(err);
  }
}
