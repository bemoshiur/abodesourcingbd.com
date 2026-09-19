import Image from "next/image";
import { Icon } from "@/components/icon";
import { Marquee } from "@/components/marquee";
import { MarqueePause } from "@/components/marquee-pause";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, type CertificationView } from "@/lib/payload";
import { cn } from "@/lib/utils";

/**
 * Two counter-scrolling rows of certification marks on a dark mesh band.
 * Server-rendered (no JS clone, no layout flash); pauses on hover/focus and via
 * a visible button; reduced-motion users get a static swipeable row.
 * Marks are shown as logos when the CMS has one, otherwise as text badges.
 */
export async function CertificationsBand({ className }: { className?: string }) {
  const { certifications } = await getSiteContent();
  if (!certifications.length) return null;
  const mid = Math.ceil(certifications.length / 2);
  const rows = [certifications.slice(0, mid), certifications.slice(mid)];

  return (
    <section
      data-marquee-root
      aria-labelledby="certifications-heading"
      className={cn("mesh-dark overflow-hidden py-14 lg:py-20", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            tone="invert"
            eyebrow="Trust, audited"
            title="Certifications held across our partner factories"
            intro={`${certifications.length} recognised social, environmental and quality standards — carried by the factories we place your orders with.`}
            className="flex-1"
          />
          <MarqueePause className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur transition-colors hover:bg-white/20" />
        </div>
      </div>

      <div className="mt-10 space-y-4" id="certifications-heading-region">
        {rows.map((row, i) => (
          <Marquee
            key={i}
            reverse={i % 2 === 1}
            duration={Math.max(28, row.length * 7)}
            gap="1rem"
            label={i === 0 ? `${certifications.length} certifications held across our partner factories` : undefined}
          >
            {row.map((c) => (
              <CertChip key={c.name} cert={c} />
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}

function CertChip({ cert }: { cert: CertificationView }) {
  return (
    <li className="flex shrink-0 items-center gap-3.5 rounded-2xl border border-white/12 bg-white/[0.07] px-5 py-3.5 backdrop-blur-sm transition-colors hover:bg-white/[0.12]">
      {cert.logo ? (
        <span className="relative h-10 w-16 shrink-0">
          <Image src={cert.logo.cardUrl} alt="" fill sizes="64px" className="object-contain" />
        </span>
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-[oklch(0.62_0.11_120)] text-accent-foreground shadow-[0_6px_16px_-6px_oklch(0.78_0.14_92/0.7)]">
          <Icon name="BadgeCheck" className="size-5" />
        </span>
      )}
      <span className="whitespace-nowrap">
        <span className="block text-[0.95rem] font-semibold leading-tight text-primary-foreground">{cert.name}</span>
        <span className="mt-0.5 block text-xs text-primary-foreground/65">{cert.full}</span>
      </span>
    </li>
  );
}
