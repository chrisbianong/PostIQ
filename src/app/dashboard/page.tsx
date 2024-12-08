'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.displayName || 'User'}!
        </h2>
        <p className="text-gray-600">
          Track and analyze your LinkedIn content performance from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Engagement</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sentiment Score</h3>
          <p className="text-3xl font-bold text-purple-600">N/A</p>
        </div>
      </div>
    </div>
  );
}