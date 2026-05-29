# Lucky Rat Casino — Full-Stack MVP

Original rat-themed crypto casino demo with Next.js, Prisma, PostgreSQL, JWT auth, games, loyalty, and admin panel.

> **Demo only** — game outcomes and payments are mocked. Not production gambling infrastructure.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS + custom CSS, Framer Motion, Zustand
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + PostgreSQL (Neon on Vercel)
- **Auth:** Email/password + JWT (httpOnly cookie)
- **Web3 (optional):** RainbowKit + wagmi for Sepolia testnet deposits

## Quick Start (Local)

```bash
npm install
cp .env.example .env
# Set DATABASE_URL to your Neon PostgreSQL connection string
npm run db:setup    # prisma migrate deploy + seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Vercel + Neon Setup

1. Create a [Neon](https://neon.tech) project and copy the **PostgreSQL** connection string.
2. In Vercel → Project → Settings → Environment Variables, add:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon connection string (`postgresql://...?sslmode=require`) |
| `JWT_SECRET` | Long random string for signing session JWTs |

3. Deploy — the build runs `prisma migrate deploy` automatically.
4. Seed demo data once (from your machine with production env, or Neon SQL console):

```bash
npx vercel env pull .env.production.local --environment=production
# Load DATABASE_URL from that file, then:
npm run db:seed
```

Or run the full setup locally against Neon:

```bash
npm run db:setup
```

## Demo Accounts

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@luckyrat.casino    | Admin123!  |
| User  | user@luckyrat.casino     | User123!   |

## Main Routes

| Page | URL |
|------|-----|
| Casino Lobby | `/` |
| Login / Register | `/login`, `/register` |
| Profile | `/profile` |
| Wallet | `/wallet` |
| Loyalty | `/loyalty` |
| Crypto Bets | `/bets` |
| Lucky Rat Slot | `/games/lucky-rat-slot` |
| Cheese Heist | `/games/cheese-heist` |
| Kristina Slot | `/slots` |
| Admin Panel | `/admin` |

## Loyalty Levels

1. Sewer Rat
2. Street Rat
3. Cheese Hunter
4. Golden Rat
5. Rat King

Progress shown with cheese pieces 🧀

## API Endpoints

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/user/me` — Current user
- `POST /api/wallet/deposit` — Mock deposit
- `POST /api/wallet/withdraw` — Mock withdraw
- `GET /api/wallet/transactions` — Transaction history
- `GET /api/games/list` — Active games
- `POST /api/games/play-slot` — Play slot (demo RNG)
- `POST /api/bets/place` — Place crypto bet
- `GET /api/bets/history` — Bet history
- `GET /api/loyalty/status` — Loyalty info
- `GET /api/admin/stats` — Admin dashboard
- `GET/PATCH /api/admin/users` — User management
- `GET/PATCH /api/admin/games` — Game management
- `GET /api/admin/transactions` — All transactions
- `GET/PATCH /api/admin/loyalty` — Loyalty settings

## Database Schema

See `prisma/schema.prisma` — models: `User`, `Game`, `Bet`, `Transaction`, `LoyaltyLevel`

Migrations live in `prisma/migrations/`. Production deploys apply them via `prisma migrate deploy`.

## Scripts

```bash
npm run dev          # Development server
npm run build        # migrate deploy + production build
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema without migrations (dev only)
npm run db:seed      # Seed demo data
npm run db:setup     # migrate deploy + seed
```

## Design

Dark grey/silver UI with neon green (#9dff57) and gold (#F4C542) accents. Rat mascot theme with cheese loyalty progress.

## Notes

- Slot and betting results use **mock random logic** (~97% RTP target for slots)
- No real crypto payments — wallet deposit/withdraw updates local DB balance only
- Web3 wallet connect still available for Sepolia on-chain casino features
