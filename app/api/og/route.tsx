import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export async function GET() {
  const [geistRegular, geistBold] = await Promise.all([
    readFile(
      join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf")
    ),
    readFile(
      join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf")
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0f0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "Geist",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Pine-tree logomark — inline SVG paths work in Satori */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <polygon points="16,2 28,22 4,22" fill="#00D26A" opacity="0.9" />
            <polygon points="16,10 26,26 6,26" fill="#00D26A" opacity="0.6" />
            <rect x="13" y="26" width="6" height="4" rx="1" fill="#00D26A" opacity="0.5" />
          </svg>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#fafafa",
            }}
          >
            Fore<span style={{ color: "#00D26A" }}>stock</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 0.93,
              letterSpacing: "-0.03em",
              maxWidth: "700px",
            }}
          >
            Know before you stock out.
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#6b7280",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            Exact stockout dates · Reorder quantities · Revenue at risk
          </div>
        </div>

        {/* Mock forecast card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            background: "#111614",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            overflow: "hidden",
            width: "420px",
            position: "absolute",
            right: "72px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "#0d1210",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "9999px",
                  background: "#00D26A",
                }}
              />
              <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "Geist" }}>
                Forecast report
              </span>
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "#6b7280",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "3px 10px",
                borderRadius: "4px",
              }}
            >
              Live analysis
            </span>
          </div>

          {/* Alert row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 18px",
              background: "rgba(239,68,68,0.04)",
              borderBottom: "1px solid rgba(239,68,68,0.08)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                background: "#ef4444",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "13px", color: "#9ca3af", flex: 1 }}>
              <span style={{ fontWeight: 600, color: "#f87171" }}>Premium Yoga Mat</span>
              {" — stockout in "}
              <span style={{ fontWeight: 600, color: "#00D26A" }}>4 days</span>
            </span>
          </div>

          {/* Product rows */}
          {[
            { name: "Premium Yoga Mat",    days: "4d",  loss: "$220", daysColor: "#f87171", lossColor: "#f87171" },
            { name: "Water Bottle XL",     days: "11d", loss: "$104", daysColor: "#fb923c", lossColor: "#fb923c" },
            { name: "Resistance Bands",    days: "29d", loss: null,   daysColor: "#6b7280", lossColor: "#00D26A" },
          ].map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <span style={{ fontSize: "13px", color: "#d1d5db" }}>{p.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {p.loss ? (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: p.lossColor }}>
                    {p.loss}
                  </span>
                ) : (
                  <span style={{ fontSize: "12px", color: "#00D26A" }}>Safe</span>
                )}
                <span style={{ fontSize: "12px", fontWeight: 600, color: p.daysColor }}>
                  {p.days}
                </span>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Order{" "}
              <span style={{ color: "#d1d5db", fontWeight: 600 }}>150 units of Yoga Mat</span>
              {" → covers demand through May 3"}
            </span>
          </div>
        </div>

        {/* Bottom left: URL */}
        <div
          style={{
            fontSize: "15px",
            color: "#374151",
            letterSpacing: "0.01em",
          }}
        >
          getforestock.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold,    weight: 700, style: "normal" },
      ],
    }
  );
}
