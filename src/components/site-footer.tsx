import Link from "next/link";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { navItems } from "@/lib/routes";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { products } from "@/content/products";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <CtaBand />
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo markClassName="size-12" />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                {site.oneLiner}
              </p>
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

          <div className="mt-10 grid gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <p className="flex items-start gap-2">
                <Icon name="MapPin" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {site.address.line1}, {site.address.line2}, {site.address.city},{" "}
                  {site.address.country}
                </span>
              </p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {site.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 hover:text-foreground"
                  >
                    <Icon name="Phone" className="size-4 text-primary" />
                    <span className="tabular-nums">{phone}</span>
                  </a>
                ))}
              </p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {site.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 hover:text-foreground"
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

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
