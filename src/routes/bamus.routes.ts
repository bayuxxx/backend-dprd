import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getBamusInfo,
  getAllBamusInfo,
  createBamusInfo,
  updateBamusInfo,
  deleteBamusInfo,
  getAnggotaBamus,
  createAnggotaBamus,
  updateAnggotaBamus,
  deleteAnggotaBamus,
} from '../controllers/bamus.controller';

const router = Router();

// ── BamusInfo ──
// GET /api/bamus/info - public (active only)
router.get('/info', getBamusInfo);
// GET /api/bamus/info/all - admin (all)
router.get('/info/all', authMiddleware, getAllBamusInfo);
// POST /api/bamus/info - admin
router.post('/info', authMiddleware, createBamusInfo);
// PUT /api/bamus/info/:id - admin
router.put('/info/:id', authMiddleware, updateBamusInfo);
// DELETE /api/bamus/info/:id - admin
router.delete('/info/:id', authMiddleware, deleteBamusInfo);

// ── AnggotaBamus ──
// GET /api/bamus/anggota - public
router.get('/anggota', getAnggotaBamus);
// POST /api/bamus/anggota - admin
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaBamus);
// PUT /api/bamus/anggota/:id - admin
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaBamus);
// DELETE /api/bamus/anggota/:id - admin
router.delete('/anggota/:id', authMiddleware, deleteAnggotaBamus);

export default router;
