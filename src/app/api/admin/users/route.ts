import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonOk, sanitizeUser } from '@/lib/api-utils';

export async function GET() {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      balance: true,
      xp: true,
      loyaltyLevel: true,
      totalWagered: true,
      totalWon: true,
      isBlocked: true,
      createdAt: true,
    },
  });

  return jsonOk({ users });
}

export async function PATCH(request: Request) {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const body = await request.json();
  const { userId, balance, isBlocked } = body as {
    userId?: string;
    balance?: number;
    isBlocked?: boolean;
  };

  if (!userId) return jsonError('userId required');

  const data: { balance?: number; isBlocked?: boolean } = {};
  if (typeof balance === 'number') data.balance = balance;
  if (typeof isBlocked === 'boolean') data.isBlocked = isBlocked;

  const user = await prisma.user.update({ where: { id: userId }, data });
  return jsonOk({ user: sanitizeUser(user) });
}
