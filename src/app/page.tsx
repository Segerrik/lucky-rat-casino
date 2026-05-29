'use client';

import { CasinoShell } from '@/components/CasinoShell';
import { PrivateClubBanner } from '@/components/PrivateClubBanner';
import { HomeStats } from '@/components/HomeStats';
import { CasinoGamesSection } from '@/components/CasinoGamesSection';
import { HOME_PAGE_CATEGORIES } from '@/lib/casinoGames';

export default function HomePage() {
  return (
    <CasinoShell>
      <div className="page-container">
        <PrivateClubBanner />
        <HomeStats />
        <CasinoGamesSection categories={HOME_PAGE_CATEGORIES} variant="home" />
      </div>
    </CasinoShell>
  );
}
