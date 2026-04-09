import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getBKInfo,
  getAllBKInfo,
  createBKInfo,
  updateBKInfo,
  deleteBKInfo,
  getAnggotaBK,
  createAnggotaBK,
  updateAnggotaBK,
  deleteAnggotaBK,
} from '../controllers/bk.controller';

const router = Router();

// ── BKInfo ──
router.get('/info', getBKInfo);
router.get('/info/all', getAllBKInfo);
router.post('/info', authMiddleware, createBKInfo);
router.put('/info/:id', authMiddleware, updateBKInfo);
router.delete('/info/:id', authMiddleware, deleteBKInfo);

// ── AnggotaBK ──
router.get('/anggota', getAnggotaBK);
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaBK);
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaBK);
router.delete('/anggota/:id', authMiddleware, deleteAnggotaBK);

export default router;
