import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../lib/multer';
import {
  getBapemperdaInfo,
  getAllBapemperdaInfo,
  createBapemperdaInfo,
  updateBapemperdaInfo,
  deleteBapemperdaInfo,
  getAnggotaBapemperda,
  createAnggotaBapemperda,
  updateAnggotaBapemperda,
  deleteAnggotaBapemperda,
} from '../controllers/bapemperda.controller';

const router = Router();

// ── BapemperdaInfo ──
router.get('/info', getBapemperdaInfo);
router.get('/info/all', getAllBapemperdaInfo);
router.post('/info', authMiddleware, createBapemperdaInfo);
router.put('/info/:id', authMiddleware, updateBapemperdaInfo);
router.delete('/info/:id', authMiddleware, deleteBapemperdaInfo);

// ── AnggotaBapemperda ──
router.get('/anggota', getAnggotaBapemperda);
router.post('/anggota', authMiddleware, upload.single('image'), createAnggotaBapemperda);
router.put('/anggota/:id', authMiddleware, upload.single('image'), updateAnggotaBapemperda);
router.delete('/anggota/:id', authMiddleware, deleteAnggotaBapemperda);

export default router;
