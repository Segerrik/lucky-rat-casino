import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonOk, sanitizeUser } from '@/lib/api-utils';

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (error) return error;

  const body = await request.json();
  const { amount, currency = 'USDT' } = body as { amount?: number; currency?: string };
  if (!amount || amount <= 0) return jsonError('Invalid amount');
  if (user!.balance < amount) return jsonError('Insufficient balance');

  const updated = await prisma.user.update({
    where: { id: user!.id },
    data: { balance: { decrement: amount } },
  });

  await prisma.transaction.create({
    data: {
      userId: user!.id,
      type: 'WITHDRAW',
      currency,
      amount,
      status: 'COMPLETED',
    },
  });

  return jsonOk({ user: sanitizeUser(updated) });
}
