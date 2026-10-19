import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b0f19 0%, #1e293b 100%)",
          borderRadius: "36px",
          border: "4px solid #3b82f6",
          position: "relative",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 25V8h16M8 12l6-4M8 17l10-7M8 8H5"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="20"
            y1="8"
            x2="20"
            y2="14"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="18" y="14" width="4.5" height="3.5" rx="1" fill="#fbbf24" />
          <circle cx="23.5" cy="23.5" r="5.5" fill="#10b981" />
          <path
            d="M21.5 23.5l1.5 1.5 3-3"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
