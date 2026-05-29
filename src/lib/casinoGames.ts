export type GameCategory =
  | 'popular'
  | 'hot'
  | 'originals'
  | 'new-releases'
  | 'high-roller'
  | 'jackpots';

export interface CasinoGame {
  id: string;
  title: string;
  provider: string;
  emoji: string;
  gradient: string;
  titleColor: string;
  category: GameCategory;
  available: boolean;
  href?: string;
  rtp?: number;
}

export interface GameCategoryConfig {
  id: GameCategory;
  label: string;
  eyebrow?: string;
  viewAllHref?: string;
}

export const HOME_PAGE_CATEGORIES: GameCategoryConfig[] = [
  { id: 'popular', label: 'Popular', eyebrow: 'Trending tonight', viewAllHref: '/casino' },
  { id: 'new-releases', label: 'New Releases', eyebrow: 'Fresh on the felt', viewAllHref: '/casino' },
];

export const CASINO_GAME_CATEGORIES: GameCategoryConfig[] = [
  { id: 'popular', label: 'Popular', eyebrow: 'Trending tonight' },
  { id: 'hot', label: 'Hot Slots', eyebrow: 'High energy' },
  { id: 'originals', label: 'Lucky Rat Originals', eyebrow: 'House exclusives' },
];

export const CASINO_GAMES: CasinoGame[] = [
  {
    id: 'hot-chillies',
    title: '3 Hot Chillies',
    provider: 'BOOONGO',
    emoji: '🧀',
    gradient: 'linear-gradient(160deg, #c62828 0%, #ff6f00 45%, #ffca28 100%)',
    titleColor: '#FFEB3B',
    category: 'popular',
    available: false,
  },
  {
    id: 'pink-joker',
    title: 'Super Pink Joker',
    provider: 'PLAYSON',
    emoji: '🃏',
    gradient: 'linear-gradient(160deg, #e91e8c 0%, #9c27b0 50%, #ff4081 100%)',
    titleColor: '#F8BBD9',
    category: 'popular',
    available: false,
  },
  {
    id: 'royal-dracos',
    title: '3 Royal Dracos',
    provider: 'PRAGMATIC',
    emoji: '👑',
    gradient: 'linear-gradient(160deg, #1a237e 0%, #3949ab 40%, #ffd54f 100%)',
    titleColor: '#FFD54F',
    category: 'popular',
    available: false,
  },
  {
    id: 'mummyland',
    title: 'Mummyland Treasures',
    provider: 'BELATRA',
    emoji: '💎',
    gradient: 'linear-gradient(160deg, #4e342e 0%, #8d6e63 40%, #ffd54f 100%)',
    titleColor: '#FFE082',
    category: 'popular',
    available: false,
  },
  {
    id: 'lucky-dice',
    title: 'Lucky Rat Dice',
    provider: 'LUCKY RAT',
    emoji: '🎲',
    gradient: 'linear-gradient(160deg, #37474f 0%, #546e7a 50%, #ffeb3b 100%)',
    titleColor: '#FFF59D',
    category: 'popular',
    available: false,
  },
  {
    id: 'midnight-heist',
    title: 'Midnight Heist',
    provider: 'NOLIMIT',
    emoji: '🌙',
    gradient: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #e94560 100%)',
    titleColor: '#FFCDD2',
    category: 'new-releases',
    available: false,
  },
  {
    id: 'golden-whiskers',
    title: 'Golden Whiskers',
    provider: 'HACKSAW',
    emoji: '🐀',
    gradient: 'linear-gradient(160deg, #bf8f00 0%, #ffd54f 50%, #fff8e1 100%)',
    titleColor: '#FFF8E1',
    category: 'new-releases',
    available: false,
  },
  {
    id: 'neon-alley',
    title: 'Neon Alley',
    provider: 'PUSH',
    emoji: '🌃',
    gradient: 'linear-gradient(160deg, #4a148c 0%, #7b1fa2 50%, #00e5ff 100%)',
    titleColor: '#E1BEE7',
    category: 'new-releases',
    available: false,
  },
  {
    id: 'velvet-roulette',
    title: 'Velvet Roulette',
    provider: 'EVOLUTION',
    emoji: '🎡',
    gradient: 'linear-gradient(160deg, #4a0000 0%, #7f0000 50%, #d4af37 100%)',
    titleColor: '#F4E4BC',
    category: 'new-releases',
    available: false,
  },
  {
    id: 'diamond-spin',
    title: 'Diamond Spin',
    provider: 'PRAGMATIC',
    emoji: '💎',
    gradient: 'linear-gradient(160deg, #0d47a1 0%, #5c6bc0 50%, #b3e5fc 100%)',
    titleColor: '#E3F2FD',
    category: 'new-releases',
    available: false,
  },
  {
    id: 'platinum-roulette',
    title: 'PLATINUM ROULETTE',
    provider: 'EVOLUTION',
    emoji: '🎡',
    gradient: 'linear-gradient(160deg, #212121 0%, #424242 50%, #e0e0e0 100%)',
    titleColor: '#FAFAFA',
    category: 'high-roller',
    available: false,
  },
  {
    id: 'diamond-blackjack',
    title: 'DIAMOND BLACKJACK',
    provider: 'EVOLUTION',
    emoji: '♠️',
    gradient: 'linear-gradient(160deg, #0d47a1 0%, #1565c0 50%, #b3e5fc 100%)',
    titleColor: '#E3F2FD',
    category: 'high-roller',
    available: false,
  },
  {
    id: 'vip-baccarat',
    title: 'VIP BACCARAT',
    provider: 'PRAGMATIC',
    emoji: '🎴',
    gradient: 'linear-gradient(160deg, #1b0000 0%, #4a0000 50%, #ffd700 100%)',
    titleColor: '#FFD700',
    category: 'high-roller',
    available: false,
  },
  {
    id: 'whale-wheel',
    title: 'WHALE WHEEL',
    provider: 'LUCKY RAT',
    emoji: '🎡',
    gradient: 'linear-gradient(160deg, #004d40 0%, #00695c 50%, #a7ffeb 100%)',
    titleColor: '#A7FFEB',
    category: 'high-roller',
    available: false,
  },
  {
    id: 'mega-cheese',
    title: 'MEGA CHEESE POT',
    provider: 'LUCKY RAT',
    emoji: '🧀',
    gradient: 'linear-gradient(160deg, #ff6f00 0%, #ffab00 50%, #fff59d 100%)',
    titleColor: '#FFFDE7',
    category: 'jackpots',
    available: false,
  },
  {
    id: 'sewer-millions',
    title: 'SEWER MILLIONS',
    provider: 'BOOONGO',
    emoji: '💰',
    gradient: 'linear-gradient(160deg, #1b5e20 0%, #388e3c 50%, #ffeb3b 100%)',
    titleColor: '#C8E6C9',
    category: 'jackpots',
    available: false,
  },
  {
    id: 'rat-king-jackpot',
    title: 'RAT KING JACKPOT',
    provider: 'LUCKY RAT',
    emoji: '👑',
    gradient: 'linear-gradient(160deg, #4a148c 0%, #7b1fa2 50%, #ffd54f 100%)',
    titleColor: '#EA80FC',
    category: 'jackpots',
    available: false,
  },
  {
    id: 'gold-rush-xl',
    title: 'GOLD RUSH XL',
    provider: 'PLAYSON',
    emoji: '⛏️',
    gradient: 'linear-gradient(160deg, #bf360c 0%, #e64a19 50%, #ffeb3b 100%)',
    titleColor: '#FFEB3B',
    category: 'jackpots',
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
    id: 'coin-flip-static',
    title: 'COIN FLIP',
    provider: 'LUCKY RAT',
    emoji: '🐀',
    gradient: 'linear-gradient(160deg, #1b5e20 0%, #2e7d32 40%, #f4c542 100%)',
    titleColor: '#F4C542',
    category: 'originals',
    available: false,
  },
];

export function getGamesByCategory(category: GameCategory) {
  return CASINO_GAMES.filter((g) => g.category === category);
}
