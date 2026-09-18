/** Initial category content used by the seed script; the CMS is the source of truth afterwards. */
export type ProductSlug =
  | "knitwear"
  | "woven-wear"
  | "activewear-performance-wear"
  | "outerwear"
  | "workwear";

export interface ProductCategory {
  /** Explicit, stable slug — read at render time, never derived from the title. */
  slug: ProductSlug;
  title: string;
  icon: string;
  summary: string;
  intro: string;
  /** Sub-item types that fall under this category. */
  subItems: string[];
}

export const products: ProductCategory[] = [
  {
    slug: "knitwear",
    title: "Knitwear",
    icon: "Shirt",
    summary: "T-shirts, polos, hoodies, and knit shirts in cotton, organic, and recycled blends.",
    intro:
      "Our largest running base: jersey, piqué, interlock, and fleece knits for everyday and premium ranges. We develop in combed cotton, organic cotton, and recycled blends to suit each market's compliance profile.",
    subItems: ["T-Shirts", "Polo Shirts", "Tank Tops", "Hoodies", "Sweatshirts", "Knit Shirts"],
  },
  {
    slug: "woven-wear",
    title: "Woven Wear",
    icon: "Scissors",
    summary: "Chinos, pants, shorts, and shirts in woven cotton and stretch-cotton constructions.",
    intro:
      "Bottoms and woven tops built on our denim and woven partner base. From combed-cotton chinos to stretch-cotton twills, we manage the fit and finish woven garments demand.",
    subItems: ["Pants", "Chinos", "Cargo Pants", "Shorts", "Woven Shirts"],
  },
  {
    slug: "activewear-performance-wear",
    title: "Activewear & Performance Wear",
    icon: "Activity",
    summary: "Performance tees, leggings, and training apparel in recycled and stretch polyesters.",
    intro:
      "Moisture-managing, stretch, and recycled-polyester performance pieces for sport and athleisure ranges — including running, training, and gym wear developed with our sports & activewear factories.",
    subItems: ["Sportswear", "Leggings", "Running Wear", "Training Apparel", "Gym Wear", "Compression Wear", "Joggers"],
  },
  {
    slug: "outerwear",
    title: "Outerwear",
    icon: "Wind",
    summary: "Micro-fleece jackets, fleece hoodies, and softshells for layering ranges.",
    intro:
      "Mid- and outer-layer pieces — micro fleece, heavyweight fleece, and softshell — engineered for warmth, durability, and clean finishing.",
    subItems: ["Jackets", "Micro Fleece", "Fleece Hoodies", "Softshell"],
  },
  {
    slug: "workwear",
    title: "Workwear",
    icon: "HardHat",
    summary: "Heavy-fleece hoodies, full-zips, high-vis, and workwear polos built to last.",
    intro:
      "Durable workwear and uniform programmes — contrast hoodies, full-zips, crew necks, high-visibility layers, and rugged polos in heavyweight cotton-poly fleece and woven shells.",
    subItems: ["Workwear", "Contrast Hoodies", "Full-Zip", "High-Visibility", "Workwear Polos"],
  },
];
