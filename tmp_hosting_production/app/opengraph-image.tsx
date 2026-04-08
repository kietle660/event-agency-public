import { ImageResponse } from "next/og";

export const alt = "TRONG THAI EVENT";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 50%, #c79b4b 100%)",
          color: "#fff",
          padding: "56px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "2px solid rgba(255,255,255,0.18)",
            borderRadius: "28px",
            padding: "42px",
            background: "rgba(17,24,39,0.35)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#f5deb3",
              }}
            >
              TRONG THAI EVENT
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "64px",
                fontWeight: 800,
                lineHeight: 1.1,
                maxWidth: "820px",
              }}
            >
              Giai phap to chuc su kien chuyen nghiep va tron goi
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "28px",
              color: "#e5e7eb",
            }}
          >
            <div style={{ display: "flex" }}>Hoi nghi • Khai truong • Team building</div>
            <div style={{ display: "flex", fontWeight: 700 }}>trongthaievent.vn</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
