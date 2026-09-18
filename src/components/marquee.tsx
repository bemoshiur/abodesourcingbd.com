import { cn } from "@/lib/utils";

/**
 * Seamless CSS-only ticker. The track holds two identical sets and animates
 * exactly -50% (see .marquee-* in globals.css). Pauses on hover/focus; with
 * reduced motion it becomes a static, swipeable row. The duplicate set is
 * aria-hidden so screen readers read the list once.
 */
export function Marquee({
  children,
  className,
  duration = 45,
  gap = "1rem",
  reverse = false,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full loop — larger = slower. */
  duration?: number;
  gap?: string;
  reverse?: boolean;
  label?: string;
}) {
  return (
    <div
      className={cn("marquee-mask", reverse && "marquee-reverse", className)}
      style={{ ["--marquee-duration" as string]: `${duration}s`, ["--marquee-gap" as string]: gap }}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      <div className="marquee-track">
        <ul className="marquee-set">{children}</ul>
        <ul className="marquee-set" aria-hidden>
          {children}
        </ul>
      </div>
    </div>
  );
}
