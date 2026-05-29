export interface SlotSymbol {
  id: string;
  emoji: string;
  label: string;
  mult: number;
  weight: number;
}

export const SLOT_SYMBOLS: SlotSymbol[] = [
  { id: 'tux', emoji: '👔', label: 'Крыс в смокинге', mult: 15, weight: 1 },
  { id: 'blonde', emoji: '👱‍♀️', label: 'Крыса блондинка', mult: 10, weight: 2 },
  { id: 'brunette', emoji: '🥀', label: 'Крыса брюнетка', mult: 7, weight: 3 },
  { id: 'diamond', emoji: '💎', label: 'Бриллиант', mult: 5, weight: 5 },
  { id: 'champagne', emoji: '🥂', label: 'Шампанское', mult: 3, weight: 10 },
  { id: 'card', emoji: '🃏', label: 'Карта', mult: 2, weight: 14 },
  { id: 'coin', emoji: '🪙', label: 'Монета', mult: 1.5, weight: 22 },
];

export const SLOT_RTP = 97;

export type SlotGrid = SlotSymbol[][];

export interface WinLine {
  row: number;
  symbol: SlotSymbol;
  multiplier: number;
}

export type WinTier = 'none' | 'win' | 'big' | 'mega';

export interface SpinResult {
  grid: SlotGrid;
  winLines: WinLine[];
  totalMultiplier: number;
  payoutEth: number;
  isBigWin: boolean;
  winTier: WinTier;
}

export function getWinTier(totalMultiplier: number): WinTier {
  if (totalMultiplier <= 0) return 'none';
  if (totalMultiplier >= 15) return 'mega';
  if (totalMultiplier >= 7) return 'big';
  return 'win';
}

function pickWeighted(rng: () => number): SlotSymbol {
  const total = SLOT_SYMBOLS.reduce((s, sym) => s + sym.weight, 0);
  let roll = rng() * total;
  for (const sym of SLOT_SYMBOLS) {
    roll -= sym.weight;
    if (roll <= 0) return sym;
  }
  return SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1];
}

/** grid[col][row] — 3 columns × 3 rows */
export function generateGrid(rng: () => number = Math.random): SlotGrid {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => pickWeighted(rng)),
  );
}

export function evaluateGrid(grid: SlotGrid): WinLine[] {
  const lines: WinLine[] = [];
  for (let row = 0; row < 3; row++) {
    const a = grid[0][row];
    const b = grid[1][row];
    const c = grid[2][row];
    if (a.id === b.id && b.id === c.id) {
      lines.push({ row, symbol: a, multiplier: a.mult });
    }
  }
  return lines;
}

/** Tune toward ~97% RTP via rejection sampling on middle-line outcomes */
export function spinSlot(betEth: number, rng: () => number = Math.random): SpinResult {
  const targetRtp = SLOT_RTP / 100;
  let grid = generateGrid(rng);
  let winLines = evaluateGrid(grid);
  let totalMultiplier = winLines.reduce((s, l) => s + l.multiplier, 0);

  for (let i = 0; i < 40; i++) {
    const rtp = totalMultiplier > 0 ? totalMultiplier / 3 : 0;
    const accept =
      totalMultiplier === 0
        ? rng() > targetRtp
        : rtp <= targetRtp * 1.35 || rng() < 0.35;
    if (accept) break;
    grid = generateGrid(rng);
    winLines = evaluateGrid(grid);
    totalMultiplier = winLines.reduce((s, l) => s + l.multiplier, 0);
  }

  const payoutEth = betEth * totalMultiplier;
  const winTier = getWinTier(totalMultiplier);
  const isBigWin = winTier === 'big' || winTier === 'mega';

  return { grid, winLines, totalMultiplier, payoutEth, isBigWin, winTier };
}

export function buildWinningGrid(symbol: SlotSymbol, row = 1): SlotGrid {
  const grid = generateGrid();
  for (let col = 0; col < 3; col++) grid[col][row] = symbol;
  return grid;
}

export function buildLosingGrid(): SlotGrid {
  let grid = generateGrid();
  let attempts = 0;
  while (evaluateGrid(grid).length > 0 && attempts < 20) {
    grid = generateGrid();
    attempts++;
  }
  return grid;
}

export function gridForOutcome(won: boolean, betEth: number): SpinResult {
  if (won) {
    const symbol = SLOT_SYMBOLS[Math.floor(Math.random() * 3)];
    const grid = buildWinningGrid(symbol, 1);
    const winLines = evaluateGrid(grid);
    const totalMult = winLines.reduce((s, l) => s + l.multiplier, 0);
    const winTier = getWinTier(totalMult);
    return {
      grid,
      winLines,
      totalMultiplier: totalMult,
      payoutEth: betEth * totalMult,
      isBigWin: winTier === 'big' || winTier === 'mega',
      winTier,
    };
  }
  const grid = buildLosingGrid();
  return {
    grid,
    winLines: [],
    totalMultiplier: 0,
    payoutEth: 0,
    isBigWin: false,
    winTier: 'none',
  };
}
