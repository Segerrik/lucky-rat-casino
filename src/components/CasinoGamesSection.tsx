'use client';

import {
  getGamesByCategory,
  type CasinoGame,
  type GameCategory,
} from '@/lib/casinoGames';
import { SlotGameCard } from '@/components/SlotGameCard';

interface CategoryConfig {
  id: GameCategory;
  label: string;
}

interface CasinoGamesSectionProps {
  categories: CategoryConfig[];
  selectedGameId?: string | null;
  onSelectGame?: (game: CasinoGame) => void;
}

export function CasinoGamesSection({
  categories,
  selectedGameId,
  onSelectGame,
}: CasinoGamesSectionProps) {
  return (
    <div style={{ marginBottom: '32px' }}>
      {categories.map((category) => {
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
