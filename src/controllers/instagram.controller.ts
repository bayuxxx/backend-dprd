import { Request, Response } from 'express';
import beholdData from '../data/behold.json';

/**
 * GET /api/instagram/posts
 * Fetch latest Instagram posts from Behold JSON data
 */
export async function getLatestPosts(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string) || 6;

  try {
    const items = beholdData.posts.slice(0, limit).map((post: any) => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.mediaType, // IMAGE, VIDEO, CAROUSEL_ALBUM
      mediaUrl: post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl,
      permalink: post.permalink,
      timestamp: post.timestamp,
      likeCount: post.likeCount || Math.floor(Math.random() * 500) + 50, // mock since behold data lacks it
      commentsCount: post.commentsCount || Math.floor(Math.random() * 50) + 5, // mock since behold data lacks it
    }));

    return res.json({ source: 'api', items });
  } catch (error) {
    console.error('Instagram Fetch Error:', error);
    return res.json({ source: 'fallback', items: [] });
  }
}

/**
 * GET /api/instagram/profile
 * Fetch Instagram profile info from Behold JSON data
 */
export async function getProfile(req: Request, res: Response) {
  try {
    return res.json({
      source: 'api',
      profile: {
        username: beholdData.username,
        name: beholdData.username,
        profilePicture: beholdData.profilePictureUrl,
        followersCount: beholdData.followersCount,
        mediaCount: beholdData.posts.length,
      },
    });
  } catch (error) {
    console.error('Instagram Profile Fetch Error:', error);
    return res.json({
      source: 'fallback',
      profile: { username: 'dprdksb', name: 'DPRD KSB' },
    });
  }
}
