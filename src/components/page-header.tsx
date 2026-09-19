import { AnswerBlock } from "@/components/answer-block";
import { cn } from "@/lib/utils";

/**
 * Top-of-page block: eyebrow, the page's single <h1>, intro, the AnswerBlock
 * (right after the H1, as the answer-engine layout requires) and optional extras.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  answer,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  answer?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden border-b border-border", className)}>
      <div aria-hidden className="mesh-light absolute inset-0" />
      <div aria-hidden className="orb float-slow -right-24 -top-24 size-72 bg-accent/25" />
      <div aria-hidden className="orb float-slower -left-24 bottom-0 size-64 bg-primary/15" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-4xl font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{intro}</p>}
        {answer && <AnswerBlock text={answer} className="mt-6" />}
        {children}
      </div>
    </header>
  );
}
