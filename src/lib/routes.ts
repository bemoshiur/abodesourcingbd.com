/** Primary navigation — order matters; reused by header, mobile menu and footer. */
export const navItems = [
  { label: "About", href: "/about/" },
  { label: "Services", href: "/services/" },
  { label: "Products", href: "/products/" },
  { label: "Factories", href: "/factories/" },
  { label: "Guides", href: "/guides/" },
  { label: "Compliance", href: "/compliance/" },
  { label: "Contact", href: "/contact/" },
] as const;

/** The conversion target — header CTA, footer band, and every page CTA point here. */
export const CONTACT_PATH = "/contact/";

export interface Crumb {
  label: string;
  href: string;
}

export const productPath = (categorySlug: string, slug: string) => `/products/${categorySlug}/${slug}/`;
