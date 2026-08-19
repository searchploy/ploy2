import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Check, Star, Clock, TrendingUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/shared/category-icon";
import { LiveEmployeeCard } from "@/components/marketplace/live-employee-card";
import { DemoRequestDialog } from "@/components/marketplace/demo-request-dialog";
import { createClient } from "@/lib/supabase/server";
import {
  getLiveEmployeeBySlugWithCategory,
  getLiveRelatedEmployees,
  getLiveAgencyById,
} from "@/lib/data/live-marketplace";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const employee = await getLiveEmployeeBySlugWithCategory(slug);
  if (!employee) return {};
  return { title: employee.name, description: employee.tagline ?? undefined };
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const employee = await getLiveEmployeeBySlugWithCategory(slug);
  if (!employee) notFound();

  const [related, agency, supabase] = await Promise.all([
    getLiveRelatedEmployees(employee.id, employee.category_id),
    employee.agency_id ? getLiveAgencyById(employee.agency_id) : Promise.resolve(null),
    createClient(),
  ]);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container flex flex-col gap-14 py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {employee.category && (
              <Badge variant="blue">
                <CategoryIcon name={employee.category.icon} className="h-3 w-3" />
                {employee.category.name}
              </Badge>
            )}
            {employee.featured && <Badge variant="premium">Featured</Badge>}
          </div>

          <div className="flex items-start gap-4">
            {employee.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={employee.thumbnail_url}
                alt=""
                className="h-16 w-16 shrink-0 rounded-2xl border border-border object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-ploy-gold">{employee.role}</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{employee.name}</h1>
              {employee.tagline && <p className="mt-2 text-lg text-muted-foreground">{employee.tagline}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {employee.avg_rating != null && employee.avg_rating > 0 && (
              <span className="flex items-center gap-1 font-medium text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                {employee.avg_rating} {employee.total_reviews ? `(${employee.total_reviews} reviews)` : ""}
              </span>
            )}
            {employee.total_purchases ? <span>{employee.total_purchases} businesses deployed</span> : null}
          </div>

          {employee.agency_name && (
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-border p-3 pr-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg">🏢</span>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  {employee.agency_name}
                  {agency?.verified && <BadgeCheck className="h-3.5 w-3.5 text-ploy-gold" />}
                </div>
                {agency ? (
                  <Link href={`/agencies/${agency.slug}`} className="text-xs text-ploy-gold hover:underline">
                    View agency profile
                  </Link>
                ) : (
                  <p className="text-xs text-muted-foreground">Built by {employee.agency_name}</p>
                )}
              </div>
            </div>
          )}

          {employee.business_problems && employee.business_problems.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Problem Solved</h2>
              <div className="flex flex-col gap-2">
                {employee.business_problems.map((p) => (
                  <p key={p} className="rounded-xl bg-secondary/30 p-4 text-sm italic text-muted-foreground">
                    &ldquo;{p}&rdquo;
                  </p>
                ))}
              </div>
            </section>
          )}

          {employee.outcomes && employee.outcomes.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Business Outcome</h2>
              <div className="flex flex-col gap-2">
                {employee.outcomes.map((o) => (
                  <div key={o} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ploy-gold" />
                    {o}
                  </div>
                ))}
              </div>
            </section>
          )}

          {employee.primary_tasks && employee.primary_tasks.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">What it does</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {employee.primary_tasks.map((task: string) => (
                  <li key={task} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ploy-gold" />
                    {task}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {((employee.industries && employee.industries.length > 0) ||
            employee.best_for_description) && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Best for</h2>
              {employee.industries && employee.industries.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {employee.industries.map((item: string) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              )}
              {employee.best_for_description && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {employee.best_for_description}
                </p>
              )}
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-bold">About {employee.name}</h2>
            <p className="leading-relaxed text-muted-foreground">{employee.description}</p>
          </section>

          {employee.integrations && employee.integrations.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Integrations</h2>
              <div className="flex flex-wrap gap-1.5">
                {employee.integrations.map((i) => (
                  <Badge key={i} variant="outline">
                    {i}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-bold">Reviews</h2>
            {reviews && reviews.length > 0 ? (
              <div className="flex flex-col divide-y divide-border">
                {reviews.map((r) => (
                  <div key={r.id} className="flex flex-col gap-2 py-5 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        {r.rating}
                      </span>
                      {r.verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-xs text-ploy-gold">
                          <BadgeCheck className="h-3 w-3" /> Verified purchase
                        </span>
                      )}
                    </div>
                    {r.title && <p className="font-medium">{r.title}</p>}
                    {r.body && <p className="text-sm text-muted-foreground">{r.body}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet — be the first to leave one after purchase.</p>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="flex flex-col gap-5 p-6">
            {employee.price_monthly != null && (
              <div>
                <p className="text-sm text-muted-foreground">Starting at</p>
                <p className="text-3xl font-semibold">
                  ${employee.price_monthly}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 text-sm">
              {employee.setup_time && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Setup time: <span className="font-medium text-foreground">{employee.setup_time}</span>
                </div>
              )}
              {employee.avg_roi_percent != null && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Avg. ROI: <span className="font-medium text-success">{employee.avg_roi_percent}%</span>
                </div>
              )}
              {employee.expected_monthly_savings != null && (
                <p className="text-xs text-muted-foreground">
                  Businesses typically save ~${Number(employee.expected_monthly_savings).toLocaleString()}/mo
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {/* Ploy refers interested businesses to the agency — it does not
                  process the sale, so this leaves Ploy entirely. */}
              {employee.website_url ? (
                <>
                  <Button asChild size="lg">
                    <a href={employee.website_url} target="_blank" rel="noopener noreferrer">
                      Visit Agency Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    You&apos;ll continue on {employee.agency_name ?? "the agency"}&apos;s website.
                  </p>
                </>
              ) : (
                <DemoRequestDialog
                  employeeName={employee.name}
                  agencyName={employee.agency_name ?? "the agency"}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">You might also like</h2>
          <div className="flex flex-col gap-4">
            {related.map((e, i) => (
              <LiveEmployeeCard key={e.id} employee={{ ...e, category: employee.category }} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
