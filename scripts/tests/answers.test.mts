/**
 * Answer-text rules that must never regress:
 *   - a single product never names a country (its origin is not knowable),
 *   - a category names only the countries of the partner factories that list it,
 *   - the Products page answer carries no category count and stays 40-60 words.
 *
 *   node --test scripts/tests/answers.test.mts
 */
import test from "node:test";
import assert from "node:assert/strict";
import { categoryAnswer, categoryOrigins, originPhrase, pageAnswer, productAnswer, wc } from "../../src/lib/answers.ts";
import type { CategoryView, ProductView } from "../../src/lib/payload.ts";

const COUNT_WORD = /\b(five|six|seven|\d+)\b/i;

const category = (over: Partial<CategoryView> = {}): CategoryView => ({
  slug: "fair-trade-bags-and-towels",
  title: "Fair Trade bags and towels",
  icon: "Package",
  summary: "Fair Trade bags and towels",
  intro: "Fair Trade bags and towels",
  subItems: ["Fair Trade bags and towels"],
  updatedAt: "2026-09-19T00:00:00.000Z",
  faqs: [],
  seo: {},
  origins: [],
  ...over,
});

const product = (over: Partial<ProductView> = {}): ProductView => ({
  slug: "bags-abd-2801",
  name: "Bags",
  styleNumber: "ABD-2801",
  categorySlug: "fair-trade-bags-and-towels",
  categoryTitle: "Fair Trade bags and towels",
  composition: "100% Fairtrade Cotton bag",
  specs: [],
  images: [],
  featured: false,
  updatedAt: "2026-09-19T00:00:00.000Z",
  seo: {},
  ...over,
});

test("originPhrase names only the countries that exist", () => {
  assert.equal(originPhrase([]), "");
  assert.equal(originPhrase(["bangladesh"]), " in Bangladesh");
  assert.equal(originPhrase(["india"]), " in India");
  assert.equal(originPhrase(["bangladesh", "india"]), " in Bangladesh and India");
});

test("originPhrase ignores input order and duplicates", () => {
  assert.equal(originPhrase(["india", "bangladesh"]), " in Bangladesh and India");
  assert.equal(originPhrase(["india", "india"]), " in India");
});

test("categoryOrigins collects the countries of the factories that list the category", () => {
  const factories = [
    { country: "india" as const, categories: ["knitwear", "woven-wear"] },
    { country: "bangladesh" as const, categories: ["knitwear"] },
    { country: "bangladesh" as const, categories: ["knitwear", "outerwear"] },
    { country: "india" as const, categories: [] },
  ];
  assert.deepEqual(categoryOrigins("knitwear", factories), ["bangladesh", "india"], "unique, Bangladesh first");
  assert.deepEqual(categoryOrigins("woven-wear", factories), ["india"]);
  assert.deepEqual(categoryOrigins("outerwear", factories), ["bangladesh"]);
  assert.deepEqual(categoryOrigins("fair-trade-bags-and-towels", factories), [], "no factory lists it: no country");
});

test("products answer is count-free, lists the given categories and stays 40-60 words", () => {
  const a = pageAnswer("products", { name: "ABD Sourcing Bangladesh" }, {
    categories: ["knitwear", "woven wear", "activewear and performance wear", "outerwear", "workwear", "fair trade bags and towels"],
  });
  assert.ok(!COUNT_WORD.test(a), `count word in: ${a}`);
  assert.ok(a.includes("fair trade bags and towels"));
  assert.ok(a.includes("sources products from partner factories across"), `bags and towels are not apparel: ${a}`);
  const n = wc(a);
  assert.ok(n >= 40 && n <= 60, `${n} words`);
});

test("products answer without categories falls back to count-free wording in 40-60 words", () => {
  for (const opts of [undefined, {}, { categories: [] }]) {
    const a = pageAnswer("products", { name: "ABD Sourcing Bangladesh" }, opts);
    assert.ok(!COUNT_WORD.test(a), `count word in: ${a}`);
    assert.ok(a.includes("its product categories"), a);
    const n = wc(a);
    assert.ok(n >= 40 && n <= 60, `${n} words`);
  }
});

test("products answer stays 40-60 words when the CMS grows many categories", () => {
  const many = Array.from({ length: 14 }, (_, i) => `wear type ${"abcdefghijklmn"[i]}`);
  const a = pageAnswer("products", { name: "ABD Sourcing Bangladesh" }, { categories: many });
  assert.ok(!COUNT_WORD.test(a), `count word in: ${a}`);
  const n = wc(a);
  assert.ok(n >= 40 && n <= 60, `${n} words`);
});

test("product answer names no country beyond the company name", () => {
  const a = productAnswer(product(), { name: "ABD Sourcing Bangladesh" });
  const withoutCompany = a.replaceAll("ABD Sourcing Bangladesh", "");
  assert.ok(!/bangladesh|india/i.test(withoutCompany), `country in: ${a}`);
  assert.ok(a.includes("compliant partner factories"), a);
  const n = wc(a);
  assert.ok(n >= 40 && n <= 60, `${n} words`);
});

test("category answer uses the derived origin, and none when no factory lists it", () => {
  const site = { name: "ABD Sourcing Bangladesh" };
  const strip = (s: string) => s.replaceAll("ABD Sourcing Bangladesh", "");

  const none = categoryAnswer(category({ origins: [] }), site);
  assert.ok(none.includes("from compliant partner factories for buyers in Europe and North America"), none);
  assert.ok(!/bangladesh|india/i.test(strip(none)), `country in: ${none}`);

  const india = categoryAnswer(category({ origins: ["india"] }), site);
  assert.ok(india.includes("compliant partner factories in India for buyers"), india);
  assert.ok(!/bangladesh/i.test(strip(india)), india);

  const bd = categoryAnswer(category({ origins: ["bangladesh"] }), site);
  assert.ok(bd.includes("compliant partner factories in Bangladesh for buyers"), bd);

  const both = categoryAnswer(category({ origins: ["bangladesh", "india"] }), site);
  assert.ok(both.includes("compliant partner factories in Bangladesh and India for buyers"), both);

  for (const a of [none, india, bd, both]) {
    const n = wc(a);
    assert.ok(n >= 40 && n <= 60, `${n} words: ${a}`);
  }
});
