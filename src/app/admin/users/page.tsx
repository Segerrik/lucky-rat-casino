'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') router.push('/login');
    else void fetch('/api/admin/users').then((r) => r.json()).then((d) => setUsers(d.users ?? []));
  }, [user, router]);

  const updateUser = async (userId: string, patch: { balance?: number; isBlocked?: boolean }) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...patch }),
    });
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users ?? []);
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
        <h1>Users</h1>
        <DataTable
          rows={users}
          columns={[
            { key: 'username', label: 'Username' },
            { key: 'email', label: 'Email' },
            { key: 'balance', label: 'Balance', render: (r) => `$${Number(r.balance).toFixed(2)}` },
            { key: 'loyaltyLevel', label: 'Level' },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => (
                <div className="lr-admin-actions">
                  <Button size="sm" onClick={() => void updateUser(String(r.id), { balance: Number(r.balance) + 100 })}>+100</Button>
                  <Button size="sm" variant="danger" onClick={() => void updateUser(String(r.id), { isBlocked: !r.isBlocked })}>
                    {r.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </main>
    </div>
  );
}
