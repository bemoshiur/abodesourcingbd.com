import { NextResponse } from "next/server";

/**
 * Inquiry form endpoint — POST handler. Validates the JSON payload, then
 * sends via Resend's REST API. The RESEND_API_KEY stays server-side
 * (Vercel project env var); it never reaches the browser. When the key is
 * missing the endpoint returns a prefilled `mailto:` so the form never
 * dead-ends.
 *
 * Required Vercel (Production) environment variables — env vars are baked in
 * at build time, so changing them requires a redeploy to take effect:
 *   - RESEND_API_KEY     — Resend API key (without it, the form falls back to mailto)
 *   - INQUIRY_FROM_EMAIL — verified sender, e.g. "ABD Sourcing Bangladesh <noreply@mail.abodesourcingbd.com>"
 *   - INQUIRY_TO_EMAILS  — comma-separated recipients
 */

export const runtime = "nodejs"; // we use Node fetch + standard env access

const DEFAULT_RECIPIENTS = ["info@abodesourcingbd.com"];
const configured = (process.env.INQUIRY_TO_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
// An empty / missing setting must never mean "no recipients".
const RECIPIENTS = configured.length ? configured : DEFAULT_RECIPIENTS;

const SITE_URL = "https://abodesourcingbd.com";
const MAX_STYLES = 30;

type Style = { name: string; styleNumber: string; url: string };

const FROM =
  process.env.INQUIRY_FROM_EMAIL || "ABD Sourcing <onboarding@resend.dev>";

type Input = Record<"name" | "company" | "email" | "country" | "category" | "quantity" | "message" | "website" | "styles", unknown>;
type Errors = Partial<Record<"name" | "company" | "email" | "message", string>>;

const clean = (s: unknown, max: number) =>
  (typeof s === "string" ? s : "").trim().slice(0, max);

/** Selected products from the visitor's "Add to inquiry" list — sanitised, links forced onto our own domain. */
function cleanStyles(input: unknown): Style[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, MAX_STYLES).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const r = raw as Record<string, unknown>;
    const name = clean(r.name, 140);
    const path = clean(r.path, 200);
    if (!name || !/^\/products\/[a-z0-9/-]+\/?$/.test(path)) return [];
    return [{ name, styleNumber: clean(r.styleNumber, 60), url: `${SITE_URL}${path}` }];
  });
}

function buildText(d: Record<string, string>, styles: Style[] = []): string {
  const lines = [
    "New inquiry from ABD Sourcing Bangladesh website",
    "",
    `Name: ${d.name}`,
    `Company: ${d.company}`,
    `Email: ${d.email}`,
  ];
  if (d.country) lines.push(`Country: ${d.country}`);
  if (d.category) lines.push(`Product category: ${d.category}`);
  if (d.quantity) lines.push(`Target quantity / MOQ: ${d.quantity}`);
  if (styles.length) {
    lines.push("", `Selected styles (${styles.length}):`);
    for (const st of styles) {
      lines.push(`- ${st.name}${st.styleNumber ? ` (style ${st.styleNumber})` : ""} — ${st.url}`);
    }
  }
  lines.push("", "Message:", d.message);
  return lines.join("\n");
}

function buildHtml(d: Record<string, string>, styles: Style[] = []): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = (
    [
      ["Name", d.name],
      ["Company", d.company],
      ["Email", d.email],
      ["Country", d.country],
      ["Product category", d.category],
      ["Target quantity / MOQ", d.quantity],
    ] as const
  )
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#566057;font-size:13px;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:4px 0;color:#16201B;font-size:14px">${esc(v)}</td></tr>`,
    )
    .join("");
  const styleList = styles.length
    ? `<p style="margin:16px 0 4px;color:#566057;font-size:13px">Selected styles (${styles.length})</p>
  <ul style="margin:0;padding-left:18px;color:#16201B;font-size:14px;line-height:1.6">${styles
    .map(
      (st) =>
        `<li><a href="${esc(st.url)}" style="color:#1C5340">${esc(st.name)}</a>${st.styleNumber ? ` <span style="color:#566057">— style ${esc(st.styleNumber)}</span>` : ""}</li>`,
    )
    .join("")}</ul>`
    : "";
  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px">
  <h2 style="color:#1C5340;font-size:18px;margin:0 0 12px">New website inquiry</h2>
  <table style="border-collapse:collapse;width:100%">${rows}</table>${styleList}
  <p style="margin:16px 0 4px;color:#566057;font-size:13px">Message</p>
  <p style="margin:0;color:#16201B;font-size:14px;line-height:1.5;white-space:pre-wrap">${esc(d.message)}</p>
</div>`;
}

function buildMailto(d: Record<string, string>, styles: Style[] = []): string {
  const params = new URLSearchParams({
    subject: `New inquiry — ${d.company} (${d.name})`,
    body: buildText(d, styles),
  });
  return `mailto:${RECIPIENTS.join(",")}?${params.toString()}`;
}

export async function POST(req: Request): Promise<Response> {
  let body: Input;
  try {
    body = (await req.json()) as Input;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields. Pretend success.
  if (body.website) {
    return NextResponse.json({ ok: true, message: "Thanks — we will be in touch shortly." });
  }

  const d = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    email: clean(body.email, 200),
    country: clean(body.country, 80),
    category: clean(body.category, 80),
    quantity: clean(body.quantity, 120),
    message: clean(body.message, 4000),
  };

  const styles = cleanStyles(body.styles);

  const fieldErrors: Errors = {};
  if (!d.name) fieldErrors.name = "Please enter your name";
  if (!d.company) fieldErrors.company = "Please enter your company";
  if (!d.email) fieldErrors.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    fieldErrors.email = "Enter a valid email address";
  if (!d.message) fieldErrors.message = "Please add a short message";

  if (Object.keys(fieldErrors).length) {
    return NextResponse.json(
      { ok: false, message: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const mailto = buildMailto(d, styles);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      fallback: true,
      mailto,
      message:
        "Email isn't wired up yet — open the prefilled message in your mail app to send it directly.",
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: RECIPIENTS,
        reply_to: d.email,
        subject: `New inquiry — ${d.company} (${d.name})${styles.length ? ` · ${styles.length} style${styles.length > 1 ? "s" : ""}` : ""}`,
        html: buildHtml(d, styles),
        text: buildText(d, styles),
      }),
      // Resend usually replies in well under 10s.
      signal: AbortSignal.timeout(20_000),
    });

    if (res.ok) {
      return NextResponse.json({
        ok: true,
        message:
          "Thank you — your inquiry is on its way. We reply within 24 hours.",
      });
    }
  } catch {
    // fall through to the mailto fallback below
  }

  return NextResponse.json(
    {
      ok: false,
      message: "We couldn't send that automatically. Please use the email fallback below.",
      mailto,
    },
    { status: 502 },
  );
}
