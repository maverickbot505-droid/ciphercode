import { NextApiRequest, NextApiResponse } from 'next';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export type Options = NextAuthOptions;

type ProviderType = "credentials";
type AccountType = {
  id?: string | number;
};

interface SessionPayload {
  user: {
    id: string | number;
    email: string;
    role: string;
  };
  expires: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, totpCode } = req.body;

    // Validate input
    if (!email || !password || !totpCode) {
      return res.status(400).json({ 
        success: false,
        error: 'Email, password, and TOTP code are required'
      });
    }

    // For demo purposes - hardcode test credentials
    // In production, these would come from the database
    if (email === 'admin@ciphercode.app' && 
        password === 'admin123' && 
        totpCode === '123456') {
      
      return res.json({
        success: true,
        user: {
          id: 1,
          email: email,
          role: 'Owner',
        },
        message: 'Login successful'
      });
    }

    // For demo purposes - accept any valid format for testing
    if (email.includes('@') && password.length >= 8 && totpCode.length === 6) {
      return res.json({
        success: true,
        user: {
          id: 1,
          email: email,
          role: 'Editor',
        },
        message: 'Login successful (demo mode)'
      });
    }

    // Invalid credentials
    return res.status(401).json({ 
      success: false,
      error: 'Invalid email or password'
    });

  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Authentication failed'
    });
  }
}
