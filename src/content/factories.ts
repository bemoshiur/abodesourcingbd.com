import type { ProductSlug } from "./products";

export type FactorySlug =
  | "liz-fashion"
  | "uhm-urmi-group"
  | "knit-plus"
  | "anowara-knit-composite"
  | "green-life-knit-composite"
  | "saturn-textiles"
  | "luna-apparels"
  | "frontier-protectivewear"
  | "prachi-exports"
  | "dibella-india";

export type FactoryCountry = "bangladesh" | "india";

export interface Factory {
  /** Explicit, stable slug — read at render time, never derived from the name. */
  slug: FactorySlug;
  name: string;
  /** Where the unit is — drives the "Factory in Bangladesh / India" grouping. */
  country: FactoryCountry;
  /** City / state, only when the factory states it publicly. */
  location?: string;
  /** Sort order within a country (lower first). */
  order: number;
  /** Short specialty line for cards. */
  specialty: string;
  /** Product types this unit runs (public facts only — no invented capacity). */
  productTypes: string[];
  /** Related product categories for cross-linking. */
  categories: ProductSlug[];
  /** The factory's own site, kept in the CMS for the team — not shown on the public pages. */
  website?: string;
  /** Path under /public/factories when a logo was available. */
  logo?: string;
  /** Detail-page narrative. */
  intro: string;
}

export const factories: Factory[] = [
  {
    slug: "liz-fashion",
    name: "Liz Fashion Ind. Ltd.",
    country: "bangladesh",
    order: 10,
    specialty: "Knit sports & activewear, lingerie",
    productTypes: ["Knit sportswear", "Activewear", "Lingerie"],
    categories: ["knitwear", "activewear-performance-wear"],
    website: "https://lizfashion.com",
    logo: "/factories/liz-fashion.png",
    intro:
      "A knit composite specialising in sports and activewear plus lingerie — one of the core units behind our performance and recycled-polyester programmes.",
  },
  {
    slug: "uhm-urmi-group",
    name: "UHM Ltd. (Urmi Group)",
    country: "bangladesh",
    order: 20,
    specialty: "Knit sports & activewear, lingerie",
    productTypes: ["Knit sportswear", "Activewear", "Lingerie"],
    categories: ["knitwear", "activewear-performance-wear"],
    website: "https://urmigroup.com",
    logo: "/factories/uhm-urmi-group.png",
    intro:
      "Part of the Urmi Group, UHM runs knit sports and activewear alongside lingerie, giving us depth in stretch and performance knits.",
  },
  {
    slug: "knit-plus",
    name: "Knit Plus Ltd.",
    country: "bangladesh",
    order: 30,
    specialty: "Polo / tee / jacket",
    productTypes: ["Polo shirts", "T-shirts", "Jackets"],
    categories: ["knitwear", "outerwear"],
    website: "https://knitplusltd.com",
    logo: "/factories/knit-plus.png",
    intro:
      "A polo, tee, and jacket specialist — a workhorse for our everyday knit and light-outerwear ranges.",
  },
  {
    slug: "anowara-knit-composite",
    name: "Anowara Knit Composite Ltd.",
    country: "bangladesh",
    order: 40,
    specialty: "Basic polo / tee",
    productTypes: ["Basic polo shirts", "T-shirts"],
    categories: ["knitwear"],
    website: "https://anowaragroup.com",
    logo: "/factories/anowara-knit-composite.png",
    intro:
      "A knit composite focused on basic polos and tees, supporting volume programmes at competitive price points.",
  },
  {
    slug: "green-life-knit-composite",
    name: "Green Life Knit Composite Ltd",
    country: "bangladesh",
    order: 50,
    specialty: "Polo / tee / jacket",
    productTypes: ["Polo shirts", "T-shirts", "Jackets"],
    categories: ["knitwear", "outerwear"],
    website: "https://greenlifebd.com",
    logo: "/factories/green-life-knit-composite.png",
    intro:
      "A knit composite producing polos, tees, and jackets — adding flexible capacity across our core knit categories.",
  },
  {
    slug: "saturn-textiles",
    name: "Saturn Textiles Ltd. (Padma Textile)",
    country: "bangladesh",
    order: 60,
    specialty: "Woven pant / shirt, denim",
    productTypes: ["Woven pants", "Woven shirts", "Denim"],
    categories: ["woven-wear"],
    website: "https://padmatextiles.com",
    logo: "/factories/saturn-textiles.png",
    intro:
      "Our woven and denim base (Padma Textile), covering pants, shirts, and denim for the woven side of the range.",
  },
  // ── Factories in India ────────────────────────────────────────────────────
  // Facts come from each factory's own public website; nothing beyond what it states is claimed.
  {
    slug: "luna-apparels",
    name: "Luna Apparels Private Limited",
    country: "india",
    order: 10,
    specialty: "Workwear, casual wear, jute & cotton bags",
    productTypes: [
      "Basic & image workwear",
      "Fire protection workwear",
      "High-visibility workwear",
      "Medical apparel & PPE",
      "Hospitality wear",
      "Winter protection wear",
      "Casual wear",
      "Jute & cotton bags",
    ],
    categories: ["workwear", "outerwear", "woven-wear"],
    website: "https://lunaapparels.com",
    logo: "/factories/luna-apparels.png",
    intro:
      "A workwear specialist in our India network, covering basic and image, fire protection, high-visibility, medical, hospitality and winter protection garments, plus casual wear and jute and cotton bags.",
  },
  {
    slug: "frontier-protectivewear",
    name: "Frontier Protectivewear Private Limited",
    country: "india",
    order: 20,
    specialty: "Workwear and protective clothing",
    productTypes: [
      "Classic & image workwear",
      "High-visibility clothing",
      "Flame-retardant clothing",
      "Special protection clothing",
      "Fleece, soft-shell & hooded jackets",
      "Uniforms",
      "Shirts",
      "T-shirts, polos & hoodies",
    ],
    categories: ["workwear", "outerwear", "woven-wear", "knitwear"],
    website: "https://www.frontierprotectivewear.com",
    logo: "/factories/frontier-protectivewear.png",
    intro:
      "A workwear and protective-clothing specialist in our India network. The range covers classic and image workwear, high-visibility, flame-retardant and special-protection garments, plus outerwear, uniforms, shirts and knit tops.",
  },
  {
    slug: "prachi-exports",
    name: "Prachi Exports (Apparel & Garments)",
    country: "india",
    order: 30,
    specialty: "Apparel & garments",
    productTypes: ["Apparel & garments"],
    categories: [],
    // No website or logo yet: https://www.prachiexports.in is a spice exporter, not an apparel unit.
    intro:
      "An apparel and garments factory in our India network. Tell the team what your programme needs and we will confirm which styles this unit runs.",
  },
  {
    slug: "dibella-india",
    name: "Dibella India",
    country: "india",
    order: 40,
    specialty: "Organic cotton shirts and apparel",
    productTypes: [
      "Formal & casual shirts",
      "Womenswear tops & dresses",
      "Workwear shirts, aprons & polos",
      "T-shirts",
      "Accessories & bags",
    ],
    categories: ["woven-wear", "workwear"],
    website: "https://www.dibellaindia.com",
    logo: "/factories/dibella-india.png",
    intro:
      "A supplier of organic cotton apparel in our India network, covering formal and casual shirts, womenswear tops and dresses, workwear shirts, aprons, polos and T-shirts, plus accessories and bags.",
  },
];

export function getFactory(slug: string): Factory | undefined {
  return factories.find((f) => f.slug === slug);
}
