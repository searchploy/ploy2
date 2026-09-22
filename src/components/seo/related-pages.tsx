import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SEO_PAGES, type SeoPageKey } from "@/lib/seo/pages";

/**
 * Cross-links between the AI-employee pages. Each page passes the keys that
 * are genuinely related to it rather than listing all seven everywhere, so the
 * links stay useful to a reader instead of becoming a footer block repeated on
 * every page.
 */
export function RelatedPages({
  title,
  keys,
  blurbs,
}: {
  title: string;
  keys: SeoPageKey[];
  blurbs: Partial<Record<SeoPageKey, string>>;
}) {
  return (
    <section className="border-t border-border py-14">
      <h2 className="display-caps mb-6 text-[1.15rem] sm:text-[1.35rem]">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {keys.map((key) => {
          const page = SEO_PAGES[key];
          return (
            <Card key={key} className="hover-glow-border p-6">
              <h3 className="mb-2 flex items-center gap-1.5 text-base font-bold">
                <Link href={page.path} className="transition-colors hover:text-ploy-gold">
                  {page.label}
                </Link>
                <ArrowUpRight aria-hidden className="h-4 w-4 text-ploy-gold" />
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {blurbs[key] ?? page.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
