'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/store/authStore';

export function Toast() {
  const { message, type, visible, hide } = useToastStore();

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(hide, 3200);
    return () => clearTimeout(t);
  }, [visible, hide]);

  if (!visible) return null;

  return (
    <div className={`lr-toast lr-toast--${type}`} role="status">
      {message}
    </div>
  );
}
