import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChartBarIcon, DocumentTextIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.displayName || user?.email || 'User'}!
          </h2>
          <p className="text-gray-600">
            Track and analyze your LinkedIn content performance from this dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">0</p>
            <p className="text-sm text-gray-500">Posts this month</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Engagement Rate</h3>
              <ChatBubbleLeftIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">0%</p>
            <p className="text-sm text-gray-500">Average engagement</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Content Score</h3>
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">N/A</p>
            <p className="text-sm text-gray-500">Overall performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => router.push('/dashboard/posts')}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DocumentTextIcon className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium">Add New Post</p>
              </button>
              <button 
                onClick={() => router.push('/dashboard/analytics')}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChartBarIcon className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm font-medium">View Analytics</p>
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Posts</h3>
            <div className="space-y-4">
              <p className="text-gray-500 text-center py-4">No recent posts found</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}