'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';

export default function AdminGamesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [games, setGames] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') router.push('/login');
    else void fetch('/api/admin/games').then((r) => r.json()).then((d) => setGames(d.games ?? []));
  }, [user, router]);

  const toggleGame = async (gameId: string, isActive: boolean) => {
    await fetch('/api/admin/games', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, isActive: !isActive }),
    });
    const res = await fetch('/api/admin/games');
    setGames((await res.json()).games ?? []);
  };

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="lr-admin">
      <aside className="lr-admin-sidebar">
        <h2>🐀 Admin</h2>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/games">Games</Link>
          <Link href="/admin/bets">Bets</Link>
          <Link href="/admin/transactions">Transactions</Link>
          <Link href="/admin/loyalty">Loyalty</Link>
        </nav>
      </aside>
      <main className="lr-admin-main">
        <h1>Games</h1>
        <DataTable
          rows={games}
          columns={[
            { key: 'name', label: 'Game' },
            { key: 'category', label: 'Category' },
            { key: 'rtp', label: 'RTP', render: (r) => `${r.rtp}%` },
            { key: 'isActive', label: 'Status', render: (r) => (r.isActive ? 'Live' : 'Disabled') },
            {
              key: 'actions',
              label: 'Toggle',
              render: (r) => (
                <Button size="sm" onClick={() => void toggleGame(String(r.id), Boolean(r.isActive))}>
                  {r.isActive ? 'Disable' : 'Enable'}
                </Button>
              ),
            },
          ]}
        />
      </main>
    </div>
  );
}
