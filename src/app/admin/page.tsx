'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { AdminMetricCard } from '@/components/ui/AdminMetricCard';
import { DataTable } from '@/components/ui/DataTable';

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      void fetch('/api/admin/stats').then((r) => r.json()).then(setStats);
    }
  }, [user]);

  if (loading || !user || user.role !== 'ADMIN') return null;

  const s = stats?.stats as Record<string, number> | undefined;

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
          <Link href="/">← Back to Casino</Link>
        </nav>
      </aside>
      <main className="lr-admin-main">
        <h1>Dashboard</h1>
        {s && (
          <div className="lr-admin-metrics">
            <AdminMetricCard label="Total Users" value={s.totalUsers} />
            <AdminMetricCard label="Deposits" value={`$${s.totalDeposits.toFixed(0)}`} />
            <AdminMetricCard label="Withdrawals" value={`$${s.totalWithdrawals.toFixed(0)}`} />
            <AdminMetricCard label="Total Bets" value={s.totalBets} />
            <AdminMetricCard label="GGR" value={`$${s.ggr.toFixed(0)}`} accent="#f4c542" />
            <AdminMetricCard label="Retention" value={`${s.retention}%`} />
          </div>
        )}
        <div className="lr-admin-charts lr-card">
          <h3>Wagers & GGR (mock)</h3>
          <div className="lr-bar-chart">
            {(stats?.chartData as { day: string; wagers: number; ggr: number }[] | undefined)?.map((d) => (
              <div key={d.day} className="lr-bar-group">
                <div className="lr-bar lr-bar--wager" style={{ height: `${d.wagers / 40}px` }} title={`$${d.wagers}`} />
                <div className="lr-bar lr-bar--ggr" style={{ height: `${d.ggr * 2}px` }} title={`$${d.ggr}`} />
                <span>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lr-card">
          <h3>Recent Users</h3>
          <DataTable
            rows={(stats?.recentUsers as Record<string, unknown>[]) ?? []}
            columns={[
              { key: 'username', label: 'User' },
              { key: 'email', label: 'Email' },
              { key: 'balance', label: 'Balance', render: (r) => `$${Number(r.balance).toFixed(2)}` },
              { key: 'isBlocked', label: 'Blocked', render: (r) => (r.isBlocked ? 'Yes' : 'No') },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
