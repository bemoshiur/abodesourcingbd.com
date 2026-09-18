import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Media, ProductCategory } from "@/payload/payload-types";

/**
 * Data-access layer — the single bridge between Payload CMS and the site's
 * pages/components. Every helper maps Payload docs to plain view models so
 * components never touch Payload types directly.
 */

const getPayloadClient = cache(() => getPayload({ config }));

// --- View models (shapes the components consume) ---

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
  phones: string[];
  emails: string[];
  payment: string;
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
}

export interface CategoryView {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  subItems: string[];
}

export interface ShotView {
  src: string;
  alt: string;
  brandName: string;
  brandSlug?: string;
  categorySlug: string;
  featured: boolean;
}

export interface FactoryView {
  slug: string;
  name: string;
  specialty: string;
  productTypes: string[];
  categories: string[];
  website?: string;
  logo?: string;
  intro: string;
}

export interface BuyerView {
  name: string;
  slug: string;
  country?: string;
  note?: string;
  categories: string[];
  logo?: string;
}

// --- Mapping helpers ---

function mediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media || typeof media === "number") return undefined;
  return media.url ?? undefined;
}

/** Relationship field → slug, when populated. */
function relSlug(rel: number | { slug: string } | null | undefined): string | undefined {
  if (!rel || typeof rel === "number") return undefined;
  return rel.slug;
}

function relSlugs(rels: (number | ProductCategory)[] | null | undefined): string[] {
  return (rels ?? []).map(relSlug).filter((s): s is string => Boolean(s));
}

// --- Globals ---

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient();
  const g = await payload.findGlobal({ slug: "site-settings" });
  const site: SiteInfo = {
    name: g.name,
    tagline: g.tagline,
    oneLiner: g.oneLiner,
    domain: g.domain,
    url: g.url,
    address: g.address,
    phones: g.phones.map((p) => p.number),
    emails: g.emails.map((e) => e.address),
    payment: g.payment,
  };
  return { site, mission: g.mission, vision: g.vision };
});

export const getSiteContent = cache(async () => {
  const payload = await getPayloadClient();
  const g = await payload.findGlobal({ slug: "site-content" });
  return {
    whyChooseUs: g.whyChooseUs.map((i) => ({ title: i.title, icon: i.icon })),
    exportMarkets: g.exportMarkets.map((m) => ({ name: m.name, code: m.code })),
    certifications: g.certifications.map((c) => ({ name: c.name, full: c.full })),
    qcSteps: g.qcSteps.map((s) => ({ step: s.step, detail: s.detail })),
    productionFlow: g.productionFlow.map((s) => s.stage),
  };
});

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

function toCategoryView(c: {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  subItems: { item: string }[];
}): CategoryView {
  return {
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    summary: c.summary,
    intro: c.intro,
    subItems: c.subItems.map((i) => i.item),
  };
}

export const getCategories = cache(async (): Promise<CategoryView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "product-categories",
    limit: 100,
    sort: "createdAt",
    depth: 1,
  });
  return docs.map(toCategoryView);
});

export async function getCategory(slug: string): Promise<CategoryView | undefined> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
}

// --- Product shots ---

export const getShots = cache(async (): Promise<ShotView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "product-shots",
    limit: 500,
    sort: "createdAt",
    depth: 1,
  });
  return docs.flatMap((s) => {
    const src = mediaUrl(s.image);
    const categorySlug = relSlug(s.category);
    if (!src || !categorySlug) return [];
    const media = typeof s.image === "number" ? undefined : s.image;
    return [
      {
        src,
        alt: s.alt || media?.alt || s.brandName,
        brandName: s.brandName,
        brandSlug: relSlug(s.brand),
        categorySlug,
        featured: Boolean(s.featured),
      },
    ];
  });
});

export async function shotsForCategory(slug: string): Promise<ShotView[]> {
  const all = await getShots();
  return all.filter((s) => s.categorySlug === slug);
}

export async function featuredShots(): Promise<ShotView[]> {
  const all = await getShots();
  return all.filter((s) => s.featured);
}

// --- Factories ---

function toFactoryView(f: {
  slug: string;
  name: string;
  specialty: string;
  productTypes: { item: string }[];
  categories?: (number | ProductCategory)[] | null;
  website?: string | null;
  logo?: (number | null) | Media;
  intro: string;
}): FactoryView {
  return {
    slug: f.slug,
    name: f.name,
    specialty: f.specialty,
    productTypes: f.productTypes.map((t) => t.item),
    categories: relSlugs(f.categories),
    website: f.website ?? undefined,
    logo: mediaUrl(f.logo),
    intro: f.intro,
  };
}

export const getFactories = cache(async (): Promise<FactoryView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "factories",
    limit: 100,
    sort: "createdAt",
    depth: 1,
  });
  return docs.map(toFactoryView);
});

export async function getFactory(slug: string): Promise<FactoryView | undefined> {
  const all = await getFactories();
  return all.find((f) => f.slug === slug);
}

// --- Buyers ---

export const getBuyers = cache(async (): Promise<BuyerView[]> => {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "buyers",
    limit: 200,
    sort: "createdAt",
    depth: 1,
  });
  return docs.map((b) => ({
    name: b.name,
    slug: b.slug,
    country: b.country ?? undefined,
    note: b.note ?? undefined,
    categories: relSlugs(b.categories),
    logo: mediaUrl(b.logo),
  }));
});

export async function buyersForCategory(slug: string): Promise<BuyerView[]> {
  const all = await getBuyers();
  return all.filter((b) => b.categories.includes(slug));
}

// --- Cross-links (previously src/lib/relations.ts) ---

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
