import SE from "country-flag-icons/react/3x2/SE";
import GB from "country-flag-icons/react/3x2/GB";
import DK from "country-flag-icons/react/3x2/DK";
import DE from "country-flag-icons/react/3x2/DE";
import NL from "country-flag-icons/react/3x2/NL";
import US from "country-flag-icons/react/3x2/US";
import { Reveal } from "@/components/reveal";
import { exportMarkets } from "@/content/site";
import { cn } from "@/lib/utils";

const flags: Record<string, typeof SE> = { SE, GB, DK, DE, NL, US };
const region: Record<string, string> = {
  SE: "Scandinavia",
  GB: "Western Europe",
  DK: "Scandinavia",
  DE: "Western Europe",
  NL: "Western Europe",
  US: "North America",
};

export function ExportMarkets({ className }: { className?: string }) {
  return (
    <section className={cn("relative overflow-hidden", className)} aria-labelledby="export-markets">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
          Where our garments ship
        </p>
        <h2 id="export-markets" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          <span className="text-gradient">Export markets</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          We ship to <span className="tabular-nums">{exportMarkets.length}</span> core
          markets across Europe and North America.
        </p>

        <Reveal as="ul" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {exportMarkets.map((m) => {
            const Flag = flags[m.code];
            return (
              <li
                key={m.code}
                className="interact group/market glass flex flex-col items-center gap-3 rounded-2xl p-5 text-center"
              >
                <span className="overflow-hidden rounded-lg shadow-[var(--shadow-soft)] ring-1 ring-black/5">
                  {Flag && <Flag className="h-10 w-auto" title={m.name} />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{m.name}</span>
                  <span className="mt-0.5 block text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
                    {region[m.code]}
                  </span>
                </span>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
