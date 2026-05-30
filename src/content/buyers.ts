import type { ProductSlug } from "./products";

export interface Buyer {
  name: string;
  slug: string;
  /** Country/region as stated on the fact sheet; omitted where not specified. */
  country?: string;
  /** Extra context (sub-brands, retail group) where the fact sheet notes it. */
  note?: string;
  categories: ProductSlug[];
  /** Path under /public/logos when a logo was available; otherwise rendered as a wordmark. */
  logo?: string;
}

// Running buyers / brands. Order follows the company profile. Countries and
// notes are taken verbatim from the fact sheet — blanks are left blank, never invented.
export const buyers: Buyer[] = [
  { name: "TRIDRI", slug: "tridri", country: "United Kingdom / USA", categories: ["activewear-performance-wear", "knitwear"], logo: "/logos/tridri.png" },
  { name: "Asquith & Fox", slug: "asquith-fox", country: "United Kingdom", categories: ["knitwear", "woven-wear"] },
  { name: "ALLIGO", slug: "alligo", country: "Sweden", categories: ["workwear", "outerwear"] },
  { name: "Stadium Outlet", slug: "stadium-outlet", country: "Sweden", categories: ["knitwear", "activewear-performance-wear"], logo: "/logos/stadium-outlet.png" },
  { name: "Premier", slug: "premier", categories: ["knitwear"], logo: "/logos/premier.png" },
  { name: "Appear / Json", slug: "appear-json", country: "Sweden", note: "incl. Ryds", categories: ["workwear", "knitwear"] },
  { name: "Le Don De Vie (LDDV)", slug: "lddv", country: "Sweden", note: "Stadium Outlet", categories: ["activewear-performance-wear", "knitwear"] },
  { name: "Swedemount", slug: "swedemount", country: "Sweden", note: "incl. X-Trail", categories: ["activewear-performance-wear", "outerwear"], logo: "/logos/swedemount.png" },
  { name: "Nimbus", slug: "nimbus", country: "Denmark", note: "Copenhagen", categories: ["knitwear"], logo: "/logos/nimbus.png" },
  { name: "NY Form", slug: "ny-form", categories: ["knitwear"] },
  { name: "RalaTeam.com", slug: "ralateam", categories: ["knitwear", "activewear-performance-wear"], logo: "/logos/ralateam.png" },
  { name: "RalaWise.com", slug: "ralawise", categories: ["knitwear", "activewear-performance-wear"], logo: "/logos/ralawise.png" },
  { name: "Sprayway", slug: "sprayway", country: "United Kingdom", categories: ["knitwear", "activewear-performance-wear"], logo: "/logos/sprayway.png" },
  { name: "RONHILL", slug: "ronhill", country: "United Kingdom", categories: ["activewear-performance-wear", "knitwear"], logo: "/logos/ronhill.png" },
  { name: "L-Shop (l-shopteam)", slug: "l-shop", country: "Germany", categories: ["knitwear", "outerwear"], logo: "/logos/l-shop.png" },
  { name: "SEBAGO", slug: "sebago", categories: ["knitwear"], logo: "/logos/sebago.png" },
];

export function buyersForCategory(category: ProductSlug): Buyer[] {
  return buyers.filter((b) => b.categories.includes(category));
}
