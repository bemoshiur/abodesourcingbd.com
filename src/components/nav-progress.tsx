"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top progress bar that fires on route change. Pathname change means the
 * new route has committed, so we play a short "load → finish" cue. The CSS
 * keyframes carry the reduced-motion guard.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setState("loading");
    const toDone = setTimeout(() => setState("done"), 280);
    const toIdle = setTimeout(() => setState("idle"), 640);
    return () => {
      clearTimeout(toDone);
      clearTimeout(toIdle);
    };
  }, [pathname]);

  if (state === "idle") return null;

  return (
    <div
      className="nav-progress"
      data-state={state}
      role="progressbar"
      aria-hidden
      aria-label="Page loading"
    />
  );
}
