import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LinkedInPost, EngagementMetrics } from '@/types/post';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    averageEngagement: 0
  });
  const [engagementData, setEngagementData] = useState<any>({
    labels: [],
    datasets: []
  });
  const [sentimentData, setSentimentData] = useState<any>({
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
    }]
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        })) as LinkedInPost[];

        // Calculate metrics
        const totalPosts = posts.length;
        const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
        const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
        const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
        const averageEngagement = totalPosts > 0 
          ? (totalLikes + totalComments + totalShares) / totalPosts 
          : 0;

        setMetrics({
          totalPosts,
          totalLikes,
          totalComments,
          totalShares,
          averageEngagement
        });

        // Prepare engagement chart data
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), i);
          return format(date, 'MMM dd');
        }).reverse();

        const engagementByDay = last30Days.map(day => {
          const postsOnDay = posts.filter(post => 
            format(post.createdAt, 'MMM dd') === day
          );
          return {
            likes: postsOnDay.reduce((sum, post) => sum + post.likes, 0),
            comments: postsOnDay.reduce((sum, post) => sum + post.comments, 0),
            shares: postsOnDay.reduce((sum, post) => sum + post.shares, 0)
          };
        });

        setEngagementData({
          labels: last30Days,
          datasets: [
            {
              label: 'Likes',
              data: engagementByDay.map(day => day.likes),
              borderColor: '#3B82F6',
              backgroundColor: '#3B82F680',
              fill: true
            },
            {
              label: 'Comments',
              data: engagementByDay.map(day => day.comments),
              borderColor: '#10B981',
              backgroundColor: '#10B98180',
              fill: true
            },
            {
              label: 'Shares',
              data: engagementByDay.map(day => day.shares),
              borderColor: '#F59E0B',
              backgroundColor: '#F59E0B80',
              fill: true
            }
          ]
        });

        // Calculate sentiment distribution
        const sentimentCounts = posts.reduce(
          (acc, post) => {
            acc[post.sentiment.overall]++;
            return acc;
          },
          { positive: 0, neutral: 0, negative: 0 }
        );

        setSentimentData({
          ...sentimentData,
          datasets: [{
            ...sentimentData.datasets[0],
            data: [
              sentimentCounts.positive,
              sentimentCounts.neutral,
              sentimentCounts.negative
            ]
          }]
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    }

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalPosts}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Likes</h3>
            <p className="text-3xl font-bold text-blue-600">{metrics.totalLikes}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Comments</h3>
            <p className="text-3xl font-bold text-green-600">{metrics.totalComments}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Engagement</h3>
            <p className="text-3xl font-bold text-orange-600">
              {metrics.averageEngagement.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Engagement Over Time</h2>
            <div className="h-80">
              <Line 
                data={engagementData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Sentiment Distribution</h2>
            <div className="h-80">
              <Doughnut 
                data={sentimentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Engagement by Type</h2>
          <div className="h-80">
            <Bar 
              data={{
                labels: ['Likes', 'Comments', 'Shares'],
                datasets: [{
                  label: 'Total Count',
                  data: [metrics.totalLikes, metrics.totalComments, metrics.totalShares],
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}