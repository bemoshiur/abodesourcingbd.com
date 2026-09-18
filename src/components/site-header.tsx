"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { navItems, CONTACT_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function SiteHeader({ logo }: { logo: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Closing on link click (below) keeps route changes and sheet state in sync
  // without a setState-in-effect.
  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {logo}

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-300",
                "hover:after:scale-x-100 aria-[current=page]:text-foreground aria-[current=page]:after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={CONTACT_PATH}
            className={cn(buttonVariants({ size: "lg" }), "hidden sm:inline-flex")}
          >
            Get a Quote
            <Icon name="ArrowRight" className="size-4" />
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "lg:hidden")}
          >
            <Icon name="Menu" className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile nav — Sheet (base-ui dialog): keyboard-operable, focus-trapped. */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-xs gap-0 p-0">
          <SheetHeader className="border-b border-border p-4">
            {logo}
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
          </SheetHeader>

          <nav aria-label="Mobile" className="flex flex-col p-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted aria-[current=page]:text-primary"
              >
                {item.label}
                <Icon name="ChevronRight" className="size-4 text-muted-foreground" />
              </Link>
            ))}
            <Link
              href={CONTACT_PATH}
              onClick={close}
              className={cn(buttonVariants({ size: "lg" }), "mt-3 w-full")}
            >
              Get a Quote
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
