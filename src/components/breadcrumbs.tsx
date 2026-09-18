import Link from "next/link";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/jsonld";
import { getSiteSettings } from "@/lib/payload";
import type { Crumb } from "@/lib/routes";

/**
 * Visual breadcrumb + BreadcrumbList JSON-LD. Used on every non-home page.
 * `items` excludes Home — it is prepended automatically.
 */
export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { site } = await getSiteSettings();
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${site.url}${c.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border/60 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && (
                  <Icon name="ChevronRight" className="size-3.5 text-muted-foreground/60" />
                )}
                {last ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
