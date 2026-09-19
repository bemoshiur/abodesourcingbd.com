import Link from "next/link";
import { Logo } from "@/components/logo";
import { LogoPlate } from "@/components/logo-plate";
import { Icon } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { FooterCertifications } from "@/components/footer-certifications";
import { navItems } from "@/lib/routes";
import { getSiteSettings, getServices, getCategories, getSiteContent } from "@/lib/payload";

export async function SiteFooter() {
  const [{ site }, services, products, { memberships }] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getCategories(),
    getSiteContent(),
  ]);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <CtaBand />
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo markClassName="size-12" />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">{site.oneLiner}</p>
              <p className="mt-4 text-sm font-medium text-accent-ink">{site.tagline}</p>
            </div>

            <FooterCol title="Services">
              {services.map((s) => (
                <FooterLink key={s.slug} href={`/services/${s.slug}/`}>
                  {s.title}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title="Products">
              {products.map((p) => (
                <FooterLink key={p.slug} href={`/products/${p.slug}/`}>
                  {p.title}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title="Company">
              {navItems.map((n) => (
                <FooterLink key={n.href} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
            </FooterCol>
          </div>

          <FooterCertifications />

          {memberships.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Memberships</p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {memberships.map((m) => (
                  <li key={m.name}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {m.logo ? <LogoPlate image={m.logo} alt={`${m.name} logo`} sizes="80px" className="h-12 w-[4.5rem] rounded-md" /> : null}
                      <span>
                        {m.relation === "member" ? "Member of " : ""}
                        {m.name}
                        {m.idValue ? <span className="tabular-nums"> · {m.idLabel ?? "ID"} {m.idValue}</span> : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 grid gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <p className="flex items-start gap-2">
                <Icon name="MapPin" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {site.address.line1}, {site.address.line2}, {site.address.city}, {site.address.country}
                </span>
              </p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {site.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 py-1.5 hover:text-foreground"
                  >
                    <Icon name="Mail" className="size-4 text-primary" />
                    {email}
                  </a>
                ))}
              </p>
            </div>
            <div className="space-y-1 text-xs sm:text-right">
              <p>
                © <span className="tabular-nums">{year}</span> {site.name}. All rights reserved.
              </p>
              <p>
                Made with <span className="text-accent-ink">♥</span> by{" "}
                <a
                  href="https://publicpulse.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  Public Pulse Agency
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** A link column. The label is a <p>, not a heading: these are navigation labels, not document sections. */
function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </nav>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} prefetch={false} className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
        {children}
      </Link>
    </li>
  );
}
