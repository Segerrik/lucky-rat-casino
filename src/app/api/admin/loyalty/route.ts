import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const levels = await prisma.loyaltyLevel.findMany({ orderBy: { level: 'asc' } });
  return jsonOk({ levels });
}

export async function PATCH(request: Request) {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const body = await request.json();
  const { level, minXp, cashbackPercent, weeklyBonusPercent, monthlyBonusPercent, name } = body as {
    level?: number;
    minXp?: number;
    cashbackPercent?: number;
    weeklyBonusPercent?: number;
    monthlyBonusPercent?: number;
    name?: string;
  };

  if (!level) return jsonError('level required');

  const updated = await prisma.loyaltyLevel.update({
    where: { level },
    data: {
      ...(typeof minXp === 'number' ? { minXp } : {}),
      ...(typeof cashbackPercent === 'number' ? { cashbackPercent } : {}),
      ...(typeof weeklyBonusPercent === 'number' ? { weeklyBonusPercent } : {}),
      ...(typeof monthlyBonusPercent === 'number' ? { monthlyBonusPercent } : {}),
      ...(name ? { name } : {}),
    },
  });

  return jsonOk({ level: updated });
}
