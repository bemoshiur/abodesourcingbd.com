"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { CONTACT_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="mesh-light absolute inset-0 -z-10" />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:py-32">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <Icon name="CircleAlert" className="size-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Something went wrong</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page could not load. Please try again — if it keeps happening, contact us and we will help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button type="button" size="xl" onClick={reset} className="btn-shine">
            Try again
          </Button>
          <Link href={CONTACT_PATH} className={cn(buttonVariants({ variant: "outline", size: "xl" }), "bg-card/70")}>
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
