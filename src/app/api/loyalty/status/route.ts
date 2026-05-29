import { prisma } from '@/lib/prisma';
import { requireUser, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;

  const [levels, current] = await Promise.all([
    prisma.loyaltyLevel.findMany({ orderBy: { level: 'asc' } }),
    prisma.user.findUnique({ where: { id: user!.id } }),
  ]);

  const currentLevel = levels.find((l) => l.level === current!.loyaltyLevel) ?? levels[0];
  const nextLevel = levels.find((l) => l.level === current!.loyaltyLevel + 1) ?? null;

  return jsonOk({
    xp: current!.xp,
    loyaltyLevel: currentLevel,
    nextLevel,
    levels,
    totalWagered: current!.totalWagered,
  });
}
