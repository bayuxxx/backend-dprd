import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(admins);
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal mengambil data admin.', error: error.message });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({ message: 'Username dan password diperlukan.' });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) {
      res.status(400).json({ message: 'Username sudah digunakan.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json(newAdmin);
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal membuat admin.', error: error.message });
  }
};

export const updateAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { username, password } = req.body;

    const existingAdmin = await prisma.admin.findUnique({ where: { id } });
    if (!existingAdmin) {
      res.status(404).json({ message: 'Admin tidak ditemukan.' });
      return;
    }

    if (username && username !== existingAdmin.username) {
      const usernameExists = await prisma.admin.findUnique({ where: { username } });
      if (usernameExists) {
        res.status(400).json({ message: 'Username sudah digunakan oleh admin lain.' });
        return;
      }
    }

    const dataToUpdate: any = { username };
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json(updatedAdmin);
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal memperbarui admin.', error: error.message });
  }
};

export const deleteAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const currentAdminId = req.adminId;

    if (id === currentAdminId) {
      res.status(400).json({ message: 'Tidak dapat menghapus akun Anda sendiri saat sedang login.' });
      return;
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { id } });
    if (!existingAdmin) {
      res.status(404).json({ message: 'Admin tidak ditemukan.' });
      return;
    }

    await prisma.admin.delete({ where: { id } });
    res.json({ message: 'Admin berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal menghapus admin.', error: error.message });
  }
};
