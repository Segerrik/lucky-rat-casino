export interface CasinoGame {
  id: string;
  title: string;
  provider: string;
  emoji: string;
  gradient: string;
  titleColor: string;
  category: 'popular' | 'hot' | 'originals';
  available: boolean;
}

export const CASINO_GAME_CATEGORIES = [
  { id: 'popular' as const, label: 'Popular' },
  { id: 'hot' as const, label: 'Hot Slots' },
  { id: 'originals' as const, label: 'Lucky Rat Originals' },
];

export const CASINO_GAMES: CasinoGame[] = [
  {
    id: 'hot-chillies',
    title: '3 HOT CHILLIES',
    provider: 'BOOONGO',
    emoji: '🌶️',
    gradient: 'linear-gradient(160deg, #c62828 0%, #ff6f00 45%, #ffca28 100%)',
    titleColor: '#FFEB3B',
    category: 'popular',
    available: false,
  },
  {
    id: 'pink-joker',
    title: 'SUPER PINK JOKER',
    provider: 'PLAYSON',
    emoji: '🃏',
    gradient: 'linear-gradient(160deg, #e91e8c 0%, #9c27b0 50%, #ff4081 100%)',
    titleColor: '#F8BBD9',
    category: 'popular',
    available: false,
  },
  {
    id: 'royal-dracos',
    title: '3 ROYAL DRACOS',
    provider: 'PRAGMATIC',
    emoji: '🐉',
    gradient: 'linear-gradient(160deg, #1a237e 0%, #3949ab 40%, #ffd54f 100%)',
    titleColor: '#FFD54F',
    category: 'popular',
    available: false,
  },
  {
    id: 'mummyland',
    title: 'MUMMYLAND TREASURES',
    provider: 'BELATRA',
    emoji: '🏺',
    gradient: 'linear-gradient(160deg, #4e342e 0%, #8d6e63 40%, #ffd54f 100%)',
    titleColor: '#FFE082',
    category: 'popular',
    available: false,
  },
  {
    id: 'royal-piggy',
    title: 'ROYAL PIGGY',
    provider: 'PLAYSON',
    emoji: '🐷',
    gradient: 'linear-gradient(160deg, #f57f17 0%, #ffab00 50%, #fff59d 100%)',
    titleColor: '#FFF9C4',
    category: 'hot',
    available: false,
  },
  {
    id: 'coin-lightning',
    title: 'COIN UP LIGHTNING',
    provider: 'BOOONGO',
    emoji: '⚡',
    gradient: 'linear-gradient(160deg, #0d47a1 0%, #1976d2 50%, #ffeb3b 100%)',
    titleColor: '#FFEB3B',
    category: 'hot',
    available: false,
  },
  {
    id: 'cash-boost',
    title: 'SUPER CASH BOOST',
    provider: 'PENGUIN KING',
    emoji: '💰',
    gradient: 'linear-gradient(160deg, #00695c 0%, #26a69a 50%, #ffeb3b 100%)',
    titleColor: '#B2FF59',
    category: 'hot',
    available: false,
  },
  {
    id: 'barrels-riches',
    title: 'BARRELS OF RICHES',
    provider: 'BOOONGO',
    emoji: '🛢️',
    gradient: 'linear-gradient(160deg, #5d4037 0%, #8d6e63 45%, #ff8f00 100%)',
    titleColor: '#FFCC80',
    category: 'hot',
    available: false,
  },
  {
    id: 'electro-coins',
    title: 'ELECTRO COINS',
    provider: 'BELATRA',
    emoji: '🪙',
    gradient: 'linear-gradient(160deg, #311b92 0%, #7b1fa2 50%, #00e5ff 100%)',
    titleColor: '#84FFFF',
    category: 'hot',
    available: false,
  },
  {
    id: 'cheese-fortune',
    title: 'CHEESE FORTUNE',
    provider: 'LUCKY RAT',
    emoji: '🧀',
    gradient: 'linear-gradient(160deg, #f9a825 0%, #fbc02d 50%, #fff176 100%)',
    titleColor: '#FFFDE7',
    category: 'originals',
    available: false,
  },
  {
    id: 'sewer-gold',
    title: 'SEWER GOLD RUSH',
    provider: 'LUCKY RAT',
    emoji: '💎',
    gradient: 'linear-gradient(160deg, #1b5e20 0%, #388e3c 50%, #ffd54f 100%)',
    titleColor: '#C8E6C9',
    category: 'originals',
    available: false,
  },
  {
    id: 'coin-flip',
    title: 'COIN FLIP',
    provider: 'LUCKY RAT',
    emoji: '🪙',
    gradient: 'linear-gradient(160deg, #1b5e20 0%, #2e7d32 40%, #f4c542 100%)',
    titleColor: '#F4C542',
    category: 'originals',
    available: true,
  },
];

export function getGamesByCategory(category: CasinoGame['category']) {
  return CASINO_GAMES.filter((g) => g.category === category);
}
