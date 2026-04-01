// Inline SVG recreation of the StockSense logo mark.
// Uses a white rounded-square background so the navy S is visible on dark navbars/sidebars.

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* White rounded background */}
      <rect width="40" height="40" rx="9" fill="white" />

      {/* Upper bowl of S — thick arc from mid-left → upper-right */}
      <path
        d="M 8 22 C 8 6 36 4 36 14"
        stroke="#1B2B6E"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Lower bowl of S — thick arc from mid-right → lower-left */}
      <path
        d="M 32 18 C 32 34 4 36 4 26"
        stroke="#1B2B6E"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Green stock-chart trend line */}
      <polyline
        points="7,32 14,24 20,28 28,15 34,8"
        stroke="#00C27A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrow tip */}
      <path d="M34 8 L28 6 L30 13Z" fill="#00C27A" />
    </svg>
  );
}
