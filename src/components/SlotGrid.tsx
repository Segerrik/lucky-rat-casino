'use client';

import { motion } from 'framer-motion';

const SYMBOLS = ['🐀', '🧀', '🪙', '🪤', '👑'];

interface SlotGridProps {
  grid: string[][];
  spinning?: boolean;
  winCells?: Set<string>;
}

export function SlotGrid({ grid, spinning, winCells }: SlotGridProps) {
  return (
    <div className="lr-slot-grid">
      {grid.map((col, colIdx) => (
        <div key={colIdx} className="lr-slot-col">
          {col.map((sym, rowIdx) => {
            const key = `${colIdx}-${rowIdx}`;
            const isWin = winCells?.has(key);
            return (
              <motion.div
                key={key}
                className={`lr-slot-cell ${isWin ? 'lr-slot-cell--win' : ''}`}
                animate={spinning ? { y: [0, -24, 0] } : {}}
                transition={spinning ? { duration: 0.2, repeat: Infinity } : {}}
              >
                {sym}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function randomGrid(): string[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]),
  );
}

export { SYMBOLS };
