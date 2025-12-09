
export enum SentimentType {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral',
}

export interface Tweet {
  id: string;
  authorName: string;
  authorHandle: string;
  followerCount: number; // Added for Influencer filter
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  sentiment: SentimentType;
  sentimentScore: number; // 0 to 100 confidence
}

export interface TopicAnalysis {
  topic: string;
  tweets: Tweet[];
  summary: {
    totalTweets: number;
    dominantSentiment: SentimentType;
    confidenceScore: number; // Added global confidence
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    averageEngagement: number;
    keyThemes: string[];
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}
