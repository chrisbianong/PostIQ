import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LinkedInConnect() {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLinkedInConnect = async () => {
    setIsConnecting(true);
    try {
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
        process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/linkedin`
      )}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;

      window.location.href = authUrl;
    } catch (error) {
      console.error('LinkedIn connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Connect LinkedIn Account</h2>
      <p className="text-gray-600 mb-4">
        Connect your LinkedIn account to analyze your content performance.
      </p>
      <button
        onClick={handleLinkedInConnect}
        disabled={isConnecting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isConnecting ? 'Connecting...' : 'Connect LinkedIn'}
      </button>
    </div>
  );
}