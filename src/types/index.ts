export type Role = 'USER' | 'ADMIN';

export interface SafeUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  xp: number;
  loyaltyLevel: number;
  totalWagered: number;
  totalWon: number;
  isBlocked: boolean;
  createdAt: string;
}

export interface GameResult {
  won: boolean;
  payout: bigint;
  txHash: string;
}

export interface CasinoStore {
  balance: bigint;
  isConnected: boolean;
  address: string | undefined;
  isPlaying: boolean;
  lastResult: GameResult | null;
  setBalance: (balance: bigint) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setLastResult: (result: GameResult | null) => void;
}

export type CoinSide = 0 | 1;

export interface DbGame {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  rtp: number;
  isActive: boolean;
}

export interface LoyaltyLevelData {
  id: number;
  level: number;
  name: string;
  minXp: number;
  cashbackPercent: number;
  weeklyBonusPercent: number;
  monthlyBonusPercent: number;
}

export interface BetSlipItem {
  marketId: string;
  title: string;
  odds: number;
}
