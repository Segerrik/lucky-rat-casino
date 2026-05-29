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