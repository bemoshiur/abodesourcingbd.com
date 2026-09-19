import type { FaqView, ImageView, ProductView, SiteInfo } from "@/lib/payload";
import { absoluteUrl } from "@/lib/seo";

/**
 * schema.org builders — one @graph per page with stable @ids. The organisation
 * is declared in full once (home page) and referenced by @id everywhere else.
 *
 * Real-only rule: no telephone, no Review / AggregateRating / Offer, dates only
 * from real CMS timestamps, sameAs / foundingDate only when the CMS has values.
 */

export type Node = Record<string, unknown>;
export interface Crumb {
  label: string;
  href: string;
}

const root = (site: Pick<SiteInfo, "url">) => site.url.replace(/\/$/, "");
export const orgId = (site: Pick<SiteInfo, "url">) => `${root(site)}/#organization`;
export const websiteId = (site: Pick<SiteInfo, "url">) => `${root(site)}/#website`;
const pageId = (site: Pick<SiteInfo, "url">, path: string, frag: string) =>
  `${absoluteUrl(site, path)}#${frag}`;

export function graph(nodes: Node[]): Record<string, unknown> {
  return { "@context": "https://schema.org", "@graph": nodes };
}

const postalCode = (city: string) => city.match(/\d{4,}/)?.[0];

export function organizationNode(
  site: SiteInfo,
  opts: {
    areaServed: string[];
    knowsAbout?: string[];
    /** Trade bodies the business is a member of (ProgramMembership with the member number). */
    memberOf?: { name: string; url?: string; membershipNumber?: string }[];
  },
): Node {
  const code = postalCode(site.address.city);
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId(site),
    name: site.name,
    url: root(site),
    logo: { "@type": "ImageObject", url: `${root(site)}/logos/abd-logo.png` },
    image: site.ogImage ? absoluteUrl(site, site.ogImage.url) : `${root(site)}/logos/abd-logo.png`,
    description: site.oneLiner,
    slogan: site.tagline,
    ...(site.emails[0] ? { email: site.emails[0] } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: "Dhaka",
      ...(code ? { postalCode: code } : {}),
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    areaServed: opts.areaServed.map((name) => ({ "@type": "Country", name })),
    ...(opts.knowsAbout?.length ? { knowsAbout: opts.knowsAbout } : {}),
    ...(opts.memberOf?.length
      ? {
          memberOf: opts.memberOf.map((m) => ({
            "@type": "ProgramMembership",
            hostingOrganization: {
              "@type": "Organization",
              name: m.name,
              ...(m.url ? { url: m.url } : {}),
            },
            ...(m.membershipNumber ? { membershipNumber: m.membershipNumber } : {}),
          })),
        }
      : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    ...(site.foundingYear ? { foundingDate: String(site.foundingYear) } : {}),
  };
}

export function websiteNode(site: SiteInfo): Node {
  return {
    "@type": "WebSite",
    "@id": websiteId(site),
    url: root(site),
    name: site.name,
    inLanguage: "en",
    publisher: { "@id": orgId(site) },
  };
}

export function breadcrumbNode(site: SiteInfo, path: string, crumbs: Crumb[]): Node {
  const items = [{ label: "Home", href: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": pageId(site, path, "breadcrumb"),
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(site, c.href),
    })),
  };
}

export function webPageNode(
  site: SiteInfo,
  o: {
    path: string;
    name: string;
    description: string;
    type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage";
    /** Only a real CMS timestamp — never new Date(). */
    dateModified?: string;
    breadcrumb?: boolean;
    primaryImage?: ImageView;
    mainEntity?: { "@id": string };
  },
): Node {
  return {
    "@type": o.type ?? "WebPage",
    "@id": pageId(site, o.path, "webpage"),
    url: absoluteUrl(site, o.path),
    name: o.name,
    description: o.description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId(site) },
    about: { "@id": orgId(site) },
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.breadcrumb === false ? {} : { breadcrumb: { "@id": pageId(site, o.path, "breadcrumb") } }),
    ...(o.primaryImage
      ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(site, o.primaryImage.url) } }
      : {}),
    ...(o.mainEntity ? { mainEntity: o.mainEntity } : {}),
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".answer-block"] },
  };
}

export function faqNode(site: SiteInfo, path: string, faqs: FaqView[]): Node | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    "@id": pageId(site, path, "faq"),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceNode(
  site: SiteInfo,
  o: { path: string; name: string; description: string; areaServed: string[] },
): Node {
  return {
    "@type": "Service",
    "@id": pageId(site, o.path, "service"),
    name: o.name,
    description: o.description,
    serviceType: o.name,
    provider: { "@id": orgId(site) },
    areaServed: o.areaServed.map((name) => ({ "@type": "Country", name })),
    url: absoluteUrl(site, o.path),
  };
}

export function itemListNode(
  site: SiteInfo,
  o: { path: string; name: string; items: { name: string; url: string }[] },
): Node {
  return {
    "@type": "ItemList",
    "@id": pageId(site, o.path, "itemlist"),
    name: o.name,
    itemListElement: o.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(site, it.url),
    })),
  };
}

/**
 * A style is a spec-sheet entry, not a sold item — schema.org's ProductModel ("a datasheet
 * or vendor specification of a product") describes it honestly. Real fields only: no Offer /
 * price (none published), no rating, no review, no brand claim.
 */
export function productNode(site: SiteInfo, p: ProductView, path: string, description: string): Node {
  const props = [
    p.gsm ? { name: "Fabric weight", value: p.gsm } : null,
    p.fabricConstruction ? { name: "Fabric construction", value: p.fabricConstruction } : null,
    ...p.specs.map((s) => ({ name: s.label, value: s.value })),
  ].filter(Boolean) as { name: string; value: string }[];
  return {
    "@type": "ProductModel",
    "@id": pageId(site, path, "product"),
    name: p.name,
    ...(p.styleNumber ? { sku: p.styleNumber } : {}),
    category: p.categoryTitle,
    ...(p.composition ? { material: p.composition } : {}),
    description,
    url: absoluteUrl(site, path),
    image: p.images.map((i) => absoluteUrl(site, i.url)),
    ...(props.length
      ? {
          additionalProperty: props.map((x) => ({
            "@type": "PropertyValue",
            name: x.name,
            value: x.value,
          })),
        }
      : {}),
  };
}
