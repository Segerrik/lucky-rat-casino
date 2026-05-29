import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Lucky Rat Casino',
  projectId: 'lucky-rat-casino-demo',
  chains: [sepolia],
  ssr: true,
});

export const CASINO_ADDRESS = '0x02E622FE5A2400F33E6cB829B9E73461c1a06F32' as const;

export const CASINO_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint8", "name": "playerChoice", "type": "uint8"},
      {"internalType": "uint256", "name": "betAmount", "type": "uint256"}
    ],
    "name": "play",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "balances",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "casinoBalance",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "bet", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "won", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "payout", "type": "uint256"}
    ],
    "name": "GamePlayed",
    "type": "event"
  }
] as const;