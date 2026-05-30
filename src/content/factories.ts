import type { ProductSlug } from "./products";

export type FactorySlug =
  | "liz-fashion"
  | "uhm-urmi-group"
  | "knit-plus"
  | "anowara-knit-composite"
  | "green-life-knit-composite"
  | "saturn-textiles";

export interface Factory {
  /** Explicit, stable slug — read at render time, never derived from the name. */
  slug: FactorySlug;
  name: string;
  /** Short specialty line for cards. */
  specialty: string;
  /** Product types this unit runs (public facts only — no invented capacity). */
  productTypes: string[];
  /** Related product categories for cross-linking. */
  categories: ProductSlug[];
  /** Outbound public website. */
  website: string;
  /** Path under /public/factories when a logo was available. */
  logo?: string;
  /** Detail-page narrative. */
  intro: string;
}

export const factories: Factory[] = [
  {
    slug: "liz-fashion",
    name: "Liz Fashion Ind. Ltd.",
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
    specialty: "Polo / tee / jacket",
    productTypes: ["Polo shirts", "T-shirts", "Jackets"],
    categories: ["knitwear", "outerwear"],
    website: "https://greenlifebd.com",
    intro:
      "A knit composite producing polos, tees, and jackets — adding flexible capacity across our core knit categories.",
  },
  {
    slug: "saturn-textiles",
    name: "Saturn Textiles Ltd. (Padma Textile)",
    specialty: "Woven pant / shirt, denim",
    productTypes: ["Woven pants", "Woven shirts", "Denim"],
    categories: ["woven-wear"],
    website: "https://padmatextiles.com",
    logo: "/factories/saturn-textiles.png",
    intro:
      "Our woven and denim base (Padma Textile), covering pants, shirts, and denim for the woven side of the range.",
  },
];

export function getFactory(slug: string): Factory | undefined {
  return factories.find((f) => f.slug === slug);
}
