import { Router } from 'express';
import { getLatestPosts, getProfile } from '../controllers/instagram.controller';

const router = Router();

// GET /api/instagram/posts - Fetch latest Instagram posts
router.get('/posts', getLatestPosts);

// GET /api/instagram/profile - Fetch Instagram profile
router.get('/profile', getProfile);

export default router;
