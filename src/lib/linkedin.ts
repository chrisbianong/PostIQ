import { LinkedInClient } from 'linkedin-api-client';

const linkedinClient = new LinkedInClient({
  clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/linkedin`
});

export interface LinkedInPost {
  id: string;
  content: string;
  published: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  };
}

export async function fetchLinkedInPosts(accessToken: string): Promise<LinkedInPost[]> {
  try {
    const response = await linkedinClient.getPosts(accessToken);
    return response.map(post => ({
      id: post.id,
      content: post.content,
      published: post.published,
      stats: {
        likes: post.numLikes,
        comments: post.numComments,
        shares: post.numShares,
        impressions: post.totalImpressions
      }
    }));
  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error);
    throw error;
  }
}

export async function fetchLinkedInAnalytics(accessToken: string, postIds: string[]) {
  try {
    const analytics = await linkedinClient.getPostAnalytics(accessToken, postIds);
    return analytics;
  } catch (error) {
    console.error('Error fetching LinkedIn analytics:', error);
    throw error;
  }
}