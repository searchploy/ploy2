import { Check, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ListingPreviewData {
  name: string;
  categoryName: string | null;
  tagline: string;
  description: string;
  primaryTasks: string[];
  bestFor: string[];
  bestForDescription: string;
  agencyName: string;
  websiteUrl: string;
  logoUrl: string;
  /** null means the listing is shown as "Custom Pricing". */
  priceMonthly: number | null;
}

/**
 * Approximates the marketplace detail page so a creator can see what
 * businesses will see before publishing. Read-only — the CTA is inert here.
 */
export function ListingPreview({ data }: { data: ListingPreviewData }) {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-4">
        {data.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.logoUrl}
            alt=""
            className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50 text-lg font-semibold text-muted-foreground">
            {data.name.trim().charAt(0).toUpperCase() || "?"}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold">
            {data.name.trim() || "Your AI employee"}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {data.categoryName && (
              <span className="rounded-full bg-ploy-gold/10 px-2.5 py-1 text-xs font-medium text-ploy-gold">
                {data.categoryName}
              </span>
            )}
            {data.agencyName.trim() && (
              <span className="text-xs text-muted-foreground">by {data.agencyName.trim()}</span>
            )}
          </div>
        </div>
      </div>

      {data.tagline.trim() && (
        <p className="text-balance text-muted-foreground">{data.tagline.trim()}</p>
      )}

      {data.description.trim() && (
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {data.description.trim()}
        </p>
      )}

      {data.primaryTasks.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What it does
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {data.primaryTasks.map((task) => (
              <li key={task} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-ploy-gold" />
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(data.bestFor.length > 0 || data.bestForDescription.trim()) && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Best for
          </p>
          {data.bestFor.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
          {data.bestForDescription.trim() && (
            <p className="mt-2 text-sm text-muted-foreground">{data.bestForDescription.trim()}</p>
          )}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          {data.priceMonthly != null ? "Starting at" : "Pricing"}
        </p>
        <p className="text-2xl font-semibold">
          {data.priceMonthly != null ? (
            <>
              ${data.priceMonthly}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </>
          ) : (
            "Custom Pricing"
          )}
        </p>
      </div>

      <Button disabled className="w-full sm:w-auto">
        Visit Agency Website
        <ExternalLink className="h-4 w-4" />
      </Button>
    </Card>
  );
}
