import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0F1A13",
          backgroundImage:
            "radial-gradient(circle at 12% 10%, rgba(185,242,107,0.16), transparent 55%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#16241C",
              border: "1px solid rgba(185,242,107,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5L9.5 18L20 6"
                stroke="#B9F26B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 30, color: "#F2F5EF", fontWeight: 700 }}>Perqora</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 60, color: "#F2F5EF", fontWeight: 800, lineHeight: 1.05 }}>
            Your student email is worth more than you think.
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#9BAA9E" }}>
            Verified benefits, dated, not just claimed.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
