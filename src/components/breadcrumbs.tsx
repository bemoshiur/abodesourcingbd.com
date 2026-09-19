import Link from "next/link";
import { Icon } from "@/components/icon";
import type { Crumb } from "@/lib/routes";

/**
 * Visual breadcrumb trail. The BreadcrumbList structured data is emitted once,
 * inside each page's @graph (see lib/schema.ts) — not here. `items` excludes Home.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border/60 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <Icon name="ChevronRight" className="size-3.5 text-muted-foreground/60" />}
                {last ? (
                  <span aria-current="page" className="max-w-[16rem] truncate font-medium text-foreground sm:max-w-none">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="inline-flex items-center py-1.5 text-muted-foreground transition-colors hover:text-foreground">
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
