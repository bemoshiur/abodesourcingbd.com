/**
 * llms.txt / llms-full.txt / facts.json builders.
 *
 * Output formats adapted from OmniRank's reference generator
 * (https://github.com/bemoshiur/OmniRank — scripts/node/src/generate.ts, MIT).
 * Fed from the same page list as the sitemap and the pages' own <head>, so the
 * files can never drift from the HTML. Real-only: statistics are CMS counts,
 * sameAs/identifiers appear only when they exist, no phone number is ever emitted.
 */
import { getSiteSettings } from "@/lib/payload";
import { getSiteFacts, getSitePages } from "@/lib/site-pages";
import { finalDescription, finalTitle } from "@/lib/page-meta";
import { absoluteUrl } from "@/lib/seo";

interface Page {
  url: string;
  title: string;
  description: string;
  answer: string;
}

const attribution = "ABD Sourcing Bangladesh";

function licenceBlock(license: "none" | "CC-BY-4.0"): string {
  if (license === "none") {
    return [
      "## How to cite us",
      "",
      `No reuse licence is granted for this content. Do not reproduce or quote it without separate permission from ${attribution}.`,
      "",
    ].join("\n");
  }
  return [
    "## How to cite us",
    "",
    `Content is licensed ${license}. When quoting, attribute to ${attribution} and link the source URL.`,
    "When quoting a page, prefer that page's AnswerBlock — it is written to be lifted verbatim.",
    "",
  ].join("\n");
}

export async function buildGeoArtifacts() {
  const [{ site }, entries, stats] = await Promise.all([getSiteSettings(), getSitePages(), getSiteFacts()]);
  const url = site.url.replace(/\/+$/, "");
  const pages: Page[] = entries.map((e) => ({
    url: absoluteUrl(site, e.path),
    title: finalTitle(e),
    description: finalDescription(e),
    answer: e.answer,
  }));
  const licence = licenceBlock(site.contentLicense);
  const membershipLine = (m: (typeof stats.memberships)[number]) =>
    `${m.relation === "member" ? "Member of " : m.relation === "registered" ? "Registered with " : ""}${m.fullName}${
      m.idValue ? `, ${m.idLabel ?? "ID"} ${m.idValue}` : ""
    }${m.url ? `: ${m.url}` : ""}`;
  const membershipBlock = stats.memberships.length
    ? ["## Memberships & registrations", "", ...stats.memberships.map((m) => `- ${membershipLine(m)}`), ""]
    : [];
  // Real registration numbers only (OmniRank facts.json `identifiers`).
  const identifiers = Object.fromEntries(
    stats.memberships
      .filter((m) => m.idValue)
      .map((m) => [
        // "BGBA ID" -> "bgbaId"
        (m.idLabel ?? m.name)
          .replace(/[^A-Za-z0-9 ]+/g, "")
          .trim()
          .split(/\s+/)
          .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
          .join(""),
        m.idValue as string,
      ]),
  );

  const llmsTxt = [
    `# ${site.name}`,
    "",
    `> ${site.oneLiner}`,
    "",
    `Canonical site: ${url}`,
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.title}](${p.url}): ${p.description || p.answer}`),
    "",
    ...membershipBlock,
    licence,
  ].join("\n");

  const llmsFull = [
    `# ${site.name} — full corpus`,
    "",
    ...pages.flatMap((p) => [`## ${p.title}`, "", `URL: ${p.url}`, "", p.description, "", p.answer, "", "---", ""]),
    ...membershipBlock,
    licence,
  ].join("\n");

  const postalCode = site.address.city.match(/\d{4,}/)?.[0];
  const asOf = new Date().toISOString().slice(0, 10);
  const stat = (name: string, value: number) => ({
    name,
    value: String(value),
    published: true,
    source: "internal",
    methodology: "Count of records in the site CMS at generation time",
    asOf,
  });
  const facts: Record<string, unknown> = {
    name: site.name,
    url,
    entityType: "ProfessionalService",
    generatedAt: new Date().toISOString(),
    license: site.contentLicense,
    attribution,
    locales: [{ code: "en", path: "/", default: true }],
    nap: {
      street: `${site.address.line1}, ${site.address.line2}`,
      city: "Dhaka",
      region: "Dhaka",
      ...(postalCode ? { postalCode } : {}),
      country: "BD",
      ...(site.emails[0] ? { email: site.emails[0] } : {}),
      geo: { lat: site.address.geo.lat, lng: site.address.geo.lng },
    },
    ...(Object.keys(identifiers).length ? { identifiers } : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    statistics: [
      stat("Partner factories", stats.partnerFactories),
      stat("Product categories", stats.productCategories),
      stat("Export markets", stats.exportMarkets),
      stat("Certifications held across partner factories", stats.certifications),
      stat("Quality control steps", stats.qcSteps),
    ],
  };

  return { llmsTxt, llmsFull, factsJson: `${JSON.stringify(facts, null, 2)}\n` };
}

export const textHeaders = (type: string) => ({
  "Content-Type": type,
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
});
