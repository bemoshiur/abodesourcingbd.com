import type {
  CategoryView,
  FactoryView,
  PageMeta,
  ProductView,
  ServiceView,
  SiteInfo,
} from "@/lib/payload";
import {
  categoryAnswer,
  factoryAnswer,
  pageAnswer,
  productAnswer,
  serviceAnswer,
} from "@/lib/answers";
import { clampDescription, withBrand } from "@/lib/seo";

/**
 * One place that decides each page's path, <title>, description, H1 and answer.
 * Pages, the sitemap, llms.txt/llms-full.txt and facts.json all call these, so
 * the files AI engines read can never disagree with the HTML crawlers see.
 * CMS values win; the strings here are the keyword-led defaults.
 */
export interface Entry {
  path: string;
  title: string;
  description: string;
  heading: string;
  answer: string;
  /** Real CMS timestamp when the page renders a single record; otherwise omitted. */
  lastModified?: string;
  kind:
    | "home" | "about" | "services" | "service" | "products" | "category"
    | "product" | "factories" | "factory" | "compliance" | "contact";
}

const pick = (cms: string | undefined, fallback: string) => (cms && cms.trim() ? cms.trim() : fallback);

export function homeEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "home",
    path: "/",
    title: pick(pc.metaTitle, "Garments Buying Office in Dhaka, Bangladesh"),
    description: pick(
      pc.metaDescription,
      "Dhaka garments buying & sourcing office for knitwear, woven wear, activewear, outerwear and workwear. Compliant factories, 7-step QC. Request a quote.",
    ),
    heading: pick(pc.heading, "Garments buying & sourcing office in Dhaka, Bangladesh"),
    answer: pick(pc.answer, pageAnswer("home", site)),
  };
}

export function aboutEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "about",
    path: "/about/",
    title: pick(pc.metaTitle, "About Our Dhaka Garments Buying Office"),
    description: pick(
      pc.metaDescription,
      "ABD Sourcing Bangladesh is a Dhaka buying office managing development, sourcing, quality and shipment for global fashion brands. See our mission and markets.",
    ),
    heading: pick(pc.heading, "A Bangladesh-based apparel buying and sourcing office"),
    answer: pick(pc.answer, pageAnswer("about", site)),
  };
}

export function servicesEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "services",
    path: "/services/",
    title: pick(pc.metaTitle, "Apparel Sourcing Services in Bangladesh"),
    description: pick(
      pc.metaDescription,
      "Product development, materials sourcing, merchandising, QA, production monitoring and logistics — end-to-end garment sourcing services in Bangladesh.",
    ),
    heading: pick(pc.heading, "End-to-end apparel sourcing services in Bangladesh"),
    answer: pick(pc.answer, pageAnswer("services", site)),
  };
}

export function serviceEntry(site: SiteInfo, s: ServiceView): Entry {
  return {
    kind: "service",
    path: `/services/${s.slug}/`,
    title: pick(s.seo.metaTitle, `${s.title} for Bangladesh Apparel Sourcing`),
    description: pick(s.seo.metaDescription, `${s.summary} Managed by ${site.name} in Dhaka — request a quote.`),
    heading: pick(s.seo.heading, s.title),
    answer: pick(s.answer, serviceAnswer(s, site)),
    lastModified: s.updatedAt,
  };
}

export function productsEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "products",
    path: "/products/",
    title: pick(pc.metaTitle, "Garment Manufacturer & Sourcing Bangladesh"),
    description: pick(
      pc.metaDescription,
      "Browse knitwear, woven wear, activewear, outerwear and workwear styles sourced in Bangladesh, with style refs and fabric specs. Add styles to an inquiry list.",
    ),
    heading: pick(pc.heading, "Apparel styles sourced from Bangladesh"),
    answer: pick(pc.answer, pageAnswer("products", site)),
  };
}

export function categoryEntry(site: SiteInfo, c: CategoryView): Entry {
  return {
    kind: "category",
    path: `/products/${c.slug}/`,
    title: pick(c.seo.metaTitle, `${c.title} Manufacturer & Sourcing in Bangladesh`),
    description: pick(c.seo.metaDescription, `${c.summary} Sourced through compliant Bangladesh factories — request a quote.`),
    heading: pick(c.seo.heading, c.title),
    answer: pick(c.answer, categoryAnswer(c, site)),
    lastModified: c.updatedAt,
  };
}

