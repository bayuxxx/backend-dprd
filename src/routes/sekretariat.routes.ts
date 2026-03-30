import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getSekretariatInfo,
  upsertSekretariatInfo,
  getAnggotaSekretariatList,
  getAnggotaSekretariatById,
  createAnggotaSekretariat,
  updateAnggotaSekretariat,
  deleteAnggotaSekretariat,
} from '../controllers/sekretariat.controller';

const router = Router();

// ─── Sekretariat Info (visi, misi, tugas, fungsi) ───
// GET /api/sekretariat/info - public
router.get('/info', getSekretariatInfo);

// PUT /api/sekretariat/info - admin only
router.put('/info', authMiddleware, upsertSekretariatInfo);

// ─── Anggota Sekretariat ───
// GET /api/sekretariat/anggota - public
router.get('/anggota', getAnggotaSekretariatList);

// GET /api/sekretariat/anggota/:id - public
router.get('/anggota/:id', getAnggotaSekretariatById);

// POST /api/sekretariat/anggota - admin only
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaSekretariat);

// PUT /api/sekretariat/anggota/:id - admin only
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaSekretariat);

// DELETE /api/sekretariat/anggota/:id - admin only
router.delete('/anggota/:id', authMiddleware, deleteAnggotaSekretariat);

export default router;
