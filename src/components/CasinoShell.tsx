'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { CheeseProgress } from '@/components/CheeseProgress';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', href: '/' },
  { icon: '🎰', label: 'Casino', href: '/casino' },
  { icon: '🎁', label: 'Promotions', href: '#' },
  { icon: '👑', label: 'VIP Club', href: '/vip' },
  { icon: '🎯', label: 'Missions', href: '#' },
  { icon: '💼', label: 'Wallet', href: '#' },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

export function CasinoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const closeSidebarOnMobile = useCallback(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

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

  const sidebarClass = [
    'shell-sidebar',
    sidebarOpen ? 'shell-sidebar--open' : 'shell-sidebar--closed',
  ].join(' ');

  return (
    <div className="shell-root">
      <header className="shell-header">
        <div className="shell-header-left">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <Link href="/" className="shell-logo" onClick={closeSidebarOnMobile}>
            <span className="shell-logo-icon">🐀</span>
            <div>
              <div className="shell-logo-title">Lucky Rat</div>
              <div className="shell-logo-sub">Casino</div>
            </div>
          </Link>
        </div>

        <div className="shell-header-right">
          {isConnected && (
            <div className="header-balance">
              <span>🧀</span>
              <span className="header-balance-amount">{formattedBalance} ETH</span>
            </div>
          )}
          <div className="connect-wrap">
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="shell-body">
        {isMobile && sidebarOpen && (
          <button
            type="button"
            className="shell-overlay"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={sidebarClass}>
          <nav className="shell-nav">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : item.href !== '#' && pathname.startsWith(item.href);
              const itemClass = `shell-nav-item ${isActive ? 'shell-nav-item--active' : ''}`;

              const inner = (
                <>
                  <span className="shell-nav-icon">{item.icon}</span>
                  <span className="shell-nav-label">{item.label}</span>
                </>
              );

              if (item.href === '#') {
                return (
                  <div key={item.label} className={itemClass}>
                    {inner}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={itemClass}
                  onClick={closeSidebarOnMobile}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          <Link href="/vip" className="vip-widget" onClick={closeSidebarOnMobile}>
            <div className="vip-widget-label">VIP Level</div>
            <div className="vip-widget-rank" style={{ color: currentLevel.accent }}>
              {currentLevel.emoji} {currentLevel.name}
            </div>
            <CheeseProgress filledCount={currentLevel.id} total={VIP_LEVELS.length} />
            <div className="vip-widget-xp">
              {vipProgress.next
                ? `${DEMO_PLAYER_XP} / ${vipProgress.next.xpRequired} XP`
                : `${DEMO_PLAYER_XP} XP · MAX`}
            </div>
          </Link>
        </aside>

        <main className="shell-main">{children}</main>
      </div>
    </div>
  );
}
