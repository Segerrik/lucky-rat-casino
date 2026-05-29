'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CasinoShell } from '@/components/CasinoShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err);
    else router.push('/');
  };

  return (
    <CasinoShell>
      <div className="page-container lr-auth-page">
        <form className="lr-auth-card" onSubmit={handleSubmit}>
          <h1>Welcome back, Rat</h1>
          <p className="lr-auth-sub">Sign in to your Lucky Rat Casino account</p>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required error={error} />
          <Button type="submit" disabled={loading} className="lr-auth-submit">
            {loading ? 'Signing in…' : 'Login'}
          </Button>
          <p className="lr-auth-footer">
            No account? <Link href="/register">Register</Link>
          </p>
          <p className="lr-demo-note">Demo: user@luckyrat.casino / User123!</p>
        </form>
      </div>
    </CasinoShell>
  );
}
