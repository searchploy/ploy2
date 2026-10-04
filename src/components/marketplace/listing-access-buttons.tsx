"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getAccessLinks, type AccessMethod } from "@/lib/listing/access";

type Listing = {
  id: string;
  name: string;
  slug: string;
  agency_name: string | null;
  website_url: string | null;
  app_store_url?: string | null;
  google_play_url?: string | null;
};

const EVENT_TYPE: Record<AccessMethod, string> = {
  website: "website_click",
  app_store: "app_store_click",
  google_play: "google_play_click",
};

// Records where the visitor was sent — never who they are. Fire-and-forget:
// the link has already opened, and a failed insert must not surface anywhere.
function trackAccessClick(listing: Listing, method: AccessMethod, surface: "card" | "detail") {
  try {
    void createClient()
      .from("analytics_events")
      .insert({
        employee_id: listing.id,
        event_type: EVENT_TYPE[method],
        properties: { destination: method, listing_name: listing.name, listing_slug: listing.slug, surface },
      })
      .then(
        () => {},
        () => {}
      );
  } catch {}
}

const CARD_SINGLE_LABEL: Record<AccessMethod, string> = {
  website: "Go to website",
  app_store: "Download on App Store",
  google_play: "Get it on Google Play",
};

const CARD_MULTI_LABEL: Record<AccessMethod, string> = {
  website: "Visit website",
  app_store: "App Store",
  google_play: "Google Play",
};

const DETAIL_LABEL: Record<AccessMethod, string> = {
  website: "Visit Agency Website",
  app_store: "Download on the App Store",
  google_play: "Get it on Google Play",
};

/**
 * Marketplace card CTA. The card is one big Link to the detail page, so each
 * button stops that navigation and opens the provider's destination instead.
 * A website-only listing renders the same single "Go to website" button the
 * card has always had.
 */
export function CardAccessButtons({ listing }: { listing: Listing }) {
  const links = getAccessLinks(listing);
  if (links.length === 0) return <Button size="sm">View Details</Button>;

  const labels = links.length === 1 ? CARD_SINGLE_LABEL : CARD_MULTI_LABEL;
  const buttons = links.map(({ method, url }) => (
    <Button
      key={method}
      size="sm"
      variant="outline"
      className="metal-border text-ploy-gold hover:text-ploy-gold-light"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, "_blank", "noopener,noreferrer");
        trackAccessClick(listing, method, "card");
      }}
    >
      {labels[method]}
    </Button>
  ));

  // A single button is returned bare so website-only cards keep their exact markup.
  return links.length === 1 ? buttons[0] : <div className="flex flex-wrap justify-end gap-2">{buttons}</div>;
}

/** Detail page CTA stack. Renders nothing when the listing has no access links. */
export function DetailAccessButtons({ listing }: { listing: Listing }) {
  const links = getAccessLinks(listing);
  if (links.length === 0) return null;

  const agency = listing.agency_name ?? "the agency";
  const websiteOnly = links.length === 1 && links[0].method === "website";

  return (
    <>
      {links.map(({ method, url }, i) => (
        <Button
          key={method}
          asChild
          size="lg"
          variant={i === 0 ? "default" : "outline"}
          className={i === 0 ? undefined : "metal-border text-ploy-gold hover:text-ploy-gold-light"}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAccessClick(listing, method, "detail")}
          >
            {DETAIL_LABEL[method]}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <p className="text-center text-xs text-muted-foreground">
        {websiteOnly ? (
          <>
            You&apos;re leaving Ploy for {agency}&apos;s website. Ploy doesn&apos;t control that
            site or its terms.
          </>
        ) : (
          <>
            You&apos;re leaving Ploy for {agency}&apos;s website or app store page. Ploy
            doesn&apos;t control those pages or their terms.
          </>
        )}
      </p>
    </>
  );
}
