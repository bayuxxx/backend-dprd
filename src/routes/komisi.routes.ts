import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getKomisiInfo,
  getAllKomisiInfo,
  createKomisiInfo,
  updateKomisiInfo,
  deleteKomisiInfo,
  getAnggotaKomisi,
  createAnggotaKomisi,
  updateAnggotaKomisi,
  deleteAnggotaKomisi,
} from '../controllers/komisi.controller';

const router = Router();

// ── KomisiInfo ──
router.get('/info', getKomisiInfo);
router.get('/info/all', getAllKomisiInfo);
router.post('/info', authMiddleware, createKomisiInfo);
router.put('/info/:id', authMiddleware, updateKomisiInfo);
router.delete('/info/:id', authMiddleware, deleteKomisiInfo);

// ── AnggotaKomisi ──
router.get('/anggota', getAnggotaKomisi);
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaKomisi);
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaKomisi);
router.delete('/anggota/:id', authMiddleware, deleteAnggotaKomisi);

export default router;
