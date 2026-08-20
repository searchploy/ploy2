"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmployeeWithCategory } from "@/lib/data/live-marketplace";

export function LiveEmployeeCard({
  employee,
  index = 0,
  isReportMatch = false,
}: {
  employee: EmployeeWithCategory;
  index?: number;
  isReportMatch?: boolean;
}) {
  // Seeded listings lead with a problem quote + outcomes. Listings created via
  // the create-listing form supply a tagline + primary tasks instead, so fall
  // back to those rather than rendering an near-empty card.
  const problem = employee.business_problems?.[0] ?? employee.tagline ?? undefined;
  const highlights =
    employee.outcomes && employee.outcomes.length > 0
      ? employee.outcomes
      : (employee.primary_tasks ?? []);

  const cardClassName = "hover-glow-border flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors sm:flex-row sm:items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
    >
      {employee.website_url ? (
        <div className={cardClassName}>
        <span className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-2xl">
          {employee.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={employee.thumbnail_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            "🤖"
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ploy-gold">{employee.role}</p>
              <h3 className="text-lg font-bold">{employee.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                {employee.avg_rating != null && employee.avg_rating > 0 && (
                  <span className="flex items-center gap-1 font-medium text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {employee.avg_rating}
                  </span>
                )}
                {employee.total_reviews ? <span>({employee.total_reviews} reviews)</span> : null}
                {employee.agency_name && <span>· Built by {employee.agency_name}</span>}
              </div>
            </div>
          </div>

          {problem && <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">&ldquo;{problem}&rdquo;</p>}

          {highlights.length > 0 && (
            <div className="mt-3 flex flex-col gap-1">
              {highlights.slice(0, 2).map((o: string) => (
                <p key={o} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-ploy-gold">↳</span>
                  {o}
                </p>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {isReportMatch && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-ploy-gold">
                <Sparkles className="h-3 w-3" />
                Report Match
              </span>
            )}
            {employee.category && (
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                {employee.category.name}
              </span>
            )}
            {employee.setup_time && (
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                Setup: {employee.setup_time}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-4">
              {employee.price_monthly != null && (
                <span className="font-mono text-base font-bold">
                  ${employee.price_monthly}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </span>
              )}
              {employee.avg_roi_percent != null && (
                <span className="font-mono text-xs font-semibold text-success">Avg. ROI {employee.avg_roi_percent}%</span>
              )}
            </div>
            {employee.website_url ? (
              <Button size="sm" asChild>
                <a href={employee.website_url} target="_blank" rel="noopener noreferrer">
                  Go to website
                </a>
              </Button>
            ) : (
              <Button size="sm">View Details</Button>
            )}
          </div>
        </div>
        </div>
      ) : (
        <Link
          href={`/marketplace/${employee.slug}`}
          className={cardClassName}
        >
        <span className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-2xl">
          {employee.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={employee.thumbnail_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            "🤖"
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ploy-gold">{employee.role}</p>
              <h3 className="text-lg font-bold">{employee.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                {employee.avg_rating != null && employee.avg_rating > 0 && (
                  <span className="flex items-center gap-1 font-medium text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {employee.avg_rating}
                  </span>
                )}
                {employee.total_reviews ? <span>({employee.total_reviews} reviews)</span> : null}
                {employee.agency_name && <span>· Built by {employee.agency_name}</span>}
              </div>
            </div>
          </div>

          {problem && <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">&ldquo;{problem}&rdquo;</p>}

          {highlights.length > 0 && (
            <div className="mt-3 flex flex-col gap-1">
              {highlights.slice(0, 2).map((o: string) => (
                <p key={o} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-ploy-gold">↳</span>
                  {o}
                </p>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {isReportMatch && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-ploy-gold">
                <Sparkles className="h-3 w-3" />
                Report Match
              </span>
            )}
            {employee.category && (
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                {employee.category.name}
              </span>
            )}
            {employee.setup_time && (
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                Setup: {employee.setup_time}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-4">
              {employee.price_monthly != null && (
                <span className="font-mono text-base font-bold">
                  ${employee.price_monthly}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </span>
              )}
              {employee.avg_roi_percent != null && (
                <span className="font-mono text-xs font-semibold text-success">Avg. ROI {employee.avg_roi_percent}%</span>
              )}
            </div>
            <Button size="sm">View Details</Button>
          </div>
        </div>
        </Link>
      )}
    </motion.div>
  );
}
