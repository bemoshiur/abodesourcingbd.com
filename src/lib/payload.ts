import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Media, Product, ProductCategory } from "@/payload/payload-types";
import { categoryOrigins } from "@/lib/answers";

/**
 * Data-access layer — the single bridge between Payload CMS and the site's
 * pages/components. Every helper maps Payload docs to plain view models so
 * components never touch Payload types directly.
 */

const getPayloadClient = cache(() => getPayload({ config }));

// --- View models (shapes the components consume) ---

export interface ImageView {
  /** Full-size (≤1400px WebP) — product detail, hero. */
  url: string;
  /** 720×900 crop — cards. */
  cardUrl: string;
  /** 240×300 crop — thumbnails. */
  thumbUrl: string;
  alt: string;
  width: number;
  height: number;
}

export interface FaqView {
  question: string;
  answer: string;
}

export interface SeoView {
  heading?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: ImageView;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  oneLiner: string;
  domain: string;
  url: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
    geo: { lat: number; lng: number };
  };
  emails: string[];
  payment: string;
  officeImage?: ImageView;
  ogImage?: ImageView;
  foundingYear?: number;
  sameAs: string[];
  keywords: string[];
  contentLicense: "none" | "CC-BY-4.0";
}

export interface ServiceView {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  covers: string[];
  how: string[];
  relatedCategories: string[];
  answer?: string;
  updatedAt: string;
  faqs: FaqView[];
  seo: SeoView;
}

export interface CategoryView {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  subItems: string[];
  image?: ImageView;
  /**
   * Countries of the partner factories that list this category (unique, Bangladesh first). Empty when
   * none does. Generated copy names only these; a single style's origin is never stated.
   */
  origins: FactoryCountry[];
  answer?: string;
  updatedAt: string;
  faqs: FaqView[];
  seo: SeoView;
}

export interface ProductView {
  slug: string;
  name: string;
  styleNumber?: string;
  categorySlug: string;
  categoryTitle: string;
  summary?: string;
  description?: string;
  composition?: string;
  gsm?: string;
  fabricConstruction?: string;
  specs: { label: string; value: string }[];
  images: (ImageView & { view: string })[];
  featured: boolean;
  updatedAt: string;
  seo: SeoView;
}

export type FactoryCountry = "bangladesh" | "india";

export interface FactoryView {
  slug: string;
  name: string;
  country: FactoryCountry;
  location?: string;
  specialty: string;
  productTypes: string[];
  categories: string[];
  website?: string;
  logo?: ImageView;
  intro: string;
  answer?: string;
  updatedAt: string;
  faqs: FaqView[];
  seo: SeoView;
}

export interface CertificationView {
  name: string;
  full: string;
  logo?: ImageView;
}

export interface MembershipView {
  name: string;
  fullName: string;
  relation: "member" | "registered" | "none";
  idLabel?: string;
  idValue?: string;
  url?: string;
  logo?: ImageView;
}

export interface PageMeta {
  metaTitle?: string;
  metaDescription?: string;
  heading?: string;
  intro?: string;
  answer?: string;
  faqs: FaqView[];
}

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "products"
  | "factories"
  | "compliance"
  | "contact";

// --- Mapping helpers ---

function toImage(media: number | Media | null | undefined): ImageView | undefined {
  if (!media || typeof media === "number" || !media.url) return undefined;
  const url = media.url;
  return {
    url: media.sizes?.detail?.url || url,
    cardUrl: media.sizes?.card?.url || media.sizes?.detail?.url || url,
    thumbUrl: media.sizes?.thumb?.url || media.sizes?.card?.url || url,
    alt: media.alt,
    width: media.sizes?.detail?.width || media.width || 1400,
    height: media.sizes?.detail?.height || media.height || 1400,
  };
}

/** Relationship field → slug, when populated. */
function relSlug(rel: number | { slug: string } | null | undefined): string | undefined {
  if (!rel || typeof rel === "number") return undefined;
  return rel.slug;
}

function relSlugs(rels: (number | ProductCategory)[] | null | undefined): string[] {
  return (rels ?? []).map(relSlug).filter((s): s is string => Boolean(s));
}

function toFaqs(faqs: { question: string; answer: string }[] | null | undefined): FaqView[] {
  return (faqs ?? []).map((f) => ({ question: f.question, answer: f.answer }));
}

function toSeo(
  seo:
    | { heading?: string | null; metaTitle?: string | null; metaDescription?: string | null; ogImage?: number | Media | null }
    | null
    | undefined,
): SeoView {
  return {
    heading: seo?.heading || undefined,
    metaTitle: seo?.metaTitle || undefined,
    metaDescription: seo?.metaDescription || undefined,
    ogImage: toImage(seo?.ogImage),
  };
}

