"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

/**
 * Pause / play control for a scrolling band (WCAG 2.2.2: moving content longer
 * than 5 s needs a way to stop it). Toggles data-paused on the nearest
 * [data-marquee-root]; CSS does the rest.
 */
export function MarqueePause({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={(e) => {
        const next = !paused;
        setPaused(next);
        e.currentTarget.closest("[data-marquee-root]")?.setAttribute("data-paused", String(next));
      }}
      className={className}
    >
      <Icon name={paused ? "Sparkles" : "Minus"} className="size-3.5" />
      {paused ? "Play animation" : "Pause animation"}
    </button>
  );
}
