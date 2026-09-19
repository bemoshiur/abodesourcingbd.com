"use client";

import { AddToInquiry } from "@/components/inquiry/add-to-inquiry";
import type { InquiryItem } from "@/components/inquiry/inquiry-store";

/**
 * Phone-only bar on a product page: name + one-tap "Add to inquiry" stay in
 * thumb reach while reading specs. (The global mobile bar hides itself on
 * product pages so the two never stack.)
 */
export function ProductStickyBar({ item }: { item: InquiryItem }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.18)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          {item.styleNumber && <p className="text-xs tabular-nums text-primary">{item.styleNumber}</p>}
        </div>
        <AddToInquiry item={item} variant="full" className="h-12 w-auto shrink-0 px-5 text-sm" />
      </div>
    </div>
  );
}
