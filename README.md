# Lucky Rat Casino — Full-Stack MVP

Original rat-themed crypto casino demo with Next.js, Prisma, SQLite, JWT auth, games, loyalty, and admin panel.

> **Demo only** — game outcomes and payments are mocked. Not production gambling infrastructure.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS + custom CSS, Framer Motion, Zustand
- **Backend:** Next.js API Routes
- **Database:** Prisma ORM + SQLite
- **Auth:** Email/password + JWT (httpOnly cookie)
- **Web3 (optional):** RainbowKit + wagmi for Sepolia testnet deposits

## Quick Start

```bash
npm install
cp .env.example .env
npm run db:setup    # prisma db push + seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:push      # Sync schema to SQLite
npm run db:seed      # Seed demo data
npm run db:setup     # Push + seed
```

## Design

Dark grey/silver UI with neon green (#9dff57) and gold (#F4C542) accents. Rat mascot theme with cheese loyalty progress.

## Notes

- Slot and betting results use **mock random logic** (~97% RTP target for slots)
- No real crypto payments — wallet deposit/withdraw updates local DB balance only
- Web3 wallet connect still available for Sepolia on-chain casino features
