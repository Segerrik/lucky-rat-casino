import type { ReactNode } from 'react';

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function NavIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    home: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    ),
    casino: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="8.5" cy="15.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    ),
    promotions: (
      <svg {...iconProps}>
        <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
        <path d="M12 3v6" />
        <path d="M8.5 9h7" />
        <path d="M12 3 9.5 9h5L12 3Z" />
        <path d="M7 12h10" />
      </svg>
    ),
    vip: (
      <svg {...iconProps}>
        <path d="M5 17 3 7l4.5 3L12 4l4.5 6L21 7l-2 10H5Z" />
        <path d="M5 17h14v2H5v-2Z" />
      </svg>
    ),
    missions: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    wallet: (
      <svg {...iconProps}>
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M17 13h4v2h-4a1 1 0 1 1 0-2Z" />
        <path d="M3 9h18" />
      </svg>
    ),
  };

  return <span className="shell-nav-icon">{icons[name] ?? null}</span>;
}
