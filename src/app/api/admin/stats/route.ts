import { prisma } from '@/lib/prisma';
import { requireUser, jsonOk } from '@/lib/api-utils';

export async function GET() {
  const { error } = await requireUser('ADMIN');
  if (error) return error;

  const [userCount, deposits, withdrawals, bets, users, recentBets] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.aggregate({ where: { type: 'DEPOSIT' }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { type: 'WITHDRAW' }, _sum: { amount: true } }),
    prisma.bet.aggregate({ _sum: { amount: true, payout: true }, _count: true }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, email: true, username: true, balance: true, role: true, createdAt: true, isBlocked: true } }),
    prisma.bet.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { username: true } }, game: { select: { name: true } } } }),
  ]);

  const totalWagered = bets._sum.amount ?? 0;
  const totalPayout = bets._sum.payout ?? 0;
  const ggr = totalWagered - totalPayout;

  return jsonOk({
    stats: {
      totalUsers: userCount,
      totalDeposits: deposits._sum.amount ?? 0,
      totalWithdrawals: withdrawals._sum.amount ?? 0,
      totalBets: bets._count,
      totalWagered,
      ggr,
      activeUsers: userCount,
      retention: 68.4,
    },
    recentUsers: users,
    recentBets,
    chartData: [
      { day: 'Mon', wagers: 1200, ggr: 180 },
      { day: 'Tue', wagers: 1800, ggr: 260 },
      { day: 'Wed', wagers: 1500, ggr: 210 },
      { day: 'Thu', wagers: 2200, ggr: 330 },
      { day: 'Fri', wagers: 2800, ggr: 420 },
      { day: 'Sat', wagers: 3400, ggr: 510 },
      { day: 'Sun', wagers: 3100, ggr: 465 },
    ],
  });
}
