import Image from "next/image";
import type { Buyer } from "@/content/buyers";
import { cn } from "@/lib/utils";

/**
 * Buyer logo wall. Renders a real logo when one is available, otherwise a
 * clean typographic wordmark tile so the wall stays complete and uniform.
 */
export function LogoWall({
  buyers,
  className,
}: {
  buyers: readonly Buyer[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {buyers.map((b) => (
        <div key={b.slug} className="grid h-24 place-items-center bg-card p-5">
          {b.logo ? (
            <Image
              src={b.logo}
              alt={`${b.name} logo`}
              width={180}
              height={56}
              className="max-h-12 w-auto object-contain"
            />
          ) : (
            <span className="text-center font-display text-base font-semibold leading-tight text-foreground/75">
              {b.name}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