// --- Globals ---

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient();
  const g = await payload.findGlobal({ slug: "site-settings", depth: 1 });
  const site: SiteInfo = {
    name: g.name,
    tagline: g.tagline,
    oneLiner: g.oneLiner,
    domain: g.domain,
    url: g.url,
    address: g.address,
    emails: g.emails.map((e) => e.address),
    payment: g.payment,
    officeImage: toImage(g.officeImage),
    ogImage: toImage(g.ogImage),
    foundingYear: g.foundingYear ?? undefined,
    sameAs: (g.sameAs ?? []).map((s) => s.url),
    keywords: (g.keywords ?? []).map((k) => k.keyword),
    contentLicense: g.contentLicense === "CC-BY-4.0" ? "CC-BY-4.0" : "none",
  };
  return { site, mission: g.mission, vision: g.vision };
});

export const getSiteContent = cache(async () => {
  const payload = await getPayloadClient();
  const g = await payload.findGlobal({ slug: "site-content", depth: 1 });
  return {
    whyChooseUs: g.whyChooseUs.map((i) => ({ title: i.title, icon: i.icon })),
    exportMarkets: g.exportMarkets.map((m) => ({ name: m.name, code: m.code })),
    certifications: g.certifications.map(
      (c): CertificationView => ({ name: c.name, full: c.full, logo: toImage(c.logo) }),
    ),
    memberships: (g.memberships ?? []).map(
      (m): MembershipView => ({
        name: m.name,
        fullName: m.fullName,
        relation: m.relation === "registered" || m.relation === "none" ? m.relation : "member",
        idLabel: m.idLabel || undefined,
        idValue: m.idValue || undefined,
        url: m.url || undefined,
        logo: toImage(m.logo),
      }),
    ),
    qcSteps: g.qcSteps.map((s) => ({ step: s.step, detail: s.detail })),
    productionFlow: g.productionFlow.map((s) => s.stage),
  };
});

const emptyPage: PageMeta = { faqs: [] };

export const getPageContent = cache(async () => {
  const payload = await getPayloadClient();
  const g = await payload.findGlobal({ slug: "page-content", depth: 0 });
  const pick = (
    p:
      | {
          metaTitle?: string | null;
          metaDescription?: string | null;
          heading?: string | null;
          intro?: string | null;
          answer?: string | null;
          faqs?: { question: string; answer: string }[] | null;
        }
      | null
      | undefined,
  ): PageMeta =>
    p
      ? {
          metaTitle: p.metaTitle || undefined,
          metaDescription: p.metaDescription || undefined,
          heading: p.heading || undefined,
          intro: p.intro || undefined,
          answer: p.answer || undefined,
          faqs: toFaqs(p.faqs),
        }
      : emptyPage;
  return {
    home: pick(g.home),
    about: pick(g.about),
    services: pick(g.services),
    products: pick(g.products),
    factories: pick(g.factories),
    compliance: pick(g.compliance),
    contact: pick(g.contact),
  } satisfies Record<PageKey, PageMeta>;
});

export async function getPageMeta(key: PageKey): Promise<PageMeta> {
  return (await getPageContent())[key];
}

// --- Services ---

function toServiceView(s: {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  covers: { item: string }[];
  how: { item: string }[];
  relatedCategories?: (number | ProductCategory)[] | null;
  answer?: string | null;
  updatedAt: string;
  faqs?: { question: string; answer: string }[] | null;
  seo?: Parameters<typeof toSeo>[0];
}): ServiceView {
  return {
    slug: s.slug,
    title: s.title,
    icon: s.icon,
    summary: s.summary,
    intro: s.intro,
    covers: s.covers.map((c) => c.item),
    how: s.how.map((h) => h.item),
    relatedCategories: relSlugs(s.relatedCategories),
    answer: s.answer || undefined,
    updatedAt: s.updatedAt,
    faqs: toFaqs(s.faqs),
    seo: toSeo(s.seo),
  };
}

export const getServices = cache(async (): Promise<ServiceView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "services",
    limit: 100,
    sort: "createdAt",
    depth: 1,
  });
  return docs.map(toServiceView);
});

export async function getService(slug: string): Promise<ServiceView | undefined> {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
}

// --- Product categories ---

function toCategoryView(
  c: {
    slug: string;
    title: string;
    icon: string;
    summary: string;
    intro: string;
    subItems: { item: string }[];
    image?: number | Media | null;
    answer?: string | null;
    updatedAt: string;
    faqs?: { question: string; answer: string }[] | null;
    seo?: Parameters<typeof toSeo>[0];
  },
  origins: FactoryCountry[],
): CategoryView {
  return {
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    summary: c.summary,
    intro: c.intro,
    subItems: c.subItems.map((i) => i.item),
    image: toImage(c.image),
    origins,
    answer: c.answer || undefined,
    updatedAt: c.updatedAt,
    faqs: toFaqs(c.faqs),
    seo: toSeo(c.seo),
  };
}

