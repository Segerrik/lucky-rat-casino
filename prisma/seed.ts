import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const LOYALTY_LEVELS = [
  { level: 1, name: 'Sewer Rat', minXp: 0, cashbackPercent: 1, weeklyBonusPercent: 0.5, monthlyBonusPercent: 1 },
  { level: 2, name: 'Street Rat', minXp: 500, cashbackPercent: 2, weeklyBonusPercent: 1, monthlyBonusPercent: 2 },
  { level: 3, name: 'Cheese Hunter', minXp: 2000, cashbackPercent: 3, weeklyBonusPercent: 2, monthlyBonusPercent: 3 },
  { level: 4, name: 'Golden Rat', minXp: 6000, cashbackPercent: 5, weeklyBonusPercent: 3, monthlyBonusPercent: 5 },
  { level: 5, name: 'Rat King', minXp: 15000, cashbackPercent: 8, weeklyBonusPercent: 5, monthlyBonusPercent: 8 },
];

const GAMES = [
  { name: 'Lucky Rat Slot', slug: 'lucky-rat-slot', type: 'slot', category: 'Rat Originals', rtp: 97 },
  { name: 'Cheese Heist', slug: 'cheese-heist', type: 'slot', category: 'Slots', rtp: 96.5 },
  { name: 'The Private Club', slug: 'private-club', type: 'slot', category: 'Popular', rtp: 97 },
  { name: 'Kristina Slot', slug: 'kristina', type: 'slot', category: 'Popular', rtp: 97 },
  { name: 'Coin Flip', slug: 'coin-flip', type: 'instant', category: 'Rat Originals', rtp: 95 },
  { name: 'Crypto Line', slug: 'crypto-line', type: 'betting', category: 'Crypto Bets', rtp: 0 },
];

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@luckyrat.casino' } });
  if (existing) {
    console.log('Seed skipped — demo data already exists.');
    return;
  }

  console.log('Seeding Lucky Rat Casino...');

  await prisma.bet.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  await prisma.loyaltyLevel.deleteMany();

  for (const level of LOYALTY_LEVELS) {
    await prisma.loyaltyLevel.create({ data: level });
  }

  const adminHash = await bcrypt.hash('Admin123!', 10);
  const userHash = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@luckyrat.casino',
      passwordHash: adminHash,
      username: 'RatAdmin',
      role: 'ADMIN',
      balance: 10000,
      xp: 20000,
      loyaltyLevel: 5,
      totalWagered: 50000,
      totalWon: 42000,
    },
  });

  const demoUsers = await Promise.all(
    ['user@luckyrat.casino', 'demo1@luckyrat.casino', 'demo2@luckyrat.casino', 'demo3@luckyrat.casino', 'demo4@luckyrat.casino'].map(
      (email, i) =>
        prisma.user.create({
          data: {
            email,
            passwordHash: email === 'user@luckyrat.casino' ? userHash : adminHash,
            username: email.split('@')[0],
            balance: 1000 + i * 250,
            xp: [1200, 800, 3500, 7000, 16000][i],
            loyaltyLevel: [2, 2, 3, 4, 5][i],
            totalWagered: 500 + i * 1200,
            totalWon: 400 + i * 900,
          },
        }),
    ),
  );

  const games = await Promise.all(GAMES.map((g) => prisma.game.create({ data: g })));

  for (const user of [admin, ...demoUsers]) {
    await prisma.transaction.createMany({
      data: [
        { userId: user.id, type: 'DEPOSIT', currency: 'USDT', amount: 500, status: 'COMPLETED' },
        { userId: user.id, type: 'DEPOSIT', currency: 'ETH', amount: 0.5, status: 'COMPLETED' },
      ],
    });
  }

  for (const user of demoUsers.slice(0, 3)) {
    for (let i = 0; i < 5; i++) {
      const game = games[i % games.length];
      const amount = 10 + i * 5;
      const won = i % 2 === 0;
      await prisma.bet.create({
        data: {
          userId: user.id,
          gameId: game.id,
          type: game.type,
          amount,
          multiplier: won ? 2.5 : 0,
          result: won ? 'WIN' : 'LOSE',
          payout: won ? amount * 2.5 : 0,
        },
      });
    }
  }

  console.log('Seed complete.');
  console.log('Admin: admin@luckyrat.casino / Admin123!');
  console.log('User:  user@luckyrat.casino / User123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
