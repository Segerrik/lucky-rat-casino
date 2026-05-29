'use client';

import Link from 'next/link';
import {
  getGamesByCategory,
  type CasinoGame,
  type GameCategoryConfig,
} from '@/lib/casinoGames';
import { SlotGameCard } from '@/components/SlotGameCard';

interface CasinoGamesSectionProps {
  categories: GameCategoryConfig[];
  selectedGameId?: string | null;
  onSelectGame?: (game: CasinoGame) => void;
}

export function CasinoGamesSection({
  categories,
  selectedGameId,
  onSelectGame,
}: CasinoGamesSectionProps) {
  return (
    <div className="games-sections">
      {categories.map((category) => {
        const games = getGamesByCategory(category.id);
        if (games.length === 0) return null;

        return (
          <section key={category.id} className="game-category">
            <div className="game-category-header">
              <div>
                {category.eyebrow && <p className="game-category-eyebrow">{category.eyebrow}</p>}
                <h2 className="game-category-title">{category.label}</h2>
              </div>
              {category.viewAllHref && (
                <Link href={category.viewAllHref} className="game-category-link">
                  View all
                </Link>
              )}
            </div>
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
