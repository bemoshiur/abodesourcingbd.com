import { ImageResponse } from "next/og";

/**
 * Per-page share card (1200×630): brand gradient, page title, optional product
 * photo. `img` is restricted to our own media path so the route can never be
 * used to fetch arbitrary URLs.
 */
export const runtime = "nodejs";

const MEDIA_PATH = /^\/api\/media\/file\/[A-Za-z0-9._%-]+$/;

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const title = (searchParams.get("title") || "ABD Sourcing Bangladesh").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") || "Garments buying & sourcing · Dhaka, Bangladesh").slice(0, 80);
  const imgParam = searchParams.get("img") || "";
  const photo = MEDIA_PATH.test(imgParam) ? `${origin}${imgParam}` : null;

  const size = title.length > 70 ? 46 : title.length > 42 ? 56 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(60% 90% at 0% 0%, #2f7a5f 0%, transparent 60%), radial-gradient(45% 70% at 100% 0%, rgba(201,162,39,0.45) 0%, transparent 62%), linear-gradient(135deg, #1c4a3a 0%, #10201a 100%)",
          color: "#f7f6f2",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: photo ? 640 : 1000 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#e6c65a", fontWeight: 600 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: size, lineHeight: 1.08, fontWeight: 700 }}>{title}</div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 30, fontWeight: 600, color: "rgba(247,246,242,0.85)" }}>
            ABD Sourcing Bangladesh
          </div>
        </div>
        {photo && (
          <div
            style={{
              display: "flex",
              width: 380,
              height: 470,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 32,
              background: "#ffffff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" width={340} height={430} style={{ objectFit: "contain" }} />
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
