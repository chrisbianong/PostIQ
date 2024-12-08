import { NextApiRequest, NextApiResponse } from 'next';
import { linkedinClient } from '@/lib/linkedin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const tokenResponse = await linkedinClient.getAccessToken(code);
    
    // Store the access token securely (e.g., in your database)
    // Associate it with the user's account

    res.redirect('/dashboard?linkedin=connected');
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect('/dashboard?error=linkedin_connection_failed');
  }
}