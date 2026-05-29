'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CasinoShell } from '@/components/CasinoShell';
import { BetPanel } from '@/components/BetPanel';
import { useAuthStore, useToastStore } from '@/store/authStore';

const REEL_SYMBOLS = ['🐀', '🧀', '💰', '🪤', '🎁'];

function randomReels() {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 3 }, () => REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)]),
  );
}

export default function CheeseHeistPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToastStore((s) => s.show);
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(randomReels());
  const [lastWin, setLastWin] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [bonus, setBonus] = useState(false);

  const spin = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSpinning(true);
    setBonus(false);
    setReels(randomReels());
    const res = await fetch('/api/games/play-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameSlug: 'cheese-heist', amount: bet }),
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
      const newReels = randomReels();
      if (Math.random() > 0.85) {
        newReels[0][1] = '🎁';
        newReels[2][0] = '🎁';
        newReels[4][2] = '🎁';
        setBonus(true);
        toast('Cheese Heist Bonus triggered!', 'success');
      }
      setReels(newReels);
      if (data.result.won) toast(`Heist win ×${data.result.multiplier}`, 'success');
    }, 1500);
  };

  return (
    <CasinoShell>
      <div className="page-container lr-game-page">
        <Link href="/casino" className="k-slot-back">← Casino Lobby</Link>
        <h1>Cheese Heist Slot</h1>
        <p className="lr-auth-sub">5 reels · vault heist · 3× 🎁 opens bonus round (demo)</p>
        <div className="lr-game-layout">
          <motion.div className="lr-game-main lr-card lr-cheese-heist" animate={spinning ? { x: [0, -4, 4, 0] } : {}}>
            <div className="lr-heist-grid">
              {reels.map((col, ci) => (
                <div key={ci} className="lr-heist-reel">
                  {col.map((sym, ri) => (
                    <div key={ri} className={`lr-heist-cell ${sym === '🎁' ? 'lr-heist-cell--bonus' : ''}`}>
                      {sym}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {bonus && <div className="lr-heist-banner">🧀 CHEESE HEIST BONUS 🧀</div>}
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
