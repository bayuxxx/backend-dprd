import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';

// ══════════════════════════════════════════════
// BapemperdaInfo (description + masa jabatan)
// ══════════════════════════════════════════════

/** GET /api/bapemperda/info — public, returns active info with all members */
export const getBapemperdaInfo = async (_req: Request, res: Response) => {
  const info = await prisma.bapemperdaInfo.findFirst({
    where: { isAktif: true },
    include: {
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  res.json(info);
};

/** GET /api/bapemperda/info/all — admin, returns all records */
export const getAllBapemperdaInfo = async (_req: Request, res: Response) => {
  const list = await prisma.bapemperdaInfo.findMany({
    orderBy: { createdAt: 'desc' },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(list);
};

/** POST /api/bapemperda/info — admin */
export const createBapemperdaInfo = async (req: AuthRequest, res: Response) => {
  const { masaJabatan, deskripsi, isAktif } = req.body;

  if (!masaJabatan) {
    res.status(400).json({ message: 'Masa jabatan diperlukan.' });
    return;
  }

  if (isAktif === true || isAktif === 'true') {
    await prisma.bapemperdaInfo.updateMany({ data: { isAktif: false } });
  }

  const info = await prisma.bapemperdaInfo.create({
    data: {
      masaJabatan,
      deskripsi: deskripsi || null,
      isAktif: isAktif === true || isAktif === 'true',
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.status(201).json(info);
};

/** PUT /api/bapemperda/info/:id — admin */
export const updateBapemperdaInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.bapemperdaInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Bapemperda info tidak ditemukan.' });
    return;
  }

  const { masaJabatan, deskripsi, isAktif } = req.body;

  if ((isAktif === true || isAktif === 'true') && !existing.isAktif) {
    await prisma.bapemperdaInfo.updateMany({ data: { isAktif: false } });
  }

  const updated = await prisma.bapemperdaInfo.update({
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

/** DELETE /api/bapemperda/info/:id — admin */
export const deleteBapemperdaInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.bapemperdaInfo.findUnique({
    where: { id: String(req.params.id) },
    include: { anggota: true },
  });
  if (!existing) {
    res.status(404).json({ message: 'Bapemperda info tidak ditemukan.' });
    return;
  }

  for (const anggota of existing.anggota) {
    if (anggota.imageUrl) await deleteFromStorage(anggota.imageUrl);
  }

  await prisma.anggotaBapemperda.deleteMany({ where: { bapemperdaInfoId: String(req.params.id) } });
  await prisma.bapemperdaInfo.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Bapemperda info berhasil dihapus.' });
};

// ══════════════════════════════════════════════
// AnggotaBapemperda (members)
// ══════════════════════════════════════════════

/** GET /api/bapemperda/anggota — public */
export const getAnggotaBapemperda = async (req: Request, res: Response) => {
  const { bapemperdaInfoId } = req.query;
  const where: Record<string, unknown> = {};
  if (bapemperdaInfoId) where.bapemperdaInfoId = String(bapemperdaInfoId);

  const anggota = await prisma.anggotaBapemperda.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { bapemperdaInfo: true },
  });
  res.json(anggota);
};

/** POST /api/bapemperda/anggota — admin */
export const createAnggotaBapemperda = async (req: AuthRequest, res: Response) => {
  const { name, jabatan, faction, order, bapemperdaInfoId } = req.body;

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
      'bapemperda'
    );
  }

  const anggota = await prisma.anggotaBapemperda.create({
    data: {
      name,
      jabatan,
      faction: faction || null,
      imageUrl,
      order: order ? parseInt(order) : 0,
      bapemperdaInfoId: bapemperdaInfoId || null,
    },
    include: { bapemperdaInfo: true },
  });
  res.status(201).json(anggota);
};

/** PUT /api/bapemperda/anggota/:id — admin */
export const updateAnggotaBapemperda = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBapemperda.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota bapemperda tidak ditemukan.' });
    return;
  }

  const { name, jabatan, faction, order, bapemperdaInfoId } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'bapemperda'
    );
  }

  const updated = await prisma.anggotaBapemperda.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      jabatan: jabatan || existing.jabatan,
      faction: faction !== undefined ? faction : existing.faction,
      imageUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
      bapemperdaInfoId: bapemperdaInfoId !== undefined ? (bapemperdaInfoId || null) : existing.bapemperdaInfoId,
    },
    include: { bapemperdaInfo: true },
  });
  res.json(updated);
};

/** DELETE /api/bapemperda/anggota/:id — admin */
export const deleteAnggotaBapemperda = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBapemperda.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota bapemperda tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.anggotaBapemperda.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Anggota bapemperda berhasil dihapus.' });
};
