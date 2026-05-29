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
    name: 'Bronze Whisker',
    emoji: '🐀',
    xpRequired: 0,
    color: '#A67C52',
    accent: '#D4A574',
    perks: ['Base rakeback', 'Daily missions', 'Community chat badge'],
    rakeback: '0.5%',
    weeklyBonus: '—',
  },
  {
    id: 2,
    name: 'Silver Whisker',
    emoji: '🐁',
    xpRequired: 1000,
    color: '#B0BEC5',
    accent: '#ECEFF1',
    perks: ['Priority support', '+5% deposit bonus', 'Exclusive promos'],
    rakeback: '1%',
    weeklyBonus: '0.001 ETH',
  },
  {
    id: 3,
    name: 'Gold Mane',
    emoji: '👑',
    xpRequired: 3200,
    color: '#D4AF37',
    accent: '#F4E4BC',
    perks: ['Higher bet limits', 'Birthday bonus', 'Free spin drops'],
    rakeback: '2%',
    weeklyBonus: '0.005 ETH',
  },
  {
    id: 4,
    name: 'Platinum Rat',
    emoji: '💎',
    xpRequired: 15000,
    color: '#9FA8DA',
    accent: '#C5CAE9',
    perks: ['Personal host', 'Cashback boosts', 'VIP tournaments'],
    rakeback: '3.5%',
    weeklyBonus: '0.02 ETH',
  },
  {
    id: 5,
    name: 'Diamond Legend',
    emoji: '✨',
    xpRequired: 50000,
    color: '#CE93D8',
    accent: '#F3E5F5',
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
export const DEMO_PLAYER_XP = 2140;
