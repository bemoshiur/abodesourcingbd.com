"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInquiry, type InquiryItem } from "./inquiry-store";

/**
 * Toggle a product in/out of the visitor's inquiry list.
 *  - variant "full": large labelled button (product page)
 *  - variant "compact": icon button that overlays a product card
 */
export function AddToInquiry({
  item,
  variant = "full",
  className,
}: {
  item: InquiryItem;
  variant?: "full" | "compact";
  className?: string;
}) {
  const { has, toggle, isFull } = useInquiry();
  const added = has(item);
  const blocked = !added && isFull;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(item);
        }}
        disabled={blocked}
        aria-pressed={added}
        aria-label={added ? `Remove ${item.name} from inquiry` : `Add ${item.name} to inquiry`}
        title={added ? "Remove from inquiry" : "Add to inquiry"}
        className={cn(
          "grid size-9 place-items-center rounded-full border shadow-sm backdrop-blur transition-all duration-300",
          added
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card/90 text-foreground hover:border-primary/50 hover:text-primary",
          "disabled:opacity-40",
          className,
        )}
      >
        <span key={String(added)} className="pop-in">
          <Icon name={added ? "Check" : "Plus"} className="size-4" />
        </span>
      </button>
    );
  }

  return (
    <Button
      type="button"
      size="xl"
      variant={added ? "outline" : "default"}
      onClick={() => toggle(item)}
      disabled={blocked}
      aria-pressed={added}
      className={cn("btn-shine w-full sm:w-auto", added && "border-primary text-primary", className)}
    >
      <span key={String(added)} className="pop-in inline-flex items-center gap-2">
        <Icon name={added ? "Check" : "Plus"} className="size-4" />
        {added ? "Added to inquiry" : blocked ? "Inquiry list is full" : "Add to inquiry"}
      </span>
    </Button>
  );
}
