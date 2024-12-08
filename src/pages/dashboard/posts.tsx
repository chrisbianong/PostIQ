import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LinkedInPost } from '@/types/post';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { ChartBarIcon, ChatBubbleLeftIcon, HandThumbUpIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Posts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchPosts() {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        })) as LinkedInPost[];

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [user]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your LinkedIn Posts</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add New Post
          </button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {format(post.createdAt, 'PPP')}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.sentiment.overall === 'positive' ? 'bg-green-100 text-green-800' :
                    post.sentiment.overall === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.sentiment.overall.charAt(0).toUpperCase() + post.sentiment.overall.slice(1)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <HandThumbUpIcon className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>{post.shares}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-900 mb-4">{post.content}</p>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                    <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
                  </div>
                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <p className="text-gray-500">No posts found. Start by adding your LinkedIn posts.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}