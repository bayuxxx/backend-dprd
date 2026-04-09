import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/storage';

// ══════════════════════════════════════════════
// BadanKehormatanInfo (description + masa jabatan)
// ══════════════════════════════════════════════

export const getBKInfo = async (req: Request, res: Response) => {
  const { id } = req.query;
  const where = id ? { id: String(id) } : { isAktif: true };
  const info = await prisma.badanKehormatanInfo.findFirst({
    where,
    include: {
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  res.json(info);
};

export const getAllBKInfo = async (_req: Request, res: Response) => {
  const list = await prisma.badanKehormatanInfo.findMany({
    orderBy: { createdAt: 'desc' },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(list);
};

export const createBKInfo = async (req: AuthRequest, res: Response) => {
  const { masaJabatan, deskripsi, isAktif } = req.body;

  if (!masaJabatan) {
    res.status(400).json({ message: 'Masa jabatan diperlukan.' });
    return;
  }

  if (isAktif === true || isAktif === 'true') {
    await prisma.badanKehormatanInfo.updateMany({ data: { isAktif: false } });
  }

  const info = await prisma.badanKehormatanInfo.create({
    data: {
      masaJabatan,
      deskripsi: deskripsi || null,
      isAktif: isAktif === true || isAktif === 'true',
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.status(201).json(info);
};

export const updateBKInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.badanKehormatanInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Badan Kehormatan info tidak ditemukan.' });
    return;
  }

  const { masaJabatan, deskripsi, isAktif } = req.body;

  if ((isAktif === true || isAktif === 'true') && !existing.isAktif) {
    await prisma.badanKehormatanInfo.updateMany({ data: { isAktif: false } });
  }

  const updated = await prisma.badanKehormatanInfo.update({
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

export const deleteBKInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.badanKehormatanInfo.findUnique({
    where: { id: String(req.params.id) },
    include: { anggota: true },
  });
  if (!existing) {
    res.status(404).json({ message: 'Badan Kehormatan info tidak ditemukan.' });
    return;
  }

  for (const anggota of existing.anggota) {
    if (anggota.imageUrl) await deleteFromStorage(anggota.imageUrl);
  }

  await prisma.anggotaBadanKehormatan.deleteMany({ where: { bkInfoId: String(req.params.id) } });
  await prisma.badanKehormatanInfo.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Badan Kehormatan info berhasil dihapus.' });
};

// ══════════════════════════════════════════════
// AnggotaBadanKehormatan (members)
// ══════════════════════════════════════════════

export const getAnggotaBK = async (req: Request, res: Response) => {
  const { bkInfoId } = req.query;
  const where: Record<string, unknown> = {};
  if (bkInfoId) where.bkInfoId = String(bkInfoId);

  const anggota = await prisma.anggotaBadanKehormatan.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { bkInfo: true },
  });
  res.json(anggota);
};

export const createAnggotaBK = async (req: AuthRequest, res: Response) => {
  const { name, jabatan, faction, order, bkInfoId } = req.body;

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
      'bk'
    );
  }

  const anggota = await prisma.anggotaBadanKehormatan.create({
    data: {
      name,
      jabatan,
      faction: faction || null,
      imageUrl,
      order: order ? parseInt(order) : 0,
      bkInfoId: bkInfoId || null,
    },
    include: { bkInfo: true },
  });
  res.status(201).json(anggota);
};

export const updateAnggotaBK = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBadanKehormatan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota Badan Kehormatan tidak ditemukan.' });
    return;
  }

  const { name, jabatan, faction, order, bkInfoId } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'bk'
    );
  }

  const updated = await prisma.anggotaBadanKehormatan.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      jabatan: jabatan || existing.jabatan,
      faction: faction !== undefined ? faction : existing.faction,
      imageUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
      bkInfoId: bkInfoId !== undefined ? (bkInfoId || null) : existing.bkInfoId,
    },
    include: { bkInfo: true },
  });
  res.json(updated);
};

export const deleteAnggotaBK = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaBadanKehormatan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota Badan Kehormatan tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.anggotaBadanKehormatan.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Anggota Badan Kehormatan berhasil dihapus.' });
};
