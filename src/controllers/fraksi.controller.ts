import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/storage';

// ═══════════════════════════════════════════
// FRAKSI INFO CRUD
// ═══════════════════════════════════════════

export const getAllFraksiInfo = async (_req: Request, res: Response) => {
  const list = await prisma.fraksiInfo.findMany({
    orderBy: [{ isAktif: 'desc' }, { order: 'asc' }],
    include: {
      masaJabatan: true,
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  res.json(list);
};

export const getFraksiInfoBySlug = async (req: Request, res: Response) => {
  const item = await prisma.fraksiInfo.findFirst({
    where: { slug: String(req.params.slug) },
    include: {
      masaJabatan: true,
      anggota: { orderBy: { order: 'asc' } },
    },
  });
  if (!item) {
    res.status(404).json({ message: 'Fraksi tidak ditemukan.' });
    return;
  }
  res.json(item);
};

export const createFraksiInfo = async (req: AuthRequest, res: Response) => {
  const { name, shortName, slug, color, kursi, masaJabatanId, deskripsi, isAktif, order } = req.body;

  if (!name || !shortName || !slug) {
    res.status(400).json({ message: 'Nama, nama singkat, dan slug diperlukan.' });
    return;
  }

  let logoUrl: string | null = null;
  if (req.file) {
    logoUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'fraksi'
    );
  }

  const item = await prisma.fraksiInfo.create({
    data: {
      name,
      shortName,
      slug,
      color: color || '#c8102e',
      kursi: kursi ? parseInt(kursi) : 0,
      masaJabatanId: masaJabatanId || null,
      deskripsi: deskripsi || null,
      logoUrl,
      isAktif: isAktif === undefined ? true : (isAktif === true || isAktif === 'true'),
      order: order ? parseInt(order) : 0,
    },
    include: { masaJabatan: true, anggota: true },
  });
  res.status(201).json(item);
};

export const updateFraksiInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.fraksiInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Fraksi tidak ditemukan.' });
    return;
  }

  const { name, shortName, slug, color, kursi, masaJabatanId, deskripsi, isAktif, order } = req.body;

  let logoUrl = existing.logoUrl;
  if (req.file) {
    if (existing.logoUrl) await deleteFromStorage(existing.logoUrl);
    logoUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'fraksi'
    );
  }

  const updated = await prisma.fraksiInfo.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      shortName: shortName || existing.shortName,
      slug: slug || existing.slug,
      color: color || existing.color,
      kursi: kursi !== undefined ? parseInt(kursi) : existing.kursi,
      masaJabatanId: masaJabatanId !== undefined ? (masaJabatanId || null) : existing.masaJabatanId,
      deskripsi: deskripsi !== undefined ? deskripsi : existing.deskripsi,
      logoUrl,
      isAktif: isAktif !== undefined ? (isAktif === true || isAktif === 'true') : existing.isAktif,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
    include: { masaJabatan: true, anggota: true },
  });
  res.json(updated);
};

export const deleteFraksiInfo = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.fraksiInfo.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Fraksi tidak ditemukan.' });
    return;
  }
  if (existing.logoUrl) await deleteFromStorage(existing.logoUrl);

  // Delete anggota first
  await prisma.anggotaFraksi.deleteMany({ where: { fraksiInfoId: String(req.params.id) } });
  await prisma.fraksiInfo.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Fraksi berhasil dihapus.' });
};

// ═══════════════════════════════════════════
// ANGGOTA FRAKSI CRUD
// ═══════════════════════════════════════════

export const createAnggotaFraksi = async (req: AuthRequest, res: Response) => {
  const { name, jabatan, faction, order, fraksiInfoId } = req.body;

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
      'fraksi-anggota'
    );
  }

  const item = await prisma.anggotaFraksi.create({
    data: {
      name,
      jabatan,
      faction: faction || null,
      imageUrl,
      order: order ? parseInt(order) : 0,
      fraksiInfoId: fraksiInfoId || null,
    },
  });
  res.status(201).json(item);
};

export const updateAnggotaFraksi = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaFraksi.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    return;
  }

  const { name, jabatan, faction, order, fraksiInfoId } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'fraksi-anggota'
    );
  }

  const updated = await prisma.anggotaFraksi.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      jabatan: jabatan || existing.jabatan,
      faction: faction !== undefined ? faction : existing.faction,
      imageUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
      fraksiInfoId: fraksiInfoId !== undefined ? (fraksiInfoId || null) : existing.fraksiInfoId,
    },
  });
  res.json(updated);
};

export const deleteAnggotaFraksi = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaFraksi.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Anggota tidak ditemukan.' });
    return;
  }
  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.anggotaFraksi.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Anggota berhasil dihapus.' });
};
