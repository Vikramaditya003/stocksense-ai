// StockSense AI logo mark — Option 1 style:
// Green rounded-square badge with a white rising sparkline (4 dots connected).
// Clean, high-contrast, scales perfectly from 16px favicon to 200px OG image.

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Green rounded-square badge background */}
      <rect width="100" height="100" rx="22" fill="#22C55E" />

      {/*
        White sparkline — 4 points rising left-to-right with one dip (realistic trend).
        Points: (16,72) → (36,52) → (56,62) → (78,22)
        Drawn as a polyline with rounded joins for smooth feel.
      */}
      <polyline
        points="16,72 36,48 56,60 78,22"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Dot at each data point for the "connected chart" look */}
      <circle cx="16" cy="72" r="5.5" fill="white" />
      <circle cx="36" cy="48" r="5.5" fill="white" />
      <circle cx="56" cy="60" r="5.5" fill="white" />
      <circle cx="78" cy="22" r="5.5" fill="white" />
    </svg>
  );
}
