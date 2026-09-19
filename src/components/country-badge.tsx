import { Icon } from "@/components/icon";
import { COUNTRY_LABEL, type FactoryCountry } from "@/lib/payload";
import { cn } from "@/lib/utils";

/** "Factory in Bangladesh" / "Factory in India" pill — same wording used in titles and structured data. */
export function CountryBadge({
  country,
  location,
  className,
}: {
  country: FactoryCountry;
  location?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        country === "india"
          ? "border-accent/50 bg-accent/15 text-accent-ink"
          : "border-primary/25 bg-primary/8 text-primary",
        className,
      )}
    >
      <Icon name="MapPin" className="size-3.5" />
      {COUNTRY_LABEL[country]}
      {location ? <span className="font-normal opacity-80">· {location}</span> : null}
    </span>
  );
}
