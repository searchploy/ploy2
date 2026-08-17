import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, Mail, MapPin, Twitter, Linkedin, BadgeCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmployeeCard } from "@/components/marketplace/employee-card";
import { ReviewList } from "@/components/marketplace/review-list";
import { ConsultationDialog } from "@/components/marketplace/consultation-dialog";
import { initials } from "@/lib/utils";
import { getAgencyBySlug, getAgencies } from "@/lib/data/agencies";
import { getEmployees } from "@/lib/data/employees";

export async function generateStaticParams() {
  const agencies = await getAgencies();
  return agencies.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) return {};
  return { title: agency.name, description: agency.tagline ?? undefined };
}

export default async function AgencyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency || agency.status !== "approved") notFound();

  const allEmployees = await getEmployees();
  const agencyEmployees = allEmployees.filter((e) => e.agency_id === agency.id);
  const enrichedEmployees = agencyEmployees.map((e) => ({
    ...e,
    agency: { name: agency.name, slug: agency.slug, is_verified: agency.is_verified },
    categories: [],
  }));
  const allReviews: never[] = [];

  return (
    <div className="flex flex-col">
      {/* Cover */}
      <div className="relative h-56 w-full overflow-hidden bg-secondary sm:h-72">
        {agency.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agency.cover_image_url} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container">
        <div className="-mt-14 flex flex-col gap-6 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <Avatar className="h-28 w-28 border-4 border-background shadow-md">
              <AvatarImage src={agency.logo_url ?? undefined} alt={agency.name} />
              <AvatarFallback className="text-2xl">{initials(agency.name)}</AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">{agency.name}</h1>
                {agency.is_verified && <BadgeCheck className="h-5 w-5 text-ploy-blue" />}
              </div>
              <p className="text-muted-foreground">{agency.tagline}</p>
            </div>
          </div>
          <div className="pb-2">
            <ConsultationDialog agencyName={agency.name} />
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-16">
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">About {agency.name}</h2>
              <p className="leading-relaxed text-muted-foreground">{agency.description}</p>
            </section>

            <section className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold">AI Employees ({enrichedEmployees.length})</h2>
              {enrichedEmployees.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {enrichedEmployees.map((e, i) => (
                    <EmployeeCard key={e.id} employee={e} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No published AI employees yet.</p>
              )}
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <RatingStars rating={agency.avgRating} reviewCount={agency.reviewCount} />
              </div>
              <ReviewList reviews={allReviews} />
            </section>
          </div>

          <aside className="flex h-fit flex-col gap-6 rounded-2xl border border-border p-6">
            <div className="flex flex-col gap-3 text-sm">
              {agency.headquarters && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {agency.headquarters}
                </div>
              )}
              {agency.team_size && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {agency.team_size} employees
                </div>
              )}
              {agency.founded_year && (
                <div className="text-muted-foreground">Founded {agency.founded_year}</div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {agency.website_url && (
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <a href={agency.website_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                </Button>
              )}
              {agency.contact_email && (
                <Button asChild variant="outline" size="sm" className="justify-start">
                  <a href={`mailto:${agency.contact_email}`}>
                    <Mail className="h-3.5 w-3.5" />
                    {agency.contact_email}
                  </a>
                </Button>
              )}
              <div className="flex gap-2">
                {agency.twitter_url && (
                  <Button asChild variant="ghost" size="icon">
                    <a href={agency.twitter_url} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {agency.linkedin_url && (
                  <Button asChild variant="ghost" size="icon">
                    <a href={agency.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {agency.is_verified && (
              <Badge variant="blue" className="w-fit">
                <BadgeCheck className="h-3 w-3" />
                Verified agency
              </Badge>
            )}
          </aside>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
