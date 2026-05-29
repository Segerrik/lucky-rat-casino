'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { DataTable } from '@/components/ui/DataTable';

export default function AdminBetsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [bets, setBets] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') router.push('/login');
    else void fetch('/api/admin/stats').then((r) => r.json()).then((d) => setBets(d.recentBets ?? []));
  }, [user, router]);

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
        <h1>Recent Bets</h1>
        <DataTable
          rows={bets}
          columns={[
            { key: 'user', label: 'User', render: (r) => String((r.user as { username?: string })?.username ?? '—') },
            { key: 'game', label: 'Game', render: (r) => String((r.game as { name?: string })?.name ?? r.type ?? 'Crypto') },
            { key: 'amount', label: 'Amount', render: (r) => `$${Number(r.amount).toFixed(2)}` },
            { key: 'result', label: 'Result' },
            { key: 'payout', label: 'Payout', render: (r) => `$${Number(r.payout).toFixed(2)}` },
          ]}
        />
      </main>
    </div>
  );
}
