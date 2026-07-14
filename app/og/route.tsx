import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Workbench";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function Home({ iconUrl }: { iconUrl: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        border: "1px solid white",

        background: "#0D0D0B",
        color: "#F0EDE6",

        padding: 70,
        fontFamily: "Plus Jakarta Sans",
      }}
    >
      {/* Blueprint Grid */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Blueprint Circle */}

      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: "1px solid rgba(233,180,76,.12)",
          right: -180,
          top: -120,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          borderRadius: "50%",
          border: "1px dashed rgba(255,255,255,.08)",
          right: -100,
          top: -40,
        }}
      />

      {/* Main Layout */}

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            width: 640,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "#E9B44C",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 8,
            }}
          >
            WORKBENCH
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 84,
              lineHeight: 0.92,
              fontWeight: 800,
            }}
          >
            Engineering
          </div>

          <div
            style={{
              fontSize: 84,
              lineHeight: 0.92,
              fontWeight: 800,
            }}
          >
            Everything.
          </div>

          <div
            style={{
              marginTop: 36,
              width: 620,
              fontSize: 30,
              color: "#BEB8AD",
              lineHeight: 1.5,
            }}
          >
            Your engineering operating system for projects, journals,
            architecture decisions, patterns and documentation.
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 45,
            }}
          >
            {["Projects", "Patterns", "Journal"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: "1px solid rgba(233,180,76,.25)",
                  color: "#E9B44C",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 70,
              fontSize: 18,
              color: "#7A756D",
            }}
          >
            <span>Projects · 14</span>
            <span>Patterns · 31</span>
            <span>Decisions · 82</span>
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            width: 360,
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            position: "relative",

            borderRadius: 40,
            border: "1px solid rgba(233,180,76,.18)",
            background: "rgba(255,255,255,.02)",
          }}
        >
          {/* Blueprint Guides */}

          <div
            style={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,.06)",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 250,
              height: 1,
              background: "rgba(255,255,255,.08)",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: 1,
              height: 250,
              background: "rgba(255,255,255,.08)",
            }}
          />

          <img
            src={iconUrl}
            width={180}
            height={180}
            alt="Workbench"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export async function GET() {
  return new ImageResponse(<Home iconUrl="https://workbenchdev.vercel.app/logo/logo.svg" />, size);
}