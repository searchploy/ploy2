import { SectionHeading } from "@/components/shared/section-heading";
import { AgencyCard } from "@/components/marketplace/agency-card";
import { getFeaturedAgencies } from "@/lib/data/agencies";
import { getEmployeesByAgency } from "@/lib/data/employees";

export async function AgencySection() {
  const featured = await getFeaturedAgencies();
  const withStats = await Promise.all(
    featured.map(async (agency) => {
      const emps = await getEmployeesByAgency(agency.id);
      const published = emps.filter((e) => e.status === "published");
      const reviewCount = published.reduce((sum, e) => sum + e.review_count, 0);
      const avgRating =
        reviewCount > 0
          ? published.reduce((sum, e) => sum + e.avg_rating * e.review_count, 0) / reviewCount
          : 0;
      return { agency, employeeCount: published.length, rating: avgRating };
    })
  );

  return (
    <section className="py-24">
      <div className="container flex flex-col gap-12">
        <SectionHeading
          eyebrow="Agencies"
          title="Built by Leading AI Agencies"
          description="Every AI employee on Ploy is built and supported by a vetted agency you can get to know before you buy."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {withStats.map(({ agency, employeeCount, rating }, i) => (
            <AgencyCard key={agency.id} agency={agency} employeeCount={employeeCount} rating={rating} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
