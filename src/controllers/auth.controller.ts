import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username dan password diperlukan.' });
    return;
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    res.status(401).json({ message: 'Username atau password salah.' });
    return;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    res.status(401).json({ message: 'Username atau password salah.' });
    return;
  }

  const token = jwt.sign(
    { adminId: admin.id, username: admin.username },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );

  res.json({
    token,
    admin: { id: admin.id, username: admin.username },
  });
};

export const getMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token tidak ditemukan.' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string; username: string };
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } });
    if (!admin) {
      res.status(401).json({ message: 'Admin tidak ditemukan.' });
      return;
    }
    res.json({ id: admin.id, username: admin.username });
  } catch {
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};
