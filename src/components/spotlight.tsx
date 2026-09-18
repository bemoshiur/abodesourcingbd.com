"use client";

import { useCallback, type ElementType } from "react";
import { cn } from "@/lib/utils";

/** Wraps a card so a soft light follows the pointer (fine pointers only; CSS in globals.css). */
export function Spotlight({
  as,
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = (as ?? "div") as ElementType;
  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <Tag className={cn("spotlight", className)} onPointerMove={onMove}>
      {children}
    </Tag>
  );
}
