import { Router } from 'express';
import { getLatestVideos, searchVideos } from '../controllers/youtube.controller';

const router = Router();

// GET /api/youtube/videos - Fetch latest channel videos
router.get('/videos', getLatestVideos);

// GET /api/youtube/search - Search videos on channel
router.get('/search', searchVideos);

export default router;
