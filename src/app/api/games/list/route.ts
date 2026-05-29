import { prisma } from '@/lib/prisma';
import { jsonOk } from '@/lib/api-utils';

export async function GET() {
  const games = await prisma.game.findMany({
    orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
  });
  return jsonOk({ games });
}
