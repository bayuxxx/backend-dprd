import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getBanggarInfo,
  getAllBanggarInfo,
  createBanggarInfo,
  updateBanggarInfo,
  deleteBanggarInfo,
  getAnggotaBanggar,
  createAnggotaBanggar,
  updateAnggotaBanggar,
  deleteAnggotaBanggar,
} from '../controllers/banggar.controller';

const router = Router();

// ── BanggarInfo ──
router.get('/info', getBanggarInfo);
router.get('/info/all', authMiddleware, getAllBanggarInfo);
router.post('/info', authMiddleware, createBanggarInfo);
router.put('/info/:id', authMiddleware, updateBanggarInfo);
router.delete('/info/:id', authMiddleware, deleteBanggarInfo);

// ── AnggotaBanggar ──
router.get('/anggota', getAnggotaBanggar);
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaBanggar);
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaBanggar);
router.delete('/anggota/:id', authMiddleware, deleteAnggotaBanggar);

export default router;
