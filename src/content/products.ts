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

export interface ProductShot {
  /** Path under /public/products. */
  src: string;
  category: ProductSlug;
  /** Descriptive alt: style + fabric (SEO + a11y). Buyer names are never published. */
  alt: string;
  /** Highlighted on the Home running-product strip. */
  featured?: boolean;
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

// --- Running-product shots, grouped by style and mapped to a category. ---
function shots(
  category: ProductSlug,
  alt: string,
  files: string[],
  featuredFile?: string,
): ProductShot[] {
  return files.map((f) => ({
    src: `/products/${f}`,
    category,
    alt,
    ...(f === featuredFile ? { featured: true } : {}),
  }));
}

export const productShots: ProductShot[] = [
  // Knitwear
  ...shots("knitwear",
    "Men's short-sleeve tipped polo shirt in 100% combed cotton, 200 GSM single lacoste",
    ["knitwear-tipped-polo-01.jpg", "knitwear-tipped-polo-02.jpg"], "knitwear-tipped-polo-01.jpg"),
  ...shots("knitwear",
    "Men's, ladies and kids tee shirt and ladies vest in 70% polyester / 30% rayon, 160 GSM",
    ["knitwear-tee-vest-01.jpg", "knitwear-tee-vest-02.jpg", "knitwear-tee-vest-03.jpg", "knitwear-tee-vest-04.jpg"], "knitwear-tee-vest-01.jpg"),
  ...shots("knitwear",
    "Men's tee, long-sleeve stripe polo and hoodie in cotton single jersey and piqué",
    ["knitwear-tee-polo-hoodie-01.jpg", "knitwear-tee-polo-hoodie-02.jpg", "knitwear-tee-polo-hoodie-03.jpg"]),
  ...shots("knitwear",
    "Men's and ladies hoodie and polo in 80% organic cotton blend and 100% recycled piqué",
    ["knitwear-hoodie-polo-01.jpg", "knitwear-hoodie-polo-02.jpg", "knitwear-hoodie-polo-03.jpg"]),
  ...shots("knitwear",
    "Men's and ladies t-shirt in 100% organic cotton, 160 GSM",
    ["knitwear-tshirt-01.jpg", "knitwear-tshirt-02.jpg", "knitwear-tshirt-03.jpg"], "knitwear-tshirt-01.jpg"),
  ...shots("knitwear",
    "Men's and ladies knit shirt in 95% organic cotton 5% spandex, 220 GSM single lacoste",
    ["knitwear-knit-shirt-01.jpg", "knitwear-knit-shirt-02.jpg", "knitwear-knit-shirt-03.jpg"]),
  ...shots("knitwear",
    "Men's contrast polo and tee in 100% cotton piqué 220 GSM and 90% cotton 10% viscose 170 GSM",
    ["knitwear-contrast-polo-tee-01.jpg", "knitwear-contrast-polo-tee-02.jpg", "knitwear-contrast-polo-tee-03.jpg"], "knitwear-contrast-polo-tee-02.jpg"),
  ...shots("knitwear",
    "Ladies long- and short-sleeve tee shirt in 78% rayon / 22% polyester single jersey, 160 GSM",
    ["knitwear-ladies-tee-01.jpg", "knitwear-ladies-tee-02.jpg", "knitwear-ladies-tee-03.jpg", "knitwear-ladies-tee-04.jpg"], "knitwear-ladies-tee-02.jpg"),

  // Woven Wear
  ...shots("woven-wear",
    "Men's chinos and shorts in 100% combed cotton 275 GSM and 98% cotton 2% spandex",
    ["woven-chinos-shorts-01.jpg", "woven-chinos-shorts-02.jpg"], "woven-chinos-shorts-02.jpg"),

  // Activewear & Performance Wear
  ...shots("activewear-performance-wear",
    "Men's and ladies performance tee and polo (long- and short-sleeve) in 100% recycled polyester, 135 GSM interlock",
    ["activewear-performance-tee-polo-01.jpg", "activewear-performance-tee-polo-02.jpg", "activewear-performance-tee-polo-03.jpg", "activewear-performance-tee-polo-04.jpg"], "activewear-performance-tee-polo-01.jpg"),
  ...shots("activewear-performance-wear",
    "Women's performance leggings and shorts in 90% recycled polyester / 10% elastane, 260–300 GSM",
    ["activewear-leggings-shorts-01.jpg", "activewear-leggings-shorts-02.jpg"]),
  ...shots("activewear-performance-wear",
    "Ladies racerback performance vest tops in moisture-managing recycled polyester",
    ["activewear-racerback-vest-01.jpg", "activewear-racerback-vest-02.jpg"]),
  ...shots("activewear-performance-wear",
    "Men's tee and ladies/men's singlet in 83% recycled polyester, 150 GSM",
    ["activewear-tee-singlet-01.jpg", "activewear-tee-singlet-02.jpg", "activewear-tee-singlet-03.jpg", "activewear-tee-singlet-04.jpg", "activewear-tee-singlet-05.jpg", "activewear-tee-singlet-06.jpg"], "activewear-tee-singlet-03.jpg"),
  ...shots("activewear-performance-wear",
    "Ladies pant, shorts and crew neck in 55% rayon / 39% polyester / 6% elastane interlock, 250 GSM",
    ["activewear-pant-shorts-crew-01.jpg", "activewear-pant-shorts-crew-02.jpg", "activewear-pant-shorts-crew-03.jpg", "activewear-pant-shorts-crew-04.jpg"]),
  ...shots("activewear-performance-wear",
    "Ladies pant, shorts and crew neck set in 55% rayon / 39% polyester / 6% elastane interlock, 250 GSM",
    ["activewear-pant-shorts-crew-set-01.jpg", "activewear-pant-shorts-crew-set-02.jpg", "activewear-pant-shorts-crew-set-03.jpg", "activewear-pant-shorts-crew-set-04.jpg"]),

  // Outerwear
  ...shots("outerwear",
    "Men's and ladies micro fleece jacket in 100% polyester micro fleece, 165 GSM",
    ["outerwear-micro-fleece-jacket-01.jpg", "outerwear-micro-fleece-jacket-02.jpg", "outerwear-micro-fleece-jacket-03.jpg", "outerwear-micro-fleece-jacket-04.jpg"], "outerwear-micro-fleece-jacket-03.jpg"),
  ...shots("outerwear",
    "Men's fleece hoodie and crew in 80% cotton / 20% polyester fleece, 300 GSM",
    ["outerwear-fleece-hoodie-01.jpg", "outerwear-fleece-hoodie-02.jpg", "outerwear-fleece-hoodie-03.jpg", "outerwear-fleece-hoodie-04.jpg"]),
  ...shots("outerwear",
    "Softshell and high-visibility hoodie in 100% polyester, 195 GSM",
    ["outerwear-softshell-hoodie-01.jpg", "outerwear-softshell-hoodie-02.jpg", "outerwear-softshell-hoodie-03.jpg"]),

  // Workwear
  ...shots("workwear",
    "Workwear contrast hoodie, full-zip and crew neck in 70% cotton / 30% polyester fleece, 300 GSM",
    ["workwear-hoodie-zip-crew-01.jpg", "workwear-hoodie-zip-crew-02.jpg", "workwear-hoodie-zip-crew-03.jpg"], "workwear-hoodie-zip-crew-01.jpg"),
  ...shots("workwear",
    "Workwear contrast hoodie, full-zip and crew neck set in 70% cotton / 30% polyester fleece, 300 GSM",
    ["workwear-hoodie-zip-crew-set-01.jpg", "workwear-hoodie-zip-crew-set-02.jpg", "workwear-hoodie-zip-crew-set-03.jpg", "workwear-hoodie-zip-crew-set-04.jpg"]),
  ...shots("workwear",
    "Men's workwear jacket and polo — 100% polyester woven shell and 95% cotton 5% spandex piqué",
    ["workwear-jacket-polo-01.jpg", "workwear-jacket-polo-02.jpg", "workwear-jacket-polo-03.jpg", "workwear-jacket-polo-04.jpg"], "workwear-jacket-polo-01.jpg"),
];

export function getCategory(slug: string): ProductCategory | undefined {
  return products.find((p) => p.slug === slug);
}

export function shotsForCategory(slug: ProductSlug): ProductShot[] {
  return productShots.filter((s) => s.category === slug);
}

export function featuredShots(): ProductShot[] {
  return productShots.filter((s) => s.featured);
}
