import { create } from 'zustand';
import { CasinoStore } from '@/types';

export const useCasinoStore = create<CasinoStore>((set) => ({
  balance: BigInt(0),
  isConnected: false,
  address: undefined,
  isPlaying: false,
  lastResult: null,
  setBalance: (balance) => set({ balance }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setLastResult: (result) => set({ lastResult: result }),
}));