'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { LinkedInPost, EngagementMetrics } from '@/types/post';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { user } = useAuth();
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
          ...doc.data()
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

        // Prepare chart data
        const sortedPosts = [...posts].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setEngagementData({
          labels: sortedPosts.map(post => new Date(post.createdAt).toLocaleDateString()),
          datasets: [
            {
              label: 'Likes',
              data: sortedPosts.map(post => post.likes),
              borderColor: 'rgb(59, 130, 246)',
              tension: 0.1
            },
            {
              label: 'Comments',
              data: sortedPosts.map(post => post.comments),
              borderColor: 'rgb(16, 185, 129)',
              tension: 0.1
            },
            {
              label: 'Shares',
              data: sortedPosts.map(post => post.shares),
              borderColor: 'rgb(249, 115, 22)',
              tension: 0.1
            }
          ]
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    }

    fetchAnalytics();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Engagement Over Time</h2>
        <div className="h-96">
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
    </div>
  );
}