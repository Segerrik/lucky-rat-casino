import { prisma } from '@/lib/prisma';
import {
  requireUser,
  jsonError,
  jsonOk,
  sanitizeUser,
  calculateSlotWin,
  xpFromWager,
  applyLoyaltyLevel,
} from '@/lib/api-utils';

/** Demo slot play — random mock results, not provably fair */
export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const { gameSlug, amount } = body as { gameSlug?: string; amount?: number };
  if (!gameSlug || !amount || amount <= 0) return jsonError('Invalid request');
  if (user!.balance < amount) return jsonError('Insufficient balance');

  const game = await prisma.game.findUnique({ where: { slug: gameSlug } });
  if (!game || !game.isActive) return jsonError('Game not found', 404);

  const { won, multiplier, payout } = calculateSlotWin(amount, game.rtp / 100);
  const newXp = user!.xp + xpFromWager(amount);

  const updated = await prisma.user.update({
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
      gameId: game.id,
      type: 'slot',
      amount,
      multiplier,
      result: won ? 'WIN' : 'LOSE',
      payout,
    },
  });

  const freshUser = await prisma.user.findUnique({ where: { id: user!.id } });

  return jsonOk({
    bet,
    result: { won, multiplier, payout },
    user: sanitizeUser(freshUser!),
  });
}
