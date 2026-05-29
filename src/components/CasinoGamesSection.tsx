'use client';

import Link from 'next/link';
import {
  type CasinoGame,
  type GameCategory,
  type GameCategoryConfig,
} from '@/lib/casinoGames';
import { buildLobbyForCategory } from '@/lib/lobbyGames';
import { useLobbyGames } from '@/hooks/useLobbyGames';
import { SlotGameCard } from '@/components/SlotGameCard';

interface CasinoGamesSectionProps {
  categories: GameCategoryConfig[];
  selectedGameId?: string | null;
  onSelectGame?: (game: CasinoGame) => void;
  variant?: 'home' | 'casino';
}

function LobbySkeleton() {
  return (
    <div className="games-scroll">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="slot-card slot-card--skeleton">
          <div className="slot-card-art slot-card-art--skeleton" />
          <div className="slot-card-meta">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--sub" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CasinoGamesSection({
  categories,
  selectedGameId,
  onSelectGame,
  variant = 'casino',
}: CasinoGamesSectionProps) {
  const { games: apiGames, loading, error } = useLobbyGames();

  const categoryIds = categories.map((c) => c.id as GameCategory);

  return (
    <div className="games-sections">
      {error && (
        <div className="lobby-error" role="alert">
          {error} — showing catalog placeholders only
        </div>
      )}

      {categories.map((category) => {
        const games = loading
          ? []
          : buildLobbyForCategory(apiGames, category.id as GameCategory, variant);

        if (!loading && games.length === 0) return null;

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

            {loading ? (
              <LobbySkeleton />
            ) : (
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
            )}
          </section>
        );
      })}

      {!loading && apiGames.length > 0 && categoryIds.every(
        (id) => buildLobbyForCategory(apiGames, id, variant).length === 0,
      ) && (
        <div className="lr-empty">No games in this section yet</div>
      )}
    </div>
  );
}
