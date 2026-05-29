'use client';

import type { CasinoGame } from '@/lib/casinoGames';

interface SlotGameCardProps {
  game: CasinoGame;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SlotGameCard({ game, isSelected, onClick }: SlotGameCardProps) {
  const isComingSoon = !game.available;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isComingSoon}
      style={{
        flex: '0 0 132px',
        width: '132px',
        height: '176px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: isSelected ? '2px solid #3DDC84' : '2px solid transparent',
        padding: 0,
        cursor: isComingSoon ? 'default' : 'pointer',
        position: 'relative',
        background: '#1E1E1E',
        textAlign: 'left',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isSelected ? 'scale(1.02)' : 'none',
        boxShadow: isSelected ? '0 8px 24px rgba(61, 220, 132, 0.25)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isComingSoon) e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.transform = 'none';
        else e.currentTarget.style.transform = 'scale(1.02)';
      }}
    >
      <div
        style={{
          height: 'calc(100% - 28px)',
          background: game.gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: '52px',
            lineHeight: 1,
            filter: isComingSoon ? 'blur(1px) brightness(0.7)' : 'none',
          }}
        >
          {game.emoji}
        </span>
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '6px',
            right: '6px',
            fontSize: '11px',
            fontWeight: '900',
            color: game.titleColor,
            textAlign: 'center',
            lineHeight: 1.15,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            letterSpacing: '0.3px',
            filter: isComingSoon ? 'blur(0.5px)' : 'none',
          }}
        >
          {game.title}
        </div>

        {isComingSoon && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'rgba(0,0,0,0.5)',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Coming Soon
            </span>
          </div>
        )}

        {game.available && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '9px',
              fontWeight: '800',
              color: '#121212',
              background: '#3DDC84',
              padding: '3px 6px',
              borderRadius: '4px',
              letterSpacing: '0.5px',
            }}
          >
            LIVE
          </div>
        )}
      </div>

      <div
        style={{
          height: '28px',
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          {game.provider}
        </span>
      </div>
    </button>
  );
}
