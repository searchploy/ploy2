import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteUrl } from "@/lib/seo/pages";

export type Crumb = { label: string; href: string };

/**
 * Visible breadcrumb trail plus the matching BreadcrumbList. The last crumb is
 * the current page, so it renders as plain text rather than a link and is
 * marked aria-current.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const base = siteUrl();

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {trail.map((crumb, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 opacity-50" />}
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors hover:text-foreground">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            item: `${base}${crumb.href}`,
          })),
        }}
      />
    </>
  );
}
