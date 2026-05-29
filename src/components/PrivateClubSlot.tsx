'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseEther, formatEther } from 'viem';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CASINO_ADDRESS, CASINO_ABI } from '@/lib/wagmi';
import {
  SLOT_SYMBOLS,
  SLOT_RTP,
  spinSlot,
  gridForOutcome,
  type SlotGrid,
  type SpinResult,
} from '@/lib/slotEngine';

const BET_OPTIONS = ['0.001', '0.002', '0.005', '0.01'] as const;
type SpinPhase = 'idle' | 'spinning' | 'stopping' | 'done';

export function PrivateClubSlot() {
  const { address } = useAccount();
  const [bet, setBet] = useState<string>('0.001');
  const [lastWin, setLastWin] = useState('0.0000');
  const [phase, setPhase] = useState<SpinPhase>('idle');
  const [stoppedReels, setStoppedReels] = useState(0);
  const [displayGrid, setDisplayGrid] = useState<SlotGrid | null>(null);
  const [winLines, setWinLines] = useState<number[]>([]);
  const [showBigWin, setShowBigWin] = useState(false);

  const balanceBeforeRef = useRef<bigint>(BigInt(0));
  const pendingResultRef = useRef<SpinResult | null>(null);
  const processedTxRef = useRef<string | undefined>(undefined);

  const { data: playerBalance, refetch: refetchBalance } = useReadContract({
    address: CASINO_ADDRESS,
    abi: CASINO_ABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const betWei = parseEther(bet);
  const canSpin =
    phase === 'idle' &&
    !isPending &&
    playerBalance !== undefined &&
    playerBalance >= betWei;

  const runReelStopSequence = useCallback((result: SpinResult) => {
    setPhase('spinning');
    setStoppedReels(0);
    setWinLines([]);
    setShowBigWin(false);
    setDisplayGrid(null);

    const stopDelays = [1200, 2000, 2800];
    stopDelays.forEach((delay, idx) => {
      setTimeout(() => {
        setStoppedReels(idx + 1);
        setDisplayGrid(result.grid);
        if (idx === 2) {
          setWinLines(result.winLines.map((l) => l.row));
          setPhase('done');
          setLastWin(result.payoutEth.toFixed(4));
          if (result.isBigWin) {
            setShowBigWin(true);
            setTimeout(() => setShowBigWin(false), 3200);
          }
          setTimeout(() => setPhase('idle'), 600);
        } else {
          setPhase('stopping');
        }
      }, delay);
    });
  }, []);

  useEffect(() => {
    if (!txSuccess || !txHash || processedTxRef.current === txHash) return;
    processedTxRef.current = txHash;

    (async () => {
      const { data: newBalance } = await refetchBalance();
      const after = newBalance ?? BigInt(0);
      const delta = after - balanceBeforeRef.current;
      const betNum = parseFloat(bet);
      const wonOnChain = delta > BigInt(0);

      let result = pendingResultRef.current ?? spinSlot(betNum);

      if (wonOnChain) {
        const profit = parseFloat(formatEther(delta));
        const visual = gridForOutcome(true, betNum);
        result = {
          ...visual,
          payoutEth: betNum + profit,
          isBigWin: visual.isBigWin || profit >= betNum * 6,
        };
      } else {
        result = gridForOutcome(false, betNum);
        result.payoutEth = 0;
      }

      pendingResultRef.current = null;
      runReelStopSequence(result);
    })();
  }, [txSuccess, txHash, bet, refetchBalance, runReelStopSequence]);

  const handleSpin = () => {
    if (!canSpin || !playerBalance) return;

    balanceBeforeRef.current = playerBalance;
    const betNum = parseFloat(bet);
    const result = spinSlot(betNum);
    pendingResultRef.current = result;

    setPhase('spinning');
    setStoppedReels(0);
    setDisplayGrid(null);
    setWinLines([]);
    setShowBigWin(false);

    writeContract({
      address: CASINO_ADDRESS,
      abi: CASINO_ABI,
      functionName: 'play',
      args: [result.payoutEth > 0 ? 0 : 1, betWei],
    });
  };

  const spinning = phase === 'spinning' || phase === 'stopping' || isPending;

  return (
    <div className="private-club-slot">
      <div className="slot-banner">
        <div className="slot-banner-rats">
          <span title="Блондинка">👱‍♀️</span>
          <span title="Брюнетка">🥀</span>
          <span title="Смокинг">👔</span>
        </div>
        <div>
          <div className="slot-banner-eyebrow">Members Only</div>
          <h2 className="slot-banner-title">The Private Club</h2>
        </div>
      </div>

      <div className="slot-machine">
        <div className="slot-stats">
          <div className="slot-stat">
            <span className="slot-stat-label">Ставка</span>
            <span className="slot-stat-value">{bet} ETH</span>
          </div>
          <div className="slot-stat">
            <span className="slot-stat-label">Последний выигрыш</span>
            <span className="slot-stat-value slot-stat-value--gold">{lastWin} ETH</span>
          </div>
          <div className="slot-stat">
            <span className="slot-stat-label">RTP</span>
            <span className="slot-stat-value">{SLOT_RTP}%</span>
          </div>
        </div>

        <div className="slot-window">
          {[0, 1, 2].map((col) => (
            <div key={col} className="slot-reel">
              <motion.div
                className="slot-reel-strip"
                animate={
                  spinning && stoppedReels <= col
                    ? { y: [0, -480] }
                    : { y: 0 }
                }
                transition={
                  spinning && stoppedReels <= col
                    ? { duration: 0.35, repeat: Infinity, ease: 'linear' }
                    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {[0, 1, 2].map((row) => {
                  const sym = displayGrid?.[col]?.[row];
                  const isWinCell = phase === 'done' && winLines.includes(row);
                  return (
                    <div
                      key={row}
                      className={`slot-cell ${isWinCell ? 'slot-cell--win' : ''}`}
                    >
                      {sym ? sym.emoji : SLOT_SYMBOLS[(col + row) % SLOT_SYMBOLS.length].emoji}
                    </div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="slot-bets">
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
        </div>

        <button
          type="button"
          className="slot-spin-btn"
          onClick={handleSpin}
          disabled={!canSpin}
        >
          {isPending ? '⏳ Подтверждение…' : spinning ? '🎰 Крутим…' : '🎰 SPIN'}
        </button>

        {!playerBalance || playerBalance < betWei ? (
          <p className="slot-hint">Пополните баланс во вкладке Deposit, чтобы крутить слот.</p>
        ) : null}

        <div className="slot-paytable">
          <div className="slot-paytable-title">Таблица выплат (3 в ряд)</div>
          <div className="slot-paytable-grid">
            {SLOT_SYMBOLS.map((sym) => (
              <div key={sym.id} className="slot-paytable-item">
                <span>{sym.emoji}</span>
                <span className="slot-paytable-mult">×{sym.mult}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBigWin && (
          <motion.div
            className="slot-big-win"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
          >
            <div className="slot-big-win-burst">✨</div>
            <div className="slot-big-win-title">BIG WIN!</div>
            <div className="slot-big-win-amount">+{lastWin} ETH</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
