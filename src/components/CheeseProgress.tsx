'use client';

interface CheeseProgressProps {
  filledCount: number;
  total?: number;
}

export function CheeseProgress({ filledCount, total = 5 }: CheeseProgressProps) {
  return (
    <div className="cheese-progress" role="progressbar" aria-valuenow={filledCount} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`cheese-piece ${i < filledCount ? 'cheese-piece--active' : ''}`}
          aria-hidden
        />
      ))}
    </div>
  );
}
