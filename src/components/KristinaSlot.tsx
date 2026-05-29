'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SYMBOLS,
  SLOT_RTP,
  FREE_SPIN_COUNT,
  FREE_SPIN_MULTIPLIER,
  spinSlot,
  getWinningCells,
  PAYTABLE_ROWS,
  PAYLINE_COUNT,
  type SlotGrid,
  type SpinResult,
  type WinTier,
  type SymbolId,
} from '@/lib/kristinaSlot/engine';
import { slotSounds } from '@/lib/slotSounds';

const BET_OPTIONS = ['0.001', '0.002', '0.005', '0.01'] as const;
const AUTOSPIN_OPTIONS = [10, 25, 50, 100] as const;
const STARTING_BALANCE = 0.1;

type SpinPhase = 'idle' | 'spinning' | 'stopping' | 'done';

const WIN_LABELS: Record<Exclude<WinTier, 'none'>, string> = {
  win: 'WIN!',
  big: 'BIG WIN!',
  mega: 'MEGA WIN!',
};

function formatEth(n: number) {
  return n.toFixed(4);
}

export function KristinaSlot() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [bet, setBet] = useState<(typeof BET_OPTIONS)[number]>('0.001');
  const [lastWin, setLastWin] = useState('0.0000');
  const [phase, setPhase] = useState<SpinPhase>('idle');
  const [stoppedReels, setStoppedReels] = useState(0);
  const [displayGrid, setDisplayGrid] = useState<SlotGrid | null>(null);
  const [winCells, setWinCells] = useState<Set<string>>(new Set());
  const [winOverlay, setWinOverlay] = useState<WinTier>('none');
  const [turbo, setTurbo] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [autoSpinRemaining, setAutoSpinRemaining] = useState(0);
  const [autoMenuOpen, setAutoMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(0);
  const [showFreeSpinBanner, setShowFreeSpinBanner] = useState(false);

  const spinningRef = useRef(false);
  const autoSpinRef = useRef(0);
  const freeSpinsRef = useRef(0);
  const triggerSpinRef = useRef<() => void>(() => {});

  const betNum = parseFloat(bet);
  const isFreeSpin = freeSpinsLeft > 0;
  const canSpin =
    phase === 'idle' &&
    !spinningRef.current &&
    (isFreeSpin || balance >= betNum);

  useEffect(() => {
    slotSounds.setMuted(!soundOn);
  }, [soundOn]);

  const runReelStopSequence = useCallback(
    (result: SpinResult) => {
      setPhase('spinning');
      setStoppedReels(0);
      setWinCells(new Set());
      setWinOverlay('none');
      setDisplayGrid(null);

      if (soundOn) slotSounds.spinStart();

      const reelDelay = turbo ? 100 : 200;
      const baseDelay = turbo ? 400 : 800;

      for (let idx = 0; idx < 5; idx++) {
        setTimeout(() => {
          setStoppedReels(idx + 1);
          setDisplayGrid(result.grid);
          if (soundOn) slotSounds.reelStop(idx);

          if (idx === 4) {
            const cells = getWinningCells(result.lineWins);
            setWinCells(cells);
            setPhase('done');
            setLastWin(formatEth(result.payoutEth));

            if (result.winTier !== 'none') {
              setWinOverlay(result.winTier);
              if (soundOn) slotSounds.win(result.winTier === 'mega' ? 'mega' : result.winTier === 'big' ? 'big' : 'win');
              const hideMs =
                result.winTier === 'mega' ? 4500 : result.winTier === 'big' ? 3600 : 2000;
              setTimeout(() => setWinOverlay('none'), hideMs);
            } else if (result.payoutEth === 0 && soundOn) {
              slotSounds.lose();
            }

            if (result.triggeredFreeSpins) {
              freeSpinsRef.current += FREE_SPIN_COUNT;
              setFreeSpinsLeft(freeSpinsRef.current);
              setShowFreeSpinBanner(true);
              setTimeout(() => setShowFreeSpinBanner(false), 3000);
            }

            setTimeout(() => {
              setPhase('idle');
              spinningRef.current = false;

              if (autoSpinRef.current > 0) {
                autoSpinRef.current -= 1;
                setAutoSpinRemaining(autoSpinRef.current);
                if (autoSpinRef.current > 0) {
                  setTimeout(() => triggerSpinRef.current(), turbo ? 150 : 400);
                }
              } else if (freeSpinsRef.current > 0) {
                setTimeout(() => triggerSpinRef.current(), turbo ? 150 : 500);
              }
            }, turbo ? 120 : 350);
          } else {
            setPhase('stopping');
          }
        }, baseDelay + idx * reelDelay);
      }
    },
    [turbo, soundOn],
  );

  const executeSpin = useCallback(() => {
    if (spinningRef.current) return false;

    const usingFreeSpin = freeSpinsRef.current > 0;
    if (!usingFreeSpin && balance < betNum) return false;

    spinningRef.current = true;

    if (usingFreeSpin) {
      freeSpinsRef.current -= 1;
      setFreeSpinsLeft(freeSpinsRef.current);
    } else {
      setBalance((b) => b - betNum);
    }

    const mult = usingFreeSpin ? FREE_SPIN_MULTIPLIER : 1;
    const result = spinSlot(betNum, Math.random, mult);

    if (result.payoutEth > 0) {
      setBalance((b) => b + result.payoutEth);
    }

    runReelStopSequence(result);
    return true;
  }, [balance, betNum, runReelStopSequence]);

  triggerSpinRef.current = executeSpin;

  const handleSpin = () => {
    if (!canSpin) return;
    autoSpinRef.current = 0;
    setAutoSpinRemaining(0);
    executeSpin();
  };

  const startAutoSpin = (count: number) => {
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
    let best: (typeof BET_OPTIONS)[number] = BET_OPTIONS[0];
    for (const opt of BET_OPTIONS) {
      if (parseFloat(opt) <= balance) best = opt;
    }
    setBet(best);
  };

  const spinning = phase === 'spinning' || phase === 'stopping';

  const renderSymbol = (id: SymbolId, col: number, row: number) => {
    const sym = SYMBOLS[id];
    const key = `${col}-${row}`;
    const isWin = phase === 'done' && winCells.has(key);
    return (
      <div
        key={key}
        className={`k-slot-cell ${isWin ? 'k-slot-cell--win' : ''}`}
      >
        <Image
          src={sym.image}
          alt={sym.name}
          width={100}
          height={100}
          className="k-slot-symbol-img"
          priority={col < 2 && row === 1}
        />
      </div>
    );
  };

  return (
    <div className="kristina-slot">
      <header className="k-slot-header">
        <Link href="/" className="k-slot-back">
          ← Back
        </Link>

        <div className="k-slot-hud">
          <div className="k-slot-hud-item">
            <span className="k-slot-hud-label">Balance</span>
            <span className="k-slot-hud-value k-slot-hud-value--gold">{formatEth(balance)} ETH</span>
          </div>
          <div className="k-slot-hud-item">
            <span className="k-slot-hud-label">Bet</span>
            <span className="k-slot-hud-value">{isFreeSpin ? 'FREE' : `${bet} ETH`}</span>
          </div>
          <div className="k-slot-hud-item">
            <span className="k-slot-hud-label">Last Win</span>
            <span className="k-slot-hud-value k-slot-hud-value--gold">{lastWin} ETH</span>
          </div>
          {freeSpinsLeft > 0 && (
            <div className="k-slot-hud-item k-slot-hud-item--free">
              <span className="k-slot-hud-label">Free Spins</span>
              <span className="k-slot-hud-value">×{freeSpinsLeft} (×{FREE_SPIN_MULTIPLIER})</span>
            </div>
          )}
        </div>

        <div className="k-slot-header-actions">
          <button
            type="button"
            className="k-slot-icon-btn"
            onClick={() => setInfoOpen(true)}
            aria-label="Rules and paytable"
          >
            i
          </button>
          <button
            type="button"
            className={`k-slot-icon-btn ${soundOn ? 'k-slot-icon-btn--active' : ''}`}
            onClick={() => setSoundOn((v) => !v)}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            className={`k-slot-icon-btn ${turbo ? 'k-slot-icon-btn--active' : ''}`}
            onClick={() => setTurbo((v) => !v)}
          >
            ⚡ TURBO
          </button>
        </div>
      </header>

      <div className="k-slot-stage">
        <div className="k-slot-window">
          {[0, 1, 2, 3, 4].map((col) => (
            <div key={col} className="k-slot-reel">
              <motion.div
                className="k-slot-reel-strip"
                animate={
                  spinning && stoppedReels <= col
                    ? { y: turbo ? [0, -360] : [0, -720] }
                    : { y: 0 }
                }
                transition={
                  spinning && stoppedReels <= col
                    ? { duration: turbo ? 0.1 : 0.22, repeat: Infinity, ease: 'linear' }
                    : { duration: turbo ? 0.2 : 0.4, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {[0, 1, 2].map((row) => {
                  const id =
                    displayGrid?.[col]?.[row] ??
                    (['kristina', 'porsche', 'trap', 'wild', 'bonus'] as SymbolId[])[
                      (col + row + stoppedReels) % 5
                    ];
                  return renderSymbol(id, col, row);
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <footer className="k-slot-controls">
        <div className="k-slot-bets">
          {BET_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={`k-slot-bet-btn ${bet === amount ? 'k-slot-bet-btn--active' : ''}`}
              onClick={() => setBet(amount)}
              disabled={spinning || isFreeSpin}
            >
              {amount}
            </button>
          ))}
          <button
            type="button"
            className="k-slot-bet-btn k-slot-bet-btn--max"
            onClick={handleMaxBet}
            disabled={spinning || isFreeSpin}
          >
            MAX
          </button>
        </div>

        <div className="k-slot-action-row">
          <div className="k-slot-autospin-wrap">
            {autoSpinRemaining > 0 ? (
              <button
                type="button"
                className="k-slot-autospin-btn k-slot-autospin-btn--stop"
                onClick={stopAutoSpin}
              >
                STOP ({autoSpinRemaining})
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="k-slot-autospin-btn"
                  onClick={() => setAutoMenuOpen((v) => !v)}
                  disabled={!canSpin && phase !== 'idle'}
                >
                  AUTOSPIN ▾
                </button>
                {autoMenuOpen && (
                  <div className="k-slot-autospin-menu">
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
            className="k-slot-spin-btn"
            onClick={handleSpin}
            disabled={!canSpin}
          >
            {spinning ? 'SPINNING…' : isFreeSpin ? '🎁 FREE SPIN' : 'SPIN'}
          </button>
        </div>

        <p className="k-slot-footer-note">
          {PAYLINE_COUNT} lines · RTP {SLOT_RTP}% · WILD substitutes all except BONUS · 3+ BONUS ={' '}
          {FREE_SPIN_COUNT} free spins (×{FREE_SPIN_MULTIPLIER})
        </p>
      </footer>

      {/* WIN overlays */}
      <AnimatePresence>
        {winOverlay !== 'none' && winOverlay !== 'big' && winOverlay !== 'mega' && (
          <motion.div
            className="k-slot-overlay k-slot-overlay--win"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="k-slot-overlay-title">{WIN_LABELS.win}</div>
            <div className="k-slot-overlay-amount">+{lastWin} ETH</div>
          </motion.div>
        )}

        {winOverlay === 'big' && (
          <motion.div
            className="k-slot-overlay k-slot-overlay--big"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="k-slot-coins">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="k-slot-coin"
                  initial={{ y: -40, x: (i % 8) * 48 - 160, opacity: 0 }}
                  animate={{
                    y: [0, 120 + (i % 5) * 40],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
                  }}
                  transition={{ duration: 2, delay: i * 0.06, repeat: Infinity }}
                >
                  🪙
                </motion.span>
              ))}
            </div>
            <div className="k-slot-overlay-title">{WIN_LABELS.big}</div>
            <div className="k-slot-overlay-amount">+{lastWin} ETH</div>
          </motion.div>
        )}

        {winOverlay === 'mega' && (
          <motion.div
            className="k-slot-overlay k-slot-overlay--mega"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="k-slot-confetti">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="k-slot-confetti-piece"
                  style={{
                    left: `${(i * 2.5) % 100}%`,
                    background: ['#F4C542', '#ff4444', '#fff', '#ff8800'][i % 4],
                  }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{
                    y: ['0vh', '100vh'],
                    opacity: [1, 1, 0],
                    rotate: [0, 720],
                  }}
                  transition={{ duration: 2.5 + (i % 3) * 0.5, delay: i * 0.04, repeat: Infinity }}
                />
              ))}
            </div>
            <div className="k-slot-overlay-title">{WIN_LABELS.mega}</div>
            <div className="k-slot-overlay-amount">+{lastWin} ETH</div>
          </motion.div>
        )}

        {showFreeSpinBanner && (
          <motion.div
            className="k-slot-free-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            🎁 {FREE_SPIN_COUNT} FREE SPINS — ×{FREE_SPIN_MULTIPLIER} MULTIPLIER!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info modal */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            className="k-slot-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInfoOpen(false)}
          >
            <motion.div
              className="k-slot-modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="k-slot-modal-close" onClick={() => setInfoOpen(false)}>
                ✕
              </button>
              <h2 className="k-slot-modal-title">Rules & Paytable</h2>

              <div className="k-slot-modal-section">
                <h3>How to play</h3>
                <ul>
                  <li>5 reels × 3 rows, {PAYLINE_COUNT} fixed paylines</li>
                  <li>Wins pay left to right on active lines</li>
                  <li>
                    <strong>WILD</strong> (cheese) substitutes any symbol except BONUS
                  </li>
                  <li>
                    <strong>3+ BONUS</strong> anywhere awards {FREE_SPIN_COUNT} free spins with ×
                    {FREE_SPIN_MULTIPLIER} multiplier
                  </li>
                  <li>
                    <strong>Trap</strong> — no payout
                  </li>
                  <li>RTP {SLOT_RTP}% · House edge {100 - SLOT_RTP}%</li>
                </ul>
              </div>

              <div className="k-slot-modal-section">
                <h3>Paytable (per line, × line bet)</h3>
                <div className="k-slot-paytable">
                  {PAYTABLE_ROWS.map((sym) => (
                    <div key={sym.id} className="k-slot-paytable-row">
                      <Image src={sym.image} alt={sym.name} width={48} height={48} />
                      <span className="k-slot-paytable-name">{sym.name}</span>
                      <span className="k-slot-paytable-pays">
                        3×{sym.pays[3]} · 4×{sym.pays[4]} · 5×{sym.pays[5]}
                      </span>
                    </div>
                  ))}
                  <div className="k-slot-paytable-row">
                    <Image src={SYMBOLS.wild.image} alt="WILD" width={48} height={48} />
                    <span className="k-slot-paytable-name">WILD</span>
                    <span className="k-slot-paytable-pays">Substitutes all except BONUS</span>
                  </div>
                  <div className="k-slot-paytable-row">
                    <Image src={SYMBOLS.bonus.image} alt="BONUS" width={48} height={48} />
                    <span className="k-slot-paytable-name">BONUS</span>
                    <span className="k-slot-paytable-pays">3+ = {FREE_SPIN_COUNT} free spins</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
