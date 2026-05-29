'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CasinoShell } from '@/components/CasinoShell';
import { useAuthStore } from '@/store/authStore';
import { DataTable } from '@/components/ui/DataTable';
import { LoyaltyProgressCheese } from '@/components/LoyaltyProgressCheese';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [bets, setBets] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    void fetch('/api/bets/history')
      .then((r) => r.json())
      .then((d) => setBets(d.bets ?? []));
  }, [user]);

  if (loading || !user) return null;

  return (
    <CasinoShell>
      <div className="page-container lr-profile">
        <h1>Profile — {user.username}</h1>
        <div className="lr-profile-grid">
          <div className="lr-card">
            <h3>Account</h3>
            <p>Email: {user.email}</p>
            <p>Balance: ${user.balance.toFixed(2)}</p>
            <p>Loyalty Level: {user.loyaltyLevel}</p>
            <LoyaltyProgressCheese filledCount={user.loyaltyLevel} />
            <p>XP: {user.xp.toLocaleString()}</p>
          </div>
          <div className="lr-card">
            <h3>Stats</h3>
            <p>Total Wagered: ${user.totalWagered.toFixed(2)}</p>
            <p>Total Won: ${user.totalWon.toFixed(2)}</p>
            <p>Favorite: Lucky Rat Slot, Cheese Heist</p>
          </div>
        </div>
        <div className="lr-card lr-card--wide">
          <h3>Recent Bets</h3>
          <DataTable
            rows={bets}
            emptyText="No bets yet"
            columns={[
              { key: 'type', label: 'Type' },
              { key: 'amount', label: 'Amount', render: (r) => `$${Number(r.amount).toFixed(2)}` },
              { key: 'result', label: 'Result' },
              { key: 'payout', label: 'Payout', render: (r) => `$${Number(r.payout).toFixed(2)}` },
              { key: 'createdAt', label: 'Date', render: (r) => new Date(String(r.createdAt)).toLocaleString() },
            ]}
          />
        </div>
      </div>
    </CasinoShell>
  );
}
