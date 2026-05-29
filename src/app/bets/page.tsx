'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CasinoShell } from '@/components/CasinoShell';
import { useAuthStore, useToastStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { BetSlipItem } from '@/types';

const MARKETS = [
  { id: 'btc-70k', title: 'BTC will close above $70,000', odds: 2.1 },
  { id: 'eth-pos', title: 'ETH 24h change positive', odds: 1.85 },
  { id: 'sol-eth', title: 'SOL outperforms ETH today', odds: 2.4 },
  { id: 'btc-vol', title: 'BTC volatility under 3%', odds: 1.65 },
];

export default function CryptoBetsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToastStore((s) => s.show);
  const [slip, setSlip] = useState<BetSlipItem | null>(null);
  const [stake, setStake] = useState(25);
  const [placing, setPlacing] = useState(false);

  const addToSlip = (market: (typeof MARKETS)[0]) => {
    setSlip({ marketId: market.id, title: market.title, odds: market.odds });
  };

  const placeBet = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!slip) return;
    setPlacing(true);
    const res = await fetch('/api/bets/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...slip, amount: stake }),
    });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) return toast(data.error ?? 'Bet failed', 'error');
    setUser(data.user);
    toast(data.won ? `Won $${data.payout.toFixed(2)}!` : 'Bet lost (demo)', data.won ? 'success' : 'info');
    setSlip(null);
  };

  const potential = slip ? stake * slip.odds : 0;

  return (
    <CasinoShell>
      <div className="page-container lr-bets-page">
        <h1>Crypto Betting Line</h1>
        <p className="lr-auth-sub">Demo sportsbook-style crypto markets — random results for MVP</p>
        <div className="lr-bets-layout">
          <div className="lr-bets-markets">
            {MARKETS.map((m) => (
              <div key={m.id} className="lr-card lr-market-card">
                <h3>{m.title}</h3>
                <div className="lr-market-odds">{m.odds.toFixed(2)}</div>
                <Button size="sm" onClick={() => addToSlip(m)}>Add to Slip</Button>
              </div>
            ))}
          </div>
          <aside className="lr-bet-slip lr-card">
            <h3>Bet Slip</h3>
            {!slip ? (
              <p className="lr-empty">Select a market</p>
            ) : (
              <>
                <p>{slip.title}</p>
                <p>Odds: {slip.odds}</p>
                <input
                  className="lr-input"
                  type="number"
                  value={stake}
                  min={1}
                  onChange={(e) => setStake(Number(e.target.value))}
                />
                <p>Potential payout: <strong className="lr-text-neon">${potential.toFixed(2)}</strong></p>
                <Button onClick={() => void placeBet()} disabled={placing}>
                  {placing ? 'Placing…' : 'Place Bet'}
                </Button>
              </>
            )}
          </aside>
        </div>
      </div>
    </CasinoShell>
  );
}
