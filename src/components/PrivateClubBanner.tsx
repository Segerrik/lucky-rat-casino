'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DepositModal } from '@/components/DepositModal';

export function PrivateClubBanner() {
  const [depositOpen, setDepositOpen] = useState(false);

  return (
    <>
      <motion.section
        className="hero-banner"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Image
          src="/banners/private-club.png"
          alt="Lucky Rat private club — rats in tuxedos at the table"
          fill
          priority
          className="hero-banner-img"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="hero-banner-overlay" />

        <div className="hero-banner-content">
          <span className="hero-badge">
            <span className="live-dot" />
            Members Only · Live Now
          </span>

          <h1 className="hero-title">
            <span className="hero-title-line">The Private</span>
            <span className="hero-title-line hero-title-line--accent">Club</span>
          </h1>

          <p className="hero-description">
            Where the sharpest rats play table games after dark. Tailored tables, gold-tier rewards,
            and unhurried odds.
          </p>

          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => setDepositOpen(true)}>
              Enter VIP Club
            </button>
            <Link href="/casino" className="btn btn-secondary">
              Tour the Tables
            </Link>
          </div>
        </div>
      </motion.section>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </>
  );
}
