import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import bannerRoutes from './routes/banner.routes';
import beritaRoutes from './routes/berita.routes';
import pimpinanRoutes from './routes/pimpinan.routes';
import youtubeRoutes from './routes/youtube.routes';
import instagramRoutes from './routes/instagram.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://dprd-sumbawa.vercel.app']
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import adminRoutes from './routes/admin.routes';

app.use('/api/auth', authRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/pimpinan', pimpinanRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/instagram', instagramRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

export default app;
