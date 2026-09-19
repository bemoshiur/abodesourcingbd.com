"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ExplorerProduct extends ProductCardData {
  categoryTitle: string;
  fabricConstruction?: string;
}

const PAGE = 24;
const FIBRES = ["Cotton", "Polyester", "Recycled", "Organic"] as const;

const hasFibre = (p: ExplorerProduct, f: string) =>
  `${p.composition ?? ""}`.toLowerCase().includes(f.toLowerCase());

/**
 * Filterable product grid: category chips, fibre chips, text search (name, style
 * ref, composition) and sort. The full first page is server-rendered (this is
 * still a client component, so its initial HTML ships with real cards and links).
 */
export function ProductsExplorer({
  products,
  categories,
}: {
  products: ExplorerProduct[];
  categories: { slug: string; title: string; count: number }[];
}) {
  const [category, setCategory] = useState<string>("all");
  const [fibre, setFibre] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"style" | "name">("style");
  const [shown, setShown] = useState(PAGE);

  const fibreOptions = useMemo(
    () => FIBRES.filter((f) => products.some((p) => hasFibre(p, f))),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "all" || p.categorySlug === category) &&
        (fibre === "all" || hasFibre(p, fibre)) &&
        (!q ||
          `${p.name} ${p.styleNumber ?? ""} ${p.composition ?? ""} ${p.gsm ?? ""}`.toLowerCase().includes(q)),
    );
    return sort === "name" ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  }, [products, category, fibre, query, sort]);

  const active = category !== "all" || fibre !== "all" || query.trim() !== "";
  const visible = filtered.slice(0, shown);
  const reset = () => {
    setCategory("all");
    setFibre("all");
    setQuery("");
    setShown(PAGE);
  };
  const pick = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setShown(PAGE);
  };

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-16 lg:mx-0 lg:rounded-2xl lg:border lg:px-4 lg:shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block lg:w-72">
            <span className="sr-only">Search styles</span>
            <Icon name="Search" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => pick(setQuery)(e.target.value)}
              placeholder="Search style, fabric, e.g. ABD-2101"
              className="h-11 w-full rounded-xl border border-input bg-card/80 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </label>

          <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1 lg:pb-0" role="group" aria-label="Filter by category">
            <Chip active={category === "all"} onClick={() => pick(setCategory)("all")}>
              All <Count active={category === "all"}>{products.length}</Count>
            </Chip>
            {categories.map((c) => (
              <Chip key={c.slug} active={category === c.slug} onClick={() => pick(setCategory)(c.slug)}>
                {c.title} <Count active={category === c.slug}>{c.count}</Count>
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Fibre</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by fibre">
            <Chip small active={fibre === "all"} onClick={() => pick(setFibre)("all")}>Any</Chip>
            {fibreOptions.map((f) => (
              <Chip small key={f} active={fibre === f} onClick={() => pick(setFibre)(f)}>{f}</Chip>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "style" | "name")}
              className="h-9 rounded-lg border border-input bg-card/80 px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <option value="style">Style number</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground" role="status" aria-live="polite">
        Showing <span className="font-medium tabular-nums text-foreground">{visible.length}</span> of{" "}
        <span className="tabular-nums">{filtered.length}</span> {filtered.length === 1 ? "style" : "styles"}
        {active && (
          <button type="button" onClick={reset} className="ml-3 font-medium text-primary underline-offset-4 hover:underline">
            Clear filters
          </button>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-xl font-semibold">No styles match those filters</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Try a different fibre or category — or send us your own tech pack and we will develop it.
          </p>
          <Button type="button" variant="outline" size="lg" className="mt-5" onClick={reset}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={`${p.categorySlug}/${p.slug}`} product={p} priority={i < 4} />
          ))}
        </div>
      )}

      {filtered.length > shown && (
        <div className="mt-10 text-center">
          <Button type="button" size="xl" variant="outline" onClick={() => setShown((n) => n + PAGE)}>
            Show more styles ({filtered.length - shown} left)
          </Button>
        </div>
      )}
    </div>
  );
}

function Count({ active, children }: { active: boolean; children: React.ReactNode }) {
  // Solid colours (not opacity) so the count keeps AA contrast on both chip states.
  return <span className={cn("tabular-nums", active ? "text-primary-foreground/90" : "text-muted-foreground")}>{children}</span>;
}

function Chip({
  active,
  small,
  onClick,
  children,
}: {
  active: boolean;
  small?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition-colors",
        small ? "h-8 px-3 text-xs" : "h-11 px-4 text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card/80 text-foreground/80 hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
