'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CasinoShell } from '@/components/CasinoShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const err = await register(email, password, username);
    setLoading(false);
    if (err) setError(err);
    else router.push('/');
  };

  return (
    <CasinoShell>
      <div className="page-container lr-auth-page">
        <form className="lr-auth-card" onSubmit={handleSubmit}>
          <h1>Join the Club</h1>
          <p className="lr-auth-sub">Create your Lucky Rat Casino account</p>
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required error={error} />
          <Button type="submit" disabled={loading} className="lr-auth-submit">
            {loading ? 'Creating…' : 'Register'}
          </Button>
          <p className="lr-auth-footer">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </CasinoShell>
  );
}
