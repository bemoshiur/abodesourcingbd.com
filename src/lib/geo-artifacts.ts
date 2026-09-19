/**
 * llms.txt / llms-full.txt / facts.json builders.
 *
 * Output formats adapted from OmniRank's reference generator
 * (https://github.com/bemoshiur/OmniRank — scripts/node/src/generate.ts, MIT) and the llms.txt
 * convention (https://llmstxt.org): an H1, a blockquote summary, then ordered H2 sections of
 * annotated links, with anything optional last.
 *
 * Fed from the same page list as the sitemap and the pages' own <head>, so the files can never
 * drift from the HTML. Real-only: statistics are CMS counts, identifiers and memberships appear
 * only when they exist, no phone number is ever emitted, and the size of the style catalogue is
 * never disclosed — individual style URLs are summarised by category rather than listed.
 */
import { getSiteContent, getSiteSettings } from "@/lib/payload";
import { getSiteFacts, getSitePages } from "@/lib/site-pages";
import { finalDescription, finalTitle, type Entry } from "@/lib/page-meta";
import { absoluteUrl } from "@/lib/seo";

interface Page {
  url: string;
  title: string;
  description: string;
  answer: string;
  kind: Entry["kind"];
  lastModified?: string;
}

const attribution = "ABD Sourcing Bangladesh";

/** Strip a trailing call to action — an answer engine wants the fact, not the pitch. */
const factual = (text: string) =>
  text.replace(/\s*(Request a quote|Request a factory match|Get a quote)\.?\s*$/i, "").trim();

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
  const [{ site }, content, entries, stats] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
    getSitePages(),
    getSiteFacts(),
  ]);
  const url = site.url.replace(/\/+$/, "");
  const all: Page[] = entries.map((e) => ({
    url: absoluteUrl(site, e.path),
    title: finalTitle(e),
    description: finalDescription(e),
    answer: e.answer,
    kind: e.kind,
    lastModified: e.lastModified,
  }));
  // Individual style pages are deliberately excluded: listing them would disclose how many styles
  // the catalogue holds. Category pages carry the same information at the level buyers ask about.
  const pages = all.filter((p) => p.kind !== "product");
  const of = (...kinds: Entry["kind"][]) => pages.filter((p) => kinds.includes(p.kind));
  const line = (p: Page) => `- [${p.title}](${p.url}): ${factual(p.description || p.answer)}`;
  const section = (heading: string, list: Page[]) => (list.length ? [`## ${heading}`, "", ...list.map(line), ""] : []);

  const membershipLine = (m: (typeof content.memberships)[number]) =>
    `${m.relation === "member" ? "Member of " : m.relation === "registered" ? "Registered with " : ""}${m.fullName}${
      m.idValue ? ` (${m.idLabel ?? "ID"} ${m.idValue})` : ""
    }${m.url ? `: ${m.url}` : ""}`;

  const llmsTxt = [
    `# ${site.name}`,
    "",
    `> ${site.oneLiner}`,
    "",
    `${site.name} is a buying house — a sourcing agent and buying office in Uttara, Dhaka. It does not own or operate garment factories: it develops, sources and ships apparel for brands in Europe and North America through ${stats.partnerFactories} vetted partner factories in Bangladesh and India, and verifies quality with a ${stats.qcSteps}-step quality control process on every order. Contact: ${site.emails[0]}.`,
    "",
    ...section("Start here", of("home", "about")),
    ...section("Services", of("services", "service")),
    ...section("Products", of("products", "category")),
    ...section("Partner factories", of("factories", "factory")),
    ...section("Guides", of("guides", "guide")),
    ...section("Compliance and contact", of("compliance", "contact")),
    ...(content.memberships.length
      ? ["## Memberships and registrations", "", ...content.memberships.map((m) => `- ${membershipLine(m)}`), ""]
      : []),
    "## Optional",
    "",
    `- [Full corpus](${url}/llms-full.txt): every page's answer, key facts and FAQs in one file.`,
    `- [Machine-readable facts](${url}/facts.json): name, address, identifiers, memberships and verified counts.`,
    `- [Sitemap](${url}/sitemap.xml): every indexable URL, including individual style pages.`,
    "",
    licenceBlock(site.contentLicense),
  ].join("\n");

  const keyFacts = [
    `Business model: buying house / sourcing agent — does not own or operate factories`,
    `Office: ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.country}`,
    `Partner factories: ${stats.partnerFactories}, in Bangladesh and India`,
    `Product categories: ${stats.productCategories}`,
    `Export markets: ${content.exportMarkets.map((m) => m.name).join(", ")}`,
    `Certifications held across the partner factories: ${content.certifications.map((c) => c.name).join(", ")}`,
    `Quality control: ${stats.qcSteps} steps — ${content.qcSteps.map((q) => q.step).join(", ")}`,
    ...content.memberships.map(membershipLine),
    `Contact: ${site.emails[0]}`,
  ];

  const llmsFull = [
    `# ${site.name} — full corpus`,
    "",
    `> ${site.oneLiner}`,
    "",
    "## Key facts",
    "",
    ...keyFacts.map((f) => `- ${f}`),
    "",
    "---",
    "",
    ...pages.flatMap((p, i) => [
      `## ${i + 1}. ${p.title}`,
      "",
      `URL: ${p.url}`,
      ...(p.lastModified ? [`Updated: ${p.lastModified.slice(0, 10)}`] : []),
      "",
      `Summary: ${factual(p.description)}`,
      "",
      `Answer: ${p.answer}`,
      "",
      "---",
      "",
    ]),
    licenceBlock(site.contentLicense),
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
  // Real registration numbers only (OmniRank facts.json `identifiers`): "BGBA ID" -> "bgbaId".
  const identifiers = Object.fromEntries(
    content.memberships
      .filter((m) => m.idValue)
      .map((m) => [
        (m.idLabel ?? m.name)
          .replace(/[^A-Za-z0-9 ]+/g, "")
          .trim()
          .split(/\s+/)
          .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
          .join(""),
        m.idValue as string,
      ]),
  );

  const facts: Record<string, unknown> = {
    name: site.name,
    alternateName: ["ABD Sourcing"],
    url,
    entityType: "ProfessionalService",
    generatedAt: new Date().toISOString(),
    license: site.contentLicense,
    attribution,
    description: site.oneLiner,
    slogan: site.tagline,
    businessModel: "Buying house and sourcing agent. Does not own or operate garment factories.",
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
    ...(content.memberships.length
      ? {
          memberships: content.memberships.map((m) => ({
            name: m.name,
            fullName: m.fullName,
            relation: m.relation,
            ...(m.idLabel ? { idLabel: m.idLabel } : {}),
            ...(m.idValue ? { idValue: m.idValue } : {}),
            ...(m.url ? { url: m.url } : {}),
          })),
        }
      : {}),
    sourcingCountries: ["Bangladesh", "India"],
    exportMarkets: content.exportMarkets.map((m) => m.name),
    productCategories: stats.categoryTitles,
    services: stats.serviceTitles,
    certificationsHeldByPartnerFactories: content.certifications.map((c) => c.name),
    qualityControlSteps: content.qcSteps.map((q) => q.step),
    ...(site.foundingYear ? { foundingYear: site.foundingYear } : {}),
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
