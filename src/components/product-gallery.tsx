"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  url: string;
  thumbUrl: string;
  alt: string;
  width: number;
  height: number;
  view: string;
}

/**
 * Product photo viewer: pointer-follow zoom on desktop, tap-to-open lightbox on
 * every device (keyboard: Enter on the image, ←/→ between photos), thumbnail
 * strip when a style has more than one photo.
 */
export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const img = images[active] ?? images[0];
  const many = images.length > 1;

  const go = (delta: number) => setActive((i) => (i + delta + images.length) % images.length);
  const onKey = (e: React.KeyboardEvent) => {
    if (!many) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <div className="space-y-3" onKeyDown={onKey}>
      <div
        className="photo-stage group relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] sm:aspect-[4/5]"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Enlarge photo of ${name}`}
          className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Image
          key={img.url}
          src={img.url}
          alt={img.alt}
          width={img.width}
          height={img.height}
          priority
          sizes="(max-width: 1024px) 92vw, 46vw"
          style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          className={cn(
            "absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-300 ease-out motion-reduce:transition-none sm:p-8",
            zoom ? "scale-[1.9]" : "scale-100",
          )}
        />
        <span className="glass pointer-events-none absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full">
          <Icon name="ZoomIn" className="size-5 text-primary" />
        </span>
        {many && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="glass absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full"
            >
              <Icon name="ChevronLeft" className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="glass absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full"
            >
              <Icon name="ChevronRight" className="size-5" />
            </button>
          </>
        )}
      </div>

      {many && (
        <ul className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((im, i) => (
            <li key={im.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${im.view} view`}
                aria-current={i === active}
                className={cn(
                  "photo-stage relative block size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                  i === active ? "border-primary" : "border-border hover:border-primary/40",
                )}
              >
                <Image src={im.thumbUrl} alt="" width={im.width} height={im.height} sizes="80px" className="h-full w-full object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl" onKeyDown={onKey}>
          <DialogTitle className="sr-only">{name} — enlarged photo</DialogTitle>
          <div className="photo-stage relative flex items-center justify-center rounded-xl">
            <Image
              src={img.url}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(max-width: 768px) 92vw, 720px"
              className="max-h-[78vh] w-auto object-contain p-2"
            />
          </div>
          {many && (
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => go(-1)} className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm">
                <Icon name="ChevronLeft" className="size-4" /> Previous
              </button>
              <span className="text-xs tabular-nums text-muted-foreground">{active + 1} / {images.length}</span>
              <button type="button" onClick={() => go(1)} className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm">
                Next <Icon name="ChevronRight" className="size-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
