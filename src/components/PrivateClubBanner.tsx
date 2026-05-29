'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const RATS = [
  { emoji: '🐀', role: 'Boss', x: '8%', scale: 1.1 },
  { emoji: '🐁', role: 'Dealer', x: '28%', scale: 1 },
  { emoji: '🐀', role: 'High Roller', x: '50%', scale: 1.15 },
  { emoji: '🐁', role: 'Whale', x: '72%', scale: 1 },
  { emoji: '🐀', role: 'VIP', x: '90%', scale: 1.05 },
];

export function PrivateClubBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '36px',
        minHeight: '280px',
        background: 'linear-gradient(180deg, #1a1208 0%, #0d0a06 40%, #121212 100%)',
        border: '1px solid rgba(244, 197, 66, 0.35)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(244, 197, 66, 0.15)',
      }}
    >
      {/* Ambient lights */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          left: '20%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(ellipse, rgba(244, 197, 66, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          paddingTop: '32px',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: 'rgba(244, 197, 66, 0.7)',
            marginBottom: '8px',
            fontWeight: '600',
          }}
        >
          Lucky Rat · Members Only
        </div>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: '900',
            letterSpacing: '0.2em',
            color: '#F4C542',
            textShadow: '0 4px 24px rgba(244, 197, 66, 0.4), 0 0 60px rgba(244, 197, 66, 0.2)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          PRIVATE CLUB
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(191, 195, 201, 0.6)',
            marginTop: '12px',
            letterSpacing: '1px',
          }}
        >
          Where the sharpest rats play table games after dark
        </p>
      </div>

      {/* Table scene */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '20px',
          height: '160px',
        }}
      >
        {/* Felt table */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(92%, 720px)',
            height: '100px',
            background: 'linear-gradient(180deg, #1b5e20 0%, #0d3d14 100%)',
            borderRadius: '120px 120px 16px 16px',
            border: '3px solid #2e7d32',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 2px 12px rgba(255,255,255,0.08)',
          }}
        >
          {/* Cards & chips on table */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: '8px',
              fontSize: '28px',
            }}
          >
            <span>🃏</span>
            <span>🎲</span>
            <span>♠️</span>
            <span>🪙</span>
            <span>🃏</span>
          </div>
        </div>

        {/* Rats around table */}
        {RATS.map((rat, i) => (
          <motion.div
            key={rat.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            style={{
              position: 'absolute',
              bottom: '48px',
              left: rat.x,
              transform: `translateX(-50%) scale(${rat.scale})`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '42px', lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
              {rat.emoji}
            </div>
            <div
              style={{
                fontSize: '8px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'rgba(244, 197, 66, 0.8)',
                marginTop: '4px',
                background: 'rgba(0,0,0,0.5)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {rat.role}
            </div>
          </motion.div>
        ))}

        {/* Chandelier */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '24px' }}>
          🕯️
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          paddingBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/vip"
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F4C542, #c9a020)',
            color: '#121212',
            fontWeight: '800',
            fontSize: '14px',
            textDecoration: 'none',
            letterSpacing: '0.5px',
          }}
        >
          Enter VIP Club
        </Link>
        <Link
          href="/casino"
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            border: '1px solid rgba(244, 197, 66, 0.5)',
            color: '#F4C542',
            fontWeight: '700',
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Play Casino →
        </Link>
      </div>
    </motion.div>
  );
}
