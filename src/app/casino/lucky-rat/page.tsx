'use client';

import { CasinoShell } from '@/components/CasinoShell';
import { PrivateClubSlot } from '@/components/PrivateClubSlot';

export default function LuckyRatGamePage() {
  return (
    <CasinoShell mainClassName="shell-main--slots">
      <PrivateClubSlot />
    </CasinoShell>
  );
}
