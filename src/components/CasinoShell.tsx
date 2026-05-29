'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { NavIcon } from '@/components/NavIcon';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Casino', href: '/casino', icon: 'casino' },
  { label: '🎰 Slots', href: '/slots', icon: 'slots' },
  { label: 'Promotions', href: '#', icon: 'promotions' },
  { label: 'VIP Club', href: '/vip', icon: 'vip' },
  { label: 'Missions', href: '#', icon: 'missions' },
  { label: 'Wallet', href: '#', icon: 'wallet' },
] as const;

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

export function CasinoShell({
  children,
  mainClassName,
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
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
    ? parseFloat(formatEther(playerBalance)).toFixed(2)
    : '0.00';

  const vipProgress = getVipProgress(DEMO_PLAYER_XP);
  const currentLevel = getVipLevelForXp(DEMO_PLAYER_XP);

  const sidebarClass = [
    'shell-sidebar',
    sidebarOpen ? 'shell-sidebar--open' : 'shell-sidebar--closed',
  ].join(' ');

  const completedTiers = vipProgress.next ? currentLevel.id - 1 : VIP_LEVELS.length;
  const tierProgress = vipProgress.next ? vipProgress.percent : 0;

  const xpText = vipProgress.next
    ? `${DEMO_PLAYER_XP.toLocaleString()} / ${vipProgress.next.xpRequired.toLocaleString()} XP to ${vipProgress.next.name.split(' ')[0]}`
    : `${DEMO_PLAYER_XP.toLocaleString()} XP · MAX`;

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
            <Image
              src="/branding/rat-logo.png"
              alt="Lucky Rat"
              width={44}
              height={44}
              className="shell-logo-img"
              priority
            />
            <div>
              <div className="shell-logo-title">Lucky Rat</div>
              <div className="shell-logo-sub">Private Casino</div>
            </div>
          </Link>
        </div>

        <div className="shell-header-right">
          {isConnected && (
            <div className="header-balance">
              <span className="header-balance-amount">{formattedBalance}Ξ</span>
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

              if (item.href === '#') {
                return (
                  <div key={item.label} className={itemClass}>
                    <NavIcon name={item.icon} />
                    <span className="shell-nav-label">{item.label}</span>
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
                  <NavIcon name={item.icon} />
                  <span className="shell-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link href="/vip" className="vip-widget" onClick={closeSidebarOnMobile}>
            <div className="vip-widget-label">VIP Tier</div>
            <div className="vip-widget-rank">{currentLevel.name}</div>
            <CheeseProgress
              filledCount={completedTiers}
              partialPercent={tierProgress}
              total={VIP_LEVELS.length}
            />
            <div className="vip-widget-xp">{xpText}</div>
          </Link>
        </aside>

        <main className={['shell-main', mainClassName].filter(Boolean).join(' ')}>{children}</main>
      </div>
    </div>
  );
}
