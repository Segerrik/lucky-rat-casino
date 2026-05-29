import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser(role?: 'USER' | 'ADMIN') {
  const session = await getSession();
  if (!session) return { error: jsonError('Unauthorized', 401), user: null };

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.isBlocked) {
    return { error: jsonError('Unauthorized', 401), user: null };
  }
  if (role && user.role !== role) {
    return { error: jsonError('Forbidden', 403), user: null };
  }
  return { error: null, user };
}

export function sanitizeUser(user: {
  id: string;
  email: string;
  username: string;
  role: string;
  balance: number;
  xp: number;
  loyaltyLevel: number;
  totalWagered: number;
  totalWon: number;
  isBlocked: boolean;
  createdAt: Date;
  passwordHash?: string;
}) {
  const { passwordHash: _pw, ...safe } = user;
  return { ...safe, createdAt: safe.createdAt.toISOString() };
}

/** Demo slot RTP ~97% — mock gambling logic, not production-ready */
export function calculateSlotWin(bet: number, rtp = 0.97): { won: boolean; multiplier: number; payout: number } {
  const roll = Math.random();
  if (roll > rtp) {
    return { won: false, multiplier: 0, payout: 0 };
  }
  const tiers = [
    { max: 0.55, mult: 0 },
    { max: 0.78, mult: 1.5 },
    { max: 0.9, mult: 3 },
    { max: 0.97, mult: 8 },
    { max: 0.995, mult: 25 },
    { max: 1, mult: 100 },
  ];
  const tierRoll = Math.random();
  const tier = tiers.find((t) => tierRoll <= t.max)!;
  const multiplier = tier.mult;
  return {
    won: multiplier > 0,
    multiplier,
    payout: bet * multiplier,
  };
}

export function xpFromWager(amount: number) {
  return Math.floor(amount * 10);
}

export async function applyLoyaltyLevel(userId: string, xp: number) {
  const levels = await prisma.loyaltyLevel.findMany({ orderBy: { level: 'desc' } });
  let level = 1;
  for (const l of levels) {
    if (xp >= l.minXp) {
      level = l.level;
      break;
    }
  }
  await prisma.user.update({ where: { id: userId }, data: { xp, loyaltyLevel: level } });
  return level;
}
