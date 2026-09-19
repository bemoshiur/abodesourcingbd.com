"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT_PATH } from "@/lib/routes";
import { useInquiry, useInquiryDrawer } from "./inquiry-store";

/**
 * Phone-only action bar pinned to the bottom edge: one-thumb access to the
 * quote form and the inquiry list. Hidden on the contact page itself.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  const { count } = useInquiry();
  const { setOpen } = useInquiryDrawer();
  // /products/<category>/<style>/ has its own sticky "Add to inquiry" bar.
  const onProductPage = /^\/products\/[^/]+\/[^/]+\/?$/.test(pathname);
  if (pathname.startsWith("/contact") || pathname.startsWith("/admin") || onProductPage) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.18)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Inquiry list, ${count} ${count === 1 ? "style" : "styles"}`}
          className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-card"
        >
          <Icon name="ClipboardList" className="size-5 text-primary" />
          {count > 0 && (
            <span
              key={count}
              className="pop-in absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-5 text-accent-foreground tabular-nums"
            >
              {count}
            </span>
          )}
        </button>
        <Link
          href={CONTACT_PATH}
          className={cn(buttonVariants({ size: "xl" }), "btn-shine h-12 flex-1")}
        >
          {count > 0 ? `Send inquiry (${count})` : "Get a Quote"}
          <Icon name="ArrowRight" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
