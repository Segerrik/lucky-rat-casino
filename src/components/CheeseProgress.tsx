'use client';

type CheeseState = 'filled' | 'partial' | 'empty';

interface CheeseProgressProps {
  filledCount: number;
  total?: number;
  /** 0–100 progress within the next tier (colors the partial wedge) */
  partialPercent?: number;
}

function CheeseWedge({ state }: { state: CheeseState }) {
  const fills = {
    filled: { body: '#FFC107', side: '#E6A800', hole: '#D4920A' },
    partial: { body: '#8B6914', side: '#6B5010', hole: '#5A440D' },
    empty: { body: '#2A2520', side: '#1E1A16', hole: '#151210' },
  };
  const c = fills[state];

  return (
    <svg
      className={`cheese-wedge cheese-wedge--${state}`}
      viewBox="0 0 32 28"
      width="32"
      height="28"
      aria-hidden
    >
      {/* 3D wedge side */}
      <path d="M4 22 L28 22 L28 26 L4 26 Z" fill={c.side} />
      {/* Main wedge face */}
      <path d="M4 22 L16 4 L28 22 Z" fill={c.body} />
      {/* Cheese holes */}
      <circle cx="13" cy="16" r="2.2" fill={c.hole} opacity="0.55" />
      <circle cx="19" cy="19" r="1.6" fill={c.hole} opacity="0.5" />
      <circle cx="16" cy="12" r="1.3" fill={c.hole} opacity="0.45" />
    </svg>
  );
}

export function CheeseProgress({
  filledCount,
  total = 5,
  partialPercent = 0,
}: CheeseProgressProps) {
  const showPartial = partialPercent > 0 && filledCount < total;

  return (
    <div
      className="cheese-progress"
      role="progressbar"
      aria-valuenow={filledCount}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => {
        let state: CheeseState = 'empty';
        if (i < filledCount) state = 'filled';
        else if (i === filledCount && showPartial) state = 'partial';
        return <CheeseWedge key={i} state={state} />;
      })}
    </div>
  );
}
