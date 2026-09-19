import { LogoPlate } from "@/components/logo-plate";
import { Marquee } from "@/components/marquee";
import { MarqueePause } from "@/components/marquee-pause";
import { getSiteContent } from "@/lib/payload";

/**
 * Quiet logo-only ticker in the footer of every page (the detailed band with names lives on
 * /compliance/). Server-rendered, pauses on hover/focus and via the button (WCAG 2.2.2);
 * with reduced motion it becomes a static swipeable row.
 */
export async function FooterCertifications() {
  const { certifications } = await getSiteContent();
  const marks = certifications.filter((c) => c.logo);
  if (!marks.length) return null;

  return (
    <div data-footer-certs data-marquee-root className="mt-10 border-t border-border pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
          Certifications across our partner factories
        </p>
        <MarqueePause className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" />
      </div>
      <Marquee
        duration={80}
        gap="1.25rem"
        className="mt-4"
        label={`${marks.length} certifications held across our partner factories`}
      >
        {marks.map((c) => (
          <li key={c.name} className="shrink-0">
            <LogoPlate
              image={c.logo!}
              alt={`${c.name} logo`}
              sizes="120px"
              plain
              height={46}
              pad={6}
              minWidth={62}
              maxWidth={116}
              className="rounded-lg opacity-85 transition-opacity hover:opacity-100"
            />
          </li>
        ))}
      </Marquee>
    </div>
  );
}
