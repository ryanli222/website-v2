"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryItem = {
  src: string;
  alt?: string;
  caption?: string;
};

type Props = {
  items: GalleryItem[];
};

export default function ImageGallery({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );
  const prev = useCallback(
    () =>
      setOpen((i) =>
        i === null ? i : (i - 1 + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  if (!items.length) return null;

  const active = open !== null ? items[open] : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-md border border-[#e5e5e5] bg-[#fafafa] cursor-pointer"
          >
            <Image
              src={item.src}
              alt={item.alt ?? ""}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/10 transition-colors" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="close"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#1a1a1a] text-[22px] leading-none transition-colors"
          >
            ×
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="previous"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#1a1a1a] transition-colors"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="next"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#1a1a1a] transition-colors"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative flex flex-col items-center max-w-[1100px] max-h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[72vh] rounded-lg overflow-hidden bg-[#1a1a1a]">
              <Image
                src={active.src}
                alt={active.alt ?? ""}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between w-full text-white/80 text-[13px] lowercase">
              <span>{active.caption ?? active.alt ?? ""}</span>
              <span>
                {(open ?? 0) + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
