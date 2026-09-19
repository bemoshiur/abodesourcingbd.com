import { cache } from "react";
import {
  getCategories,
  getFactories,
  getPageContent,
  getProducts,
  getServices,
  getSiteContent,
  getSiteSettings,
} from "@/lib/payload";
import {
  aboutEntry,
  categoryEntry,
  complianceEntry,
  contactEntry,
  factoriesEntry,
  factoryEntry,
  homeEntry,
  productEntry,
  productsEntry,
  serviceEntry,
  servicesEntry,
  type Entry,
} from "@/lib/page-meta";

/**
 * Every indexable URL on the site with its metadata — the single list behind
 * sitemap.xml, llms.txt, llms-full.txt and facts.json.
 */
export const getSitePages = cache(async (): Promise<Entry[]> => {
  const [{ site }, pc, services, categories, products, factories] = await Promise.all([
    getSiteSettings(),
    getPageContent(),
    getServices(),
    getCategories(),
    getProducts(),
    getFactories(),
  ]);
  return [
    homeEntry(site, pc.home),
    aboutEntry(site, pc.about),
    servicesEntry(site, pc.services),
    ...services.map((s) => serviceEntry(site, s)),
    productsEntry(site, pc.products),
    ...categories.map((c) => categoryEntry(site, c)),
    ...products.map((p) => productEntry(site, p)),
    factoriesEntry(site, pc.factories),
    ...factories.map((f) => factoryEntry(site, f)),
    complianceEntry(site, pc.compliance),
    contactEntry(site, pc.contact),
  ];
});

/** Facts the site states about itself, computed from CMS counts (never hard-coded). */
export const getSiteFacts = cache(async () => {
  const [factories, categories, content] = await Promise.all([
    getFactories(),
    getCategories(),
    getSiteContent(),
  ]);
  return {
    partnerFactories: factories.length,
    productCategories: categories.length,
    exportMarkets: content.exportMarkets.length,
    certifications: content.certifications.length,
    qcSteps: content.qcSteps.length,
    memberships: content.memberships,
  };
});

/** Context for the fallback FAQ builders (lib/default-faqs.ts) — every value comes from the CMS. */
export const getFaqContext = cache(async () => {
  const [{ site }, categories, services, content, factories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getServices(),
    getSiteContent(),
    getFactories(),
  ]);
  return {
    site,
    categories: categories.map((c) => c.title),
    services: services.map((s) => s.title.toLowerCase()),
    certifications: content.certifications.map((c) => c.name),
    markets: content.exportMarkets.map((m) => m.name),
    qcSteps: content.qcSteps.length,
    factoryCount: factories.length,
  };
});
