import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getAllFraksiInfo,
  getFraksiInfoBySlug,
  createFraksiInfo,
  updateFraksiInfo,
  deleteFraksiInfo,
  createAnggotaFraksi,
  updateAnggotaFraksi,
  deleteAnggotaFraksi,
} from '../controllers/fraksi.controller';

const router = Router();

// ── FraksiInfo ──
router.get('/', getAllFraksiInfo);
router.get('/slug/:slug', getFraksiInfoBySlug);

router.post('/', authMiddleware, upload.single('logo'), createFraksiInfo);
router.put('/:id', authMiddleware, upload.single('logo'), updateFraksiInfo);
router.delete('/:id', authMiddleware, deleteFraksiInfo);

// ── AnggotaFraksi ──
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaFraksi);
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaFraksi);
router.delete('/anggota/:id', authMiddleware, deleteAnggotaFraksi);

export default router;
