import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/storage';

// ══════════════════════════════════════════════
// KomisiInfo (nama komisi + masa jabatan)
// ══════════════════════════════════════════════

export const getKomisiInfo = async (req: Request, res: Response) => {
  const { id } = req.query;
  const where = id ? { id: String(id) } : { isAktif: true };
  const info = await prisma.komisiInfo.findFirst({
    where,
    include: {
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  res.json(info);
};

export const getAllKomisiInfo = async (_req: Request, res: Response) => {
  const list = await prisma.komisiInfo.findMany({
    orderBy: [
      { createdAt: 'desc' },
      { namaKomisi: 'asc' }
    ],
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(list);
};

export const createKomisiInfo = async (req: AuthRequest, res: Response) => {
  const { namaKomisi, masaJabatan, deskripsi, isAktif } = req.body;

  if (!namaKomisi || !masaJabatan) {
    res.status(400).json({ message: 'Nama komisi dan masa jabatan diperlukan.' });
    return;
  }

  // NOTE: Komisi has MULTIPLE items active at the same time usually (Komisi A, B, C...)
  // so we don't automatically deactivate all others on creation unless it's a new period setting.
  // We leave it to the admin entirely.

  const info = await prisma.komisiInfo.create({
    data: {
      namaKomisi,
      masaJabatan,
      deskripsi: deskripsi || null,
      isAktif: isAktif === true || isAktif === 'true',
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.status(201).json(info);
};

export const updateKomisiInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.komisiInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Komisi info tidak ditemukan.' });
    return;
  }

  const { namaKomisi, masaJabatan, deskripsi, isAktif } = req.body;

  const updated = await prisma.komisiInfo.update({
    where: { id: String(req.params.id) },
    data: {
      namaKomisi: namaKomisi ?? existing.namaKomisi,
      masaJabatan: masaJabatan ?? existing.masaJabatan,
      deskripsi: deskripsi !== undefined ? deskripsi : existing.deskripsi,
      isAktif: isAktif !== undefined ? (isAktif === true || isAktif === 'true') : existing.isAktif,
    },
    include: { anggota: { orderBy: { order: 'asc' } } },
  });
  res.json(updated);
};

export const deleteKomisiInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.komisiInfo.findUnique({
    where: { id: String(req.params.id) },
    include: { anggota: true },
  });
  if (!existing) {
    res.status(404).json({ message: 'Komisi info tidak ditemukan.' });
    return;
  }

  for (const anggota of existing.anggota) {
    if (anggota.imageUrl) await deleteFromStorage(anggota.imageUrl);
  }

  await prisma.anggotaKomisi.deleteMany({ where: { komisiInfoId: String(req.params.id) } });
  await prisma.komisiInfo.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Komisi info berhasil dihapus.' });
};

// ══════════════════════════════════════════════
// AnggotaKomisi (members)
// ══════════════════════════════════════════════

export const getAnggotaKomisi = async (req: Request, res: Response) => {
  const { komisiInfoId } = req.query;
  const where: Record<string, unknown> = {};
  if (komisiInfoId) where.komisiInfoId = String(komisiInfoId);

  const anggota = await prisma.anggotaKomisi.findMany({
    where,
    orderBy: { order: 'asc' },
    include: { komisiInfo: true },
  });
  res.json(anggota);
};

export const createAnggotaKomisi = async (req: AuthRequest, res: Response) => {
  const { name, jabatan, faction, order, komisiInfoId } = req.body;

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
      'komisi'
    );
  }

  const anggota = await prisma.anggotaKomisi.create({
    data: {
      name,
      jabatan,
      faction: faction || null,
      imageUrl,
      order: order ? parseInt(order) : 0,
      komisiInfoId: komisiInfoId || null,
    },
    include: { komisiInfo: true },
  });
  res.status(201).json(anggota);
};

export const updateAnggotaKomisi = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaKomisi.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota Komisi tidak ditemukan.' });
    return;
  }

  const { name, jabatan, faction, order, komisiInfoId } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'komisi'
    );
  }

  const updated = await prisma.anggotaKomisi.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      jabatan: jabatan || existing.jabatan,
      faction: faction !== undefined ? faction : existing.faction,
      imageUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
      komisiInfoId: komisiInfoId !== undefined ? (komisiInfoId || null) : existing.komisiInfoId,
    },
    include: { komisiInfo: true },
  });
  res.json(updated);
};

export const deleteAnggotaKomisi = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaKomisi.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota Komisi tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.anggotaKomisi.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Anggota Komisi berhasil dihapus.' });
};
