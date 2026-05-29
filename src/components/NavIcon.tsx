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

/** Sidebar icons — rat-themed casino motifs */
export function NavIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    home: (
      <svg {...iconProps}>
        <path d="M4 11 12 4l8 7" />
        <path d="M6 10v10h12V10" />
        <path d="M10 20v-5h4v5" />
        <path d="M9 8.5c0-1 .8-1.5 1.5-1.5h3C14.2 7 15 7.5 15 8.5" />
        <circle cx="12" cy="6" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
    casino: (
      <svg {...iconProps}>
        <rect x="5" y="6" width="14" height="14" rx="2" />
        <path d="M8 10v6M12 10v6M16 10v6" />
        <path d="M5 13h14" />
        <path d="M9 4.5 10 6h4l1-1.5" />
        <circle cx="12" cy="4" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
    slots: (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 9v6M12 9v6M16 9v6" />
        <path d="M4 12h16" />
        <path d="M7 20c1.5 1 8.5 1 10 0" />
        <circle cx="9" cy="3.5" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="15" cy="3.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
    promotions: (
      <svg {...iconProps}>
        <path d="M12 3 8 7h8l-4-4Z" />
        <rect x="6" y="7" width="12" height="10" rx="1.5" />
        <path d="M12 7v10" />
        <path d="M6 11h12" />
        <circle cx="12" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    ),
    vip: (
      <svg {...iconProps}>
        <path d="M5 16 3 8l4 2.5L12 5l5 5.5 4-2.5-2 8H5Z" />
        <path d="M5 16h14v2H5v-2Z" />
        <path d="M8.5 18.5c1 .5 6 .5 7 0" />
        <circle cx="12" cy="10" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
    missions: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
        <path d="M6.5 6.5 8 8M16 16l1.5 1.5M17.5 6.5 16 8M8 16l-1.5 1.5" />
      </svg>
    ),
    wallet: (
      <svg {...iconProps}>
        <ellipse cx="12" cy="14" rx="7" ry="4" />
        <path d="M5 14V9a7 4 0 0 1 14 0v5" />
        <circle cx="15" cy="14" r="1.25" fill="currentColor" stroke="none" />
        <path d="M8.5 7.5c.5-1 2-1.5 3.5-1.5s3 .5 3.5 1.5" />
        <path d="M10 18.5c1 .8 3 .8 4 0" />
      </svg>
    ),
  };

  return <span className="shell-nav-icon">{icons[name] ?? null}</span>;
}
