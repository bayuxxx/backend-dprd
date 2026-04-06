import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';

// ══════════════════════════════════════════════
// BamusInfo (description + masa jabatan)
// ══════════════════════════════════════════════

/** GET /api/bamus/info — public, returns active bamus info with all members */
export const getBamusInfo = async (_req: Request, res: Response) => {
  const info = await prisma.bamusInfo.findFirst({
    where: { isAktif: true },
    include: {
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  res.json(info);
};

/** GET /api/bamus/info/all — admin, returns all bamus info records */
export const getAllBamusInfo = async (_req: Request, res: Response) => {
  const list = await prisma.bamusInfo.findMany({
    orderBy: { createdAt: 'desc' },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(list);
};

/** POST /api/bamus/info — admin, create bamus info */
export const createBamusInfo = async (req: AuthRequest, res: Response) => {
  const { masaJabatan, deskripsi, isAktif } = req.body;

  if (!masaJabatan) {
    res.status(400).json({ message: 'Masa jabatan diperlukan.' });
    return;
  }

  // If setting as active, deactivate others
  if (isAktif === true || isAktif === 'true') {
    await prisma.bamusInfo.updateMany({ data: { isAktif: false } });
  }

  const info = await prisma.bamusInfo.create({
    data: {
      masaJabatan,
      deskripsi: deskripsi || null,
      isAktif: isAktif === true || isAktif === 'true',
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.status(201).json(info);
};

/** PUT /api/bamus/info/:id — admin, update bamus info */
export const updateBamusInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.bamusInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Bamus info tidak ditemukan.' });
    return;
  }

  const { masaJabatan, deskripsi, isAktif } = req.body;

  // If setting as active, deactivate others
  if ((isAktif === true || isAktif === 'true') && !existing.isAktif) {
    await prisma.bamusInfo.updateMany({ data: { isAktif: false } });
  }

  const updated = await prisma.bamusInfo.update({
    where: { id: String(req.params.id) },
    data: {
      masaJabatan: masaJabatan ?? existing.masaJabatan,
      deskripsi: deskripsi !== undefined ? deskripsi : existing.deskripsi,
      isAktif: isAktif !== undefined ? (isAktif === true || isAktif === 'true') : existing.isAktif,
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(updated);
};

/** DELETE /api/bamus/info/:id — admin */
export const deleteBamusInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.bamusInfo.findUnique({
    where: { id: String(req.params.id) },
    include: { anggota: true },
  });
  if (!existing) {
    res.status(404).json({ message: 'Bamus info tidak ditemukan.' });
    return;
  }

  // Delete images of all members
  for (const anggota of existing.anggota) {
    if (anggota.imageUrl) await deleteFromStorage(anggota.imageUrl);
  }

  // Delete all members first, then the info
  await prisma.anggotaBamus.deleteMany({ where: { bamusInfoId: String(req.params.id) } });
  await prisma.bamusInfo.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Bamus info berhasil dihapus.' });
};

// ══════════════════════════════════════════════
// AnggotaBamus (members)
// ══════════════════════════════════════════════

/** GET /api/bamus/anggota — public, returns all members (optionally filter by bamusInfoId) */
export const getAnggotaBamus = async (req: Request, res: Response) => {
  const { bamusInfoId } = req.query;
  const where: Record<string, unknown> = {};
  if (bamusInfoId) where.bamusInfoId = String(bamusInfoId);

  const anggota = await prisma.anggotaBamus.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { bamusInfo: true },
  });
  res.json(anggota);
};

/** POST /api/bamus/anggota — admin, create member */
export const createAnggotaBamus = async (req: AuthRequest, res: Response) => {
  const { name, jabatan, faction, order, bamusInfoId } = req.body;

  if (!name || !jabatan) {
    res.status(400).json({ message: 'Nama dan jabatan diperlukan.' });
    return;
  }

  let imageUrl: string | null = null;
  if (req.file) {
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'bamus'
    );
  }

  const anggota = await prisma.anggotaBamus.create({
    data: {
      name,
      jabatan,
      faction: faction || null,
      imageUrl,
      order: order ? parseInt(order) : 0,
      bamusInfoId: bamusInfoId || null,
    },
    include: { bamusInfo: true },
  });
  res.status(201).json(anggota);
};

/** PUT /api/bamus/anggota/:id — admin, update member */
export const updateAnggotaBamus = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBamus.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota bamus tidak ditemukan.' });
    return;
  }

  const { name, jabatan, faction, order, bamusInfoId } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'bamus'
    );
  }

  const updated = await prisma.anggotaBamus.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      jabatan: jabatan || existing.jabatan,
      faction: faction !== undefined ? faction : existing.faction,
      imageUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
      bamusInfoId: bamusInfoId !== undefined ? (bamusInfoId || null) : existing.bamusInfoId,
    },
    include: { bamusInfo: true },
  });
  res.json(updated);
};

/** DELETE /api/bamus/anggota/:id — admin */
export const deleteAnggotaBamus = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBamus.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota bamus tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.anggotaBamus.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Anggota bamus berhasil dihapus.' });
};
