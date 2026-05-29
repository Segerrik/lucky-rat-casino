'use client';

import { useEffect, useState } from 'react';
import type { DbGame } from '@/types';

export function useLobbyGames() {
  const [games, setGames] = useState<DbGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/games/list');
        if (!res.ok) throw new Error('Failed to load games');
        const data = await res.json();
        if (!cancelled) {
          setGames(data.games ?? []);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Could not load games');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { games, loading, error, refetch: () => setLoading(true) };
}
