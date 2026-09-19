"use client";

import { useEffect, useRef, type ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal-on-scroll wrapper. Adds `.is-visible` when the element enters the
 * viewport (the CSS hidden state lives only inside a prefers-reduced-motion:
 * no-preference query, so reduced-motion users and no-JS both see content).
 */
export function Reveal({
  as,
  className,
  delay = 0,
  id,
  children,
}: {
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Anchor target, e.g. for a table of contents. */
  id?: string;
  children: React.ReactNode;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver → reveal immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
