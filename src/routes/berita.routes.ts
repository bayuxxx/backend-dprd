import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import { getBeritas, getBeritaByIdOrSlug, createBerita, updateBerita, deleteBerita } from '../controllers/berita.controller';

const router = Router();

// GET /api/berita - public
router.get('/', getBeritas);

// GET /api/berita/:idOrSlug - public
router.get('/:idOrSlug', getBeritaByIdOrSlug);

// POST /api/berita - admin only
router.post('/', authMiddleware, upload.single('image'), createBerita);

// PUT /api/berita/:id - admin only
router.put('/:id', authMiddleware, upload.single('image'), updateBerita);

// DELETE /api/berita/:id - admin only
router.delete('/:id', authMiddleware, deleteBerita);

export default router;
