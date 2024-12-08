import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DashboardHeader() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard">
              <a className="text-xl font-bold text-gray-900">
                LinkedIn Analyzer
              </a>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}