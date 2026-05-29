'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CASINO_ADDRESS, CASINO_ABI } from '@/lib/wagmi';

const STATS = [
  { label: 'Active Tables', value: '248', sub: '+12 tonight', live: false },
  { label: 'Top Payout 24h', value: '12.4Ξ', sub: 'Velvet Roulette', live: false },
  { label: 'Members Online', value: '1,892', sub: 'Live', live: true },
];

export function HomeStats() {
  const { address, isConnected } = useAccount();
  const { data: playerBalance } = useReadContract({
    address: CASINO_ADDRESS,
    abi: CASINO_ABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const eth = playerBalance ? parseFloat(formatEther(playerBalance)) : 0;
  const bankroll = isConnected ? `${eth.toFixed(2)}Ξ` : '—';
  const bankrollSub = isConnected ? `≈ $${(eth * 2540).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'Connect wallet';

  return (
    <div className="stats-grid">
      {STATS.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-card-label">{stat.label}</div>
          <div className="stat-card-value">{stat.value}</div>
          <div className={`stat-card-sub ${stat.live ? 'stat-card-sub--live' : ''}`}>
            {stat.live && <span className="live-dot" />}
            {stat.sub}
          </div>
        </div>
      ))}
      <div className="stat-card stat-card--highlight">
        <div className="stat-card-label">Your Bankroll</div>
        <div className="stat-card-value">{bankroll}</div>
        <div className="stat-card-sub">{bankrollSub}</div>
      </div>
    </div>
  );
}
