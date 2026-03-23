import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';

export const getPimpinanList = async (_req: Request, res: Response) => {
  const pimpinan = await prisma.pimpinan.findMany({
    orderBy: { order: 'asc' },
  });
  res.json(pimpinan);
};

export const getPimpinanById = async (req: Request, res: Response) => {
  const pimpinan = await prisma.pimpinan.findUnique({ where: { id: String(req.params.id) } });
  if (!pimpinan) {
    res.status(404).json({ message: 'Data pimpinan tidak ditemukan.' });
    return;
  }
  res.json(pimpinan);
};

export const createPimpinan = async (req: AuthRequest, res: Response) => {
  const { name, position, faction, period, bio, order } = req.body;

  if (!name || !position) {
    res.status(400).json({ message: 'Nama dan jabatan diperlukan.' });
    return;
  }

  let imageUrl: string | null = null;
  if (req.file) {
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'pimpinan'
    );
  }

  const pimpinan = await prisma.pimpinan.create({
    data: {
      name,
      position,
      faction: faction || null,
      period: period || '2024-2029',
      imageUrl,
      bio: bio || null,
      order: order ? parseInt(order) : 0,
    },
  });

  res.status(201).json(pimpinan);
};

export const updatePimpinan = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.pimpinan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Data pimpinan tidak ditemukan.' });
    return;
  }

  const { name, position, faction, period, bio, order } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'pimpinan'
    );
  }

  const updated = await prisma.pimpinan.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      position: position || existing.position,
      faction: faction !== undefined ? faction : existing.faction,
      period: period || existing.period,
      imageUrl,
      bio: bio !== undefined ? bio : existing.bio,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
  });

  res.json(updated);
};

export const deletePimpinan = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.pimpinan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Data pimpinan tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.pimpinan.delete({ where: { id: String(req.params.id) } });

  res.json({ message: 'Data pimpinan berhasil dihapus.' });
};
