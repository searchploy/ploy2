import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryIcon } from "@/components/shared/category-icon";
import { getLiveCategories } from "@/lib/data/live-marketplace";

export async function CategoriesSection() {
  const categories = await getLiveCategories();

  return (
    <section className="bg-secondary/30 py-24">
      <div className="container flex flex-col gap-12">
        <SectionHeading
          eyebrow="Shop by problem"
          title="AI employees for every business problem"
          description="Not sure which technology you need? Start with the problem you're trying to solve."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/marketplace?category=${category.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-ploy-gold/40 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </span>
              <span className="font-medium transition-colors group-hover:text-ploy-gold">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
