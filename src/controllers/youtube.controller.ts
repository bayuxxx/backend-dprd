import { Request, Response } from 'express';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCxxxxxxxxxxxxxxxxxxxxxxx';

/**
 * GET /api/youtube/videos
 * Fetch latest videos from DPRD Sumbawa Barat YouTube channel
 */
export async function getLatestVideos(req: Request, res: Response) {
  const maxResults = parseInt(req.query.maxResults as string) || 6;

  if (!YOUTUBE_API_KEY) {
    // Return fallback data when no API key is configured
    return res.json({
      source: 'fallback',
      items: getFallbackVideos(),
    });
  }

  try {
    // First, get the uploads playlist ID from the channel
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
    const channelRes = await fetch(channelUrl);
    const channelData: any = await channelRes.json();

    if (!channelData.items || channelData.items.length === 0) {
      return res.json({ source: 'fallback', items: getFallbackVideos() });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch latest videos from the uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
    const playlistRes = await fetch(playlistUrl);
    const playlistData: any = await playlistRes.json();

    if (!playlistData.items) {
      return res.json({ source: 'fallback', items: getFallbackVideos() });
    }

    // Get video IDs for statistics
    const videoIds = playlistData.items.map(
      (item: any) => item.snippet.resourceId.videoId
    ).join(',');

    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const statsRes = await fetch(statsUrl);
    const statsData: any = await statsRes.json();

    const statsMap: Record<string, any> = {};
    if (statsData.items) {
      statsData.items.forEach((item: any) => {
        statsMap[item.id] = item.statistics;
      });
    }

    const items = playlistData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const stats = statsMap[videoId] || {};
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.maxres?.url
          || item.snippet.thumbnails?.high?.url
          || item.snippet.thumbnails?.medium?.url
          || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        viewCount: stats.viewCount || '0',
        likeCount: stats.likeCount || '0',
      };
    });

    return res.json({ source: 'api', items });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return res.json({ source: 'fallback', items: getFallbackVideos() });
  }
}

/**
 * GET /api/youtube/search
 * Search videos on the channel
 */
export async function searchVideos(req: Request, res: Response) {
  const query = req.query.q as string || '';
  const maxResults = parseInt(req.query.maxResults as string) || 6;

  if (!YOUTUBE_API_KEY) {
    return res.json({ source: 'fallback', items: getFallbackVideos() });
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&q=${encodeURIComponent(query)}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData: any = await searchRes.json();

    if (!searchData.items) {
      return res.json({ source: 'fallback', items: getFallbackVideos() });
    }

    const items = searchData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url
        || `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
    }));

    return res.json({ source: 'api', items });
  } catch (error) {
    console.error('YouTube Search Error:', error);
    return res.json({ source: 'fallback', items: getFallbackVideos() });
  }
}

function getFallbackVideos() {
  return [
    {
      id: 'z38p3gX7XFw',
      title: 'Live: Rapat Paripurna DPRD Kab. Sumbawa Barat - Penetapan APBD 2026',
      channelTitle: 'DPRD Sumbawa Barat',
      thumbnail: 'https://img.youtube.com/vi/z38p3gX7XFw/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      viewCount: '1200',
    },
    {
      id: 'eC7i6222b40',
      title: 'Paripurna Masa Sidang II 2026 - Jawaban Bupati Atas Pandangan Fraksi',
      channelTitle: 'DPRD Sumbawa Barat',
      thumbnail: 'https://img.youtube.com/vi/eC7i6222b40/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      viewCount: '800',
    },
    {
      id: 'BHACKCNDMW8',
      title: 'Sosialisasi Perda tentang Pengelolaan Sampah Terpadu',
      channelTitle: 'DPRD Sumbawa Barat',
      thumbnail: 'https://img.youtube.com/vi/BHACKCNDMW8/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      viewCount: '540',
    },
  ];
}
