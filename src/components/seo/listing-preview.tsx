import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveEmployeeCard } from "@/components/marketplace/live-employee-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getLiveEmployeesByCategorySlugs } from "@/lib/data/live-marketplace";
import { siteUrl } from "@/lib/seo/pages";

/**
 * Previews real published listings for a role, using the same card the
 * marketplace renders. Nothing here is invented: when a category has no
 * published listings the section collapses to the marketplace link, so the
 * page never shows a placeholder employee.
 *
 * The ItemList describes only what is actually rendered, and carries no
 * ratings, prices or review counts — those belong to the individual listings,
 * not to this summary of them.
 */
export async function ListingPreview({
  categorySlugs,
  title,
  emptyBody,
  browseHref,
  browseLabel,
  limit = 3,
}: {
  categorySlugs: string[];
  title: string;
  emptyBody: string;
  browseHref: string;
  browseLabel: string;
  limit?: number;
}) {
  const employees = await getLiveEmployeesByCategorySlugs(categorySlugs, limit);
  const base = siteUrl();

  return (
    <section className="border-t border-border py-14">
      <h2 className="display-caps mb-6 text-[1.15rem] sm:text-[1.35rem]">{title}</h2>

      {employees.length > 0 ? (
        <>
          <div className="flex flex-col gap-4">
            {employees.map((employee, i) => (
              <LiveEmployeeCard key={employee.id} employee={employee} index={i} />
            ))}
          </div>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: title,
              numberOfItems: employees.length,
              itemListElement: employees.map((employee, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: employee.name,
                url: `${base}/marketplace/${employee.slug}`,
              })),
            }}
          />
        </>
      ) : (
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{emptyBody}</p>
      )}

      <Button asChild variant="outline" className="mt-6">
        <Link href={browseHref}>
          {browseLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
