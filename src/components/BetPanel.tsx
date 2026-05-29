'use client';

import { Button } from '@/components/ui/Button';

interface BetPanelProps {
  bet: number;
  onBetChange: (v: number) => void;
  onSpin: () => void;
  spinning: boolean;
  lastWin?: number;
  multiplier?: number;
  balance?: number;
}

const PRESETS = [5, 10, 25, 50, 100];

export function BetPanel({
  bet,
  onBetChange,
  onSpin,
  spinning,
  lastWin = 0,
  multiplier = 0,
  balance,
}: BetPanelProps) {
  return (
    <aside className="lr-bet-panel">
      <h3 className="lr-bet-panel-title">Bet Panel</h3>
      {balance !== undefined && (
        <div className="lr-bet-panel-stat">
          <span>Balance</span>
          <strong>${balance.toFixed(2)}</strong>
        </div>
      )}
      <div className="lr-bet-panel-stat">
        <span>Last Win</span>
        <strong className="lr-text-neon">${lastWin.toFixed(2)}</strong>
      </div>
      {multiplier > 0 && (
        <div className="lr-bet-panel-stat">
          <span>Multiplier</span>
          <strong>×{multiplier}</strong>
        </div>
      )}
      <div className="lr-bet-presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`lr-bet-preset ${bet === p ? 'lr-bet-preset--active' : ''}`}
            onClick={() => onBetChange(p)}
            disabled={spinning}
          >
            ${p}
          </button>
        ))}
      </div>
      <input
        type="number"
        className="lr-input"
        value={bet}
        min={1}
        onChange={(e) => onBetChange(Number(e.target.value))}
        disabled={spinning}
      />
      <Button className="lr-bet-spin" onClick={onSpin} disabled={spinning}>
        {spinning ? 'Spinning…' : 'SPIN'}
      </Button>
      <p className="lr-demo-note">Demo mode — mock random results</p>
    </aside>
  );
}
