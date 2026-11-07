'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo purposes, use the API route
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, totpCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login failed');
        return;
      }

      // Auto-redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cipher-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-cipher-text-muted hover:text-white mb-6"
        >
          ← Back
        </button>

        <div className="card bg-gradient-to-br from-cipher-card to-cipher-bg/50 border border-gray-700">
          <h1 className="text-3xl font-bold text-center mb-2">Admin Portal</h1>
          <p className="text-center text-cipher-text-muted mb-8">Sign in to CipherCode Admin</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ciphercode.app"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="totpCode" className="block text-sm font-medium mb-2">
                TOTP Code (6 digits)
              </label>
              <input
                id="totpCode"
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456"
                className="input text-center tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-cipher-text-muted">
              For demo purposes, use the test admin account
            </p>
            <p className="text-xs text-cipher-text-muted mt-1 font-mono">
              Email: admin@ciphercode.app<br/>
              Password: admin123<br/>
              TOTP: 123456 (demo)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
