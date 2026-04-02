// Inline SVG recreation of the StockSense logo mark.
// Navy bold-S (single thick stroke) + green trending-arrow line, white rounded bg.

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
      {/* White rounded-square background */}
      <rect width="100" height="100" rx="18" fill="white" />

      {/*
        Bold navy S — single cubic-bezier stroke.
        Starts upper-right, curves left across top,
        crosses to right at mid, curves left across bottom.
      */}
      <path
        d="M 68 18 C 68 10 18 10 18 30 C 18 50 82 50 82 70 C 82 90 32 90 32 82"
        stroke="#1B2B6E"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />

      {/* Green stock-chart trend line — lower-left to upper-right */}
      <polyline
        points="16,82  34,61  48,70  65,44  84,20"
        stroke="#1DB87A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Arrowhead at tip */}
      <path
        d="M84 20 L72 18 L76 30 Z"
        fill="#1DB87A"
      />
    </svg>
  );
}
