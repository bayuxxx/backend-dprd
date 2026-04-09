import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/storage';

export const getPimpinanList = async (req: Request, res: Response) => {
  const { isPast, masaJabatanId } = req.query;

  const where: Record<string, unknown> = {};
  if (isPast !== undefined) {
    where.isPast = isPast === 'true';
  }
  if (masaJabatanId) {
    where.masaJabatanId = String(masaJabatanId);
  }

  const pimpinan = await prisma.pimpinan.findMany({
    where,
    orderBy: [{ period: 'desc' }, { order: 'asc' }],
    include: {
      masaJabatan: true,
    },
  });
  res.json(pimpinan);
};

export const getPimpinanById = async (req: Request, res: Response) => {
  const pimpinan = await prisma.pimpinan.findUnique({
    where: { id: String(req.params.id) },
    include: { masaJabatan: true },
  });
  if (!pimpinan) {
    res.status(404).json({ message: 'Data pimpinan tidak ditemukan.' });
    return;
  }
  res.json(pimpinan);
};

export const createPimpinan = async (req: AuthRequest, res: Response) => {
  const { name, position, faction, period, bio, order, isPast, masaJabatanId } = req.body;

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
      masaJabatanId: masaJabatanId || null,
      isPast: isPast === true || isPast === 'true',
      imageUrl,
      bio: bio || null,
      order: order ? parseInt(order) : 0,
    },
    include: { masaJabatan: true },
  });

  res.status(201).json(pimpinan);
};

export const updatePimpinan = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.pimpinan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Data pimpinan tidak ditemukan.' });
    return;
  }

  const { name, position, faction, period, bio, order, isPast, masaJabatanId } = req.body;

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
      masaJabatanId: masaJabatanId !== undefined ? (masaJabatanId || null) : existing.masaJabatanId,
      isPast: isPast !== undefined ? (isPast === true || isPast === 'true') : existing.isPast,
      imageUrl,
      bio: bio !== undefined ? bio : existing.bio,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
    include: { masaJabatan: true },
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
