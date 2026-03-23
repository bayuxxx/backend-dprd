import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import { getBanners, getBannerById, createBanner, updateBanner, deleteBanner } from '../controllers/banner.controller';

const router = Router();

// GET /api/banners - public
router.get('/', getBanners);

// GET /api/banners/:id - public
router.get('/:id', getBannerById);

// POST /api/banners - admin only
router.post('/', authMiddleware, upload.single('image'), createBanner);

// PUT /api/banners/:id - admin only
router.put('/:id', authMiddleware, upload.single('image'), updateBanner);

// DELETE /api/banners/:id - admin only
router.delete('/:id', authMiddleware, deleteBanner);

export default router;
