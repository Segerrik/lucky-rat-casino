'use client';

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export function UserBalance() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <Link href="/login" className="lr-balance lr-balance--guest">
        Sign in
      </Link>
    );
  }

  return (
    <div className="lr-balance">
      <span className="lr-balance-label">Balance</span>
      <span className="lr-balance-value">${user.balance.toFixed(2)}</span>
    </div>
  );
}
