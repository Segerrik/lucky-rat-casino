import { PAYLINE_COUNT, PAYLINES } from './paylines';

export { PAYLINE_COUNT };

export type SymbolId =
  | 'kristina'
  | 'krisanna'
  | 'kristaliy'
  | 'porsche'
  | 'wild'
  | 'bonus'
  | 'trap';

export interface SlotSymbolDef {
  id: SymbolId;
  name: string;
  image: string;
  weight: number;
  pays: Partial<Record<3 | 4 | 5, number>>;
  isWild?: boolean;
  isBonus?: boolean;
  isTrap?: boolean;
}

export const SLOT_RTP = 97;
export const FREE_SPIN_COUNT = 10;
export const FREE_SPIN_MULTIPLIER = 2;

export const SYMBOLS: Record<SymbolId, SlotSymbolDef> = {
  kristina: {
    id: 'kristina',
    name: 'Kristina',
    image: '/slots/kristina.png',
    weight: 2,
    pays: { 3: 50, 4: 150, 5: 450 },
  },
  krisanna: {
    id: 'krisanna',
    name: 'Krisanna',
    image: '/slots/krisanna.png',
    weight: 4,
    pays: { 3: 15, 4: 40, 5: 100 },
  },
  kristaliy: {
    id: 'kristaliy',
    name: 'Kristaliy',
    image: '/slots/kristaliy.png',
    weight: 6,
    pays: { 3: 8, 4: 20, 5: 50 },
  },
  porsche: {
    id: 'porsche',
    name: 'Porsche',
    image: '/slots/porsche.jfif',
    weight: 12,
    pays: { 3: 3, 4: 6, 5: 10 },
  },
  wild: {
    id: 'wild',
    name: 'WILD',
    image: '/slots/wild.jfif',
    weight: 3,
    pays: {},
    isWild: true,
  },
  bonus: {
    id: 'bonus',
    name: 'BONUS',
    image: '/slots/bonus.png',
    weight: 3,
    pays: {},
    isBonus: true,
  },
  trap: {
    id: 'trap',
    name: 'Trap',
    image: '/slots/trap.jfif',
    weight: 28,
    pays: {},
    isTrap: true,
  },
};

const SPIN_SYMBOLS = Object.values(SYMBOLS);

/** grid[col][row] — 5 columns × 3 rows */
export type SlotGrid = SymbolId[][];

export interface LineWin {
  lineIndex: number;
  positions: { col: number; row: number }[];
  symbol: SymbolId;
  count: 3 | 4 | 5;
  multiplier: number;
  payoutEth: number;
}

export type WinTier = 'none' | 'win' | 'big' | 'mega';

export interface SpinResult {
  grid: SlotGrid;
  lineWins: LineWin[];
  totalMultiplier: number;
  payoutEth: number;
  winTier: WinTier;
  bonusCount: number;
  triggeredFreeSpins: boolean;
}

function pickWeighted(rng: () => number): SymbolId {
  const total = SPIN_SYMBOLS.reduce((s, sym) => s + sym.weight, 0);
  let roll = rng() * total;
  for (const sym of SPIN_SYMBOLS) {
    roll -= sym.weight;
    if (roll <= 0) return sym.id;
  }
  return 'trap';
}

export function generateGrid(rng: () => number = Math.random): SlotGrid {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 3 }, () => pickWeighted(rng)),
  );
}

function isPayingSymbol(id: SymbolId): id is Exclude<SymbolId, 'wild' | 'bonus' | 'trap'> {
  return id !== 'wild' && id !== 'bonus' && id !== 'trap';
}

function evaluatePayline(
  grid: SlotGrid,
  lineIndex: number,
  betEth: number,
): LineWin | null {
  const pattern = PAYLINES[lineIndex];
  const cells = pattern.map((row, col) => ({ col, row, id: grid[col][row] }));

  let target: SymbolId | null = null;
  for (const cell of cells) {
    if (cell.id === 'bonus' || cell.id === 'trap') continue;
    if (cell.id === 'wild') continue;
    target = cell.id;
    break;
  }

  if (!target) {
    const allWild = cells.every((c) => c.id === 'wild');
    if (allWild) target = 'kristina';
    else return null;
  }

  let count = 0;
  const positions: { col: number; row: number }[] = [];
  for (const cell of cells) {
    if (cell.id === target || cell.id === 'wild') {
      count++;
      positions.push({ col: cell.col, row: cell.row });
    } else break;
  }

  if (count < 3) return null;

  const payCount = (count >= 5 ? 5 : count >= 4 ? 4 : 3) as 3 | 4 | 5;
  const symDef = SYMBOLS[target];
  const lineMult = symDef.pays[payCount];
  if (!lineMult) return null;

  const lineBet = betEth / PAYLINE_COUNT;
  const payoutEth = lineMult * lineBet;

  return {
    lineIndex,
    positions: positions.slice(0, payCount),
    symbol: target,
    count: payCount,
    multiplier: lineMult,
    payoutEth,
  };
}

export function countBonusSymbols(grid: SlotGrid): number {
  let n = 0;
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < 3; row++) {
      if (grid[col][row] === 'bonus') n++;
    }
  }
  return n;
}

export function evaluateGrid(grid: SlotGrid, betEth: number): LineWin[] {
  const wins: LineWin[] = [];
  for (let i = 0; i < PAYLINES.length; i++) {
    const win = evaluatePayline(grid, i, betEth);
    if (win) wins.push(win);
  }
  return wins;
}

export function getWinTier(totalMultiplier: number): WinTier {
  if (totalMultiplier <= 0) return 'none';
  if (totalMultiplier >= 100) return 'mega';
  if (totalMultiplier >= 50) return 'big';
  return 'win';
}

function computeResult(grid: SlotGrid, betEth: number, winMultiplier = 1): SpinResult {
  const lineWins = evaluateGrid(grid, betEth);
  const basePayout = lineWins.reduce((s, w) => s + w.payoutEth, 0);
  const payoutEth = basePayout * winMultiplier;
  const totalMultiplier = betEth > 0 ? payoutEth / betEth : 0;
  const bonusCount = countBonusSymbols(grid);

  return {
    grid,
    lineWins,
    totalMultiplier,
    payoutEth,
    winTier: getWinTier(totalMultiplier),
    bonusCount,
    triggeredFreeSpins: bonusCount >= 3,
  };
}

/** Rejection sampling toward ~97% RTP */
export function spinSlot(
  betEth: number,
  rng: () => number = Math.random,
  winMultiplier = 1,
): SpinResult {
  const targetRtp = SLOT_RTP / 100;
  let grid = generateGrid(rng);
  let result = computeResult(grid, betEth, winMultiplier);

  for (let i = 0; i < 50; i++) {
    const rtp = result.payoutEth > 0 ? result.payoutEth / betEth : 0;
    const accept =
      result.payoutEth === 0
        ? rng() > targetRtp
        : rtp <= targetRtp * 1.4 || rng() < 0.32;
    if (accept) break;
    grid = generateGrid(rng);
    result = computeResult(grid, betEth, winMultiplier);
  }

  return result;
}

export function getWinningCells(lineWins: LineWin[]): Set<string> {
  const set = new Set<string>();
  for (const win of lineWins) {
    for (const pos of win.positions) {
      set.add(`${pos.col}-${pos.row}`);
    }
  }
  return set;
}

export const PAYTABLE_ROWS = (
  ['kristina', 'krisanna', 'kristaliy', 'porsche'] as const
).map((id) => ({
  ...SYMBOLS[id],
  pays: SYMBOLS[id].pays,
}));
