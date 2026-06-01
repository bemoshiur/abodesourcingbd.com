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

const RECIPIENTS = (
  process.env.INQUIRY_TO_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean) ??
  ["shakhawat@abodesourcingbd.com"]
);

const FROM =
  process.env.INQUIRY_FROM_EMAIL || "ABD Sourcing <onboarding@resend.dev>";

type Input = Record<"name" | "company" | "email" | "country" | "category" | "quantity" | "message" | "website", unknown>;
type Errors = Partial<Record<"name" | "company" | "email" | "message", string>>;

const clean = (s: unknown, max: number) =>
  (typeof s === "string" ? s : "").trim().slice(0, max);

function buildText(d: Record<string, string>): string {
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
  lines.push("", "Message:", d.message);
  return lines.join("\n");
}

function buildHtml(d: Record<string, string>): string {
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
  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px">
  <h2 style="color:#1C5340;font-size:18px;margin:0 0 12px">New website inquiry</h2>
  <table style="border-collapse:collapse;width:100%">${rows}</table>
  <p style="margin:16px 0 4px;color:#566057;font-size:13px">Message</p>
  <p style="margin:0;color:#16201B;font-size:14px;line-height:1.5;white-space:pre-wrap">${esc(d.message)}</p>
</div>`;
}

function buildMailto(d: Record<string, string>): string {
  const params = new URLSearchParams({
    subject: `New inquiry — ${d.company} (${d.name})`,
    body: buildText(d),
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

  const mailto = buildMailto(d);
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
        subject: `New inquiry — ${d.company} (${d.name})`,
        html: buildHtml(d),
        text: buildText(d),
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
