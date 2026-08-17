"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmployeeImage } from "@/lib/types/mock";

export function EmployeeGallery({ images, videoUrl }: { images: EmployeeImage[]; videoUrl: string | null }) {
  const items = [
    ...(videoUrl ? [{ type: "video" as const, url: videoUrl }] : []),
    ...images.map((img) => ({ type: "image" as const, url: img.url, alt: img.alt_text ?? "" })),
  ];
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;
  const current = items[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-secondary">
        {current.type === "video" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted text-muted-foreground">
            <PlayCircle className="h-14 w-14" />
            <p className="text-sm">Demo video coming soon</p>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.url} alt={current.alt ?? ""} className="h-full w-full object-cover" />
        )}
      </div>
      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-none">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-secondary transition-all",
                active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {item.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center">
                  <PlayCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
