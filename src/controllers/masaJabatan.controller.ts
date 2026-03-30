import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMasaJabatanList = async (_req: Request, res: Response) => {
  const list = await prisma.masaJabatan.findMany({
    orderBy: [{ isAktif: 'desc' }, { tahunMulai: 'desc' }],
    include: {
      pimpinan: {
        orderBy: { order: 'asc' },
      },
    },
  });
  res.json(list);
};

export const getMasaJabatanById = async (req: Request, res: Response) => {
  const item = await prisma.masaJabatan.findUnique({
    where: { id: String(req.params.id) },
    include: {
      pimpinan: {
        orderBy: { order: 'asc' },
      },
    },
  });
  if (!item) {
    res.status(404).json({ message: 'Data masa jabatan tidak ditemukan.' });
    return;
  }
  res.json(item);
};

export const createMasaJabatan = async (req: AuthRequest, res: Response) => {
  const { periode, tahunMulai, tahunSelesai, isAktif, keterangan, order } = req.body;

  if (!periode || !tahunMulai || !tahunSelesai) {
    res.status(400).json({ message: 'Periode, tahun mulai, dan tahun selesai diperlukan.' });
    return;
  }

  // Jika isAktif true, nonaktifkan yang lain
  if (isAktif === true || isAktif === 'true') {
    await prisma.masaJabatan.updateMany({ data: { isAktif: false } });
  }

  const item = await prisma.masaJabatan.create({
    data: {
      periode,
      tahunMulai: parseInt(tahunMulai),
      tahunSelesai: parseInt(tahunSelesai),
      isAktif: isAktif === true || isAktif === 'true',
      keterangan: keterangan || null,
      order: order ? parseInt(order) : 0,
    },
  });

  res.status(201).json(item);
};

export const updateMasaJabatan = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.masaJabatan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Data masa jabatan tidak ditemukan.' });
    return;
  }

  const { periode, tahunMulai, tahunSelesai, isAktif, keterangan, order } = req.body;

  // Jika isAktif true, nonaktifkan yang lain dulu
  const setActive = isAktif === true || isAktif === 'true';
  if (setActive) {
    await prisma.masaJabatan.updateMany({
      where: { id: { not: String(req.params.id) } },
      data: { isAktif: false },
    });
  }

  const updated = await prisma.masaJabatan.update({
    where: { id: String(req.params.id) },
    data: {
      periode: periode || existing.periode,
      tahunMulai: tahunMulai ? parseInt(tahunMulai) : existing.tahunMulai,
      tahunSelesai: tahunSelesai ? parseInt(tahunSelesai) : existing.tahunSelesai,
      isAktif: isAktif !== undefined ? setActive : existing.isAktif,
      keterangan: keterangan !== undefined ? keterangan : existing.keterangan,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
  });

  res.json(updated);
};

export const deleteMasaJabatan = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.masaJabatan.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Data masa jabatan tidak ditemukan.' });
    return;
  }

  // Set masaJabatanId pimpinan ke null dulu
  await prisma.pimpinan.updateMany({
    where: { masaJabatanId: String(req.params.id) },
    data: { masaJabatanId: null },
  });

  await prisma.masaJabatan.delete({ where: { id: String(req.params.id) } });

  res.json({ message: 'Data masa jabatan berhasil dihapus.' });
};
