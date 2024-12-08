'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LinkedInPost } from '@/types/post';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'posts'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LinkedInPost[];

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [user]);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your LinkedIn Posts</h1>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  {format(post.createdAt, 'PPP')}
                </p>
              </div>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>👍 {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔄 {post.shares}</span>
              </div>
            </div>
            
            <p className="text-gray-900 mb-4">{post.content}</p>
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500">
                Sentiment Analysis:
                <span className={`ml-2 ${
                  post.sentiment.overall === 'positive' ? 'text-green-600' :
                  post.sentiment.overall === 'negative' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {post.sentiment.overall.charAt(0).toUpperCase() + post.sentiment.overall.slice(1)}
                </span>
              </p>
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
  );
}