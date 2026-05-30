import { cn } from "@/lib/utils";

/**
 * ABD Sourcing logomark — a forest-gradient badge with a needle-point "A"
 * monogram and a gold thread crossbar (apparel + precision). Self-contained
 * SVG so it scales crisply at any size and reuses the brand palette.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="abd-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#23664E" />
          <stop offset="1" stopColor="#123A2C" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#abd-badge)" />
      <rect
        x="0.6"
        y="0.6"
        width="62.8"
        height="62.8"
        rx="14.4"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="1.2"
      />
      {/* Needle-point "A" */}
      <path
        d="M19 45.5 L32 18 L45 45.5"
        fill="none"
        stroke="#F7F6F2"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gold thread crossbar */}
      <line
        x1="25.2"
        y1="38"
        x2="38.8"
        y2="38"
        stroke="#C9A227"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Gold needle eye at the apex */}
      <circle cx="32" cy="18" r="3.2" fill="#C9A227" />
    </svg>
  );
}
