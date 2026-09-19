import { Icon } from "@/components/icon";
import { LogoPlate } from "@/components/logo-plate";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, type MembershipView } from "@/lib/payload";
import { cn } from "@/lib/utils";

/** Trade-body memberships and registrations, each with its official logo when the CMS has one. */
export async function MembershipsBand({
  className,
  compact = false,
}: {
  className?: string;
  /** Compact = a single quiet row (used on Home / About); full = headed cards (Compliance). */
  compact?: boolean;
}) {
  const { memberships } = await getSiteContent();
  if (!memberships.length) return null;

  return (
    <section aria-labelledby="memberships-heading" className={cn(className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {compact ? (
          <h2 id="memberships-heading" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Memberships &amp; registrations
          </h2>
        ) : (
          <SectionHeading
            eyebrow="Memberships & registrations"
            title="Recognised by Bangladesh's trade bodies and government"
            intro="Our buying-house membership and government registration — listed with their official references."
          />
        )}
        <ul className={cn("grid gap-4", compact ? "mt-4 md:grid-cols-2" : "mt-10 md:grid-cols-2")}>
          {memberships.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 70}>
              <MembershipCard membership={m} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MembershipCard({ membership: m }: { membership: MembershipView }) {
  const lead = m.relation === "member" ? "Member of" : m.relation === "registered" ? "Registered with" : "";
  const body = (
    <>
      {m.logo ? (
        <LogoPlate image={m.logo} alt={`${m.name} logo`} sizes="112px" className="h-20 w-28" />
      ) : (
        <span className="grid h-20 w-28 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-border">
          <Icon name="Award" className="size-8 text-primary" />
        </span>
      )}
      <span className="min-w-0">
        {lead ? (
          <span className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{lead}</span>
        ) : null}
        <span className={cn("block font-semibold leading-snug", lead && "mt-0.5")}>{m.fullName}</span>
        {m.idValue ? (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Icon name="BadgeCheck" className="size-3.5" />
            {m.idLabel ?? "ID"}: <span className="tabular-nums">{m.idValue}</span>
          </span>
        ) : null}
      </span>
    </>
  );
  const shell =
    "glass flex h-full items-center gap-4 rounded-2xl p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] motion-reduce:transform-none";
  return m.url ? (
    <a
      href={m.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${lead ? `${lead} ` : ""}${m.fullName}${m.idValue ? `, ${m.idLabel ?? "ID"} ${m.idValue}` : ""} (opens the official website)`}
      className={shell}
    >
      {body}
    </a>
  ) : (
    <div className={shell}>{body}</div>
  );
}
