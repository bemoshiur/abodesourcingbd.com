import { getServices, getCategories, getFactories } from "@/lib/payload";

/** Primary navigation — order matters; reused by header and footer. */
export const navItems = [
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Products", href: "/products/" },
  { label: "Factories", href: "/factories/" },
  { label: "Compliance", href: "/compliance/" },
  { label: "Contact", href: "/contact/" },
] as const;

/** The conversion target — header CTA, footer band, and every page CTA point here. */
export const CONTACT_PATH = "/contact/";

export interface Crumb {
  label: string;
  href: string;
}

/** Every static + dynamic route, used by sitemap.ts. */
export async function allRoutes(): Promise<string[]> {
  const [services, products, factories] = await Promise.all([
    getServices(),
    getCategories(),
    getFactories(),
  ]);
  const staticRoutes = [
    "/",
    "/about/",
    "/services/",
    "/products/",
    "/factories/",
    "/compliance/",
    "/contact/",
  ];
  const serviceRoutes = services.map((s) => `/services/${s.slug}/`);
  const productRoutes = products.map((p) => `/products/${p.slug}/`);
  const factoryRoutes = factories.map((f) => `/factories/${f.slug}/`);
  return [...staticRoutes, ...serviceRoutes, ...productRoutes, ...factoryRoutes];
}
