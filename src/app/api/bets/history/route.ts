import { prisma } from '@/lib/prisma';
import { requireUser, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  const bets = await prisma.bet.findMany({
    where: { userId: user!.id },
    include: { game: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return jsonOk({ bets });
}
