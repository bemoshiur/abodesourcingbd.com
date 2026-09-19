import type { CategoryView, FactoryCountry, FactoryView, ProductView, ServiceView, SiteInfo } from "@/lib/payload";

/**
 * AnswerBlock text: a 40–60 word plain-prose factual answer at the top of every
 * page. CMS-authored answers win; these builders are the safety net so a page
 * created in the CMS without one still ships a valid block.
 * Rules (OmniRank): subject–verb–object opener, business named once, no lists,
 * no superlatives, only facts the site already states.
 */

export const wc = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Lower-case ordinary capitalised words for mid-sentence use, leaving acronyms (PPE, OEKO-TEX) intact. */
export const softLower = (s: string) => s.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());

/** Join sentences, dropping optional trailing ones until the count fits 40–60 words. */
function fit(required: string[], optional: string[]): string {
  let text = required.join(" ");
  for (const extra of optional) {
    const next = `${text} ${extra}`;
    if (wc(next) <= 60) text = next;
    if (wc(text) >= 44) break;
  }
  return text;
}

const MARKETS = "buyers in Europe and North America";

/**
 * " in Bangladesh", " in India" or " in Bangladesh and India" (leading space, so it appends directly),
 * or "" when no country is known. Callers pass only countries they can prove — see categoryOrigins.
 */
export function originPhrase(countries: readonly FactoryCountry[]): string {
  const found = new Set(countries);
  const names = [found.has("bangladesh") && "Bangladesh", found.has("india") && "India"].filter(Boolean);
  return names.length ? ` in ${names.join(" and ")}` : "";
}

/**
 * Where a category is made: the countries of the partner factories that list it (unique, Bangladesh
 * first). A single style's origin is not knowable, so only categories get one; `[]` means no factory
 * lists the category yet and the copy must then name no country at all.
 */
export function categoryOrigins(
  slug: string,
  factories: readonly Pick<FactoryView, "country" | "categories">[],
): FactoryCountry[] {
  const found = new Set(factories.filter((f) => f.categories.includes(slug)).map((f) => f.country));
  return (["bangladesh", "india"] as const).filter((c) => found.has(c));
}

export function productAnswer(p: ProductView, site: Pick<SiteInfo, "name">): string {
  const spec = [p.composition, p.gsm, p.fabricConstruction].filter(Boolean).join(", ");
  const ref = p.styleNumber ? ` (style ${p.styleNumber})` : "";
  return fit(
    [
      `${site.name} sources ${p.name}${ref} from compliant partner factories.`,
      spec ? `The style is made in ${spec}.` : `The style belongs to our ${p.categoryTitle.toLowerCase()} range.`,
    ],
    [
      `It is part of our ${p.categoryTitle.toLowerCase()} range, developed for ${MARKETS}.`,
      "Send your target quantity and delivery market and the team replies with a quotation within 24 hours.",
      "The order is managed from sampling and quality control through to shipment.",
    ],
  );
}

export function categoryAnswer(c: CategoryView, site: Pick<SiteInfo, "name">): string {
  const items = c.subItems.slice(0, 4).join(", ").toLowerCase();
  return fit(
    [
      `${site.name} sources ${c.title.toLowerCase()} from compliant partner factories${originPhrase(c.origins)} for ${MARKETS}.`,
      `The range covers ${items} and related styles.`,
    ],
    [
      "The team manages development, sampling, production monitoring, quality control and shipment for every order.",
      "Send a tech pack or reference garment with a target quantity to receive a quotation within 24 hours.",
    ],
  );
}

export function serviceAnswer(s: ServiceView, site: Pick<SiteInfo, "name">): string {
  return fit(
    [
      `${site.name} provides ${s.title.toLowerCase()} for apparel brands sourcing from Bangladesh.`,
      s.summary.replace(/\s+/g, " ").trim().replace(/([^.])$/, "$1."),
    ],
    [
      "The service runs alongside a vetted network of compliant knit and woven partner factories.",
      "Contact the team with a tech pack or reference to receive a clear next step within 24 hours.",
    ],
  );
}

export function factoryAnswer(f: FactoryView, site: Pick<SiteInfo, "name">): string {
  const where = f.country === "india" ? "India" : "Bangladesh";
  return fit(
    [
      `${f.name} is a partner factory in ${where} within the ${site.name} network, specialising in ${softLower(f.specialty)}.`,
      `It runs ${softLower(f.productTypes.slice(0, 4).join(", "))} for the programmes we manage.`,
    ],
    [
      "Every partner factory is vetted for social and technical compliance before it receives an order.",
      "Send a brief and the team will match your style to the right production unit.",
    ],
  );
}

/** "a, b and c"; a serial comma from three items on, so "activewear and performance wear" stays unambiguous. */
const joinList = (xs: string[]) =>
  xs.length <= 2 ? xs.join(" and ") : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`;

/**
 * The Products page answer. It names the categories it is given but never how many there are (the
 * count goes stale the moment a category is added), and it never uses a digit for one. With no
 * categories, or a list too long to fit the 60-word ceiling, it falls back to generic wording.
 */
function productsPageAnswer(n: string, categories: string[] | undefined): string {
  const build = (across: string) =>
    fit(
      [
        `${n} sources apparel from partner factories across ${across}.`,
        "Each style lists its style reference, fibre composition and fabric weight.",
      ],
      [
        "Add styles to an inquiry list and the team quotes them together within a day.",
        "The team manages sampling, quality control and shipment for buyers in Europe and North America.",
      ],
    );
  const named = (categories ?? []).map((c) => c.trim()).filter(Boolean);
  const withList = named.length ? build(joinList(named)) : "";
  return withList && wc(withList) <= 60 ? withList : build("its apparel categories");
}

export function pageAnswer(
  kind: "home" | "about" | "services" | "products" | "factories" | "compliance" | "contact",
  site: Pick<SiteInfo, "name">,
  opts: { categories?: string[] } = {},
): string {
  const n = site.name;
  const t: Record<typeof kind, string> = {
    home: `${n} is a garments buying and sourcing office in Uttara, Dhaka. The team develops, sources and ships knitwear, woven wear, activewear, outerwear and workwear for brands in Europe and North America, working through a vetted network of compliant partner factories. Send a tech pack to receive a quotation within 24 hours.`,
    about: `${n} is a Dhaka-based buying office that acts as the on-the-ground partner for global fashion and workwear brands. The team manages product development, sourcing, quality control and shipment across a network of compliant partner factories, serving buyers in Europe and North America from its Uttara office.`,
    services: `${n} offers six sourcing services: product development, materials and trims sourcing, merchandising support, quality assurance, production monitoring and logistics support. Together they cover an order from tech pack to shipment, delivered through compliant partner factories in Bangladesh for brands in Europe and North America.`,
    products: productsPageAnswer(n, opts.categories),
    factories: `${n} works with compliant partner factories in Bangladesh and India, covering knitwear, sportswear, activewear, jackets, lingerie and woven wear. Each unit is vetted for social and technical compliance, so brands in Europe and North America can place orders through one accountable team in Dhaka.`,
    compliance: `${n} works only with partner factories that hold recognised social and environmental certifications, including BSCI, SEDEX, WRAP, ISO, OEKO-TEX, GOTS and GRS. Every order also passes a seven-step quality control process, from fabric inspection to final shipment approval, before goods ship.`,
    contact: `${n} welcomes quotation requests from apparel brands and retailers. Send a tech pack or reference garment with your target quantity and market through the form or to the team by email, and expect a reply within 24 hours. The office is located in Uttara, Sector 4, Dhaka.`,
  };
  return t[kind];
}
