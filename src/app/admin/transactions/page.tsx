'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { DataTable } from '@/components/ui/DataTable';

export default function AdminTransactionsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [transactions, setTransactions] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') router.push('/login');
    else void fetch('/api/admin/transactions').then((r) => r.json()).then((d) => setTransactions(d.transactions ?? []));
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
        <h1>Transactions</h1>
        <DataTable
          rows={transactions}
          columns={[
            { key: 'user', label: 'User', render: (r) => String((r.user as { username?: string })?.username ?? '—') },
            { key: 'type', label: 'Type' },
            { key: 'currency', label: 'Currency' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Date', render: (r) => new Date(String(r.createdAt)).toLocaleString() },
          ]}
        />
      </main>
    </div>
  );
}
