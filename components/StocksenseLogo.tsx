// SVG recreation of the StockSense AI logo mark.
// Rising bar chart (3 columns) + S-curve shelf lines + upward arrow.
// Flat teal — no gradient, scales cleanly from 16px favicon to 200px OG image.

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
      {/*
        Three rising bar columns — left=short, mid=medium, right=tall.
        Columns are filled teal rectangles with rounded tops.
      */}
      <rect x="8"  y="62" width="18" height="32" rx="3" fill="#22C55E" opacity="0.55" />
      <rect x="32" y="44" width="18" height="50" rx="3" fill="#22C55E" opacity="0.75" />
      <rect x="56" y="24" width="18" height="70" rx="3" fill="#22C55E" />

      {/*
        S-curve shelf lines overlaid on left side of chart.
        Upper arc: sweeps left-to-right across top of short+mid bars.
        Lower arc: sweeps right-to-left across bottom area.
        These form the S-for-Stock shape.
      */}
      <path
        d="M 52 28 C 38 18 6 22 6 38 C 6 52 42 52 42 64 C 42 78 8 80 8 72"
        stroke="#22C55E"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/*
        Upward-right arrow — diagonal line + filled arrowhead.
        Originates from mid-chart, exits upper-right corner.
      */}
      <line
        x1="30" y1="72"
        x2="82" y2="14"
        stroke="#22C55E"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Arrowhead at (82, 14) pointing upper-right */}
      <polygon
        points="82,14  70,16  76,28"
        fill="#22C55E"
      />
    </svg>
  );
}
