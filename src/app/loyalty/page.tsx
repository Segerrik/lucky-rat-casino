'use client';

import { useEffect, useState } from 'react';
import { CasinoShell } from '@/components/CasinoShell';
import { LoyaltyProgressCheese } from '@/components/LoyaltyProgressCheese';
import type { LoyaltyLevelData } from '@/types';

export default function LoyaltyPage() {
  const [data, setData] = useState<{
    xp: number;
    loyaltyLevel: LoyaltyLevelData;
    nextLevel: LoyaltyLevelData | null;
    levels: LoyaltyLevelData[];
    totalWagered: number;
  } | null>(null);

  useEffect(() => {
    void fetch('/api/loyalty/status')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData);
  }, []);

  const filled = data?.loyaltyLevel.level ?? 1;
  const progressToNext = data?.nextLevel
    ? Math.min(100, ((data.xp - data.loyaltyLevel.minXp) / (data.nextLevel.minXp - data.loyaltyLevel.minXp)) * 100)
    : 100;

  return (
    <CasinoShell>
      <div className="page-container lr-loyalty">
        <h1>Loyalty Program</h1>
        <p className="lr-auth-sub">Climb from Sewer Rat to Rat King — progress shown in cheese pieces 🧀</p>

        {!data ? (
          <div className="lr-empty">Sign in to view your loyalty status</div>
        ) : (
          <>
            <div className="lr-card lr-loyalty-hero">
              <div className="lr-loyalty-level">{data.loyaltyLevel.name}</div>
              <LoyaltyProgressCheese filledCount={filled} />
              <p>{data.xp.toLocaleString()} XP · ${data.totalWagered.toFixed(2)} wagered</p>
              {data.nextLevel && (
                <div className="lr-progress-bar">
                  <div className="lr-progress-fill" style={{ width: `${progressToNext}%` }} />
                </div>
              )}
            </div>

            <div className="lr-loyalty-grid">
              {data.levels.map((level) => (
                <div key={level.level} className={`lr-card ${level.level === data.loyaltyLevel.level ? 'lr-card--active' : ''}`}>
                  <h3>{level.name}</h3>
                  <p>{level.minXp.toLocaleString()} XP required</p>
                  <ul>
                    <li>Cashback: {level.cashbackPercent}%</li>
                    <li>Weekly bonus: {level.weeklyBonusPercent}%</li>
                    <li>Monthly bonus: {level.monthlyBonusPercent}%</li>
                  </ul>
                  {level.level === 5 && <p className="lr-text-neon">Rat King exclusive perks & VIP tables</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </CasinoShell>
  );
}
