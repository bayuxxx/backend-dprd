import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import { getPimpinanList, getPimpinanById, createPimpinan, updatePimpinan, deletePimpinan } from '../controllers/pimpinan.controller';

const router = Router();

// GET /api/pimpinan - public
router.get('/', getPimpinanList);

// GET /api/pimpinan/:id - public
router.get('/:id', getPimpinanById);

// POST /api/pimpinan - admin only
router.post('/', authMiddleware, upload.single('image'), createPimpinan);

// PUT /api/pimpinan/:id - admin only
router.put('/:id', authMiddleware, upload.single('image'), updatePimpinan);

// DELETE /api/pimpinan/:id - admin only
router.delete('/:id', authMiddleware, deletePimpinan);

export default router;
