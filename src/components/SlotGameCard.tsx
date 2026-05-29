'use client';

import { useState } from 'react';
import type { CasinoGame } from '@/lib/casinoGames';

interface SlotGameCardProps {
  game: CasinoGame;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SlotGameCard({ game, isSelected, onClick }: SlotGameCardProps) {
  const isComingSoon = !game.available;
  const [notified, setNotified] = useState(false);

  const handleNotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotified(true);
  };

  return (
    <article
      className={`slot-card ${isSelected ? 'slot-card--selected' : ''} ${isComingSoon ? 'slot-card--soon' : ''}`}
    >
      <button
        type="button"
        className="slot-card-hit"
        onClick={onClick}
        disabled={isComingSoon}
        aria-label={game.title}
      >
        <div className="slot-card-art" style={{ background: game.gradient }}>
          <span className="slot-card-emoji">{game.emoji}</span>
          {isComingSoon && <span className="slot-card-badge">Coming Soon</span>}
          {game.available && <span className="slot-card-badge slot-card-badge--live">Live</span>}
        </div>
        <div className="slot-card-meta">
          <h3 className="slot-card-title">{game.title}</h3>
          <p className="slot-card-provider">{game.provider}</p>
        </div>
      </button>
      {isComingSoon && (
        <button
          type="button"
          className={`slot-card-notify ${notified ? 'slot-card-notify--done' : ''}`}
          onClick={handleNotify}
        >
          {notified ? '✓ Notified' : 'Notify me'}
        </button>
      )}
    </article>
  );
}
