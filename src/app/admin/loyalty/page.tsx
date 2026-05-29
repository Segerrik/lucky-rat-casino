'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { DataTable } from '@/components/ui/DataTable';

export default function AdminLoyaltyPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [levels, setLevels] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') router.push('/login');
    else void fetch('/api/admin/loyalty').then((r) => r.json()).then((d) => setLevels(d.levels ?? []));
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
        <h1>Loyalty Settings</h1>
        <DataTable
          rows={levels}
          columns={[
            { key: 'level', label: 'Level' },
            { key: 'name', label: 'Name' },
            { key: 'minXp', label: 'Min XP' },
            { key: 'cashbackPercent', label: 'Cashback %' },
            { key: 'weeklyBonusPercent', label: 'Weekly %' },
            { key: 'monthlyBonusPercent', label: 'Monthly %' },
          ]}
        />
      </main>
    </div>
  );
}
