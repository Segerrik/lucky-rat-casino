'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CasinoShell } from '@/components/CasinoShell';
import { SlotGrid, randomGrid } from '@/components/SlotGrid';
import { BetPanel } from '@/components/BetPanel';
import { useAuthStore, useToastStore } from '@/store/authStore';

export default function LuckyRatSlotPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToastStore((s) => s.show);
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [grid, setGrid] = useState(randomGrid());
  const [lastWin, setLastWin] = useState(0);
  const [multiplier, setMultiplier] = useState(0);

  const spin = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSpinning(true);
    setGrid(randomGrid());
    const res = await fetch('/api/games/play-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameSlug: 'lucky-rat-slot', amount: bet }),
    });
    const data = await res.json();
    setTimeout(() => {
      setSpinning(false);
      if (!res.ok) {
        toast(data.error ?? 'Spin failed', 'error');
        return;
      }
      setUser(data.user);
      setLastWin(data.result.payout);
      setMultiplier(data.result.multiplier);
      setGrid(randomGrid());
      if (data.result.won) toast(`Win! ×${data.result.multiplier}`, 'success');
    }, 1200);
  };

  return (
    <CasinoShell>
      <div className="page-container lr-game-page">
        <Link href="/casino" className="k-slot-back">← Casino Lobby</Link>
        <h1>Lucky Rat Slot</h1>
        <p className="lr-auth-sub">Sewer pipes · cheese · traps · demo mock RTP ~97%</p>
        <div className="lr-game-layout">
          <motion.div className="lr-game-main lr-card" animate={spinning ? { scale: 0.98 } : { scale: 1 }}>
            <SlotGrid grid={grid} spinning={spinning} />
          </motion.div>
          <BetPanel
            bet={bet}
            onBetChange={setBet}
            onSpin={() => void spin()}
            spinning={spinning}
            lastWin={lastWin}
            multiplier={multiplier}
            balance={user?.balance}
          />
        </div>
      </div>
    </CasinoShell>
  );
}
