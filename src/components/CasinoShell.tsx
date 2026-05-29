'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CASINO_ADDRESS, CASINO_ABI } from '@/lib/wagmi';
import {
  DEMO_PLAYER_XP,
  getVipLevelForXp,
  getVipProgress,
  VIP_LEVELS,
} from '@/lib/vipLevels';

const NAV_ITEMS = [
  { icon: '🎰', label: 'Casino', href: '/' },
  { icon: '⚽', label: 'Sports', href: '#' },
  { icon: '🎮', label: 'Live Casino', href: '#' },
  { icon: '🎁', label: 'Promotions', href: '#' },
  { icon: '👑', label: 'VIP Club', href: '/vip' },
  { icon: '🎯', label: 'Missions', href: '#' },
  { icon: '🏆', label: 'Leaderboard', href: '#' },
  { icon: '💼', label: 'Wallet', href: '#' },
];

export function CasinoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  const { data: playerBalance } = useReadContract({
    address: CASINO_ADDRESS,
    abi: CASINO_ABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const formattedBalance = playerBalance
    ? parseFloat(formatEther(playerBalance)).toFixed(4)
    : '0.0000';

  const vipProgress = getVipProgress(DEMO_PLAYER_XP);
  const currentLevel = getVipLevelForXp(DEMO_PLAYER_XP);

  return (
    <div style={{ minHeight: '100vh', background: '#121212', color: '#BFC3C9' }}>
      <header
        style={{
          background: '#1E1E1E',
          borderBottom: '1px solid #2A2A2A',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <span style={{ fontSize: '28px' }}>🐀</span>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#3DDC84', letterSpacing: '-0.5px' }}>
              Lucky Rat
            </div>
            <div style={{ fontSize: '11px', color: '#7D7D7D', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Casino
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isConnected && (
            <div
              style={{
                background: '#2A2A2A',
                border: '1px solid #3DDC84',
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '14px' }}>🧀</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#3DDC84' }}>
                {formattedBalance} ETH
              </span>
            </div>
          )}
          <ConnectButton />
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>
        <aside
          style={{
            width: '220px',
            background: '#1E1E1E',
            borderRight: '1px solid #2A2A2A',
            padding: '24px 0',
            flexShrink: 0,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : item.href !== '#' && pathname.startsWith(item.href);
            const inner = (
              <>
                <span>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
              </>
            );
            const itemStyle = {
              display: 'flex' as const,
              alignItems: 'center' as const,
              gap: '12px',
              padding: '12px 24px',
              cursor: 'pointer' as const,
              background: isActive ? 'rgba(61, 220, 132, 0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #3DDC84' : '3px solid transparent',
              color: isActive ? '#3DDC84' : '#7D7D7D',
              transition: 'all 0.2s',
              textDecoration: 'none' as const,
            };

            return item.href === '#' ? (
              <div key={item.label} style={itemStyle}>
                {inner}
              </div>
            ) : (
              <Link key={item.label} href={item.href} style={itemStyle}>
                {inner}
              </Link>
            );
          })}

          <Link
            href="/vip"
            style={{
              margin: '24px 16px',
              background: '#2A2A2A',
              borderRadius: '12px',
              padding: '16px',
              display: 'block',
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: '12px', color: '#7D7D7D', marginBottom: '8px' }}>VIP Level</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: currentLevel.accent, marginBottom: '12px' }}>
              {currentLevel.emoji} {currentLevel.name}
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {VIP_LEVELS.map((level) => (
                <div
                  key={level.id}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    background: level.id <= currentLevel.id ? currentLevel.color : '#3A3A3A',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#7D7D7D' }}>
              {vipProgress.next
                ? `${DEMO_PLAYER_XP} / ${vipProgress.next.xpRequired} XP`
                : `${DEMO_PLAYER_XP} XP · MAX`}
            </div>
          </Link>
        </aside>

        <main style={{ flex: 1, padding: '32px' }}>{children}</main>
      </div>
    </div>
  );
}