export const getCategories = cache(async (): Promise<CategoryView[]> => {
  const payload = await getPayloadClient();
  const [{ docs }, factories] = await Promise.all([
    payload.find({
      collection: "product-categories",
      limit: 100,
      sort: "order",
      depth: 1,
    }),
    getFactories(),
  ]);
  return docs.map((c) => toCategoryView(c, categoryOrigins(c.slug, factories)));
});

export async function getCategory(slug: string): Promise<CategoryView | undefined> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
}

// --- Products ---

function toProductView(p: Product): ProductView {
  const cat = typeof p.category === "number" ? undefined : p.category;
  return {
    slug: p.slug ?? "",
    name: p.name,
    styleNumber: p.styleNumber ?? undefined,
    categorySlug: cat?.slug ?? "",
    categoryTitle: cat?.title ?? "",
    summary: p.summary ?? undefined,
    description: p.description ?? undefined,
    composition: p.composition ?? undefined,
    gsm: p.gsm ?? undefined,
    fabricConstruction: p.fabricConstruction ?? undefined,
    specs: (p.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
    images: (p.images ?? []).flatMap((i) => {
      const img = toImage(i.image);
      return img ? [{ ...img, view: i.view ?? "front" }] : [];
    }),
    featured: Boolean(p.featured),
    updatedAt: p.updatedAt,
    seo: toSeo(p.seo),
  };
}

export const getProducts = cache(async (): Promise<ProductView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "products",
    where: { published: { equals: true } },
    limit: 1000,
    sort: ["order", "styleNumber"],
    depth: 2,
  });
  return docs.map(toProductView).filter((p) => p.slug && p.categorySlug && p.images.length > 0);
});

export async function productsForCategory(slug: string): Promise<ProductView[]> {
  const all = await getProducts();
  return all.filter((p) => p.categorySlug === slug);
}

export async function featuredProducts(): Promise<ProductView[]> {
  const all = await getProducts();
  return all.filter((p) => p.featured);
}

export async function getProduct(
  categorySlug: string,
  slug: string,
): Promise<ProductView | undefined> {
  const all = await getProducts();
  return all.find((p) => p.categorySlug === categorySlug && p.slug === slug);
}

/** Previous / next product within the same category (wraps around). */
export async function adjacentProducts(product: ProductView) {
  const list = await productsForCategory(product.categorySlug);
  const i = list.findIndex((p) => p.slug === product.slug);
  if (i === -1 || list.length < 2) return { prev: undefined, next: undefined };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}

// --- Factories ---

function toFactoryView(f: {
  slug: string;
  name: string;
  country?: "bangladesh" | "india" | null;
  location?: string | null;
  specialty: string;
  productTypes: { item: string }[];
  categories?: (number | ProductCategory)[] | null;
  website?: string | null;
  logo?: (number | null) | Media;
  intro: string;
  answer?: string | null;
  updatedAt: string;
  faqs?: { question: string; answer: string }[] | null;
  seo?: Parameters<typeof toSeo>[0];
}): FactoryView {
  return {
    slug: f.slug,
    name: f.name,
    country: f.country === "india" ? "india" : "bangladesh",
    location: f.location || undefined,
    specialty: f.specialty,
    productTypes: f.productTypes.map((t) => t.item),
    categories: relSlugs(f.categories),
    website: f.website ?? undefined,
    logo: toImage(f.logo),
    intro: f.intro,
    answer: f.answer || undefined,
    updatedAt: f.updatedAt,
    faqs: toFaqs(f.faqs),
    seo: toSeo(f.seo),
  };
}

export const getFactories = cache(async (): Promise<FactoryView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "factories",
    limit: 100,
    sort: ["order", "createdAt"],
    depth: 1,
  });
  // Bangladesh first, then India; the CMS `order` decides within a country.
  return docs.map(toFactoryView).sort((a, b) => Number(a.country === "india") - Number(b.country === "india"));
});

export async function getFactory(slug: string): Promise<FactoryView | undefined> {
  const all = await getFactories();
  return all.find((f) => f.slug === slug);
}

// --- Cross-links ---

/** Services whose relatedCategories include this product category. */
export async function servicesForCategory(slug: string): Promise<ServiceView[]> {
  const all = await getServices();
  return all.filter((s) => s.relatedCategories.includes(slug));
}

/** Partner factories that run this product category. */
export async function factoriesForCategory(slug: string): Promise<FactoryView[]> {
  const all = await getFactories();
  return all.filter((f) => f.categories.includes(slug));
}

/** Services relevant to a factory, derived from the categories it runs. */
export async function servicesForFactory(factory: FactoryView): Promise<ServiceView[]> {
  const all = await getServices();
  return all.filter((s) => s.relatedCategories.some((c) => factory.categories.includes(c)));
}

export const COUNTRY_LABEL: Record<FactoryCountry, string> = {
  bangladesh: "Factory in Bangladesh",
  india: "Factory in India",
};
