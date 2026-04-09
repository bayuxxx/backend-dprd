import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/storage';

// ══════════════════════════════════════════════
// BanggarInfo (description + masa jabatan)
// ══════════════════════════════════════════════

/** GET /api/banggar/info — public, returns active info with all members */
export const getBanggarInfo = async (req: Request, res: Response) => {
  const { id } = req.query;
  const where = id ? { id: String(id) } : { isAktif: true };
  const info = await prisma.banggarInfo.findFirst({
    where,
    include: {
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  res.json(info);
};

/** GET /api/banggar/info/all — admin, returns all records */
export const getAllBanggarInfo = async (_req: Request, res: Response) => {
  const list = await prisma.banggarInfo.findMany({
    orderBy: { createdAt: 'desc' },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(list);
};

/** POST /api/banggar/info — admin */
export const createBanggarInfo = async (req: AuthRequest, res: Response) => {
  const { masaJabatan, deskripsi, isAktif } = req.body;

  if (!masaJabatan) {
    res.status(400).json({ message: 'Masa jabatan diperlukan.' });
    return;
  }

  if (isAktif === true || isAktif === 'true') {
    await prisma.banggarInfo.updateMany({ data: { isAktif: false } });
  }

  const info = await prisma.banggarInfo.create({
    data: {
      masaJabatan,
      deskripsi: deskripsi || null,
      isAktif: isAktif === true || isAktif === 'true',
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.status(201).json(info);
};

/** PUT /api/banggar/info/:id — admin */
export const updateBanggarInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.banggarInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Banggar info tidak ditemukan.' });
    return;
  }

  const { masaJabatan, deskripsi, isAktif } = req.body;

  if ((isAktif === true || isAktif === 'true') && !existing.isAktif) {
    await prisma.banggarInfo.updateMany({ data: { isAktif: false } });
  }

  const updated = await prisma.banggarInfo.update({
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

/** DELETE /api/banggar/info/:id — admin */
export const deleteBanggarInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.banggarInfo.findUnique({
    where: { id: String(req.params.id) },
    include: { anggota: true },
  });
  if (!existing) {
    res.status(404).json({ message: 'Banggar info tidak ditemukan.' });
    return;
  }

  for (const anggota of existing.anggota) {
    if (anggota.imageUrl) await deleteFromStorage(anggota.imageUrl);
  }

  await prisma.anggotaBanggar.deleteMany({ where: { banggarInfoId: String(req.params.id) } });
  await prisma.banggarInfo.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Banggar info berhasil dihapus.' });
};

// ══════════════════════════════════════════════
// AnggotaBanggar (members)
// ══════════════════════════════════════════════

/** GET /api/banggar/anggota — public */
export const getAnggotaBanggar = async (req: Request, res: Response) => {
  const { banggarInfoId } = req.query;
  const where: Record<string, unknown> = {};
  if (banggarInfoId) where.banggarInfoId = String(banggarInfoId);

  const anggota = await prisma.anggotaBanggar.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { banggarInfo: true },
  });
  res.json(anggota);
};

/** POST /api/banggar/anggota — admin */
export const createAnggotaBanggar = async (req: AuthRequest, res: Response) => {
  const { name, jabatan, faction, order, banggarInfoId } = req.body;

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
      'banggar'
    );
  }

  const anggota = await prisma.anggotaBanggar.create({
    data: {
      name,
      jabatan,
      faction: faction || null,
      imageUrl,
      order: order ? parseInt(order) : 0,
      banggarInfoId: banggarInfoId || null,
    },
    include: { banggarInfo: true },
  });
  res.status(201).json(anggota);
};

/** PUT /api/banggar/anggota/:id — admin */
export const updateAnggotaBanggar = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBanggar.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota banggar tidak ditemukan.' });
    return;
  }

  const { name, jabatan, faction, order, banggarInfoId } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'banggar'
    );
  }

  const updated = await prisma.anggotaBanggar.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      jabatan: jabatan || existing.jabatan,
      faction: faction !== undefined ? faction : existing.faction,
      imageUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
      banggarInfoId: banggarInfoId !== undefined ? (banggarInfoId || null) : existing.banggarInfoId,
    },
    include: { banggarInfo: true },
  });
  res.json(updated);
};

/** DELETE /api/banggar/anggota/:id — admin */
export const deleteAnggotaBanggar = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBanggar.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota banggar tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.anggotaBanggar.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Anggota banggar berhasil dihapus.' });
};
