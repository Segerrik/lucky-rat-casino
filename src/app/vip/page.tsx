'use client';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CasinoShell } from '@/components/CasinoShell';
import {
  DEMO_PLAYER_XP,
  VIP_LEVELS,
  getVipProgress,
  type VipLevel,
} from '@/lib/vipLevels';
import { CheeseProgress } from '@/components/CheeseProgress';

function LevelCard({
  level,
  isCurrent,
  isUnlocked,
}: {
  level: VipLevel;
  isCurrent: boolean;
  isUnlocked: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: level.id * 0.08 }}
      style={{
        background: isCurrent
          ? `linear-gradient(145deg, #1E1E1E 0%, #2A2A2A 100%)`
          : '#1E1E1E',
        border: isCurrent ? `2px solid ${level.color}` : '1px solid #2A2A2A',
        borderRadius: '20px',
        padding: '24px',
        opacity: isUnlocked ? 1 : 0.55,
        boxShadow: isCurrent ? `0 0 32px ${level.color}33` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: level.color,
            background: `${level.color}22`,
            padding: '4px 10px',
            borderRadius: '20px',
          }}
        >
          Your rank
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `${level.color}22`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}
        >
          {level.emoji}
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#7D7D7D', marginBottom: '4px' }}>Tier {level.id}</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: level.accent }}>{level.name}</div>
          <div style={{ fontSize: '12px', color: '#7D7D7D', marginTop: '2px' }}>
            {level.xpRequired === 0 ? 'Starting rank' : `${level.xpRequired.toLocaleString()} XP`}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ background: '#2A2A2A', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#7D7D7D', marginBottom: '4px' }}>Rakeback</div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: level.color }}>{level.rakeback}</div>
        </div>
        <div style={{ background: '#2A2A2A', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#7D7D7D', marginBottom: '4px' }}>Weekly bonus</div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>{level.weeklyBonus}</div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {level.perks.map((perk) => (
          <li
            key={perk}
            style={{
              fontSize: '13px',
              color: '#BFC3C9',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: level.color }}>✓</span>
            {perk}
          </li>
        ))}
      </ul>

      {!isUnlocked && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#7D7D7D',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          🔒 Play more to unlock
        </div>
      )}
    </motion.div>
  );
}

export default function VipClubPage() {
  const { isConnected } = useAccount();
  const xp = DEMO_PLAYER_XP;
  const progress = getVipProgress(xp);
  const current = progress.current;

  return (
    <CasinoShell>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #1E1E1E 0%, #2a2418 50%, #1E1E1E 100%)',
            border: '1px solid #F4C542',
            borderRadius: '24px',
            padding: '40px 48px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 0 48px rgba(244, 197, 66, 0.12)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                color: '#F4C542',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '12px',
                fontWeight: '700',
              }}
            >
              👑 VIP Club
            </div>
            <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#fff', marginBottom: '12px', lineHeight: 1.1 }}>
              Climb the Rat Ranks
            </h1>
            <p style={{ fontSize: '16px', color: '#7D7D7D', maxWidth: '480px' }}>
              Earn XP with every bet. Rise from Street Rat to Lucky Rat Legend and unlock rakeback,
              weekly cheese bonuses, and exclusive perks.
            </p>
          </div>
          <div style={{ fontSize: '96px', lineHeight: 1 }}>🐀</div>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '64px 32px',
              background: '#1E1E1E',
              borderRadius: '20px',
              border: '1px solid #2A2A2A',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              Connect to track your rank
            </h2>
            <p style={{ fontSize: '15px', color: '#7D7D7D', marginBottom: '28px' }}>
              Link your wallet to see XP progress and claim VIP rewards
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectButton />
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#1E1E1E',
                border: `1px solid ${current.color}`,
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '40px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '8px' }}>Current rank</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '40px' }}>{current.emoji}</span>
                    <div>
                      <div style={{ fontSize: '28px', fontWeight: '900', color: current.accent }}>{current.name}</div>
                      <div style={{ fontSize: '14px', color: '#7D7D7D' }}>Tier {current.id} of {VIP_LEVELS.length}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '4px' }}>Total XP</div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#F4C542' }}>{xp.toLocaleString()}</div>
                </div>
              </div>

              {progress.next ? (
                <>
                  <div style={{ marginTop: '28px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#7D7D7D' }}>
                      Progress to <span style={{ color: progress.next.accent }}>{progress.next.emoji} {progress.next.name}</span>
                    </span>
                    <span style={{ color: '#BFC3C9', fontWeight: '600' }}>{progress.percent}%</span>
                  </div>
                  <CheeseProgress filledCount={current.id} total={VIP_LEVELS.length} />
                  <div style={{ fontSize: '12px', color: '#7D7D7D', marginTop: '8px' }}>
                    {progress.xpInTier.toLocaleString()} / {progress.xpNeeded.toLocaleString()} XP to next tier
                  </div>
                </>
              ) : (
                <div
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(224, 64, 251, 0.1)',
                    borderRadius: '12px',
                    color: '#EA80FC',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  🎉 Maximum rank achieved — you rule the sewer!
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
                {VIP_LEVELS.map((level) => (
                  <div
                    key={level.id}
                    title={level.name}
                    style={{
                      flex: 1,
                      minWidth: '48px',
                      textAlign: 'center',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      background: level.id <= current.id ? `${level.color}22` : '#2A2A2A',
                      border: level.id === current.id ? `1px solid ${level.color}` : '1px solid transparent',
                    }}
                  >
                    <div style={{ fontSize: '20px' }}>{level.emoji}</div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: level.id <= current.id ? level.accent : '#7D7D7D',
                        marginTop: '4px',
                        fontWeight: level.id === current.id ? '700' : '400',
                      }}
                    >
                      {level.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
              All Rat Ranks
            </h2>
            <div className="vip-cards-grid" style={{ marginBottom: '40px' }}>
              {VIP_LEVELS.map((level) => (
                <LevelCard
                  key={level.id}
                  level={level}
                  isCurrent={level.id === current.id}
                  isUnlocked={xp >= level.xpRequired}
                />
              ))}
            </div>

            <div
              style={{
                background: '#1E1E1E',
                border: '1px solid #2A2A2A',
                borderRadius: '20px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
                How to earn XP
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { icon: '🪙', title: 'Coin Flip bets', desc: '1 XP per 0.001 ETH wagered' },
                  { icon: '🎯', title: 'Daily missions', desc: 'Up to 200 XP per day' },
                  { icon: '🎁', title: 'Promotions', desc: 'Bonus XP on events' },
                  { icon: '👥', title: 'Referrals', desc: '500 XP per active friend' },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      background: '#2A2A2A',
                      borderRadius: '14px',
                      padding: '20px',
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: '#7D7D7D' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </CasinoShell>
  );
}
