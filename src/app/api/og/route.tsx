import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title")?.slice(0, 100) || "YUGA — GMC Kozhikode Union";
    const subtitle =
      searchParams.get("subtitle")?.slice(0, 160) ||
      "Government Medical College, Kozhikode • Kerala, India";
    const badge = searchParams.get("badge")?.toUpperCase().slice(0, 40) || "OFFICIAL UNION PORTAL";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 80px",
            background: "linear-gradient(135deg, #07111e 0%, #0d1e35 55%, #05261e 100%)",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle glowing ambient lights */}
          <div
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-100px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, transparent 70%)",
            }}
          />

          {/* Top Bar: Brand, Emblem & Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "#07111e",
                  fontWeight: 900,
                  fontSize: "26px",
                  boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
                }}
              >
                Y
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    color: "#fef3c7",
                  }}
                >
                  YUGA
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "#94a3b8",
                  }}
                >
                  GMC KOZHIKODE UNION 2026–27
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: "9999px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#6ee7b7",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              {badge}
            </div>
          </div>

          {/* Middle: Main Title & Subtitle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              zIndex: 1,
              maxWidth: "1040px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? "52px" : "64px",
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#ffffff",
                margin: 0,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                fontWeight: 400,
                lineHeight: 1.4,
                color: "#cbd5e1",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Bar: Institutional Accreditation & Verified URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid rgba(148, 163, 184, 0.2)",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 500 }}>
                Calicut Medical College • KUHS Affiliated
              </span>
              <span style={{ fontSize: "16px", color: "#64748b" }}>•</span>
              <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 500 }}>
                Est. 1957
              </span>
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "0.03em",
              }}
            >
              yugacollegeunion.co.in
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    return new Response(`Failed to generate OpenGraph image: ${error?.message}`, {
      status: 500,
    });
  }
}
