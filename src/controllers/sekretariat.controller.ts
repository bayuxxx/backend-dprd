import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';

// ==========================================
// Sekretariat Info (visi, misi, tugas, fungsi)
// ==========================================

export const getSekretariatInfo = async (_req: Request, res: Response) => {
  // Return the first (singleton) record or null
  let info = await prisma.sekretariat.findFirst();
  res.json(info);
};

export const upsertSekretariatInfo = async (req: AuthRequest, res: Response) => {
  const { visi, misi, tugas, fungsi } = req.body;

  const existing = await prisma.sekretariat.findFirst();

  if (existing) {
    const updated = await prisma.sekretariat.update({
      where: { id: existing.id },
      data: {
        visi: visi !== undefined ? visi : existing.visi,
        misi: misi !== undefined ? misi : existing.misi,
        tugas: tugas !== undefined ? tugas : existing.tugas,
        fungsi: fungsi !== undefined ? fungsi : existing.fungsi,
      },
    });
    res.json(updated);
  } else {
    const created = await prisma.sekretariat.create({
      data: {
        visi: visi || null,
        misi: misi || null,
        tugas: tugas || null,
        fungsi: fungsi || null,
      },
    });
    res.status(201).json(created);
  }
};

// ==========================================
// Anggota Sekretariat CRUD
// ==========================================

export const getAnggotaSekretariatList = async (_req: Request, res: Response) => {
  const list = await prisma.anggotaSekretariat.findMany({
    orderBy: [{ isSekretaris: 'desc' }, { order: 'asc' }],
  });
  res.json(list);
};

export const getAnggotaSekretariatById = async (req: Request, res: Response) => {
  const item = await prisma.anggotaSekretariat.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!item) {
    res.status(404).json({ message: 'Data anggota sekretariat tidak ditemukan.' });
    return;
  }
  res.json(item);
};

export const createAnggotaSekretariat = async (req: AuthRequest, res: Response) => {
  const { name, position, unit, isSekretaris, order } = req.body;

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
      'sekretariat'
    );
  }

  const item = await prisma.anggotaSekretariat.create({
    data: {
      name,
      position,
      unit: unit || null,
      imageUrl,
      isSekretaris: isSekretaris === 'true' || isSekretaris === true,
      order: order ? parseInt(order) : 0,
    },
  });

  res.status(201).json(item);
};

export const updateAnggotaSekretariat = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaSekretariat.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!existing) {
    res.status(404).json({ message: 'Data anggota sekretariat tidak ditemukan.' });
    return;
  }

  const { name, position, unit, isSekretaris, order } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    // Delete old image
    if (existing.imageUrl) {
      await deleteFromStorage(existing.imageUrl);
    }
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'sekretariat'
    );
  }

  const updated = await prisma.anggotaSekretariat.update({
    where: { id: String(req.params.id) },
    data: {
      name: name || existing.name,
      position: position || existing.position,
      unit: unit !== undefined ? (unit || null) : existing.unit,
      imageUrl,
      isSekretaris: isSekretaris !== undefined
        ? (isSekretaris === 'true' || isSekretaris === true)
        : existing.isSekretaris,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
  });

  res.json(updated);
};

export const deleteAnggotaSekretariat = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.anggotaSekretariat.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!existing) {
    res.status(404).json({ message: 'Data anggota sekretariat tidak ditemukan.' });
    return;
  }

  // Delete image from storage
  if (existing.imageUrl) {
    await deleteFromStorage(existing.imageUrl);
  }

  await prisma.anggotaSekretariat.delete({ where: { id: String(req.params.id) } });

  res.json({ message: 'Data anggota sekretariat berhasil dihapus.' });
};
