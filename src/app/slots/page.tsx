'use client';

import { CasinoShell } from '@/components/CasinoShell';
import { PrivateClubSlot } from '@/components/PrivateClubSlot';

export default function SlotsPage() {
  return (
    <CasinoShell mainClassName="shell-main--slots">
      <PrivateClubSlot />
    </CasinoShell>
  );
}
