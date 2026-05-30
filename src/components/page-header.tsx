export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
