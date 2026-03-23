import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me - verify token
router.get('/me', getMe);

export default router;
