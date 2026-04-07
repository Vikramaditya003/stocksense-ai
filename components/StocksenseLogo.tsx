// Forestock logo mark — pine tree + rising stock chart band.
// Two parallel green lines "cut through" the white tree, creating the chart effect.
// The lines are badge-green: invisible on green background, visible only on white tree.
// Scales cleanly from 16px favicon to 200px hero usage.

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
      {/* Green rounded-square badge */}
      <rect width="100" height="100" rx="22" fill="#22C55E" />

      {/* Dark border — inset so it never clips outside the badge bounds */}
      <rect
        x="3.5" y="3.5" width="93" height="93"
        rx="19"
        fill="none"
        stroke="#0D1F2D"
        strokeWidth="5"
      />

      {/* ── Pine tree ──────────────────────────────────────────────── */}
      {/* Trunk */}
      <rect x="43" y="75" width="14" height="10" rx="2" fill="white" />
      {/* Bottom tier — widest */}
      <polygon points="50,42 9,77 91,77" fill="white" />
      {/* Middle tier */}
      <polygon points="50,29 19,60 81,60" fill="white" />
      {/* Top tier — narrowest */}
      <polygon points="50,17 31,46 69,46" fill="white" />

      {/* ── Stock chart band ───────────────────────────────────────── */}
      {/* Two parallel zigzag lines using badge green — visible on white tree only,
          invisible on green badge background. Creates an "engraved" chart effect. */}

      {/* Lower line of the chart band */}
      <polyline
        points="14,70 31,53 45,63 63,39"
        stroke="#1ea854"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Upper line of the chart band — parallel to lower, ~8px above */}
      <polyline
        points="17,63 34,46 48,56 66,32"
        stroke="#1ea854"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Arrow ─────────────────────────────────────────────────── */}
      {/* Shaft extending northeast from end of upper line */}
      <line
        x1="66" y1="32" x2="77" y2="19"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Arrowhead — filled triangle, tip pointing northeast */}
      <polygon points="85,12 74,21 68,14" fill="white" />
    </svg>
  );
}
