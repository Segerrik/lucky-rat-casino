export interface VipLevel {
  id: number;
  name: string;
  emoji: string;
  xpRequired: number;
  color: string;
  accent: string;
  perks: string[];
  rakeback: string;
  weeklyBonus: string;
}

export const VIP_LEVELS: VipLevel[] = [
  {
    id: 1,
    name: 'Street Rat',
    emoji: '🐀',
    xpRequired: 0,
    color: '#9E9E9E',
    accent: '#BFC3C9',
    perks: ['Base rakeback', 'Daily missions', 'Community chat badge'],
    rakeback: '0.5%',
    weeklyBonus: '—',
  },
  {
    id: 2,
    name: 'Alley Scout',
    emoji: '🐁',
    xpRequired: 1000,
    color: '#8B7355',
    accent: '#C4A574',
    perks: ['Priority support', '+5% deposit bonus', 'Exclusive promos'],
    rakeback: '1%',
    weeklyBonus: '0.001 ETH',
  },
  {
    id: 3,
    name: 'Sewer Boss',
    emoji: '🦴',
    xpRequired: 5000,
    color: '#3DDC84',
    accent: '#5AE89A',
    perks: ['Higher bet limits', 'Birthday bonus', 'Free spin drops'],
    rakeback: '2%',
    weeklyBonus: '0.005 ETH',
  },
  {
    id: 4,
    name: 'Cheese Baron',
    emoji: '🧀',
    xpRequired: 15000,
    color: '#F4C542',
    accent: '#FFD966',
    perks: ['Personal host', 'Cashback boosts', 'VIP tournaments'],
    rakeback: '3.5%',
    weeklyBonus: '0.02 ETH',
  },
  {
    id: 5,
    name: 'Lucky Rat Legend',
    emoji: '👑',
    xpRequired: 50000,
    color: '#E040FB',
    accent: '#EA80FC',
    perks: ['Custom limits', 'Instant withdrawals', 'Legend loot crate'],
    rakeback: '5%',
    weeklyBonus: '0.1 ETH',
  },
];

export function getVipLevelForXp(xp: number): VipLevel {
  let current = VIP_LEVELS[0];
  for (const level of VIP_LEVELS) {
    if (xp >= level.xpRequired) current = level;
  }
  return current;
}

export function getNextVipLevel(xp: number): VipLevel | null {
  const current = getVipLevelForXp(xp);
  const idx = VIP_LEVELS.findIndex((l) => l.id === current.id);
  return idx < VIP_LEVELS.length - 1 ? VIP_LEVELS[idx + 1] : null;
}

export function getVipProgress(xp: number) {
  const current = getVipLevelForXp(xp);
  const next = getNextVipLevel(xp);
  if (!next) {
    return { current, next: null, xpInTier: xp - current.xpRequired, xpNeeded: 0, percent: 100 };
  }
  const xpInTier = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  const percent = Math.min(100, Math.round((xpInTier / xpNeeded) * 100));
  return { current, next, xpInTier, xpNeeded, percent };
}

/** Demo XP for UI until on-chain loyalty is wired */
export const DEMO_PLAYER_XP = 0;
