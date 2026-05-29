import { prisma } from '@/lib/prisma';
import { requireUser, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  const transactions = await prisma.transaction.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return jsonOk({ balance: user!.balance, transactions });
}
