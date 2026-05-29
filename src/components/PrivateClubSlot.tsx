'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { parseEther, formatEther } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CASINO_ADDRESS, CASINO_ABI } from '@/lib/wagmi';
import {
  SLOT_SYMBOLS,
  SLOT_RTP,
  spinSlot,
  type SlotGrid,
  type SpinResult,
  type WinTier,
} from '@/lib/slotEngine';
import {
  resolveSessionBalance,
  updateSessionBalance,
} from '@/lib/slotSession';
import { slotSounds } from '@/lib/slotSounds';

const BET_OPTIONS = ['0.001', '0.002', '0.005', '0.01'] as const;
const AUTOSPIN_OPTIONS = [10, 25, 50, 100] as const;

type SpinPhase = 'idle' | 'spinning' | 'stopping' | 'done';

const WIN_LABELS: Record<Exclude<WinTier, 'none'>, string> = {
  win: 'WIN!',
  big: 'BIG WIN!',
  mega: 'MEGA WIN!',
};

function payoutToWei(payoutEth: number): bigint {
  const fixed = payoutEth.toFixed(9);
  return parseEther(fixed);
}

export function PrivateClubSlot() {
  const { address, isConnected } = useAccount();
  const [bet, setBet] = useState<(typeof BET_OPTIONS)[number]>('0.001');
  const [lastWin, setLastWin] = useState('0.0000');
  const [phase, setPhase] = useState<SpinPhase>('idle');
  const [stoppedReels, setStoppedReels] = useState(0);
  const [displayGrid, setDisplayGrid] = useState<SlotGrid | null>(null);
  const [winLines, setWinLines] = useState<number[]>([]);
  const [winOverlay, setWinOverlay] = useState<WinTier>('none');
  const [turbo, setTurbo] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [autoSpinRemaining, setAutoSpinRemaining] = useState(0);
  const [autoMenuOpen, setAutoMenuOpen] = useState(false);
  const [sessionBalance, setSessionBalance] = useState<bigint | null>(null);

  const sessionRef = useRef<bigint>(BigInt(0));
  const autoSpinRef = useRef(0);
  const spinningRef = useRef(false);

  const { data: chainBalance, refetch: refetchBalance } = useReadContract({
    address: CASINO_ADDRESS,
    abi: CASINO_ABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    slotSounds.setMuted(!soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (!address || chainBalance === undefined) {
      setSessionBalance(null);
      return;
    }
    const resolved = resolveSessionBalance(address, chainBalance);
    sessionRef.current = resolved;
    setSessionBalance(resolved);
  }, [address, chainBalance]);

  const betWei = parseEther(bet);
  const formattedSession =
    sessionBalance !== null
      ? parseFloat(formatEther(sessionBalance)).toFixed(4)
      : '0.0000';

  const canSpin =
    phase === 'idle' &&
    sessionBalance !== null &&
    sessionBalance >= betWei &&
    !spinningRef.current;

  const runReelStopSequence = useCallback(
    (result: SpinResult) => {
      setPhase('spinning');
      setStoppedReels(0);
      setWinLines([]);
      setWinOverlay('none');
      setDisplayGrid(null);

      if (soundOn) slotSounds.spinStart();

      const baseDelays = turbo ? [120, 220, 320] : [900, 1500, 2100];

      baseDelays.forEach((delay, idx) => {
        setTimeout(() => {
          setStoppedReels(idx + 1);
          setDisplayGrid(result.grid);
          if (soundOn) slotSounds.reelStop(idx);

          if (idx === 2) {
            setWinLines(result.winLines.map((l) => l.row));
            setPhase('done');
            setLastWin(result.payoutEth.toFixed(4));

            if (result.winTier !== 'none') {
              setWinOverlay(result.winTier);
              if (soundOn) slotSounds.win(result.winTier);
              const hideMs = result.winTier === 'mega' ? 4200 : result.winTier === 'big' ? 3400 : 2200;
              setTimeout(() => setWinOverlay('none'), hideMs);
            } else if (soundOn) {
              slotSounds.lose();
            }

            setTimeout(() => {
              setPhase('idle');
              spinningRef.current = false;

              if (autoSpinRef.current > 0) {
                autoSpinRef.current -= 1;
                setAutoSpinRemaining(autoSpinRef.current);
                if (autoSpinRef.current === 0) return;
                setTimeout(() => triggerSpinRef.current(), turbo ? 200 : 500);
              }
            }, turbo ? 150 : 400);
          } else {
            setPhase('stopping');
          }
        }, delay);
      });
    },
    [turbo, soundOn],
  );

  const triggerSpinRef = useRef<() => void>(() => {});

  const executeSpin = useCallback(() => {
    if (spinningRef.current || sessionBalance === null || !address) return false;
    if (sessionBalance < betWei) return false;

    spinningRef.current = true;
    const betNum = parseFloat(bet);
    const result = spinSlot(betNum);
    const payoutWei = payoutToWei(result.payoutEth);
    const nextBalance = sessionBalance - betWei + payoutWei;

    sessionRef.current = nextBalance;
    setSessionBalance(nextBalance);
    updateSessionBalance(address, nextBalance);

    runReelStopSequence(result);
    return true;
  }, [sessionBalance, betWei, bet, address, runReelStopSequence]);

  triggerSpinRef.current = executeSpin;

  const handleSpin = () => {
    if (!canSpin) return;
    autoSpinRef.current = 0;
    setAutoSpinRemaining(0);
    executeSpin();
  };

  const startAutoSpin = (count: number) => {
    if (!canSpin && phase !== 'idle') return;
    setAutoMenuOpen(false);
    autoSpinRef.current = count;
    setAutoSpinRemaining(count);
    if (phase === 'idle' && !spinningRef.current) executeSpin();
  };

  const stopAutoSpin = () => {
    autoSpinRef.current = 0;
    setAutoSpinRemaining(0);
  };

  const handleMaxBet = () => {
    if (sessionBalance === null) return;
    const balanceNum = parseFloat(formatEther(sessionBalance));
    let best: (typeof BET_OPTIONS)[number] = BET_OPTIONS[0];
    for (const opt of BET_OPTIONS) {
      if (parseFloat(opt) <= balanceNum) best = opt;
    }
    setBet(best);
  };

  const spinning = phase === 'spinning' || phase === 'stopping';

  if (!isConnected) {
    return (
      <div className="slots-connect">
        <div className="slots-connect-rats">
          <span>👱‍♀️</span>
          <span>🥀</span>
          <span>👔</span>
        </div>
        <h1 className="slots-connect-title">The Private Club</h1>
        <p className="slots-connect-text">
          Connect your wallet to play. Balance is loaded from the casino contract — no MetaMask on every spin.
        </p>
        <ConnectButton />
        <Link href="/casino" className="slots-connect-link">
          ← Deposit at Casino
        </Link>
      </div>
    );
  }

  return (
    <div className="private-club-slot">
      <header className="slots-topbar">
        <div className="slots-topbar-brand">
          <span className="slots-topbar-rats">
            <span>👱‍♀️</span>
            <span>🥀</span>
            <span>👔</span>
          </span>
          <div>
            <div className="slots-topbar-eyebrow">Members Only · RTP {SLOT_RTP}%</div>
            <h1 className="slots-topbar-title">The Private Club</h1>
          </div>
        </div>

        <div className="slots-hud">
          <div className="slots-hud-item">
            <span className="slots-hud-label">Balance</span>
            <span className="slots-hud-value slots-hud-value--gold">{formattedSession} ETH</span>
          </div>
          <div className="slots-hud-item">
            <span className="slots-hud-label">Bet</span>
            <span className="slots-hud-value">{bet} ETH</span>
          </div>
          <div className="slots-hud-item">
            <span className="slots-hud-label">Last Win</span>
            <span className="slots-hud-value slots-hud-value--gold">{lastWin} ETH</span>
          </div>
        </div>

        <div className="slots-topbar-actions">
          <button
            type="button"
            className={`slots-icon-btn ${soundOn ? 'slots-icon-btn--active' : ''}`}
            onClick={() => setSoundOn((v) => !v)}
            aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            className={`slots-icon-btn ${turbo ? 'slots-icon-btn--active' : ''}`}
            onClick={() => setTurbo((v) => !v)}
            aria-pressed={turbo}
          >
            ⚡ TURBO
          </button>
        </div>
      </header>

      <div className="slots-stage">
        <div className="slot-window slot-window--fullscreen">
          {[0, 1, 2].map((col) => (
            <div key={col} className="slot-reel slot-reel--large">
              <motion.div
                className="slot-reel-strip"
                animate={
                  spinning && stoppedReels <= col
                    ? { y: turbo ? [0, -360] : [0, -540] }
                    : { y: 0 }
                }
                transition={
                  spinning && stoppedReels <= col
                    ? { duration: turbo ? 0.12 : 0.28, repeat: Infinity, ease: 'linear' }
                    : { duration: turbo ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {[0, 1, 2].map((row) => {
                  const sym = displayGrid?.[col]?.[row];
                  const isWinCell = phase === 'done' && winLines.includes(row);
                  const placeholder =
                    sym?.emoji ??
                    SLOT_SYMBOLS[(col + row + stoppedReels) % SLOT_SYMBOLS.length].emoji;
                  return (
                    <div
                      key={row}
                      className={`slot-cell slot-cell--large ${isWinCell ? 'slot-cell--win' : ''}`}
                    >
                      {placeholder}
                    </div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <footer className="slots-controls">
        <div className="slot-bets slot-bets--wide">
          {BET_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`slot-bet-btn ${bet === amount ? 'slot-bet-btn--active' : ''}`}
              onClick={() => setBet(amount)}
              disabled={spinning}
            >
              {amount}
            </button>
          ))}
          <button
            type="button"
            className="slot-bet-btn slot-bet-btn--max"
            onClick={handleMaxBet}
            disabled={spinning || sessionBalance === null}
          >
            MAX BET
          </button>
        </div>

        <div className="slots-action-row">
          <div className="slots-autospin-wrap">
            {autoSpinRemaining > 0 ? (
              <button type="button" className="slots-autospin-btn slots-autospin-btn--stop" onClick={stopAutoSpin}>
                STOP ({autoSpinRemaining})
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="slots-autospin-btn"
                  onClick={() => setAutoMenuOpen((v) => !v)}
                  disabled={!canSpin && phase !== 'idle'}
                >
                  AUTOSPIN ▾
                </button>
                {autoMenuOpen && (
                  <div className="slots-autospin-menu">
                    {AUTOSPIN_OPTIONS.map((n) => (
                      <button key={n} type="button" onClick={() => startAutoSpin(n)}>
                        {n} spins
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            className="slot-spin-btn slot-spin-btn--hero"
            onClick={handleSpin}
            disabled={!canSpin}
          >
            {spinning ? '🎰 SPINNING…' : '🎰 SPIN'}
          </button>
        </div>

        {sessionBalance !== null && sessionBalance < betWei ? (
          <p className="slot-hint">
            Insufficient balance.{' '}
            <Link href="/casino">Deposit at Casino</Link> — spins use your session balance without MetaMask.
          </p>
        ) : (
          <p className="slot-hint slot-hint--muted">
            Session balance · synced on deposit · withdraw on-chain at{' '}
            <Link href="/casino">Casino → Withdraw</Link>
            <button type="button" className="slots-sync-btn" onClick={() => void refetchBalance()}>
              ↻ Sync
            </button>
          </p>
        )}

        <div className="slot-paytable slot-paytable--compact">
          <div className="slot-paytable-title">Paytable — 3 in a row</div>
          <div className="slot-paytable-grid">
            {SLOT_SYMBOLS.map((sym) => (
              <div key={sym.id} className="slot-paytable-item">
                <span className="slot-paytable-emoji">{sym.emoji}</span>
                <span className="slot-paytable-mult">×{sym.mult}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {winOverlay !== 'none' && (
          <motion.div
            className={`slot-win-overlay slot-win-overlay--${winOverlay}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
          >
            <div className="slot-win-overlay-burst">
              {winOverlay === 'mega' ? '💎✨🎰✨💎' : winOverlay === 'big' ? '✨🎰✨' : '⭐'}
            </div>
            <div className="slot-win-overlay-title">{WIN_LABELS[winOverlay]}</div>
            <div className="slot-win-overlay-amount">+{lastWin} ETH</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
