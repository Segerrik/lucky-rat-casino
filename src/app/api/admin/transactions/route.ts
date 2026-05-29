import { prisma } from '@/lib/prisma';
import { requireUser, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { username: true, email: true } } },
  });

  return jsonOk({ transactions });
}
