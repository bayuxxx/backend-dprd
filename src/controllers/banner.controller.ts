import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';

export const getBanners = async (req: Request, res: Response) => {
  const { isActive } = req.query;

  const banners = await prisma.banner.findMany({
    where: isActive !== undefined ? { isActive: isActive === 'true' } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(banners);
};

export const getBannerById = async (req: Request, res: Response) => {
  const banner = await prisma.banner.findUnique({ where: { id: String(req.params.id) } });
  if (!banner) {
    res.status(404).json({ message: 'Banner tidak ditemukan.' });
    return;
  }
  res.json(banner);
};

export const createBanner = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Judul banner diperlukan.' });
    return;
  }

  let imageUrl = req.body.imageUrl || '';
  if (req.file) {
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'banners'
    );
  }

  const banner = await prisma.banner.create({
    data: {
      title,
      subtitle: null,
      category: 'Berita Dewan',
      imageUrl,
      linkUrl: null,
      isActive: true,
      order: 0,
    },
  });

  res.status(201).json(banner);
};

export const updateBanner = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.banner.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Banner tidak ditemukan.' });
    return;
  }

  const { title } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'banners'
    );
  }

  const updated = await prisma.banner.update({
    where: { id: String(req.params.id) },
    data: {
      title: title || existing.title,
      imageUrl,
    },
  });

  res.json(updated);
};

export const deleteBanner = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.banner.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Banner tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.banner.delete({ where: { id: String(req.params.id) } });

  res.json({ message: 'Banner berhasil dihapus.' });
};