export function productEntry(site: SiteInfo, p: ProductView): Entry {
  const specShort = [p.composition, p.gsm].filter(Boolean).join(" ");
  const ref = p.styleNumber ? ` ${p.styleNumber}` : "";
  // "<name> <style ref>, <composition> <gsm> | ABD Sourcing" — the style ref keeps every title unique
  // (several styles share a name and fabric); the spec is dropped first if it would overflow 60 chars.
  const base = `${p.name}${ref}`;
  const withSpec = specShort ? `${base}, ${specShort}` : base;
  const title = `${withSpec} | ABD Sourcing`.length <= 60 ? withSpec : base;
  const spec = [p.composition, p.gsm].filter(Boolean).join(", ");
  return {
    kind: "product",
    path: `/products/${p.categorySlug}/${p.slug}/`,
    title: pick(p.seo.metaTitle, title),
    description: pick(
      p.seo.metaDescription,
      `${p.name}${spec ? ` in ${spec}` : ""}${p.styleNumber ? ` (style ${p.styleNumber})` : ""}. Developed and produced through ABD's partner factories in Bangladesh. Request a quote.`,
    ),
    heading: pick(p.seo.heading, p.name),
    answer: productAnswer(p, site),
    lastModified: p.updatedAt,
  };
}

export function factoriesEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "factories",
    path: "/factories/",
    title: pick(pc.metaTitle, "Compliant Garment Factories in Bangladesh"),
    description: pick(
      pc.metaDescription,
      "Our vetted network of compliant knit and woven partner factories in Bangladesh — sportswear, activewear, polos, tees, jackets and lingerie.",
    ),
    heading: pick(pc.heading, "Our compliant partner factories in Bangladesh"),
    answer: pick(pc.answer, pageAnswer("factories", site)),
  };
}

export function factoryEntry(site: SiteInfo, f: FactoryView): Entry {
  return {
    kind: "factory",
    path: `/factories/${f.slug}/`,
    title: pick(f.seo.metaTitle, `${f.specialty} Factory in Bangladesh`),
    description: pick(
      f.seo.metaDescription,
      `${f.name}: ${f.specialty.toLowerCase()} partner factory in Bangladesh, managed by ABD Sourcing with seven-step QC. Request a factory match.`,
    ),
    heading: pick(f.seo.heading, `${f.name}: ${f.specialty.toLowerCase()} partner factory in Bangladesh`),
    answer: pick(f.answer, factoryAnswer(f, site)),
    lastModified: f.updatedAt,
  };
}

export function complianceEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "compliance",
    path: "/compliance/",
    title: pick(pc.metaTitle, "BSCI, SEDEX, WRAP Certified Factories Bangladesh"),
    description: pick(
      pc.metaDescription,
      "Our partner factories hold BSCI, SEDEX, WRAP, ISO, OEKO-TEX, GOTS and GRS certifications, backed by a 7-step quality control process.",
    ),
    heading: pick(pc.heading, "Compliance, certifications & quality control"),
    answer: pick(pc.answer, pageAnswer("compliance", site)),
  };
}

export function contactEntry(site: SiteInfo, pc: PageMeta): Entry {
  return {
    kind: "contact",
    path: "/contact/",
    title: pick(pc.metaTitle, "Request a Garment Sourcing Quote — Dhaka"),
    description: pick(
      pc.metaDescription,
      "Send your tech pack, target quantity and market to ABD Sourcing Bangladesh in Uttara, Dhaka. We reply within 24 hours with a clear next step.",
    ),
    heading: pick(pc.heading, "Let's source your next program"),
    answer: pick(pc.answer, pageAnswer("contact", site)),
  };
}

/** Final <title>/description as the page will render them (used by llms.txt so it matches the HTML). */
export const finalTitle = (e: Pick<Entry, "title">) => withBrand(e.title);
export const finalDescription = (e: Pick<Entry, "description">) => clampDescription(e.description);
