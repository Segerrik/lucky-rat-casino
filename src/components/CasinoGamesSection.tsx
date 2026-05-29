'use client';

import {
  CASINO_GAME_CATEGORIES,
  getGamesByCategory,
  type CasinoGame,
} from '@/lib/casinoGames';
import { SlotGameCard } from '@/components/SlotGameCard';

interface CasinoGamesSectionProps {
  selectedGameId?: string | null;
  onSelectGame?: (game: CasinoGame) => void;
}

export function CasinoGamesSection({ selectedGameId, onSelectGame }: CasinoGamesSectionProps) {
  return (
    <div style={{ marginBottom: '32px' }}>
      {CASINO_GAME_CATEGORIES.map((category) => {
        const games = getGamesByCategory(category.id);
        if (games.length === 0) return null;

        return (
          <section key={category.id} style={{ marginBottom: '28px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '14px',
              }}
            >
              {category.label}
            </h2>
            <div className="games-scroll">
              {games.map((game) => (
                <SlotGameCard
                  key={game.id}
                  game={game}
                  isSelected={selectedGameId === game.id}
                  onClick={() => onSelectGame?.(game)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
