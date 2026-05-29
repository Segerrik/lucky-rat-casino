'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CasinoGame } from '@/lib/casinoGames';

interface SlotGameCardProps {
  game: CasinoGame;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SlotGameCard({ game, isSelected, onClick }: SlotGameCardProps) {
  const isComingSoon = !game.available;
  const [notified, setNotified] = useState(false);
  const isLink = game.available && !!game.href;

  const handleNotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNotified(true);
  };

  const cardClass = `slot-card ${isSelected ? 'slot-card--selected' : ''} ${isComingSoon ? 'slot-card--soon' : ''}`;

  const cardBody = (
    <>
      <div className="slot-card-art" style={{ background: game.gradient }}>
        <span className="slot-card-emoji">{game.emoji}</span>
        {isComingSoon && <span className="slot-card-badge">Coming Soon</span>}
        {game.available && <span className="slot-card-badge slot-card-badge--live">Live</span>}
      </div>
      <div className="slot-card-meta">
        <h3 className="slot-card-title">{game.title}</h3>
        <p className="slot-card-provider">
          {game.provider}
          {game.rtp != null && game.rtp > 0 && (
            <span className="slot-card-rtp"> · RTP {game.rtp}%</span>
          )}
        </p>
      </div>
    </>
  );

  return (
    <article className={cardClass}>
      {isLink ? (
        <Link href={game.href!} className="slot-card-hit" aria-label={game.title}>
          {cardBody}
        </Link>
      ) : (
        <button
          type="button"
          className="slot-card-hit"
          onClick={onClick}
          disabled={isComingSoon}
          aria-label={game.title}
        >
          {cardBody}
        </button>
      )}
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
