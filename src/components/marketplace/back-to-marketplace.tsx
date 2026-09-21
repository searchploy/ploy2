"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MARKETPLACE_VISITED_KEY } from "@/lib/constants";

/**
 * Returns to the marketplace, matching what the browser's own back button
 * would do so the two don't disagree: history is popped, which restores the
 * previous scroll position.
 *
 * Filters do not survive the trip — marketplace-browser holds them in
 * component state rather than the URL, so the list remounts unfiltered.
 *
 * Popping history is only safe when the marketplace is actually behind us.
 * Anyone arriving from a shared link or a search result follows the href
 * instead, which is also what middle-click and modifier-click get.
 */
export function BackToMarketplace() {
  const router = useRouter();

  return (
    <Link
      href="/marketplace"
      onClick={(e) => {
        // Let the browser handle new-tab/window modifiers itself.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        let visited = false;
        try {
          visited = sessionStorage.getItem(MARKETPLACE_VISITED_KEY) === "1";
        } catch {
          // Blocked storage: fall through to the href.
        }
        if (!visited) return;

        e.preventDefault();
        router.back();
      }}
      className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to marketplace
    </Link>
  );
}
