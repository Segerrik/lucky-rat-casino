import { prisma } from '@/lib/prisma';
import {
  requireUser,
  jsonError,
  jsonOk,
  sanitizeUser,
  xpFromWager,
  applyLoyaltyLevel,
} from '@/lib/api-utils';

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const { marketId, marketTitle, amount, odds } = body as {
    marketId?: string;
    marketTitle?: string;
    amount?: number;
    odds?: number;
  };

  if (!marketId || !amount || !odds || amount <= 0 || odds <= 1) {
    return jsonError('Invalid bet');
  }
  if (user!.balance < amount) return jsonError('Insufficient balance');

  const won = Math.random() < 1 / odds;
  const payout = won ? amount * odds : 0;
  const newXp = user!.xp + xpFromWager(amount);

  await prisma.user.update({
    where: { id: user!.id },
    data: {
      balance: user!.balance - amount + payout,
      totalWagered: { increment: amount },
      totalWon: { increment: payout },
      xp: newXp,
    },
  });

  await applyLoyaltyLevel(user!.id, newXp);

  const bet = await prisma.bet.create({
    data: {
      userId: user!.id,
      marketId,
      type: 'crypto',
      amount,
      multiplier: odds,
      result: won ? 'WIN' : 'LOSE',
      payout,
      metadata: marketTitle ?? marketId,
    },
  });

  const freshUser = await prisma.user.findUnique({ where: { id: user!.id } });
  return jsonOk({ bet, won, payout, user: sanitizeUser(freshUser!) });
}
