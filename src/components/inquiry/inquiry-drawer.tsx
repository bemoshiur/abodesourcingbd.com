"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CONTACT_PATH } from "@/lib/routes";
import { useInquiry, useInquiryDrawer } from "./inquiry-store";

/** Header trigger: clipboard icon + live count badge. */
export function InquiryButton({ className }: { className?: string }) {
  const { count } = useInquiry();
  const { setOpen } = useInquiryDrawer();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={count ? `Inquiry list, ${count} ${count === 1 ? "style" : "styles"}` : "Inquiry list (empty)"}
      className={cn(
        "relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background/70 px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted",
        className,
      )}
    >
      <Icon name="ClipboardList" className="size-4 text-primary" />
      <span className="hidden xl:inline">Inquiry list</span>
      {count > 0 && (
        <span
          key={count}
          className="pop-in grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-5 text-primary-foreground tabular-nums"
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** Slide-over listing the chosen styles; sends the visitor on to the contact form. */
export function InquiryDrawer() {
  const { items, remove, clear, count } = useInquiry();
  const { open, setOpen } = useInquiryDrawer();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="font-display text-xl">Your inquiry list</SheetTitle>
          <SheetDescription>
            {count
              ? `${count} ${count === 1 ? "style" : "styles"} selected — we'll quote them together.`
              : "Add styles from the product pages and we'll quote them together."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {count === 0 ? (
            <div className="grid h-full place-items-center px-6 text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon name="ClipboardList" className="size-6" />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">
                  Your list is empty. Browse our styles and tap “Add to inquiry”.
                </p>
                <Link
                  href="/products/"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-5")}
                >
                  Browse products
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={`${i.categorySlug}/${i.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
                >
                  <Link
                    href={`/products/${i.categorySlug}/${i.slug}/`}
                    onClick={() => setOpen(false)}
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    {i.image && (
                      <Image src={i.image} alt={i.name} fill sizes="64px" className="object-contain p-1" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    {i.styleNumber && (
                      <p className="text-xs text-muted-foreground">Style {i.styleNumber}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={`Remove ${i.name}`}
                    className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Icon name="Trash2" className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count > 0 && (
          <div className="space-y-2 border-t border-border bg-muted/40 p-4">
            <Link
              href={CONTACT_PATH}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "xl" }), "btn-shine w-full")}
            >
              Send inquiry ({count})
              <Icon name="ArrowRight" className="size-4" />
            </Link>
            <button
              type="button"
              onClick={clear}
              className="w-full py-1 text-center text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Clear list
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
