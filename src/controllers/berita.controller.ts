import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToStorage, deleteFromStorage } from '../lib/supabase';

// Helper: generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const getBeritas = async (req: Request, res: Response) => {
  const { limit, page, category, isPublished } = req.query;

  const take = limit ? parseInt(limit as string) : undefined;
  const skip = page && limit ? (parseInt(page as string) - 1) * parseInt(limit as string) : undefined;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (isPublished !== undefined) where.isPublished = isPublished === 'true';

  const [beritas, total] = await Promise.all([
    prisma.berita.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take,
      skip,
    }),
    prisma.berita.count({ where }),
  ]);

  res.json({ data: beritas, total, page: page ? parseInt(page as string) : 1 });
};

export const getBeritaByIdOrSlug = async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;

  const berita = await prisma.berita.findFirst({
    where: {
      OR: [{ id: String(idOrSlug) }, { slug: String(idOrSlug) }],
    },
  });

  if (!berita) {
    res.status(404).json({ message: 'Berita tidak ditemukan.' });
    return;
  }
  res.json(berita);
};

export const createBerita = async (req: AuthRequest, res: Response) => {
  const { title, excerpt, content, category, isPublished, publishedAt } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Judul berita diperlukan.' });
    return;
  }

  // Generate unique slug
  let slug = generateSlug(title);
  const existing = await prisma.berita.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  let imageUrl: string | null = null;
  if (req.file) {
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'berita'
    );
  }

  const berita = await prisma.berita.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      imageUrl,
      category: category || 'Berita Dewan',
      isPublished: isPublished === 'false' ? false : true,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    },
  });

  res.status(201).json(berita);
};

export const updateBerita = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.berita.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Berita tidak ditemukan.' });
    return;
  }

  const { title, excerpt, content, category, isPublished, publishedAt } = req.body;

  let imageUrl = existing.imageUrl;
  if (req.file) {
    if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
    imageUrl = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'berita'
    );
  }

  // If title changed, update slug
  let { slug } = existing;
  if (title && title !== existing.title) {
    const newSlug = generateSlug(title);
    const duplicate = await prisma.berita.findFirst({
      where: { slug: newSlug, NOT: { id: String(req.params.id) } },
    });
    slug = duplicate ? `${newSlug}-${Date.now()}` : newSlug;
  }

  const updated = await prisma.berita.update({
    where: { id: String(req.params.id) },
    data: {
      title: title || existing.title,
      slug,
      excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
      content: content !== undefined ? content : existing.content,
      imageUrl,
      category: category || existing.category,
      isPublished: isPublished !== undefined ? isPublished === 'true' : existing.isPublished,
      publishedAt: publishedAt ? new Date(publishedAt) : existing.publishedAt,
    },
  });

  res.json(updated);
};

export const deleteBerita = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.berita.findUnique({ where: { id: String(req.params.id) } });
  if (!existing) {
    res.status(404).json({ message: 'Berita tidak ditemukan.' });
    return;
  }

  if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
  await prisma.berita.delete({ where: { id: String(req.params.id) } });

  res.json({ message: 'Berita berhasil dihapus.' });
};
