'use client';

interface LoyaltyProgressCheeseProps {
  filledCount: number;
  total?: number;
}

export function LoyaltyProgressCheese({ filledCount, total = 5 }: LoyaltyProgressCheeseProps) {
  return (
    <div className="lr-cheese-progress" aria-label={`Loyalty progress ${filledCount} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`lr-cheese-piece ${i < filledCount ? 'lr-cheese-piece--filled' : ''}`}>
          {i < filledCount ? '🧀' : '⬚'}
        </span>
      ))}
    </div>
  );
}
