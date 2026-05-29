import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const games = await prisma.game.findMany({ orderBy: { name: 'asc' } });
  return jsonOk({ games });
}

export async function PATCH(request: Request) {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const body = await request.json();
  const { gameId, isActive, rtp, category } = body as {
    gameId?: string;
    isActive?: boolean;
    rtp?: number;
    category?: string;
  };

  if (!gameId) return jsonError('gameId required');

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      ...(typeof rtp === 'number' ? { rtp } : {}),
      ...(category ? { category } : {}),
    },
  });

  return jsonOk({ game });
}
