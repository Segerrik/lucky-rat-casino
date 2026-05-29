import type { DbGame } from '@/types';
import {
  CASINO_GAMES,
  type CasinoGame,
  type GameCategory,
} from '@/lib/casinoGames';

/** Visual + routing metadata keyed by DB slug */
const SLUG_META: Record<
  string,
  Pick<CasinoGame, 'emoji' | 'gradient' | 'titleColor' | 'href' | 'provider'>
> = {
  'lucky-rat-slot': {
    emoji: '🐀',
    provider: 'LUCKY RAT',
    gradient: 'linear-gradient(160deg, #1b5e20 0%, #2e7d32 40%, #9dff57 100%)',
    titleColor: '#9dff57',
    href: '/games/lucky-rat-slot',
  },
  'cheese-heist': {
    emoji: '🧀',
    provider: 'LUCKY RAT',
    gradient: 'linear-gradient(160deg, #f9a825 0%, #ff8f00 50%, #fff176 100%)',
    titleColor: '#FFFDE7',
    href: '/games/cheese-heist',
  },
  'private-club': {
    emoji: '🎰',
    provider: 'LUCKY RAT',
    gradient: 'linear-gradient(160deg, #0a0908 0%, #2a2218 45%, #f4c542 100%)',
    titleColor: '#F4C542',
    href: '/slots',
  },
  kristina: {
    emoji: '💎',
    provider: 'LUCKY RAT',
    gradient: 'linear-gradient(160deg, #1a0a2e 0%, #4a148c 50%, #f4c542 100%)',
    titleColor: '#F4C542',
    href: '/slots',
  },
  'coin-flip': {
    emoji: '🪙',
    provider: 'LUCKY RAT',
    gradient: 'linear-gradient(160deg, #1b5e20 0%, #2e7d32 40%, #f4c542 100%)',
    titleColor: '#F4C542',
  },
  'crypto-line': {
    emoji: '📈',
    provider: 'LUCKY RAT',
    gradient: 'linear-gradient(160deg, #0d47a1 0%, #1565c0 50%, #9dff57 100%)',
    titleColor: '#84FFFF',
    href: '/bets',
  },
};

const DEFAULT_META = {
  emoji: '🐀',
  provider: 'LUCKY RAT',
  gradient: 'linear-gradient(160deg, #141414 0%, #2a2a2a 50%, #9dff57 100%)',
  titleColor: '#9dff57',
} as const;

/** Map DB category string → lobby section id */
export function dbCategoryToLobbyCategory(
  dbCategory: string,
  variant: 'home' | 'casino',
): GameCategory {
  switch (dbCategory) {
    case 'Popular':
      return 'popular';
    case 'Rat Originals':
      return 'originals';
    case 'Slots':
      return variant === 'home' ? 'popular' : 'hot';
    case 'Crypto Bets':
      return variant === 'home' ? 'popular' : 'originals';
    default:
      return 'popular';
  }
}

export function dbGameToLobbyCard(game: DbGame, variant: 'home' | 'casino'): CasinoGame {
  const meta = SLUG_META[game.slug] ?? DEFAULT_META;
  return {
    id: game.slug,
    title: game.name.toUpperCase(),
    provider: meta.provider,
    emoji: meta.emoji,
    gradient: meta.gradient,
    titleColor: meta.titleColor,
    category: dbCategoryToLobbyCategory(game.category, variant),
    available: game.isActive,
    href: game.isActive ? meta.href : undefined,
    rtp: game.rtp,
  };
}

/** Live games from API first, then static “Coming Soon” placeholders */
export function buildLobbyForCategory(
  apiGames: DbGame[],
  category: GameCategory,
  variant: 'home' | 'casino',
): CasinoGame[] {
  const fromApi = apiGames
    .map((g) => dbGameToLobbyCard(g, variant))
    .filter((g) => g.category === category);

  const apiSlugs = new Set(fromApi.map((g) => g.id));
  const comingSoon = CASINO_GAMES.filter(
    (g) => g.category === category && !g.available && !apiSlugs.has(g.id),
  );

  return [...fromApi, ...comingSoon];
}

export function buildFullLobby(
  apiGames: DbGame[],
  categories: GameCategory[],
  variant: 'home' | 'casino',
): Map<GameCategory, CasinoGame[]> {
  const map = new Map<GameCategory, CasinoGame[]>();
  for (const cat of categories) {
    const games = buildLobbyForCategory(apiGames, cat, variant);
    if (games.length > 0) map.set(cat, games);
  }
  return map;
}
