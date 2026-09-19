import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/payload";

export const dynamic = "force-static";

/** AI crawlers named explicitly — visibility to answer engines is a deliberate choice for this site. */
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "Claude-Web",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Meta-ExternalAgent",
  "Amazonbot", "CCBot", "Bytespider", "Cohere-AI", "DuckAssistBot", "Diffbot", "YouBot", "PetalBot",
] as const;

// Admin UI and API are private — but product photos are served from /api/media/file/,
// so that one path stays crawlable (the longer Allow wins over the shorter Disallow).
const disallow = ["/admin", "/api/"];
const allow = ["/", "/api/media/file/"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSiteSettings();
  return {
    rules: [
      { userAgent: "*", allow, disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow, disallow })),
    ],
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
