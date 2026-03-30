import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getMasaJabatanList,
  getMasaJabatanById,
  createMasaJabatan,
  updateMasaJabatan,
  deleteMasaJabatan,
} from '../controllers/masaJabatan.controller';

const router = Router();

// GET /api/masa-jabatan - public
router.get('/', getMasaJabatanList);

// GET /api/masa-jabatan/:id - public
router.get('/:id', getMasaJabatanById);

// POST /api/masa-jabatan - admin only
router.post('/', authMiddleware, createMasaJabatan);

// PUT /api/masa-jabatan/:id - admin only
router.put('/:id', authMiddleware, updateMasaJabatan);

// DELETE /api/masa-jabatan/:id - admin only
router.delete('/:id', authMiddleware, deleteMasaJabatan);

export default router;
