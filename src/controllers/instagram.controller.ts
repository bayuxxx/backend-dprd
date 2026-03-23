import { Request, Response } from 'express';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

/**
 * GET /api/instagram/posts
 * Fetch latest Instagram posts using the Instagram Graph API (Basic Display API)
 */
export async function getLatestPosts(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string) || 6;

  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    return res.json({
      source: 'fallback',
      items: getFallbackPosts(),
    });
  }

  try {
    // Fetch media from Instagram Graph API
    const mediaUrl = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const mediaRes = await fetch(mediaUrl);
    const mediaData: any = await mediaRes.json();

    if (mediaData.error || !mediaData.data) {
      console.error('Instagram API Error:', mediaData.error);
      return res.json({ source: 'fallback', items: getFallbackPosts() });
    }

    const items = mediaData.data.map((post: any) => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type, // IMAGE, VIDEO, CAROUSEL_ALBUM
      mediaUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
      likeCount: post.like_count || 0,
      commentsCount: post.comments_count || 0,
    }));

    return res.json({ source: 'api', items });
  } catch (error) {
    console.error('Instagram Fetch Error:', error);
    return res.json({ source: 'fallback', items: getFallbackPosts() });
  }
}

/**
 * GET /api/instagram/profile
 * Fetch Instagram profile info
 */
export async function getProfile(req: Request, res: Response) {
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    return res.json({
      source: 'fallback',
      profile: {
        username: 'humas.dprdksb',
        name: 'Humas DPRD KSB',
        profilePicture: null,
        followersCount: 0,
        mediaCount: 0,
      },
    });
  }

  try {
    const profileUrl = `https://graph.instagram.com/${INSTAGRAM_USER_ID}?fields=id,username,name,profile_picture_url,followers_count,media_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    const profileRes = await fetch(profileUrl);
    const profileData: any = await profileRes.json();

    if (profileData.error) {
      console.error('Instagram Profile Error:', profileData.error);
      return res.json({
        source: 'fallback',
        profile: {
          username: 'humas.dprdksb',
          name: 'Humas DPRD KSB',
        },
      });
    }

    return res.json({
      source: 'api',
      profile: {
        username: profileData.username,
        name: profileData.name,
        profilePicture: profileData.profile_picture_url,
        followersCount: profileData.followers_count,
        mediaCount: profileData.media_count,
      },
    });
  } catch (error) {
    console.error('Instagram Profile Fetch Error:', error);
    return res.json({
      source: 'fallback',
      profile: { username: 'humas.dprdksb', name: 'Humas DPRD KSB' },
    });
  }
}

function getFallbackPosts() {
  return [
    {
      id: '1',
      caption: 'Rapat Paripurna DPRD Sumbawa Barat Maret 2026 📋 #DPRDSumbawaBarat #Legislasi',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80',
      permalink: 'https://www.instagram.com/humas.dprdksb/',
      timestamp: new Date().toISOString(),
      likeCount: 234,
      commentsCount: 18,
    },
    {
      id: '2',
      caption: 'Kunjungan Kerja Komisi II ke Kecamatan Maluk bersama warga setempat 🤝 #WakilKita',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1591522810850-58128c5fb3db?w=400&q=80',
      permalink: 'https://www.instagram.com/humas.dprdksb/',
      timestamp: new Date().toISOString(),
      likeCount: 189,
      commentsCount: 12,
    },
    {
      id: '3',
      caption: 'Pengesahan Perda RTRW 2026–2046 oleh DPRD Sumbawa Barat 🏛️ #Perda #RTRW',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=80',
      permalink: 'https://www.instagram.com/humas.dprdksb/',
      timestamp: new Date().toISOString(),
      likeCount: 312,
      commentsCount: 27,
    },
    {
      id: '4',
      caption: 'Sidak infrastruktur jalan oleh Komisi III – aspirasi warga jadi prioritas! 🚧',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
      permalink: 'https://www.instagram.com/humas.dprdksb/',
      timestamp: new Date().toISOString(),
      likeCount: 156,
      commentsCount: 9,
    },
    {
      id: '5',
      caption: 'Forum Dialog Publik bersama masyarakat tentang APBD 2026 💬 #Aspirasi',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
      permalink: 'https://www.instagram.com/humas.dprdksb/',
      timestamp: new Date().toISOString(),
      likeCount: 278,
      commentsCount: 21,
    },
    {
      id: '6',
      caption: 'Rapat Badan Anggaran – transparansi keuangan daerah Sumbawa Barat 📊 #APBD',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
      permalink: 'https://www.instagram.com/humas.dprdksb/',
      timestamp: new Date().toISOString(),
      likeCount: 198,
      commentsCount: 14,
    },
  ];
}
