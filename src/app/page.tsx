'use client';

import { CasinoShell } from '@/components/CasinoShell';
import { PrivateClubBanner } from '@/components/PrivateClubBanner';
import { CasinoGamesSection } from '@/components/CasinoGamesSection';
import { HOME_PAGE_CATEGORIES } from '@/lib/casinoGames';

export default function HomePage() {
  return (
    <CasinoShell>
      <div className="page-container">
        <PrivateClubBanner />
        <CasinoGamesSection categories={HOME_PAGE_CATEGORIES} />
      </div>
    </CasinoShell>
  );
}
