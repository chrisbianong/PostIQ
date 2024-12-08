export interface LinkedInPost {
  id: string;
  content: string;
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    overall: 'positive' | 'negative' | 'neutral';
  };
  userId: string;
}

export interface EngagementMetrics {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagement: number;
}