'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DepositModal } from '@/components/DepositModal';

export function PrivateClubBanner() {
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '21 / 9',
          minHeight: '280px',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '36px',
          border: '1px solid rgba(244, 197, 66, 0.35)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Image
          src="/banners/private-club.png"
          alt="VIP rats playing board games at a private club table"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          sizes="(max-width: 1200px) 100vw, 1200px"
        />

        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Title */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            paddingTop: '28px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: 'rgba(244, 197, 66, 0.85)',
              marginBottom: '8px',
              fontWeight: '600',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            Lucky Rat · Members Only
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: '900',
              letterSpacing: '0.2em',
              color: '#F4C542',
              textShadow: '0 4px 24px rgba(0,0,0,0.9), 0 0 40px rgba(244, 197, 66, 0.3)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            PRIVATE CLUB
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.75)',
              marginTop: '12px',
              letterSpacing: '1px',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            Where the sharpest rats play table games after dark
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '28px',
            paddingTop: '120px',
          }}
        >
          <button
            type="button"
            onClick={() => setDepositOpen(true)}
            style={{
              padding: '14px 32px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F4C542, #c9a020)',
              color: '#121212',
              fontWeight: '800',
              fontSize: '14px',
              letterSpacing: '0.5px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            Enter VIP Club
          </button>
        </div>
      </motion.div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </>
  );
}
