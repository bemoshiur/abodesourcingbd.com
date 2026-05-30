import { services, type Service } from "@/content/services";
import { factories, type Factory } from "@/content/factories";
import type { ProductSlug } from "@/content/products";

/** Services whose relatedCategories include this product category. */
export function servicesForCategory(slug: ProductSlug): Service[] {
  return services.filter((s) => s.relatedCategories.includes(slug));
}

/** Partner factories that run this product category. */
export function factoriesForCategory(slug: ProductSlug): Factory[] {
  return factories.filter((f) => f.categories.includes(slug));
}

/** Services relevant to a factory, derived from the categories it runs. */
export function servicesForFactory(factory: Factory): Service[] {
  return services.filter((s) =>
    s.relatedCategories.some((c) => factory.categories.includes(c)),
  );
}
