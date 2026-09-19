"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { InquiryButton } from "@/components/inquiry/inquiry-drawer";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CONTACT_PATH, navItems } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface MenuItem {
  href: string;
  title: string;
  icon: string;
  summary: string;
}

/**
 * Sticky header: transparent over the page top, condenses into frosted glass on
 * scroll. Products/Services open a mega-menu on hover, keyboard focus or tap
 * (Esc closes). Mobile gets a full-height sheet with accordions.
 */
export function SiteHeader({
  logo,
  products,
  services,
}: {
  logo: React.ReactNode;
  products: MenuItem[];
  services: MenuItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  const menus: Record<string, { items: MenuItem[]; cta: string }> = {
    "/services/": { items: services, cta: "All services" },
    "/products/": { items: products, cta: "Browse all styles" },
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border/60 bg-background/80 shadow-[0_8px_30px_-18px_rgb(0_0_0/0.25)] backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-14" : "h-16",
        )}
      >
        {logo}

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) =>
            menus[item.href] ? (
              <NavDropdown
                key={item.href}
                label={item.label}
                href={item.href}
                active={isActive(item.href)}
                items={menus[item.href].items}
                cta={menus[item.href].cta}
              />
            ) : (
              <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <InquiryButton className="hidden md:inline-flex" />
          <Link
            href={CONTACT_PATH}
            className={cn(buttonVariants({ size: "lg" }), "btn-shine hidden sm:inline-flex")}
          >
            Get a Quote
            <Icon name="ArrowRight" className="size-4" />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }), "lg:hidden")}
          >
            <Icon name="Menu" className="size-5" />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
          <SheetHeader className="border-b border-border p-4">
            {logo}
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
          </SheetHeader>

          <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto p-3">
            {navItems.map((item) => {
              const sub = menus[item.href];
              if (!sub) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium transition-colors hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/20 aria-[current=page]:text-primary"
                  >
                    {item.label}
                    <Icon name="ChevronRight" className="size-4 text-muted-foreground" />
                  </Link>
                );
              }
              return (
                <details key={item.href} className="group rounded-lg" open={isActive(item.href)}>
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium transition-colors marker:hidden hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/20 [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <Icon name="ChevronDown" className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mb-1 ml-3 space-y-0.5 border-l border-border pl-2">
                    <Link href={item.href} onClick={close} className="block rounded-md px-3 py-2.5 text-sm font-semibold text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/20">
                      {sub.cta}
                    </Link>
                    {sub.items.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        onClick={close}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-foreground/85 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/20"
                      >
                        <Icon name={m.icon} className="size-4 text-primary" />
                        {m.title}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </nav>

          <div className="border-t border-border bg-muted/40 p-4">
            <Link
              href={CONTACT_PATH}
              onClick={close}
              className={cn(buttonVariants({ size: "xl" }), "btn-shine w-full")}
            >
              Get a Quote
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

const linkBase =
  "nav-link relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-foreground/85 outline-none transition-colors duration-200 hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-primary aria-expanded:text-primary";

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={linkBase}>
      {children}
    </Link>
  );
}

/** Hover-intent + focus + Esc mega-menu panel. */
function NavDropdown({
  label,
  href,
  active,
  items,
  cta,
}: {
  label: string;
  href: string;
  active: boolean;
  items: MenuItem[];
  cta: string;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 90);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 140);
  };
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) hide();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        className={linkBase}
      >
        {label}
        <Icon name="ChevronDown" className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </Link>
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 w-[36rem] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur-xl before:absolute before:inset-x-8 before:top-0 before:h-0.5 before:rounded-full before:bg-gradient-to-r before:from-primary before:via-[oklch(0.62_0.11_150)] before:to-accent">
          <ul className="grid grid-cols-2 gap-1">
            {items.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="group/item flex items-start gap-3 rounded-xl p-3 outline-none ring-1 ring-transparent transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/20 hover:ring-primary/25 focus-visible:bg-gradient-to-br focus-visible:from-primary/10 focus-visible:to-accent/20 focus-visible:ring-primary/40 motion-reduce:transform-none"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover/item:scale-105 group-hover/item:bg-gradient-to-br group-hover/item:from-primary group-hover/item:to-[oklch(0.55_0.1_155)] group-hover/item:text-primary-foreground group-hover/item:shadow-md group-focus-visible/item:bg-gradient-to-br group-focus-visible/item:from-primary group-focus-visible/item:to-[oklch(0.55_0.1_155)] group-focus-visible/item:text-primary-foreground">
                    <Icon name={m.icon} className="size-[1.1rem]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground transition-colors group-hover/item:text-primary">{m.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{m.summary}</span>
                  </span>
                  <Icon name="ArrowRight" className="mt-1 size-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className="btn-shine mt-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary to-[oklch(0.5_0.09_160)] px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110"
          >
            {cta}
            <Icon name="ArrowRight" className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
