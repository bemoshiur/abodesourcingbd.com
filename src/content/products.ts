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
  brandSlug: string;
  brandName: string;
  category: ProductSlug;
  /** Descriptive alt: brand + style + fabric (SEO + a11y). */
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

// --- Running-product shots, grouped by brand and mapped to a category. ---
function shots(
  brandSlug: string,
  brandName: string,
  category: ProductSlug,
  alt: string,
  files: string[],
  featuredFile?: string,
): ProductShot[] {
  return files.map((f) => ({
    src: `/products/${f}`,
    brandSlug,
    brandName,
    category,
    alt,
    ...(f === featuredFile ? { featured: true } : {}),
  }));
}

export const productShots: ProductShot[] = [
  // Knitwear
  ...shots("asquith-fox", "Asquith & Fox", "knitwear",
    "Asquith & Fox men's short-sleeve tipped polo shirt in 100% combed cotton, 200 GSM single lacoste",
    ["asquith-fox-ss-polo-3.jpg", "asquith-fox-ss-polo-4.jpg"], "asquith-fox-ss-polo-3.jpg"),
  ...shots("sprayway", "Sprayway", "knitwear",
    "Sprayway men's, ladies and kids tee shirt and ladies vest in 70% polyester / 30% rayon, 160 GSM",
    ["sprayway-tee-vest-2.jpg", "sprayway-tee-vest-3.jpg", "sprayway-tee-vest-4.jpg", "sprayway-tee-vest-5.jpg"], "sprayway-tee-vest-2.jpg"),
  ...shots("sebago", "SEBAGO", "knitwear",
    "SEBAGO men's tee, long-sleeve stripe polo and hoodie in cotton single jersey and piqué",
    ["sebago-tee-polo-hood-2.jpg", "sebago-tee-polo-hood-3.jpg", "sebago-tee-polo-hood-4.jpg"]),
  ...shots("nimbus", "Nimbus", "knitwear",
    "Nimbus men's and ladies hoodie and polo in 80% organic cotton blend and 100% recycled piqué",
    ["nimbus-hood-polo-2.jpg", "nimbus-hood-polo-3.jpg", "nimbus-hood-polo-4.jpg"]),
  ...shots("nimbus", "Nimbus", "knitwear",
    "Nimbus men's and ladies t-shirt in 100% organic cotton, 160 GSM",
    ["nimbus-tshirt-2.jpg", "nimbus-tshirt-3.jpg", "nimbus-tshirt-4.jpg"], "nimbus-tshirt-2.jpg"),
  ...shots("nimbus", "Nimbus / RONHILL", "knitwear",
    "Nimbus and RONHILL men's and ladies knit shirt in 95% organic cotton 5% spandex, 220 GSM single lacoste",
    ["nimbus-ronhill-knit-shirt-2.jpg", "nimbus-ronhill-knit-shirt-3.jpg", "nimbus-ronhill-knit-shirt-4.jpg"]),
  ...shots("alligo", "ALLIGO", "knitwear",
    "ALLIGO men's contrast polo and tee in 100% cotton piqué 220 GSM and 90% cotton 10% viscose 170 GSM",
    ["alligo-polo-tee-2.jpg", "alligo-polo-tee-3.jpg", "alligo-polo-tee-4.jpg"], "alligo-polo-tee-3.jpg"),
  ...shots("lddv", "Le Don De Vie", "knitwear",
    "Le Don De Vie ladies long- and short-sleeve tee shirt in 78% rayon / 22% polyester single jersey, 160 GSM",
    ["lddv-tee-shirt-2.jpg", "lddv-tee-shirt-3.jpg", "lddv-tee-shirt-4.jpg", "lddv-tee-shirt-5.jpg"], "lddv-tee-shirt-3.jpg"),

  // Woven Wear
  ...shots("asquith-fox", "Asquith & Fox", "woven-wear",
    "Asquith & Fox men's chinos and shorts in 100% combed cotton 275 GSM and 98% cotton 2% spandex",
    ["asquith-fox-chinos-2.jpg", "asquith-fox-chinos-3.jpg"], "asquith-fox-chinos-3.jpg"),

  // Activewear & Performance Wear
  ...shots("tridri", "TRIDRI", "activewear-performance-wear",
    "TRIDRI men's and ladies performance tee and polo (long- and short-sleeve) in 100% recycled polyester, 135 GSM interlock",
    ["tridri-tee-polo-2.jpg", "tridri-tee-polo-3.jpg", "tridri-tee-polo-4.jpg", "tridri-tee-polo-5.jpg"], "tridri-tee-polo-2.jpg"),
  ...shots("tridri", "TRIDRI", "activewear-performance-wear",
    "TRIDRI women's performance leggings and shorts in 90% recycled polyester / 10% elastane, 260–300 GSM",
    ["tridri-leggings-shorts-2.jpg", "tridri-leggings-shorts-3.jpg"]),
  ...shots("tridri", "TRIDRI", "activewear-performance-wear",
    "TRIDRI ladies racerback performance vest tops in moisture-managing recycled polyester",
    ["tridri-tank-purple.jpg", "tridri-tank-pink.jpg"]),
  ...shots("swedemount", "Swedemount X-Trail", "activewear-performance-wear",
    "Swedemount X-Trail men's tee and ladies/men's singlet in 83% recycled polyester, 150 GSM",
    ["swedemount-xtrail-tee-singlet-2.jpg", "swedemount-xtrail-tee-singlet-3.jpg", "swedemount-xtrail-tee-singlet-4.jpg", "swedemount-xtrail-tee-singlet-5.jpg", "swedemount-xtrail-tee-singlet-6.jpg", "swedemount-xtrail-tee-singlet-7.jpg"], "swedemount-xtrail-tee-singlet-4.jpg"),
  ...shots("lddv", "Le Don De Vie", "activewear-performance-wear",
    "Le Don De Vie ladies pant, shorts and crew neck in 55% rayon / 39% polyester / 6% elastane interlock, 250 GSM",
    ["lddv-pant-shorts-crew-2.jpg", "lddv-pant-shorts-crew-3.jpg", "lddv-pant-shorts-crew-4.jpg", "lddv-pant-shorts-crew-5.jpg"]),
  ...shots("lddv", "Le Don De Vie", "activewear-performance-wear",
    "Le Don De Vie ladies pant, shorts and crew neck set in 55% rayon / 39% polyester / 6% elastane interlock, 250 GSM",
    ["lddv-pant-shorts-crew-b-2.jpg", "lddv-pant-shorts-crew-b-3.jpg", "lddv-pant-shorts-crew-b-4.jpg", "lddv-pant-shorts-crew-b-5.jpg"]),

  // Outerwear
  ...shots("swedemount", "Swedemount", "outerwear",
    "Swedemount men's and ladies micro fleece jacket in 100% polyester micro fleece, 165 GSM",
    ["swedemount-micro-fleece-jacket-2.jpg", "swedemount-micro-fleece-jacket-3.jpg", "swedemount-micro-fleece-jacket-4.jpg", "swedemount-micro-fleece-jacket-5.jpg"], "swedemount-micro-fleece-jacket-4.jpg"),
  ...shots("l-shop", "L-Shop", "outerwear",
    "L-Shop men's fleece hoodie and crew in 80% cotton / 20% polyester fleece, 300 GSM",
    ["l-shop-fleece-hoodie-2.jpg", "l-shop-fleece-hoodie-3.jpg", "l-shop-fleece-hoodie-4.jpg", "l-shop-fleece-hoodie-5.jpg"]),
  ...shots("alligo", "ALLIGO", "outerwear",
    "ALLIGO softshell and high-visibility hoodie in 100% polyester, 195 GSM",
    ["alligo-softshell-hoodie-2.jpg", "alligo-softshell-hoodie-3.jpg", "alligo-softshell-hoodie-4.jpg"]),

  // Workwear
  ...shots("alligo", "ALLIGO", "workwear",
    "ALLIGO workwear contrast hoodie, full-zip and crew neck in 70% cotton / 30% polyester fleece, 300 GSM",
    ["alligo-hood-zip-crew-2.jpg", "alligo-hood-zip-crew-3.jpg", "alligo-hood-zip-crew-4.jpg"], "alligo-hood-zip-crew-2.jpg"),
  ...shots("alligo", "ALLIGO", "workwear",
    "ALLIGO workwear contrast hoodie, full-zip and crew neck set in 70% cotton / 30% polyester fleece, 300 GSM",
    ["alligo-hood-zip-crew-b-2.jpg", "alligo-hood-zip-crew-b-3.jpg", "alligo-hood-zip-crew-b-4.jpg", "alligo-hood-zip-crew-b-5.jpg"]),
  ...shots("appear-json", "Appear / Json", "workwear",
    "Appear / Json men's workwear jacket and polo — 100% polyester woven shell and 95% cotton 5% spandex piqué",
    ["appear-json-workwear-polo-2.jpg", "appear-json-workwear-polo-3.jpg", "appear-json-workwear-polo-4.jpg", "appear-json-workwear-polo-5.jpg"], "appear-json-workwear-polo-2.jpg"),
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
